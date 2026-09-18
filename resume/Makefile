PYTHON ?= python3
VENV ?= .venv
RENDERCV := $(VENV)/bin/rendercv
SOURCE := resume.yaml
BUILD := build
VARIANT ?= default
# Selected YAML must live next to the `folio/` theme folder for RenderCV.
SELECTED := resume.selected.yaml
SELECT := $(VENV)/bin/python select_variant.py

.PHONY: install select render preview variants

install: $(RENDERCV)

$(RENDERCV): requirements.txt
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/python -m pip install --upgrade pip
	$(VENV)/bin/python -m pip install -r requirements.txt

select: $(RENDERCV)
	$(SELECT) --source $(SOURCE) --variant $(VARIANT) --output $(SELECTED)

render: select
	$(RENDERCV) render $(SELECTED) --output-folder $(BUILD) --pdf-path $(BUILD)/resume.pdf

preview: select
	$(RENDERCV) render $(SELECTED) --output-folder $(BUILD) --pdf-path $(BUILD)/resume.pdf --watch

variants:
	@echo "Known variants: default frontend platform leadership full"
