/****************************************************************************
 ** Auto Activities - Show activities overlay when there are no windows.
 ** Copyright (C) 2022-2023 Cleo Menezes Jr., 2021  jan Sena <mi-jan-sena@proton.me>
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

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import { AutoActivitiesManager } from "./autoActivities.js";

export default class AutoActivities extends Extension {
  enable() {
    this._settings = this.getSettings();
    this._autoActivities = new AutoActivitiesManager({
      settings: this._settings,
    });
  }

  disable() {
    this._autoActivities.destroy();
    this._autoActivities = null;
    this._settings = null;
  }
}
