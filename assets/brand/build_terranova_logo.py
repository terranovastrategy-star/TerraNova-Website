#!/usr/bin/env python3
"""Build Terranova logo SVGs — horizon arc, nested territory peaks, wordmark."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent

INK = "#202220"
MUTED = "#666866"
WHITE = "#FFFFFF"
ACCENT = "#AF2832"


def mark(*, ink: str, accent: str | None = None, stroke_width: float = 1.05) -> str:
    """Horizon arc + three nested territory peaks + focal point."""
    tri = accent or ink
    sw = stroke_width
    return f"""
  <g transform="translate(0 0.25)">
    <path d="M4.8 10.2 A8.2 8.2 0 0 1 21.2 10.2" fill="none" stroke="{ink}" stroke-width="{sw}" stroke-linecap="round"/>
    <path d="M2.8 16.4 13 3.8 23.2 16.4" fill="none" stroke="{ink}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.6 16.4 13 8.2 19.4 16.4" fill="none" stroke="{ink}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.8 16.4 13 11.8 16.2 16.4" fill="none" stroke="{ink}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13 17.55 11.2 19.95 14.8 19.95Z" fill="{tri}"/>
  </g>""".strip()


def wordmark(*, ink: str, muted: str, muted_opacity: float = 1.0) -> str:
    opacity = f' opacity="{muted_opacity}"' if muted_opacity < 1 else ""
    return f"""
  <text x="36" y="15.9" font-family="Inter, Segoe UI, Calibri, Arial, sans-serif" font-size="11.5" font-weight="300" fill="{ink}" letter-spacing="0.28em">TERRANOVA</text>
  <text x="158" y="15.9" font-family="Inter, Segoe UI, Calibri, Arial, sans-serif" font-size="9.5" font-weight="300" fill="{muted}"{opacity} letter-spacing="0.14em">Strategy</text>""".strip()


def logo(*, ink: str, muted: str, accent: str | None, label: str, muted_opacity: float = 1.0) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 214 22" fill="none" role="img" aria-label="{label}">
  <title>{label}</title>
{mark(ink=ink, accent=accent)}
{wordmark(ink=ink, muted=muted, muted_opacity=muted_opacity)}
</svg>
"""


def favicon(*, bg: str, ink: str, accent: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="{bg}"/>
  <g transform="translate(3 4.75) scale(1.06)">
{mark(ink=ink, accent=accent, stroke_width=1.2)}
  </g>
</svg>
"""


def write_favicon_rasters(svg_path: Path) -> None:
    import cairosvg
    from PIL import Image

    svg_bytes = svg_path.read_bytes()
    sizes = {
        "favicon-16.png": 16,
        "favicon-32.png": 32,
        "apple-touch-icon.png": 180,
    }
    images: list[Image.Image] = []
    for name, px in sizes.items():
        out = ROOT / name
        cairosvg.svg2png(bytestring=svg_bytes, write_to=str(out), output_width=px, output_height=px)
        if px in (16, 32):
            images.append(Image.open(out))

    ico_path = ROOT / "favicon.ico"
    images[0].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32)],
        append_images=images[1:],
    )


def main() -> None:
    (ROOT / "terranova-mark.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 22" fill="none" aria-hidden="true">\n{mark(ink=INK, accent=ACCENT)}\n</svg>\n',
        encoding="utf-8",
    )
    (ROOT / "terranova-mark-light.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 22" fill="none" aria-hidden="true">\n{mark(ink=WHITE, accent=ACCENT)}\n</svg>\n',
        encoding="utf-8",
    )
    (ROOT / "terranova-logo.svg").write_text(
        logo(ink=INK, muted=MUTED, accent=ACCENT, label="Terranova Strategy"),
        encoding="utf-8",
    )
    (ROOT / "terranova-logo-light.svg").write_text(
        logo(ink=WHITE, muted=WHITE, accent=ACCENT, label="Terranova Strategy", muted_opacity=0.68),
        encoding="utf-8",
    )
    favicon_path = ROOT / "favicon.svg"
    favicon_path.write_text(favicon(bg=INK, ink=WHITE, accent=ACCENT), encoding="utf-8")
    write_favicon_rasters(favicon_path)
    print("Wrote Terranova logo assets")


if __name__ == "__main__":
    main()
