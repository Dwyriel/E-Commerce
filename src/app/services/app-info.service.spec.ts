import { TestBed } from '@angular/core/testing';

import { AppResources } from './app-info.service';

describe('AppInfoService', () => {
  let service: AppResources;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppResources);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
