import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionApprenantComponent } from './inscription-apprenant.component';

describe('InscriptionApprenantComponent', () => {
  let component: InscriptionApprenantComponent;
  let fixture: ComponentFixture<InscriptionApprenantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionApprenantComponent]
    });
    fixture = TestBed.createComponent(InscriptionApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
