import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaiementProfComponent } from './list-paiement-prof.component';

describe('ListPaiementProfComponent', () => {
  let component: ListPaiementProfComponent;
  let fixture: ComponentFixture<ListPaiementProfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPaiementProfComponent]
    });
    fixture = TestBed.createComponent(ListPaiementProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
