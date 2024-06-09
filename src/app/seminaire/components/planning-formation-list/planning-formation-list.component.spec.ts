import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningFormationListComponent } from './planning-formation-list.component';

describe('PlanningFormationListComponent', () => {
  let component: PlanningFormationListComponent;
  let fixture: ComponentFixture<PlanningFormationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningFormationListComponent]
    });
    fixture = TestBed.createComponent(PlanningFormationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
