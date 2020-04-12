import { Injectable } from '@angular/core';
import { Preferences } from './preferences.model';
import { SettingsPanelStore } from './settings.store';

@Injectable({
  providedIn: 'root'
})
export class SettingsPanelService {

  constructor(private settingsStore: SettingsPanelStore) { }

  updatePreferences(preferences: Preferences) {
    this.settingsStore.updatePreferences(preferences);
  }
}
