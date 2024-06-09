import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesseurViewComponent } from './professeur-view.component';

describe('ProfesseurViewComponent', () => {
  let component: ProfesseurViewComponent;
  let fixture: ComponentFixture<ProfesseurViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesseurViewComponent]
    });
    fixture = TestBed.createComponent(ProfesseurViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
