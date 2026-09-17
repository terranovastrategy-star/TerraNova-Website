#!/usr/bin/env python3
"""Network graphic for Intervention prioritisation.

Nodes are recovery interventions. Edges are unlock / dependency links.
Priority is the node degree: the hub with the most connections is Priority 1;
leaves with a single connection are Priority 5.
"""

from __future__ import annotations

from collections import defaultdict
from math import hypot
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Circle, PathPatch
from matplotlib.path import Path as MplPath

ROOT = Path(__file__).resolve().parent

INK = "#202220"
MUTED = "#666866"
LINE = "#A0A19E"
TRACK = "#E5E5E2"
WHITE = "#FFFFFF"
ACCENT = "#AF2832"

PRIORITY_FILL = {
    1: "#AF2832",
    2: "#C45A61",
    3: "#D07A80",
    4: "#C8C9C6",
    5: "#E5E5E2",
}
PRIORITY_INNER = {
    1: "#C45A61",
    2: "#D07A80",
    3: "#E0A8AB",
    4: "#D8D9D6",
    5: "#F0F0ED",
}
PRIORITY_RADIUS = {
    1: 0.052,
    2: 0.038,
    3: 0.028,
    4: 0.022,
    5: 0.017,
}


def polar(cx: float, cy: float, radius: float, deg: float) -> tuple[float, float]:
    a = np.radians(deg)
    return float(cx + radius * np.cos(a)), float(cy + radius * np.sin(a))


def build_graph() -> tuple[dict[str, tuple[float, float]], list[tuple[str, str]]]:
    main = (0.52, 0.58)
    left = (0.22, 0.46)
    right = (0.76, 0.28)
    bridge = (0.36, 0.52)
    mid = (0.62, 0.40)

    pos: dict[str, tuple[float, float]] = {
        "hub": main,
        "left": left,
        "right": right,
        "bridge": bridge,
        "mid": mid,
    }
    edges: list[tuple[str, str]] = [
        ("hub", "left"),
        ("hub", "right"),
        ("hub", "bridge"),
        ("hub", "mid"),
        ("left", "bridge"),
        ("right", "mid"),
    ]

    main_fan = [
        (0.20, 108),
        (0.24, 88),
        (0.29, 70),
        (0.26, 52),
        (0.31, 36),
        (0.27, 18),
        (0.30, 0),
        (0.23, 128),
        (0.28, 146),
        (0.21, 164),
        (0.25, 322),
        (0.22, 78),
    ]
    for i, (r, deg) in enumerate(main_fan):
        name = f"m{i}"
        pos[name] = polar(*main, r, deg)
        edges.append(("hub", name))

    pos["m_ext0"] = polar(*pos["m2"], 0.11, 58)
    pos["m_ext1"] = polar(*pos["m4"], 0.10, 22)
    pos["m_ext2"] = polar(*pos["m5"], 0.09, 8)
    edges.extend(
        [
            ("m2", "m_ext0"),
            ("m4", "m_ext1"),
            ("m_ext0", "m_ext1"),
            ("m5", "m_ext2"),
            ("m_ext1", "m_ext2"),
        ]
    )

    left_fan = [
        (0.13, 198),
        (0.15, 172),
        (0.12, 222),
        (0.14, 248),
        (0.125, 148),
        (0.11, 268),
    ]
    for i, (r, deg) in enumerate(left_fan):
        name = f"l{i}"
        pos[name] = polar(*left, r, deg)
        edges.append(("left", name))
    pos["l_ext"] = polar(*pos["l0"], 0.08, 188)
    edges.append(("l0", "l_ext"))
    edges.append(("l2", "l3"))
    edges.append(("l1", "bridge"))

    right_fan = [
        (0.13, 318),
        (0.15, 346),
        (0.12, 16),
        (0.14, 292),
        (0.11, 262),
    ]
    for i, (r, deg) in enumerate(right_fan):
        name = f"r{i}"
        pos[name] = polar(*right, r, deg)
        edges.append(("right", name))
    pos["r_ext"] = polar(*pos["r1"], 0.08, 350)
    edges.append(("r1", "r_ext"))
    edges.append(("mid", "m3"))
    edges.append(("m2", "m10"))
    edges.append(("mid", "r2"))

    return pos, edges


def degrees(edges: list[tuple[str, str]]) -> dict[str, int]:
    d: dict[str, int] = defaultdict(int)
    for a, b in edges:
        d[a] += 1
        d[b] += 1
    return d


def priority_for(degree: int, max_degree: int) -> int:
    if degree <= 1:
        return 5
    if degree == 2:
        return 4
    if degree <= 4:
        return 3
    if degree < max_degree:
        return 2
    return 1


def data_bounds(pos, rank, extra: float = 0.08) -> tuple[float, float, float, float]:
    xs, ys = [], []
    for n, (x, y) in pos.items():
        r = PRIORITY_RADIUS[rank[n]] * 1.7
        xs.extend([x - r, x + r])
        ys.extend([y - r, y + r])
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    padx = extra * (maxx - minx)
    pady = extra * (maxy - miny)
    return minx - padx, maxx + padx, miny - pady, maxy + pady


