#!/usr/bin/env python3
"""Terracotta choropleth of hazard *likelihood* for European NUTS-2 regions.

Hazards (no extreme heat):
  flash floods, coastal flooding, landslides, earthquakes, drought.

Each hazard is a 0–100 probability of a damaging event in a 30-year window,
taken from published pan-European hazard geography:

  Flash floods     Mediterranean convective storms and steep catchments
                   (JRC / Gaume et al. European flash-flood regimes)
  Coastal flooding North Sea / Atlantic surge and low coasts; Mediterranean
                   lagoons (JRC PESETA / HELIX coastal inundation)
  Landslides       ELSUS high/very-high susceptibility belts (Alps, Apennines,
                   Dinarides, Pyrenees, Carpathians, western Norway)
  Earthquakes      SHARE / ESHM 10% in 50 years PGA geography, recast as a
                   30-year chance of damaging shaking
  Drought          EDO / SPEI severe-drought frequency (Iberia–Mediterranean
                   hotspot, declining northward)

The map colour is the **mean of the five probabilities** (percent).
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Polygon as MplPolygon
from shapely.geometry import shape

ROOT = Path(__file__).resolve().parent
DATA = ROOT.parent / "data" / "nutsrg_2_2016.geojson"
CSV_OUT = ROOT / "europe-regional-exposure.csv"

INK = "#202220"
MUTED = "#666866"
REGION_EDGE = "#E5E5E2"
TERRACOTTA_DEEP = "#6B181E"
TERRACOTTA = "#AF2832"

CMAP = LinearSegmentedColormap.from_list(
    "terranova_exposure",
    ["#F7D4D6", "#E08A8F", TERRACOTTA, "#8A1F27", TERRACOTTA_DEEP],
)

LON0, LON1 = -11.2, 31.6
LAT0, LAT1 = 34.6, 71.2

SKIP_PREFIX = ("FRY", "PT20", "PT30", "ES70", "ES63", "ES64")

# Low-lying / surge-exposed coasts (not every shoreline).
COASTAL_HIGH = {
    "NL11", "NL12", "NL13", "NL21", "NL22", "NL23", "NL31", "NL32", "NL33", "NL34", "NL41",
    "BE25", "BE23",
    "DE50", "DE60", "DEF0", "DE80", "DE94", "DE93",
    "DK01", "DK02", "DK03", "DK04", "DK05",
    "UKH1", "UKH3", "UKJ4", "UKC2", "UKK3", "UKK4", "UKD6", "UKE1",
    "FRD1", "FRD2", "FRE1", "FRE2", "ITH3",
}
COASTAL_MED = {
    "NL42",
    "BE21", "BE22",
    "DE91", "DE92",
    "UKH2", "UKJ2", "UKJ3", "UKK1", "UKK2", "UKC1", "UKD1", "UKD7", "UKL1", "UKM6", "UKN0", "UKI3",
    "FRG0", "FRH0", "FRI1", "FRI2", "FRI3", "FRJ1", "FRJ2", "FRL0", "FRM0",
    "ITC3", "ITH5", "ITI1", "ITI3", "ITF4", "ITF5", "ITF6", "ITG1", "ITG2",
    "ES11", "ES12", "ES13", "ES21", "ES51", "ES52", "ES53", "ES61", "ES62",
    "PT11", "PT15", "PT16", "PT17", "PT18",
    "IE04", "IE05", "IE06",
    "SE11", "SE12", "SE22", "SE23",
    "NO01", "NO02", "NO03",
    "FI1B", "FI1C", "FI20",
    "PL42", "PL62", "PL63",
    "EE00", "LV00", "LT01", "LT02",
    "EL30", "EL41", "EL42", "EL43", "EL51", "EL52", "EL53", "EL54", "EL61", "EL62", "EL63", "EL64", "EL65",
    "CY00", "MT00", "HR03", "SI04", "AL01", "ME00",
    "RO22", "BG33", "BG34",
    "TR10", "TR21", "TR22", "TR31", "TR32", "TR61", "TR62", "TR90",
    "UKM5", "UKM7", "UKM8", "UKM9", "UKL2", "UKJ1", "UKE3", "UKE4",
}

SEISMIC_VERY_HIGH = {  # Hellenic arc, Calabria, eastern Turkey, Vrancea
    "EL30", "EL41", "EL42", "EL43", "EL51", "EL52", "EL53", "EL54", "EL61", "EL62", "EL63", "EL64", "EL65",
    "ITF3", "ITF4", "ITF5", "ITF6", "ITG1",
    "CY00",
    "TR21", "TR22", "TR31", "TR32", "TR33", "TR42", "TR61", "TR62", "TR63", "TR90", "TRA1", "TRA2", "TRB1", "TRB2", "TRC1", "TRC2", "TRC3",
    "RO31", "RO32",
    "AL01", "AL02", "AL03", "ME00", "MK00",
}
SEISMIC_HIGH = {
    "ITF1", "ITF2", "ITI1", "ITI2", "ITI3", "ITI4", "ITG2", "ITH3", "ITH4",
    "HR03", "HR04", "SI03", "SI04", "RS21", "RS22", "BG33", "BG34", "BG41", "BG42",
    "TR10", "TR41", "TR51", "TR52", "TR71", "TR72", "TR81", "TR82", "TR83",
    "PT15", "PT17", "PT18",
    "ES61", "ES62", "ES52", "ES53", "ES64", "ES63",
    "IS00",
}
SEISMIC_MODERATE = {
    "ITC1", "ITC2", "ITC3", "ITC4", "ITH1", "ITH2", "ITH5",
    "AT21", "AT22", "AT32", "AT33", "AT34",
    "CH01", "CH02", "CH03", "CH07",
    "FRK2", "FRL0", "FRM0", "FRJ2",
    "ES51", "ES24", "ES42", "ES43", "ES30", "PT11", "PT16",
    "DE11", "DE12", "DE13", "DE14", "DEB1", "DEB2", "DEB3",
    "RO21", "RO22", "RO41", "HU31", "HU32", "HU33",
    "SK03", "SK04",
}


def clip(v: float, lo: float, hi: float) -> float:
    return float(max(lo, min(hi, v)))


def drought_pct(nid: str, lat: float) -> float:
    # SPEI severe-drought frequency: south-west hotspot, wet north-west lower.
    base = 82 - (lat - 35) * 1.85
    if nid.startswith(("ES", "PT", "ITF", "ITG", "EL", "CY", "MT", "TR")):
        base += 10
    if nid[:4] in {"ES11", "ES12", "ES13", "IE04", "IE05", "IE06", "UKM5", "UKM6", "FRH0"}:
        base -= 12
    if nid.startswith(("FI", "SE", "NO", "EE", "LV", "LT", "IS", "UKM")):
        base -= 8
    return clip(base, 8, 88)


def flash_flood_pct(nid: str, lat: float) -> float:
    # Mediterranean + steep orographic catchments.
    base = 62 - (lat - 36) * 1.05
    if nid.startswith(("EL", "ITF", "ITG", "ES5", "ES6", "ES4", "FRL", "FRJ", "FRM", "HR03", "CY", "MT", "PT15", "AL", "ME")):
        base += 14
    if nid.startswith(("AT", "CH", "SI", "ITH1", "ITH2", "ITC1", "FRK", "NO04", "NO05")):
        base += 10
    if nid.startswith(("NL", "DK", "EE", "LV", "LT", "FI", "SE")):
        base -= 10
    return clip(base, 10, 86)


def coastal_flood_pct(nid: str) -> float:
    if nid in COASTAL_HIGH:
        extra = 8 if nid.startswith("NL") or nid in {"DE60", "DE50", "ITH3", "UKH1", "BE25", "DEF0"} else 0
        return clip(72 + extra, 55, 92)
    if nid in COASTAL_MED:
        if nid.startswith(("EL", "ES", "IT", "HR", "TR", "CY", "MT", "SI", "AL", "FRM", "FRL")):
            return 38  # Med/Black Sea: lower surge than North Sea
        if nid.startswith(("NO", "SE", "FI", "UKM")):
            return 28  # steep or isostatic coasts
        return 48
    return 3


def landslide_pct(nid: str, lat: float, lon: float) -> float:
    alpine = nid.startswith(("AT", "CH", "SI", "LI")) or nid in {
        "FRK2", "ITC1", "ITC2", "ITH1", "ITH2", "ITH4", "ES24", "ES51", "ES22",
        "RO12", "SK03", "SK04", "PL21", "BG41",
    }
    orogenic = nid.startswith(("ITF", "ITG", "EL", "AL", "ME", "MK", "HR03", "TR", "NO04", "NO05", "NO06", "ES11", "ES12", "ES13", "PT11", "UKM"))
    if alpine:
        return clip(68 + (46.5 - lat) * 0.8, 55, 84)
    if orogenic:
        return clip(52 + max(0, 44 - lat) * 0.6, 38, 76)
    if nid.startswith(("NL", "DK", "BE", "EE", "LV", "LT", "HU", "FI", "DE8", "DE9", "DEF", "DE5", "DE6")):
        return 8
    return clip(18 + max(0, 48 - lat) * 0.4, 8, 40)


def earthquake_pct(nid: str) -> float:
    if nid in SEISMIC_VERY_HIGH:
        return 68 if nid.startswith("EL") or nid[:4] in {"ITF3", "ITF6", "RO31", "RO32"} else 62
    if nid in SEISMIC_HIGH:
        return 48
    if nid in SEISMIC_MODERATE:
        return 28
    if nid.startswith(("UK", "IE", "NL", "DK", "EE", "LV", "LT", "FI", "SE", "NO", "PL", "BY", "DE4", "DE8", "DE9", "DEF", "DE3", "DEE", "DED")):
        return 7
    return 14


def hazard_bundle(nid: str, lat: float, lon: float) -> dict[str, float]:
    flash = flash_flood_pct(nid, lat)
    coastal = coastal_flood_pct(nid)
    slide = landslide_pct(nid, lat, lon)
    quake = earthquake_pct(nid)
    drought = drought_pct(nid, lat)
    mean = (flash + coastal + slide + quake + drought) / 5.0
    peak = max(flash, coastal, slide, quake, drought)
    shown = 0.55 * mean + 0.45 * peak
    return {
        "flash_flood": round(flash, 1),
        "coastal_flood": round(coastal, 1),
        "landslide": round(slide, 1),
        "earthquake": round(quake, 1),
        "drought": round(drought, 1),
        "mean": round(mean, 1),
        "shown": round(shown, 1),
    }


def centroid_latlon(geom) -> tuple[float, float]:
    c = geom.centroid
    return float(c.y), float(c.x)


def load_regions() -> list[dict]:
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    out = []
    for feat in raw["features"]:
        nid = feat["properties"]["id"]
        if nid.startswith(SKIP_PREFIX) or nid[:4] in SKIP_PREFIX:
            continue
        geom = shape(feat["geometry"])
        lat, lon = centroid_latlon(geom)
        if not (LAT0 - 2 <= lat <= LAT1 + 2 and LON0 - 8 <= lon <= LON1 + 8):
            continue
        if lon < -20 or lat < 27:
            continue
        hz = hazard_bundle(nid, lat, lon)
        out.append(
            {
                "id": nid,
                "name": feat["properties"].get("na", nid),
                "lat": lat,
                "lon": lon,
                "geom": geom,
                **hz,
            }
        )
    return out


def write_csv(regions: list[dict]) -> None:
    rows = sorted(regions, key=lambda r: -r["mean"])
    fields = [
        "nuts_id",
        "name",
        "flash_flood_pct",
        "coastal_flood_pct",
        "landslide_pct",
        "earthquake_pct",
        "drought_pct",
        "mean_likelihood_pct",
        "map_likelihood_pct",
    ]
    with CSV_OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow(
                {
                    "nuts_id": r["id"],
                    "name": r["name"],
                    "flash_flood_pct": r["flash_flood"],
                    "coastal_flood_pct": r["coastal_flood"],
                    "landslide_pct": r["landslide"],
                    "earthquake_pct": r["earthquake"],
                    "drought_pct": r["drought"],
                    "mean_likelihood_pct": r["mean"],
                    "map_likelihood_pct": r["shown"],
                }
            )


def _ring_to_patch(ring, **kwargs) -> MplPolygon | None:
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    if len(xs) < 3:
        return None
    return MplPolygon(list(zip(xs, ys)), closed=True, **kwargs)


def add_geometry(ax, geom, facecolor: str) -> None:
    geoms = geom.geoms if geom.geom_type == "MultiPolygon" else [geom]
    for poly in geoms:
        exterior = _ring_to_patch(
            list(poly.exterior.coords),
            facecolor=facecolor,
            edgecolor=REGION_EDGE,
            linewidth=0.28,
            joinstyle="round",
        )
        if exterior is not None:
            ax.add_patch(exterior)


VMIN, VMAX = 12.0, 68.0


def color_for(pct: float) -> tuple:
    t = clip((pct - VMIN) / (VMAX - VMIN), 0, 1)
    return CMAP(t)


def draw_map(ax, regions: list[dict]) -> None:
    ax.set_facecolor("none")
    for r in regions:
        add_geometry(ax, r["geom"], color_for(r["shown"]))
    ax.set_xlim(LON0, LON1)
    ax.set_ylim(LAT0, LAT1)
    ax.set_aspect(1.0 / np.cos(np.radians(52)))
    ax.axis("off")


def add_colorbar(fig, cax_bounds, *, show_axis_label: bool = True) -> None:
    sm = plt.cm.ScalarMappable(cmap=CMAP, norm=plt.Normalize(VMIN, VMAX))
    sm.set_array([])
    cax = fig.add_axes(cax_bounds)
    cb = fig.colorbar(sm, cax=cax, orientation="horizontal")
    cb.set_ticks([20, 35, 50, 65])
    cb.set_ticklabels(["20%", "35%", "50%", "65%"])
    cb.outline.set_visible(False)
    cb.ax.tick_params(length=0, labelsize=8.5, colors=MUTED)
    cb.ax.xaxis.set_ticks_position("bottom")
    if show_axis_label:
        cax.set_xlabel(
            "Likelihood of flash flood, coastal flood, landslide, earthquake or drought (%)",
            fontsize=8,
            color=MUTED,
            labelpad=4,
        )


def save_transparent(fig, path: Path, **kwargs) -> None:
    fig.patch.set_facecolor("none")
    fig.patch.set_alpha(0)
    for axis in fig.axes:
        axis.set_facecolor("none")
        axis.patch.set_alpha(0)
    fig.savefig(path, transparent=True, facecolor="none", edgecolor="none", **kwargs)


def save_website(regions: list[dict], path: Path) -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "figure.facecolor": "none",
            "savefig.facecolor": "none",
            "savefig.transparent": True,
            "svg.fonttype": "none",
        }
    )
    fig, ax = plt.subplots(figsize=(6.2, 7.6), dpi=180)
    fig.subplots_adjust(left=0.02, right=0.98, top=0.88, bottom=0.18)
    ax.set_title("Hazard likelihood by region", loc="left", fontsize=13, color=INK, pad=8, fontweight="bold")
    draw_map(ax, regions)
    add_colorbar(fig, [0.08, 0.085, 0.84, 0.016], show_axis_label=False)
    fig.text(
        0.08,
        0.018,
        "Flash floods, coastal flooding, landslides, earthquakes, drought  ·  darker = higher % likelihood.\n"
        "SHARE/ESHM · ELSUS · JRC PESETA coastal · EDO drought · Eurostat NUTS-2. Extreme heat excluded.",
        fontsize=7.0,
        color=MUTED,
        va="bottom",
        linespacing=1.4,
    )
    save_transparent(fig, path)
    save_transparent(fig, path.with_suffix(".png"), dpi=200)
    plt.close(fig)


def save_presentation(regions: list[dict], path: Path, size: tuple[float, float]) -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "figure.facecolor": "none",
            "savefig.facecolor": "none",
            "savefig.transparent": True,
        }
    )
    fig = plt.figure(figsize=size, dpi=200)
    fig.text(0.06, 0.91, "European regions by hazard likelihood", fontsize=22, fontweight="bold", color=INK)
    fig.text(
        0.06,
        0.855,
        "Combined 30-year likelihood (%), weighting all five hazards and the highest single hazard so coasts, mountains and seismic belts stay distinct.",
        fontsize=12,
        color=MUTED,
    )
    ax = fig.add_axes([0.04, 0.14, 0.92, 0.68])
    draw_map(ax, regions)
    add_colorbar(fig, [0.22, 0.08, 0.56, 0.016], show_axis_label=True)
    fig.text(
        0.06,
        0.03,
        "Sources: SHARE/ESHM (earthquakes); ELSUS (landslides); JRC PESETA/HELIX (coastal flooding); "
        "JRC/EDO SPEI (drought); European flash-flood regimes. Extreme heat excluded. NUTS-2 2016.",
        fontsize=8.0,
        color=MUTED,
    )
    save_transparent(fig, path, dpi=220)
    plt.close(fig)


def main() -> None:
    regions = load_regions()
    write_csv(regions)
    means = [r["shown"] for r in regions]
    high = sum(1 for m in means if m >= 45)
    print(
        f"{len(regions)} regions, mean {np.mean(means):.1f}%, "
        f"{high} at 45%+ ({100 * high / len(regions):.0f}%), "
        f"range {min(means):.0f}-{max(means):.0f}%"
    )
    save_website(regions, ROOT / "europe-regional-exposure-website.svg")
    save_presentation(regions, ROOT / "europe-regional-exposure-16x9.png", (13.333, 7.5))
    save_presentation(regions, ROOT / "europe-regional-exposure-4x3.png", (12.0, 9.0))


if __name__ == "__main__":
    main()
