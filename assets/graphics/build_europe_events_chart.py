#!/usr/bin/env python3
"""Build Europe catastrophic-events charts for the website and presentations.

Recorded series (terracotta)
    EEA CATDAT weather- and climate-related events in EEA-32 countries,
    published as decade totals and shown here as annual averages:
      1981–1990  392 events  →  39.2 / year
      1991–2000  483 events  →  48.3 / year
      2001–2010  799 events  →  79.9 / year
      2011–2020 1,220 events  → 122.0 / year
    Source: EEA briefing “Economic losses and fatalities from weather- and
    climate-related events in Europe” (CATDAT / RiskLayer).

    1970s point is not in CATDAT (series starts 1980). It is scaled from the
    1980s CATDAT rate using the global EM-DAT weather-disaster ratio
    1970–1979 / 1980–1989 (Our World in Data, based on CRED EM-DAT).

Projected series (soft gray)
    Original JRC PESETA I (2009) / IPCC AR4-era pathway: river-flood and
    related extreme impacts in Europe more than double by the 2080s versus
    the 1961–1990 control climate. Applied as a linear frequency path from
    the first CATDAT decade (1981–1990) toward a 2.15× factor by 2085.
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.ticker import MultipleLocator
import numpy as np

ROOT = Path(__file__).resolve().parent
CSV = ROOT / "europe-catastrophic-events-1970-2025.csv"

INK = "#202220"
WARM = "none"
MUTED = "#666866"
LINE = "#E5E5E2"
TERRACOTTA = "#AF2832"
SOFT_GRAY = "#A0A19E"
ESTIMATE = "#D07A80"

# CATDAT decade totals → annual means (EEA-32)
CATDAT = {
    1985: 392 / 10,
    1995: 483 / 10,
    2005: 799 / 10,
    2015: 1220 / 10,
}

# OWID/EM-DAT global weather disasters (Drought, extreme temperature,
# extreme weather, flood, landslide, wildfire), decade means:
# 1970–79 = 75.9, 1980–89 = 145.0
EMDAT_1970S_RATIO = 75.9 / 145.0
POINT_1975 = CATDAT[1985] * EMDAT_1970S_RATIO  # ~20.5

PESETA_BASE_YEAR = 1985
PESETA_BASE_RATE = CATDAT[1985]
PESETA_HORIZON_YEAR = 2085
PESETA_FACTOR = 2.15  # “more than doubling” (PESETA I range ~2.0–2.3)


def projected(year: np.ndarray | float) -> np.ndarray | float:
    span = PESETA_HORIZON_YEAR - PESETA_BASE_YEAR
    return PESETA_BASE_RATE * (1.0 + (PESETA_FACTOR - 1.0) * (np.asarray(year) - PESETA_BASE_YEAR) / span)


def recorded_polyline() -> tuple[np.ndarray, np.ndarray]:
    years = np.array([1975, 1985, 1995, 2005, 2015], dtype=float)
    values = np.array(
        [POINT_1975, CATDAT[1985], CATDAT[1995], CATDAT[2005], CATDAT[2015]],
        dtype=float,
    )
    return years, values


def write_csv() -> None:
    years = np.arange(1970, 2026)
    rec_x, rec_y = recorded_polyline()
    rec = np.interp(years, rec_x, rec_y)
    rec[years > 2015] = np.nan
    rows = ["year,recorded_events_per_year,projected_events_per_year,recorded_status"]
    for y, r, p in zip(years, rec, projected(years)):
        if y <= 1980:
            status = "estimated_from_emdat_ratio"
        elif y <= 2015:
            status = "eea_catdat_decade_interpolated"
        else:
            status = "after_last_catdat_decade_midpoint"
        r_out = "" if np.isnan(r) else f"{r:.2f}"
        rows.append(f"{int(y)},{r_out},{float(p):.2f},{status}")
    CSV.write_text("\n".join(rows) + "\n", encoding="utf-8")


def save_transparent(fig, path: Path, **kwargs) -> None:
    fig.patch.set_facecolor("none")
    fig.patch.set_alpha(0)
    for axis in fig.axes:
        axis.set_facecolor("none")
        axis.patch.set_alpha(0)
    fig.savefig(path, transparent=True, facecolor="none", edgecolor="none", **kwargs)


def style_axes(ax) -> None:
    ax.set_facecolor("none")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(LINE)
    ax.spines["bottom"].set_color(LINE)
    ax.tick_params(colors=MUTED, labelsize=11)
    ax.yaxis.grid(True, color=LINE, linewidth=0.8)
    ax.xaxis.grid(False)
    ax.set_axisbelow(True)
    ax.set_xlim(1970, 2026)
    ax.set_ylim(0, 140)
    ax.xaxis.set_major_locator(MultipleLocator(10))
    ax.yaxis.set_major_locator(MultipleLocator(20))
    ax.set_xlabel("Year", color=INK, fontsize=12, labelpad=10)
    ax.set_ylabel("Events per year in Europe", color=INK, fontsize=12, labelpad=10)


def draw_series(ax) -> None:
    rec_x, rec_y = recorded_polyline()
    years = np.linspace(1970, 2025, 221)
    ax.plot(years, projected(years), color=SOFT_GRAY, linewidth=2.2, linestyle=(0, (5, 4)), zorder=2)

    ax.plot(rec_x[:2], rec_y[:2], color=ESTIMATE, linewidth=2.6, linestyle=(0, (1.5, 2.5)), zorder=3)
    ax.plot(rec_x[1:], rec_y[1:], color=TERRACOTTA, linewidth=2.8, solid_capstyle="round", zorder=3)

    ax.scatter([1975], [POINT_1975], s=36, facecolors="#FFFFFF", edgecolors=ESTIMATE, linewidths=1.6, zorder=4)
    published_x = [1985, 1995, 2005, 2015]
    published_y = [CATDAT[x] for x in published_x]
    ax.scatter(published_x, published_y, s=42, color=TERRACOTTA, zorder=4, edgecolors="#FFFFFF", linewidths=1.2)

    ax.annotate(
        f"{CATDAT[2015]:.0f}",
        xy=(2015, CATDAT[2015]),
        xytext=(8, 8),
        textcoords="offset points",
        color=TERRACOTTA,
        fontsize=11,
        fontweight="bold",
    )


def save_presentation(path: Path, size: tuple[float, float]) -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "figure.facecolor": "none",
            "savefig.facecolor": "none",
            "savefig.transparent": True,
            "text.color": INK,
        }
    )
    fig, ax = plt.subplots(figsize=size, dpi=200)
    fig.subplots_adjust(left=0.08, right=0.96, top=0.78, bottom=0.16)
    style_axes(ax)
    draw_series(ax)

    fig.text(0.08, 0.92, "Catastrophic weather and climate events in Europe", fontsize=22, fontweight="bold", color=INK)
    fig.text(
        0.08,
        0.865,
        "Recorded events rose faster than the increase originally projected in EU climate-impact studies.",
        fontsize=12.5,
        color=MUTED,
    )

    legend = [
        Line2D([0], [0], color=TERRACOTTA, lw=2.8, label="Recorded events (EEA CATDAT)"),
        Line2D([0], [0], color=ESTIMATE, lw=2.6, linestyle=(0, (1.5, 2.5)), label="1970s estimate (EM-DAT scaled)"),
        Line2D([0], [0], color=SOFT_GRAY, lw=2.2, linestyle=(0, (5, 4)), label="Original projected increase (PESETA I / IPCC AR4)"),
    ]
    ax.legend(handles=legend, loc="upper left", frameon=False, fontsize=10.5, labelcolor=INK)

    fig.text(
        0.08,
        0.045,
        "Vertical axis: weather- and climate-related events per year, EEA-32. Horizontal axis: 1970–2025.\n"
        "Sources: EEA CATDAT/RiskLayer decade counts (1981–2020); 1970s scaled with CRED EM-DAT via Our World in Data; "
        "projection path from JRC PESETA I (2009), flood impacts more than doubling by the 2080s vs 1961–1990.",
        fontsize=8.2,
        color=MUTED,
        va="bottom",
        linespacing=1.45,
    )
    save_transparent(fig, path, dpi=220)
    plt.close(fig)


def save_website_svg(path: Path) -> None:
    """Compact chart without slide chrome, for embedding on the site."""
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
    fig, ax = plt.subplots(figsize=(10.2, 5.6), dpi=160)
    fig.subplots_adjust(left=0.09, right=0.97, top=0.86, bottom=0.18)
    style_axes(ax)
    draw_series(ax)
    ax.set_title("Events per year, Europe 1970–2020", loc="left", fontsize=14, color=INK, pad=12, fontweight="bold")
    legend = [
        Line2D([0], [0], color=TERRACOTTA, lw=2.6, label="Recorded"),
        Line2D([0], [0], color=SOFT_GRAY, lw=2.0, linestyle=(0, (5, 4)), label="Originally projected"),
    ]
    ax.legend(handles=legend, loc="upper left", frameon=False, fontsize=10, labelcolor=INK)
    fig.text(
        0.09,
        0.04,
        "EEA CATDAT (EEA-32) · 1970s estimated from EM-DAT · projection: JRC PESETA I / IPCC AR4 doubling-by-2080s path",
        fontsize=7.5,
        color=MUTED,
    )
    save_transparent(fig, path)
    save_transparent(fig, path.with_suffix(".png"), dpi=200)
    plt.close(fig)


def main() -> None:
    write_csv()
    save_presentation(ROOT / "europe-catastrophic-events-16x9.png", (13.333, 7.5))
    save_presentation(ROOT / "europe-catastrophic-events-4x3.png", (12.0, 9.0))
    save_website_svg(ROOT / "europe-catastrophic-events-website.svg")
    print(f"Wrote charts to {ROOT}")


if __name__ == "__main__":
    main()
