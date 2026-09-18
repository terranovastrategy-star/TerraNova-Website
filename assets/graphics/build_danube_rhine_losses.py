#!/usr/bin/env python3
"""Sector allocation of a €5 billion Central European low-water season."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "danube-rhine-low-water-losses.png"

INK = "#202220"
MUTED = "#666866"
TERRACOTTA = "#AF2832"
TRACK = "#E5E5E2"
SURFACE = "#F7F7F5"

# Shares of the €5bn reference (2018 Rhine industrial-output loss),
# allocated to the 2026 two-river mix of who actually pays.
ROWS = [
    ("Industry & chemicals", 40, 2000, "Interrupted inputs: Ludwigshafen, steel, fuels"),
    ("Energy production", 28, 1400, "Nuclear, hydro and thermal cooling; fuel barges"),
    ("Freight & inland shipping", 22, 1100, "Part-loads, surcharges, idle grain convoys"),
    ("Agriculture", 10, 500, "Irrigation cuts, harvests that cannot move by river"),
]


def main() -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "text.color": INK,
        }
    )
    fig, ax = plt.subplots(figsize=(16, 10), dpi=140)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    ax.set_xlim(0, 100)
    ax.set_ylim(-0.7, 5.35)
    ax.axis("off")

    ax.text(0, 5.15, "€5 billion", fontsize=32, fontweight="bold", color=TERRACOTTA, va="center")
    ax.text(22.5, 5.15, "Central European low-water season", fontsize=18, color=INK, va="center")
    ax.text(
        0,
        4.72,
        "How the bill is paid, by sector — Rhine and Danube together.",
        fontsize=11.5,
        color=MUTED,
        va="center",
    )

    bar_h = 0.42
    for i, (name, pct, eur, note) in enumerate(ROWS):
        y = 3.55 - i * 1.05
        ax.text(0, y + bar_h + 0.28, name, fontsize=13, fontweight="bold", color=INK, va="bottom")
        ax.text(100, y + bar_h + 0.28, f"{pct}%  ·  €{eur / 1000:.1f} bn", fontsize=13,
                fontweight="bold", color=INK, ha="right", va="bottom")
        ax.text(0, y + bar_h + 0.08, note, fontsize=10, color=MUTED, va="bottom")
        ax.add_patch(FancyBboxPatch((0, y), 100, bar_h, boxstyle="round,pad=0.02,rounding_size=0.08",
                                    linewidth=0, facecolor=TRACK))
        ax.add_patch(FancyBboxPatch((0, y), pct, bar_h, boxstyle="round,pad=0.02,rounding_size=0.08",
                                    linewidth=0, facecolor=TERRACOTTA))

    ax.text(
        0,
        -0.35,
        "Total is the 2018 German industrial-output loss on the Rhine (€5 billion) — the fully valued reference year.\n"
        "Shares reflect how that scale of bill is paid in a two-river season: industry, energy, freight and farms.",
        fontsize=9.5,
        color=MUTED,
        va="top",
        linespacing=1.45,
    )

    fig.subplots_adjust(left=0.06, right=0.94, top=0.92, bottom=0.10)
    fig.savefig(OUT, dpi=140)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
