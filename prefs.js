/****************************************************************************
 ** Auto Activities - Show activities overlay when there are no windows.
 ** Copyright (C) 2021  jan Sena <mi-jan-sena@proton.me>
 **
 ** This program is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** This program is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with this program.  If not, see <https://www.gnu.org/licenses/>.
 ****************************************************************************/
"use strict";

const { GObject, Gtk, Gio, Adw } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const BuilderScope = GObject.registerClass(
  {
    Implements: [Gtk.BuilderScope],
  },
  class BuilderScope extends GObject.Object {
    vfunc_create_closure(builder, handlerName, flags, connectObject) {
      if (flags & Gtk.BuilderClosureFlags.SWAPPED)
        throw new Error('Unsupported template signal flag "swapped"');
      if (typeof this[handlerName] === "undefined")
        throw new Error(`${handlerName} is undefined`);

      return this[handlerName].bind(connectObject || this);
    }
  }
);

function init() {}

function buildPrefsWidget() {
  let builder = Gtk.Builder.new_from_file(Me.dir.get_path() + "/prefs.ui");
  builder.set_scope(new BuilderScope());
  builder.set_translation_domain("auto-activities");
  let settings = ExtensionUtils.getSettings(
    "org.gnome.shell.extensions.auto-activities"
  );

  let isolateWorkspaces = builder.get_object("IsolateWorkspacesSwitch");
  isolateWorkspaces.set_active(settings.get_boolean("isolate-workspaces"));
  settings.bind(
    "isolate-workspaces",
    isolateWorkspaces,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  );

  let isolateMonitors = builder.get_object("IsolateMonitorsSwitch");
  isolateMonitors.set_active(settings.get_boolean("isolate-monitors"));
  settings.bind(
    "isolate-monitors",
    isolateMonitors,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  );

  let skipTaskbar = builder.get_object("SkipTaskbarSwitch");
  skipTaskbar.set_active(settings.get_boolean("skip-taskbar"));
  settings.bind(
    "skip-taskbar",
    skipTaskbar,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  );

  let detectMinimized = builder.get_object("MinimizedSwitch");
  detectMinimized.set_active(settings.get_boolean("detect-minimized"));
  settings.bind(
    "detect-minimized",
    detectMinimized,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  );

  let hideOnNewWindow = builder.get_object("HideOnNewWindowSwitch");
  hideOnNewWindow.set_active(settings.get_boolean("hide-on-new-window"));
  settings.bind(
    "hide-on-new-window",
    hideOnNewWindow,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  );

  let checkingDelay = builder.get_object("CheckingDelayEntry");
  checkingDelay.set_text(settings.get_string("window-checking-delay"));
  settings.bind(
    "window-checking-delay",
    checkingDelay,
    "text",
    Gio.SettingsBindFlags.DEFAULT
  );

  return builder.get_object("MainWidget");
}
