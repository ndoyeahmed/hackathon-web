import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFixeComponent } from './charge-fixe.component';

describe('ChargeFixeComponent', () => {
  let component: ChargeFixeComponent;
  let fixture: ComponentFixture<ChargeFixeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargeFixeComponent]
    });
    fixture = TestBed.createComponent(ChargeFixeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
