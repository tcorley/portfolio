from typing import Literal

from rendercv.schema.models.design.classic_theme import ClassicTheme


class SignalTheme(ClassicTheme):
    """Classic design controls paired with the custom Signal Typst templates."""

    theme: Literal["signal"] = "signal"
