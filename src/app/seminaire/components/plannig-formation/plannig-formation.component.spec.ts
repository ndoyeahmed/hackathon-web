import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannigFormationComponent } from './plannig-formation.component';

describe('PlannigFormationComponent', () => {
  let component: PlannigFormationComponent;
  let fixture: ComponentFixture<PlannigFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlannigFormationComponent]
    });
    fixture = TestBed.createComponent(PlannigFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
