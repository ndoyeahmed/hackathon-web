import { TestBed } from '@angular/core/testing';

import { SubjectUtilsService } from './subject-utils.service';

describe('SubjectUtilsService', () => {
  let service: SubjectUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
