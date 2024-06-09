import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningFormationAddComponent } from './planning-formation-add.component';

describe('PlanningFormationAddComponent', () => {
  let component: PlanningFormationAddComponent;
  let fixture: ComponentFixture<PlanningFormationAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningFormationAddComponent]
    });
    fixture = TestBed.createComponent(PlanningFormationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
