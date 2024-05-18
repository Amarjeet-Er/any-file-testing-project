import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { AdminRegistrationListComponent } from './admin-registration-list/admin-registration-list.component';
import { AdminRegistrationUpdateComponent } from './admin-registration-update/admin-registration-update.component';
import { AdminCandidateComponent } from './admin-candidate/admin-candidate.component';

const routes: Routes = [
  {
    path: '', component: AdminHomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'candidate', component: AdminCandidateComponent },
      { path: 'registrationform', component: AdminRegistrationComponent },
      { path: 'registrationlist', component: AdminRegistrationListComponent },
      { path: 'registrationupdate', component: AdminRegistrationUpdateComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
