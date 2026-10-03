.DEFAULT_GOAL := dev

.PHONY: dev check build verify preview

dev:
	npm run dev

check:
	npm run check

build:
	npm run build

verify:
	npm run verify

preview:
	npm run preview
