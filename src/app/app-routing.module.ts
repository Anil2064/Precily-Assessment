import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: 'login', loadChildren: './modules/panel/panel.module#PanelModule'},
  {path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule'},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
