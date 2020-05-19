import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SettingsPanelStore, SettingsPanelState } from './settings.store';

@Injectable({ providedIn: 'root' })
export class SettingsQuery extends Query<SettingsPanelState> {

  preferences$ = this.select((state) => state.preferences);

  constructor(protected store: SettingsPanelStore) {
    super(store);
  }

}
