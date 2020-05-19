import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Preferences, BuildingColorMapperPreference, SizeMapperPreference, DistrictColorMapperPreference } from './preferences.model';

export interface SettingsPanelState {
   preferences: Preferences;
}

export function createInitialState(): SettingsPanelState {
  return {
    preferences: {
      sizeMapping: {
        height: SizeMapperPreference.number_lines_sqrt,
        width: '3',
        depth: '3'
      },
      colorMapping: {
        buildingColor: BuildingColorMapperPreference.author,
        districtColor: DistrictColorMapperPreference.depth
      }
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'settings-panel' })
export class SettingsPanelStore extends Store<SettingsPanelState> {

  constructor() {
    super(createInitialState());
  }

  updatePreferences(preferences: Preferences) {
    this.update(state => ({
      ...state,
      preferences: preferences
    }));
  }
}

