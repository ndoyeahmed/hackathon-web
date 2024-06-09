import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenantListComponent } from './apprenant-list.component';

describe('ApprenantListComponent', () => {
  let component: ApprenantListComponent;
  let fixture: ComponentFixture<ApprenantListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprenantListComponent]
    });
    fixture = TestBed.createComponent(ApprenantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
