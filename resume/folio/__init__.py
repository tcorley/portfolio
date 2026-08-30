from typing import Literal

from rendercv.schema.models.design.classic_theme import ClassicTheme


class FolioTheme(ClassicTheme):
    """Classic design controls paired with the custom Folio Typst templates."""

    theme: Literal["folio"] = "folio"
