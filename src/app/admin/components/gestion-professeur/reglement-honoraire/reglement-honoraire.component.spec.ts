import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementHonoraireComponent } from './reglement-honoraire.component';

describe('ReglementHonoraireComponent', () => {
  let component: ReglementHonoraireComponent;
  let fixture: ComponentFixture<ReglementHonoraireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReglementHonoraireComponent]
    });
    fixture = TestBed.createComponent(ReglementHonoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