def draw_link(ax, p0, p1, width: float, bulge: float = 0.0) -> None:
    if abs(bulge) < 1e-4:
        ax.plot(
            [p0[0], p1[0]],
            [p0[1], p1[1]],
            color=TRACK,
            linewidth=width + 1.6,
            solid_capstyle="round",
            zorder=1,
            clip_on=False,
        )
        ax.plot(
            [p0[0], p1[0]],
            [p0[1], p1[1]],
            color=LINE,
            linewidth=width,
            solid_capstyle="round",
            zorder=1.1,
            clip_on=False,
        )
        return

    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    length = hypot(dx, dy) or 1
    cx, cy = mx - dy / length * bulge, my + dx / length * bulge
    verts = [p0, (cx, cy), p1]
    codes = [MplPath.MOVETO, MplPath.CURVE3, MplPath.CURVE3]
    path = MplPath(verts, codes)
    ax.add_patch(PathPatch(path, facecolor="none", edgecolor=TRACK, lw=width + 1.6, capstyle="round", zorder=1, clip_on=False))
    ax.add_patch(PathPatch(path, facecolor="none", edgecolor=LINE, lw=width, capstyle="round", zorder=1.1, clip_on=False))


def draw_node(ax, x: float, y: float, priority: int, label: str | None) -> None:
    r = PRIORITY_RADIUS[priority]
    if priority <= 2:
        ax.add_patch(
            Circle(
                (x, y),
                r * (2.15 if priority == 1 else 1.85),
                facecolor=ACCENT,
                edgecolor="none",
                alpha=0.08 if priority == 1 else 0.05,
                zorder=1.4,
                clip_on=False,
            )
        )
        if priority == 1:
            ring = plt.Circle(
                (x, y),
                r * 2.35,
                fill=False,
                linestyle=(0, (1.2, 2.4)),
                linewidth=0.9,
                edgecolor=ACCENT,
                alpha=0.35,
                zorder=1.5,
                clip_on=False,
            )
            ax.add_patch(ring)

    ax.add_patch(
        Circle(
            (x, y),
            r,
            facecolor=PRIORITY_FILL[priority],
            edgecolor=WHITE if priority <= 3 else MUTED,
            linewidth=1.7 if priority <= 2 else 1.05 if priority == 3 else 0.8,
            zorder=3 if priority <= 2 else 2.5,
            clip_on=False,
        )
    )
    if priority <= 3:
        ax.add_patch(
            Circle(
                (x, y),
                r * 0.42,
                facecolor=PRIORITY_INNER[priority],
                edgecolor="none",
                zorder=3.2,
                clip_on=False,
            )
        )
    if label:
        ax.text(
            x,
            y - r * 0.02,
            label,
            ha="center",
            va="center",
            fontsize=11 if priority == 1 else 8.5,
            color=WHITE,
            fontweight="bold",
            zorder=4,
            clip_on=False,
        )


def save_transparent(fig, path: Path, **kwargs) -> None:
    fig.patch.set_facecolor("none")
    fig.patch.set_alpha(0)
    for axis in fig.axes:
        axis.set_facecolor("none")
        axis.patch.set_alpha(0)
    fig.savefig(path, transparent=True, facecolor="none", edgecolor="none", **kwargs)


def save_website(path: Path) -> None:
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
    pos, edges = build_graph()
    deg = degrees(edges)
    max_d = max(deg.values())
    rank = {n: priority_for(deg[n], max_d) for n in pos}

    fig, ax = plt.subplots(figsize=(10.4, 6.4), dpi=180)
    fig.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)
    x0, x1, y0, y1 = data_bounds(pos, rank, extra=0.05)
    ax.set_xlim(x0, x1)
    ax.set_ylim(y0, y1)
    ax.set_aspect("equal", adjustable="box")
    ax.axis("off")
    ax.set_clip_on(False)

    hubs = {"hub", "left", "right"}
    for a, b in edges:
        pa, pb = rank[a], rank[b]
        width = 2.15 if min(pa, pb) == 1 else 1.55 if min(pa, pb) == 2 else 1.05
        bulge = 0.018 if {a, b} <= hubs or "ext" in a or "ext" in b else 0.0
        if a.startswith("m") and b.startswith("m"):
            bulge = 0.022
        draw_link(ax, pos[a], pos[b], width, bulge)

    labeled = {}
    p2_nodes = [n for n, p in rank.items() if p == 2]
    labeled["hub"] = "1"
    for i, n in enumerate(sorted(p2_nodes, key=lambda k: -deg[k])[:2]):
        labeled[n] = "2"

    for n in sorted(pos, key=lambda k: -rank[k]):
        draw_node(ax, *pos[n], rank[n], labeled.get(n))

    counts = defaultdict(int)
    for p in rank.values():
        counts[p] += 1
    print("nodes", len(pos), "edges", len(edges), "priorities", dict(sorted(counts.items())))
    save_transparent(fig, path, bbox_inches="tight", pad_inches=0.04)
    save_transparent(fig, path.with_suffix(".png"), dpi=220, bbox_inches="tight", pad_inches=0.04)
    plt.close(fig)


def main() -> None:
    save_website(ROOT / "intervention-prioritisation-website.svg")


if __name__ == "__main__":
    main()
