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
const Workspace = imports.ui.workspace;
const { GObject, St } = imports.gi;

var AutoActivities = GObject.registerClass(
  class AutoActivities extends St.Bin {
    _init(remoteModel, monitorIndex) {
      this.workspace = null;
      this._workspacesReorderedEvent = null;
      this._workspacesUpdatedEvent = null;
      this._windowRemovedEvent = null;
      this.remoteModel = remoteModel;
      this.monitorIndex = monitorIndex;
    }
  
    enable() {
      let workspaceManager = global.workspace_manager;
      this.workspace = workspaceManager.get_active_workspace();
      this.workspace.connect('window-removed', this._windowRemoved.bind(this));
      this._workspacesReorderedEvent = workspaceManager.connect('workspaces-reordered', this._workspacesUpdated.bind(this));
      this._workspacesUpdatedEvent = workspaceManager.connect('notify::n-workspaces', this._workspacesUpdated.bind(this));
    }
  
    _workspacesUpdated() {
      let workspaceManager = global.workspace_manager;
      this.workspace.disconnect(this._windowRemovedEvent);
      this.workspace = workspaceManager.get_active_workspace();
      this.workspace.connect('window-removed', this._windowRemoved.bind(this));
    }
  
    _windowRemoved() {
      const globalWindows = global.get_window_actors();
      let windows = global.get_window_actors();
      windows = windows.filter(window => window.meta_window.get_workspace().index() === this.workspace.index());
  
      if (windows.length <= 1) Main.overview.show();
    }
  
    destroy() {
      let workspaceManager = global.workspace_manager;
      workspaceManager.disconnect(this._workspacesReorderedEvent);
      workspaceManager.disconnect(this._workspacesUpdatedEvent);
  
      try { this.workspace.disconnect(this._windowRemovedEvent); }
      catch (_err) {}
    }
  });