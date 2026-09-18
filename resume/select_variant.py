#!/usr/bin/env python3
"""Filter tagged resume source into a RenderCV-ready YAML for one variant.

Highlight (or entry) objects may include a ``variants`` list. An item is kept
when:

* ``variant`` is ``full`` (everything), or
* the item has no ``variants`` field (included in every named variant), or
* ``variant`` appears in that item's ``variants`` list.

Tagged highlights use ``{text, variants}``; plain strings are always kept.
The filtered output uses only plain strings so RenderCV validation stays happy.
"""

from __future__ import annotations

import argparse
import copy
import sys
from pathlib import Path
from typing import Any

try:
    from ruamel.yaml import YAML
except ImportError:  # pragma: no cover - venv always has ruamel via rendercv
    import yaml as _pyyaml

    def _load(path: Path) -> Any:
        return _pyyaml.safe_load(path.read_text())

    def _dump(data: Any, path: Path) -> None:
        path.write_text(_pyyaml.safe_dump(data, sort_keys=False))
else:
    _yaml = YAML(typ="safe")
    _yaml.default_flow_style = False

    def _load(path: Path) -> Any:
        with path.open() as handle:
            return _yaml.load(handle)

    def _dump(data: Any, path: Path) -> None:
        out = YAML()
        out.default_flow_style = False
        out.indent(mapping=2, sequence=4, offset=2)
        out.width = 1000
        with path.open("w") as handle:
            out.dump(data, handle)


KNOWN_VARIANTS = ("default", "frontend", "platform", "leadership", "full")


def _keep(item_variants: list[str] | None, variant: str) -> bool:
    if variant == "full":
        return True
    if not item_variants:
        return True
    return variant in item_variants


def _filter_highlight(item: Any, variant: str) -> str | None:
    if isinstance(item, str):
        return item
    if not isinstance(item, dict) or "text" not in item:
        raise ValueError(f"Highlight must be a string or {{text, variants}}: {item!r}")
    tags = item.get("variants")
    if tags is not None and not isinstance(tags, list):
        raise ValueError(f"variants must be a list: {item!r}")
    if not _keep(tags, variant):
        return None
    text = item["text"]
    if not isinstance(text, str):
        raise ValueError(f"Highlight text must be a string: {item!r}")
    return text


def _filter_entry(entry: Any, variant: str) -> Any | None:
    if isinstance(entry, str):
        return entry
    if not isinstance(entry, dict):
        return entry

    tags = entry.get("variants")
    if tags is not None and not isinstance(tags, list):
        raise ValueError(f"Entry variants must be a list: {entry!r}")
    if not _keep(tags, variant):
        return None

    filtered = {key: value for key, value in entry.items() if key != "variants"}
    if "highlights" in filtered and isinstance(filtered["highlights"], list):
        highlights = [
            text
            for text in (
                _filter_highlight(item, variant) for item in filtered["highlights"]
            )
            if text is not None
        ]
        filtered["highlights"] = highlights
    return filtered


def select_variant(data: dict[str, Any], variant: str) -> dict[str, Any]:
    if variant not in KNOWN_VARIANTS:
        known = ", ".join(KNOWN_VARIANTS)
        raise SystemExit(f"Unknown variant {variant!r}. Expected one of: {known}")

    result = copy.deepcopy(data)
    sections = result.get("cv", {}).get("sections")
    if not isinstance(sections, dict):
        return result

    for name, entries in list(sections.items()):
        if not isinstance(entries, list):
            continue
        kept = []
        for entry in entries:
            filtered = _filter_entry(entry, variant)
            if filtered is None:
                continue
            # Drop experience entries that lost every highlight after filtering.
            if (
                isinstance(filtered, dict)
                and "highlights" in filtered
                and not filtered["highlights"]
            ):
                continue
            kept.append(filtered)
        sections[name] = kept

    return result


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("resume.yaml"),
        help="Tagged master YAML (default: resume.yaml)",
    )
    parser.add_argument(
        "--variant",
        default="default",
        help=f"Variant to select (default: default). One of: {', '.join(KNOWN_VARIANTS)}",
    )
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Path for the filtered RenderCV YAML",
    )
    args = parser.parse_args(argv)

    data = _load(args.source)
    if not isinstance(data, dict):
        raise SystemExit(f"Expected a mapping in {args.source}")

    filtered = select_variant(data, args.variant)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    _dump(filtered, args.output)
    print(f"Wrote {args.output} for variant={args.variant}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
