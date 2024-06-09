import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSalaireComponent } from './gestion-salaire.component';

describe('GestionSalaireComponent', () => {
  let component: GestionSalaireComponent;
  let fixture: ComponentFixture<GestionSalaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionSalaireComponent]
    });
    fixture = TestBed.createComponent(GestionSalaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
