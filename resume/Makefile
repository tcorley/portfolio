PYTHON ?= python3
VENV ?= .venv
RENDERCV := $(VENV)/bin/rendercv
SOURCE := resume.yaml
BUILD := build

.PHONY: install render preview

install: $(RENDERCV)

$(RENDERCV): requirements.txt
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/python -m pip install --upgrade pip
	$(VENV)/bin/python -m pip install -r requirements.txt

render: $(RENDERCV)
	$(RENDERCV) render $(SOURCE) --output-folder $(BUILD) --pdf-path $(BUILD)/resume.pdf

preview: $(RENDERCV)
	$(RENDERCV) render $(SOURCE) --output-folder $(BUILD) --pdf-path $(BUILD)/resume.pdf --watch
