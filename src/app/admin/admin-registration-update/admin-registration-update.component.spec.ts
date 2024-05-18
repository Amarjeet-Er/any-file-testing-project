import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrationUpdateComponent } from './admin-registration-update.component';

describe('AdminRegistrationUpdateComponent', () => {
  let component: AdminRegistrationUpdateComponent;
  let fixture: ComponentFixture<AdminRegistrationUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRegistrationUpdateComponent]
    });
    fixture = TestBed.createComponent(AdminRegistrationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
