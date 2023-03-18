/****************************************************************************
 ** Auto Activities - Show activities overlay when there are no windows.
 ** Copyright (C) 2021  jan Sena <mi-jan-sena@proton.me> and Cleo Menezes Jr.
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

const { Gtk, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

function fillPreferencesWindow(window) {
    window.set_default_size(360, 571);
  let builder = Gtk.Builder.new();
  builder.add_from_file(Me.dir.get_path() + "/prefs.ui");
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

  let skipLastWorkspace = builder.get_object("SkipLastWorkspaceSwitch");
  skipLastWorkspace.set_active(settings.get_boolean("skip-last-workspace"));
  settings.bind(
    "skip-last-workspace",
    skipLastWorkspace,
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

  let showApps = builder.get_object("ShowAppsSwitch");
  showApps.set_active(settings.get_boolean("show-apps"));
  settings.bind("show-apps", showApps, "active", Gio.SettingsBindFlags.DEFAULT);

  let page = builder.get_object("MainWidget");
  window.add(page);
}
