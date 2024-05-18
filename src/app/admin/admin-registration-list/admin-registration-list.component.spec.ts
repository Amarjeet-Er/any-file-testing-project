import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrationListComponent } from './admin-registration-list.component';

describe('AdminRegistrationListComponent', () => {
  let component: AdminRegistrationListComponent;
  let fixture: ComponentFixture<AdminRegistrationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRegistrationListComponent]
    });
    fixture = TestBed.createComponent(AdminRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
