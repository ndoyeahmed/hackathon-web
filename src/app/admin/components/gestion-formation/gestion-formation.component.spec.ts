import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFormationComponent } from './gestion-formation.component';

describe('GestionFormationComponent', () => {
  let component: GestionFormationComponent;
  let fixture: ComponentFixture<GestionFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionFormationComponent]
    });
    fixture = TestBed.createComponent(GestionFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
