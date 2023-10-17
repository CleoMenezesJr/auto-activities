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

import Gtk from "gi://Gtk";
import Gio from "gi://Gio";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class MyExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings();
    window.set_default_size(360, 724);

    const builder = new Gtk.Builder();
    builder.add_from_file(`${this.path}/prefs.ui`);

    const isolateWorkspaces = builder.get_object("IsolateWorkspacesSwitch");
    isolateWorkspaces.set_active(
      window._settings.get_boolean("isolate-workspaces"),
    );
    window._settings.bind(
      "isolate-workspaces",
      isolateWorkspaces,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const isolateMonitors = builder.get_object("IsolateMonitorsSwitch");
    isolateMonitors.set_active(
      window._settings.get_boolean("isolate-monitors"),
    );
    window._settings.bind(
      "isolate-monitors",
      isolateMonitors,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const skipTaskbar = builder.get_object("SkipTaskbarSwitch");
    skipTaskbar.set_active(window._settings.get_boolean("skip-taskbar"));
    window._settings.bind(
      "skip-taskbar",
      skipTaskbar,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const skipLastWorkspace = builder.get_object("SkipLastWorkspaceSwitch");
    skipLastWorkspace.set_active(
      window._settings.get_boolean("skip-last-workspace"),
    );
    window._settings.bind(
      "skip-last-workspace",
      skipLastWorkspace,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const detectMinimized = builder.get_object("MinimizedSwitch");
    detectMinimized.set_active(
      window._settings.get_boolean("detect-minimized"),
    );
    window._settings.bind(
      "detect-minimized",
      detectMinimized,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const hideOnNewWindow = builder.get_object("HideOnNewWindowSwitch");
    hideOnNewWindow.set_active(
      window._settings.get_boolean("hide-on-new-window"),
    );
    window._settings.bind(
      "hide-on-new-window",
      hideOnNewWindow,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const checkingDelay = builder.get_object("CheckingDelayEntry");
    checkingDelay.set_value(
      window._settings.get_int("window-checking-delay"),
    );
    window._settings.bind(
      "window-checking-delay",
      checkingDelay,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const showApps = builder.get_object("ShowAppsSwitch");
    showApps.set_active(window._settings.get_boolean("show-apps"));
    window._settings.bind(
      "show-apps",
      showApps,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    const page = builder.get_object("MainWidget");
    window.add(page);
  }
}
