#!/usr/bin/env python3
"""Territorial dependency map for the business-continuity insight.

A facility with LOW direct (flood) exposure, ringed by the external systems
it depends on to operate. Two of those dependencies — the access road and the
electricity supply — are HIGH exposure with no redundancy: single points of
failure. The point of the graphic is that a clean plot can still sit one
blocked road or one lost substation away from a full stop.
"""

from __future__ import annotations

from math import cos, radians, sin
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch, Patch

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "territorial-dependencies-map.png"

# Brand tokens
INK = "#202220"
MUTED = "#666866"
TRACK = "#E5E5E2"
WHITE = "#FFFFFF"
TERRACOTTA = "#AF2832"   # High exposure
MID = "#D07A80"          # Medium exposure (brand terracotta tint)
SAGE = "#5B6B4A"         # Low exposure

LEVEL_COLOR = {"High": TERRACOTTA, "Medium": MID, "Low": SAGE}

# name, angle(deg), exposure level, single point of failure
DEPS = [
    ("Access road", 60, "High", True),
    ("Electricity\nsupply", 120, "High", True),
    ("Key\nsuppliers", 180, "Medium", False),
    ("Water", 240, "Medium", False),
    ("Logistics\ncorridor", 300, "Medium", False),
    ("Workforce\naccess", 0, "Low", False),
]

R = 1.78         # ring radius
NODE_R = 0.5     # dependency node radius
CORE_R = 0.62    # facility node radius
CY = -0.62       # vertical offset for the network (keeps clear of heading)


def polar(radius: float, deg: float) -> tuple[float, float]:
    a = radians(deg)
    return radius * cos(a), CY + radius * sin(a)


def draw_node(ax, x, y, r, face, label, sub=None, label_color=WHITE):
    ax.add_patch(Circle((x, y), r, facecolor=face, edgecolor=WHITE, linewidth=2.4, zorder=4))
    ax.add_patch(Circle((x, y), r * 0.40, facecolor=WHITE, edgecolor="none", alpha=0.14, zorder=4.1))
    ax.text(x, y + (0.07 if sub else 0.0), label, ha="center", va="center",
            fontsize=12.5, fontweight="bold", color=label_color, zorder=5, linespacing=1.0)
    if sub:
        ax.text(x, y - 0.19, sub, ha="center", va="center",
                fontsize=9, color=label_color, zorder=5)


def main() -> None:
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["Segoe UI", "Calibri", "Arial", "DejaVu Sans"],
            "text.color": INK,
            "svg.fonttype": "none",
        }
    )

    fig, ax = plt.subplots(figsize=(14, 8.4), dpi=150)
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)
    ax.set_xlim(-4.75, 4.75)
    ax.set_ylim(-3.25, 2.55)
    ax.set_aspect("equal")
    ax.axis("off")

    # --- Heading -------------------------------------------------------
    ax.text(-4.5, 2.26, "The site is dry. The operation is not.",
            fontsize=24, fontweight="bold", color=TERRACOTTA, va="center")
    ax.text(-4.5, 1.80, "A facility with low flood exposure, scored by the systems it depends on to run",
            fontsize=13, color=INK, va="center")

    # --- Spokes --------------------------------------------------------
    for _, deg, level, _ in DEPS:
        nx, ny = polar(R, deg)
        high = level == "High"
        ax.plot([0, nx], [CY, ny], color=TERRACOTTA if high else TRACK,
                linewidth=4.2 if high else 2.4, solid_capstyle="round",
                zorder=1, alpha=0.9 if high else 1.0)

    # --- Single-point-of-failure halos --------------------------------
    for _, deg, level, spof in DEPS:
        if not spof:
            continue
        nx, ny = polar(R, deg)
        ax.add_patch(Circle((nx, ny), NODE_R + 0.17, fill=False, linestyle=(0, (1.4, 2.6)),
                            linewidth=1.7, edgecolor=TERRACOTTA, alpha=0.75, zorder=3))

    # --- Dependency nodes ---------------------------------------------
    for name, deg, level, spof in DEPS:
        nx, ny = polar(R, deg)
        draw_node(ax, nx, ny, NODE_R, LEVEL_COLOR[level], name, sub=level.upper())

    # --- Facility core -------------------------------------------------
    ax.add_patch(Circle((0, CY), CORE_R + 0.14, facecolor="none", edgecolor=TRACK, linewidth=1.6, zorder=3.5))
    draw_node(ax, 0, CY, CORE_R, INK, "FACILITY", sub="flood: LOW")

    # --- Legend --------------------------------------------------------
    handles = [
        Patch(facecolor=SAGE, edgecolor="none", label="Low exposure"),
        Patch(facecolor=MID, edgecolor="none", label="Medium exposure"),
        Patch(facecolor=TERRACOTTA, edgecolor="none", label="High exposure"),
    ]
    leg = ax.legend(handles=handles, loc="lower center", bbox_to_anchor=(0.5, -0.02),
                    frameon=False, ncol=3, fontsize=10.5, handlelength=1.1, columnspacing=2.2)
    for t in leg.get_texts():
        t.set_color(INK)

    # dashed-ring key
    ky, kx = -2.98, 1.75
    ax.add_patch(Circle((kx, ky), 0.12, fill=False, linestyle=(0, (1.4, 2.6)),
                        linewidth=1.7, edgecolor=TERRACOTTA, zorder=5))
    ax.text(kx + 0.26, ky, "Single point of failure — no redundancy",
            fontsize=10.5, color=INK, va="center", ha="left")

    fig.subplots_adjust(left=0.03, right=0.97, top=0.98, bottom=0.04)
    fig.savefig(OUT, dpi=150, facecolor=WHITE)
    print("wrote", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
