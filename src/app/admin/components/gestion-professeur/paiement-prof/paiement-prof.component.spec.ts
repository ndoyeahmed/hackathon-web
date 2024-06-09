import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementProfComponent } from './paiement-prof.component';

describe('PaiementProfComponent', () => {
  let component: PaiementProfComponent;
  let fixture: ComponentFixture<PaiementProfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementProfComponent]
    });
    fixture = TestBed.createComponent(PaiementProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
