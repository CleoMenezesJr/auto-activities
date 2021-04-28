UUID = auto-activities@acedron.github.io
ifeq ($(strip $(DESTDIR)),)
	INSTALLTYPE = local
	INSTALLBASE = $(HOME)/.local/share/gnome-shell/extensions
else
	INSTALLTYPE = system
	SHARE_PREFIX = $(DESTDIR)/usr/share
	INSTALLBASE = $(SHARE_PREFIX)/gnome-shell/extensions
endif
INSTALLNAME = auto-activities@acedron.github.io

.PHONY: default
default: build

.PHONY: build
build:
	glib-compile-schemas ./schemas

.PHONY: install
install: build
	rm -rf $(INSTALLBASE)/$(INSTALLNAME)
	mkdir -p $(INSTALLBASE)/$(INSTALLNAME)
	cp -r ./ $(INSTALLBASE)/$(INSTALLNAME)

.PHONY: uninstall
uninstall:
	rm -rf $(INSTALLBASE)/$(INSTALLNAME)

.PHONY: clean
clean:
	rm -f ./schemas/gschemas.compiled
