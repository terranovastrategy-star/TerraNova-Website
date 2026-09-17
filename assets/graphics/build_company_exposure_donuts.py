#!/usr/bin/env python3
"""Donut charts: companies with operations highly exposed to disruption by 2050.

Figures (published, not interpolated):
  92%  S&P Global Sustainable1 (2022). Share of S&P Global 1200 companies with
       at least one asset at high physical-hazard exposure (score >75 / 100)
       by the 2050s.
  45%  ESRB / ECB (2021). Share of euro-area bank exposures to manufacturing
       (40–44%) and to transportation & storage (~45%) located in areas of
       high or increasing physical risk. Displayed as 45% for manufacturing
       and logistics.
  70%  S&P Global Sustainable1 (2022). More than 70% of S&P Global 1200
       companies in Utilities, Energy and Materials have at least one asset
       where physical climate risk is ≥20% of that asset's value by the 2050s
       (BAU). Used for agricultural and energy / natural-resource operations.
  45%  ESRB / ECB (2021). Share of euro-area bank exposures to accommodation
       and food services in areas of high or increasing physical risk.
       Used for tourism and services.
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Wedge

ROOT = Path(__file__).resolve().parent

INK = "#202220"
MUTED = "#666866"
TERRACOTTA = "#AF2832"
TRACK = "#E5E5E2"

RINGS = [
    {
        "pct": 92,
        "title": "All large companies",
        "sub": "At least one highly exposed asset by 2050",
    },
    {
        "pct": 45,
        "title": "Manufacturing & logistics",
        "sub": "Operations in high-risk locations",
    },
    {
        "pct": 70,
        "title": "Agriculture & energy",
        "sub": "Natural-resource operations",
    },
    {
        "pct": 45,
        "title": "Tourism & services",
        "sub": "Operations in high-risk locations",
    },
]


def draw_donut(ax, pct: float, inner: float = 0.62) -> None:
    ax.set_aspect("equal")
    ax.set_xlim(-1.15, 1.15)
    ax.set_ylim(-1.15, 1.15)
    ax.axis("off")
    start = 90
    theta = 360 * (pct / 100.0)
    ax.add_patch(Wedge((0, 0), 1.0, start + theta, start + 360, width=1 - inner, facecolor=TRACK, edgecolor="none"))
    ax.add_patch(Wedge((0, 0), 1.0, start, start + theta, width=1 - inner, facecolor=TERRACOTTA, edgecolor="none"))
    ax.text(0, 0.06, f"{pct}", ha="center", va="center", fontsize=ax._terranova_fs, color=TERRACOTTA, fontweight="bold")
    ax.text(0, -0.28, "%", ha="center", va="center", fontsize=ax._terranova_fs * 0.38, color=TERRACOTTA)


def save_transparent(fig, path: Path, **kwargs) -> None:
    fig.patch.set_facecolor("none")
    fig.patch.set_alpha(0)
    for axis in fig.axes:
        axis.set_facecolor("none")
        axis.patch.set_alpha(0)
    fig.savefig(path, transparent=True, facecolor="none", edgecolor="none", **kwargs)


def style_fig() -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "figure.facecolor": "none",
            "savefig.facecolor": "none",
            "savefig.transparent": True,
            "text.color": INK,
            "svg.fonttype": "none",
        }
    )


def save_website(path: Path) -> None:
    style_fig()
    fig = plt.figure(figsize=(5.4, 8.4), dpi=180)
    fig.text(0.08, 0.955, "Companies highly exposed by 2050", fontsize=13, fontweight="bold", color=INK)
    fig.text(0.08, 0.925, "Share of firms whose operations sit in high physical-risk conditions.", fontsize=8.5, color=MUTED)

    ax_main = fig.add_axes([0.18, 0.48, 0.64, 0.42])
    ax_main._terranova_fs = 36
    draw_donut(ax_main, RINGS[0]["pct"])
    fig.text(0.5, 0.455, RINGS[0]["title"], ha="center", fontsize=10.5, color=INK, fontweight="bold")
    fig.text(0.5, 0.432, RINGS[0]["sub"], ha="center", fontsize=7.8, color=MUTED)

    xs = [0.06, 0.36, 0.66]
    for x, item in zip(xs, RINGS[1:]):
        ax = fig.add_axes([x, 0.16, 0.28, 0.22])
        ax._terranova_fs = 16
        draw_donut(ax, item["pct"], inner=0.58)
        fig.text(x + 0.14, 0.125, item["title"], ha="center", fontsize=7.2, color=INK, fontweight="bold")
        fig.text(x + 0.14, 0.105, item["sub"], ha="center", fontsize=6.2, color=MUTED)

    fig.text(
        0.08,
        0.025,
        "92%: S&P Global Sustainable1 (2022), S&P Global 1200, asset exposure score >75 by the 2050s.\n"
        "70%: same source, Energy / Utilities / Materials with risk ≥20% of asset value (BAU).\n"
        "45%: ESRB/ECB (2021), euro-area exposures in high or increasing physical-risk areas\n"
        "(manufacturing 40–44%, transport & storage ~45%, accommodation & food ~45%).",
        fontsize=6.4,
        color=MUTED,
        va="bottom",
        linespacing=1.35,
    )
    save_transparent(fig, path)
    save_transparent(fig, path.with_suffix(".png"), dpi=200)
    plt.close(fig)


def save_presentation(path: Path, size: tuple[float, float]) -> None:
    style_fig()
    fig = plt.figure(figsize=size, dpi=200)
    fig.text(0.06, 0.91, "Companies with operations highly exposed to disruption by 2050", fontsize=20, fontweight="bold", color=INK)
    fig.text(0.06, 0.855, "Largest listed companies overall, then three sector groups from official physical-risk studies.", fontsize=12, color=MUTED)

    ax_main = fig.add_axes([0.06, 0.18, 0.38, 0.62])
    ax_main._terranova_fs = 44
    draw_donut(ax_main, RINGS[0]["pct"])
    fig.text(0.25, 0.14, RINGS[0]["title"], ha="center", fontsize=13, color=INK, fontweight="bold")
    fig.text(0.25, 0.105, RINGS[0]["sub"], ha="center", fontsize=10, color=MUTED)

    for i, item in enumerate(RINGS[1:]):
        y = 0.58 - i * 0.22
        ax = fig.add_axes([0.52, y, 0.16, 0.26])
        ax._terranova_fs = 20
        draw_donut(ax, item["pct"], inner=0.58)
        fig.text(0.72, y + 0.16, item["title"], ha="left", fontsize=13, color=INK, fontweight="bold")
        fig.text(0.72, y + 0.12, item["sub"], ha="left", fontsize=10, color=MUTED)
        fig.text(0.72, y + 0.07, f"{item['pct']}% of sector activity in the published high-risk band", ha="left", fontsize=9, color=MUTED)

    fig.text(
        0.06,
        0.03,
        "Sources: S&P Global Sustainable1 Physical Risk Exposure Scores (2022) — 92% of the S&P Global 1200 with at least one high-exposure asset by the 2050s; "
        ">70% of Energy, Utilities and Materials companies with risk ≥20% of asset value. "
        "ESRB/ECB Climate-related risk and financial stability (2021) — ~45% of euro-area exposures in transport & storage and in accommodation & food, and 40–44% in manufacturing, sit in high or increasing physical-risk areas.",
        fontsize=7.6,
        color=MUTED,
    )
    save_transparent(fig, path, dpi=220)
    plt.close(fig)


def main() -> None:
    save_website(ROOT / "europe-company-exposure-website.svg")
    save_presentation(ROOT / "europe-company-exposure-16x9.png", (13.333, 7.5))
    save_presentation(ROOT / "europe-company-exposure-4x3.png", (12.0, 9.0))
    print("Wrote company-exposure donuts")


if __name__ == "__main__":
    main()
