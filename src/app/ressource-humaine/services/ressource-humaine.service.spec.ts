import { TestBed } from '@angular/core/testing';

import { RessourceHumaineService } from './ressource-humaine.service';

describe('RessourceHumaineService', () => {
  let service: RessourceHumaineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RessourceHumaineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
