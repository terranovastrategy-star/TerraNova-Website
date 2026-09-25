#!/usr/bin/env python3
"""Deseasonalising outdoor activity around Mont Blanc."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Patch

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "mont-blanc-deseasonalisation.png"

INK = "#202220"
MUTED = "#666866"
TERRACOTTA = "#AF2832"
SAGE = "#5B6B4A"
TRACK = "#E5E5E2"

MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
# Intensity 0–5
ALP_TODAY = [0, 0, 0, 0, 1, 3, 5, 5, 3, 1, 0, 0]
ALP_PLAN = [0, 0, 0, 1, 3, 5, 2, 1, 5, 4, 1, 0]
LEISURE = [1, 1, 2, 3, 4, 5, 5, 5, 5, 4, 2, 1]


def main() -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "text.color": INK,
        }
    )
    fig, ax = plt.subplots(figsize=(16, 9), dpi=140)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    ax.set_xlim(-0.6, 12.4)
    ax.set_ylim(-1.15, 7.35)
    ax.axis("off")

    ax.text(0, 7.05, "Move the summit.", fontsize=32, fontweight="bold", color=TERRACOTTA, va="center")
    ax.text(0, 6.48, "Deseasonalising outdoor activity around Mont Blanc", fontsize=16, color=INK, va="center")
    ax.text(
        0,
        6.05,
        "High alpinism is sold in the months when the face is least stable. The valley can still sell a summer — if the 4,000ers leave July and August.",
        fontsize=11,
        color=MUTED,
        va="center",
    )

    # Heat window
    ax.add_patch(FancyBboxPatch((5.55, -0.15), 2.9, 5.35, boxstyle="round,pad=0.02,rounding_size=0.08",
                                linewidth=0, facecolor="#F3E6E6"))
    ax.text(7.0, 5.05, "Heat window", fontsize=9, color=TERRACOTTA, ha="center", fontweight="bold")

    def row(y, values, color, label):
        ax.text(-0.15, y + 0.72, label, fontsize=12, fontweight="bold", color=INK, va="bottom")
        for i, v in enumerate(values):
            x = i + 0.12
            ax.add_patch(FancyBboxPatch((x, y), 0.76, 0.62, boxstyle="round,pad=0.01,rounding_size=0.06",
                                        linewidth=0, facecolor=TRACK))
            if v:
                h = 0.12 + 0.50 * (v / 5)
                ax.add_patch(FancyBboxPatch((x, y), 0.76, h, boxstyle="round,pad=0.01,rounding_size=0.06",
                                            linewidth=0, facecolor=color))
            ax.text(x + 0.38, y - 0.28, MONTHS[i], fontsize=10, color=MUTED, ha="center", va="top")

    row(3.55, ALP_TODAY, TERRACOTTA, "High alpinism — sold today")
    row(1.85, ALP_PLAN, INK, "High alpinism — planned calendar")
    row(0.15, LEISURE, SAGE, "Valley and mid-mountain leisure — keep")

    ax.legend(
        handles=[
            Patch(facecolor=TERRACOTTA, edgecolor="none", label="Peak 4,000er demand"),
            Patch(facecolor=INK, edgecolor="none", label="Shoulder-season alpinism"),
            Patch(facecolor=SAGE, edgecolor="none", label="Hiking, cycling, thermal, mid-mountain"),
        ],
        loc="lower left",
        frameon=False,
        ncol=3,
        fontsize=10,
        bbox_to_anchor=(0.0, -0.08),
    )

    ax.text(
        0,
        -0.85,
        "July–August is when five heatwaves in 2026 stored heat in the permafrost and closed the three principal routes.\n"
        "The planned calendar keeps the valley open in high summer and moves commercial alpinism to late spring and early autumn.",
        fontsize=9.5,
        color=MUTED,
        va="top",
        linespacing=1.4,
    )

    fig.subplots_adjust(left=0.07, right=0.96, top=0.93, bottom=0.14)
    fig.savefig(OUT, dpi=140)
    print("wrote", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
