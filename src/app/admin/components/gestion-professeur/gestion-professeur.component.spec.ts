import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProfesseurComponent } from './gestion-professeur.component';

describe('GestionProfesseurComponent', () => {
  let component: GestionProfesseurComponent;
  let fixture: ComponentFixture<GestionProfesseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionProfesseurComponent]
    });
    fixture = TestBed.createComponent(GestionProfesseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
