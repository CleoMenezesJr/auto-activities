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
const { GObject, St } = imports.gi;

const AutoActivities = GObject.registerClass(
  class AutoActivities extends St.Bin {
    _init(remoteModel, monitorIndex) {
      this._workspacesReorderedEvent = null;
      this._workspacesUpdatedEvent = null;
      this._windowRemovedEvent = null;
      this.remoteModel = remoteModel;
      this.monitorIndex = monitorIndex;
    }
  
    enable() {
      for (let i = 0; i < global.workspace_manager.n_workspaces; i++) {
        try { global.workspace_manager.get_workspace_by_index(i).connect('window-removed', this._windowRemoved.bind(this)); }
        catch (_err) {}
      }
      this._workspacesReorderedEvent = global.workspace_manager.connect('workspaces-reordered', this._workspacesUpdated.bind(this));
      this._workspacesUpdatedEvent = global.workspace_manager.connect('notify::n-workspaces', this._workspacesUpdated.bind(this));
    }
  
    _workspacesUpdated() {
      for (let i = 0; i < global.workspace_manager.n_workspaces; i++) {
        try { global.workspace_manager.get_workspace_by_index(i).disconnect(this._windowRemovedEvent); }
        catch (_err) {}
      }
      for (let i = 0; i < global.workspace_manager.n_workspaces; i++) {
        try { global.workspace_manager.get_workspace_by_index(i).connect('window-removed', this._windowRemoved.bind(this)); }
        catch (_err) {}
      }
    }
  
    _windowRemoved() {
      let windows = global.get_window_actors();
      windows = windows.filter(window => window.meta_window.get_workspace().index() === global.workspace_manager.get_active_workspace().index());
      windows = windows.filter(window => !window.meta_window.skip_taskbar);

      if (windows.length < 1) Main.overview.show();
    }
  
    destroy() {
      global.workspace_manager.disconnect(this._workspacesReorderedEvent);
      global.workspace_manager.disconnect(this._workspacesUpdatedEvent);
  
      for (let i = 0; i < global.workspace_manager.n_workspaces; i++) {
        try { global.workspace_manager.get_workspace_by_index(i).disconnect(this._windowRemovedEvent); }
        catch (_err) {}
      }
    }
  });
