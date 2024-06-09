import { TestBed } from '@angular/core/testing';

import { SeminaireService } from './seminaire.service';

describe('SeminaireService', () => {
  let service: SeminaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeminaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
