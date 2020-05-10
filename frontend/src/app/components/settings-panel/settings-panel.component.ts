import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsQuery } from './state/settings.query';
import { Preferences, SizeMapperPreference, BuildingColorMapperPreference, DistrictColorMapperPreference } from './state/preferences.model';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsPanelService } from './state/settings.service';

@Component({
  selector: 'cc-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit {

  settingsForm = new FormGroup({
    sizeMapping: new FormGroup({
      height: new FormControl(SizeMapperPreference.number_lines_sqrt),
      width: new FormControl('3'),
      depth: new FormControl('3')
    }),
    colorMapping: new FormGroup({
      buildingColor: new FormControl(BuildingColorMapperPreference.author),
      districtColor: new FormControl(DistrictColorMapperPreference.depth)
    })
  });

  SizeMapper = SizeMapperPreference;
  BuildingColorMapper = BuildingColorMapperPreference;
  DistrictColorMapper = DistrictColorMapperPreference;

  constructor(
    public activeModal: NgbActiveModal,
    private settingsPanelQuery: SettingsQuery,
    private settingsPanelService: SettingsPanelService
  ) {
    settingsPanelQuery.preferences$.subscribe((preferences) => {
      this.settingsForm.patchValue(preferences);
    });
  }

  ngOnInit() {
  }

  onSubmit({ value, valid }) {
    if (valid) {
      const preferences = value as Preferences;
      this.settingsPanelService.updatePreferences(preferences);
      console.debug(`Updated preferences ${JSON.stringify(preferences)}`);
      this.activeModal.close();
    }
  }

}
