/****************************************************************************
** Auto Activities - Show activities overlay when there are no windows.
** Copyright (C) 2021  acedron <acedrons@yahoo.co.jp>
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
'use strict';

const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const { GObject, St, Meta } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var AutoActivities = GObject.registerClass(
  class AutoActivities extends St.Bin {
    _init(remoteModel, monitorIndex) {
      this._remoteModel = remoteModel;
      this._monitorIndex = monitorIndex;
      this._windowRemovedEvents = [];
      this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.auto-activities');
    
      for (let i = 0; i < global.workspace_manager.n_workspaces; i++)
        this._onWorkspaceAdded(global.workspace_manager, i);

      this._workspaceAddedEvent = global.workspace_manager.connect('workspace-added', this._onWorkspaceAdded.bind(this));
      this._workspaceRemovedEvent = global.workspace_manager.connect('workspace-removed', this._onWorkspaceRemoved.bind(this));
      this._workspacesReorderedEvent = global.workspace_manager.connect('workspaces-reordered', this._onWorkspacesReordered.bind(this));
      this._minimizedEvent = global.window_manager.connect('minimize', this._onWindowMinimized.bind(this));
    }
  
    _onWorkspaceAdded(_workspaceManager, workspaceIndex) {
      let windowRemovedEvent = global.workspace_manager.get_workspace_by_index(workspaceIndex).connect('window-removed', this._onWindowRemoved.bind(this)); 
      this._windowRemovedEvents.push(windowRemovedEvent);
    }

    _onWorkspaceRemoved(_workspaceManager, workspaceIndex) {
      if (workspaceIndex < this._windowRemovedEvents.length)
        this._windowRemovedEvents.splice(workspaceIndex);
    }

    _onWorkspacesReordered(_workspaceManager) {
      let firstWorkspaceIndex = -1;
      let secondWorkspaceIndex = -1;
      for (let i = 0; i < this._windowRemovedEvents.length; i++)
        if (GObject.signal_handler_is_connected(global.workspace_manager.get_workspace_by_index(i), this._windowRemovedEvents[i])) {
          if (firstWorkspaceIndex < 0)
            firstWorkspaceIndex = i;
          else
            secondWorkspaceIndex = i;
        }

      let tempFirstWorkspaceRemovedEvent = this._windowRemovedEvents[firstWorkspaceIndex];
      this._windowRemovedEvents[firstWorkspaceIndex] = this._windowRemovedEvents[secondWorkspaceIndex];
      this._windowRemovedEvents[secondWorkspaceIndex] = tempFirstWorkspaceRemovedEvent;
    }

    _onWindowMinimized(_sender, actor) {
      this._onWindowRemoved(_sender, actor.meta_window);
    }

    _onWindowRemoved(_sender, removedWindow) {
      let ignoredWindowTypes = [ Meta.WindowType.DROPDOWN_MENU, Meta.WindowType.NOTIFICATION, Meta.WindowType.POPUP_MENU, Meta.WindowType.SPLASHSCREEN ];
      if (ignoredWindowTypes.includes(removedWindow.get_window_type()))
        return;

      let delay = 0;
      let delaySetting = parseInt(this._settings.get_string('window-checking-delay'));
      if (!isNaN(delaySetting) && delaySetting > 0)
          delay = delaySetting;

      Mainloop.timeout_add(delay, () => {
        let windows = global.get_window_actors();
        if (this._settings.get_boolean('isolate-workspaces'))
          windows = windows.filter(window => window.meta_window.get_workspace().index() === global.workspace_manager.get_active_workspace().index());
        if (this._settings.get_boolean('isolate-monitors'))
          windows = windows.filter(window => window.meta_window.get_monitor() === this._monitorIndex);
        if (this._settings.get_boolean('skip-taskbar'))
          windows = windows.filter(window => !window.meta_window.skip_taskbar);
        if (this._settings.get_boolean('detect-minimized'))
          windows = windows.filter(window => !window.meta_window.minimized);

        if (windows.length < 1)
          Main.overview.show();
      });
    }
  
    destroy() {
      global.workspace_manager.disconnect(this._workspaceAddedEvent);
      global.workspace_manager.disconnect(this._workspaceRemovedEvent);
      global.workspace_manager.disconnect(this._workspacesReorderedEvent);
      global.window_manager.disconnect(this._minimizedEvent);

      for (let i = 0; i < this._windowRemovedEvents.length; i++)
        if (GObject.signal_handler_is_connected(global.workspace_manager.get_workspace_by_index(i), this._windowRemovedEvents[i]))
          global.workspace_manager.get_workspace_by_index(i).disconnect(this._windowRemovedEvents[i]);
    }
  });
