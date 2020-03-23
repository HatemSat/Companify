import { CompanyDetailsComponent } from './company-details/company-details.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { CompaniesComponent } from './companies/companies.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { ExpertsComponent } from './experts/experts.component';
import { ExpertDetailsComponent } from './expert-details/expert-details.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
  { path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard] },
  { path: 'member-details/:id', component: MemberDetailsComponent, canActivate: [AuthGuard] },
  { path: 'company-details/:id', component: CompanyDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'experts', component: ExpertsComponent, canActivate: [AuthGuard] },
  { path: 'expert-details/:id', component: ExpertDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
