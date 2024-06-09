import { TestBed } from '@angular/core/testing';

import { ParametragesService } from './parametrages.service';

describe('ParametragesService', () => {
  let service: ParametragesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametragesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
