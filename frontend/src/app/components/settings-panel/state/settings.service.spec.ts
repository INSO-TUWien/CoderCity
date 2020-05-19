import { TestBed } from '@angular/core/testing';

import { SettingsPanelService } from './settings.service';

describe('SettingsPanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsPanelService = TestBed.get(SettingsPanelService);
    expect(service).toBeTruthy();
  });
});
