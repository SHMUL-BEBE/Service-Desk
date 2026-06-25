import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { ClientsComponent } from './pages/clients/clients';
import { EngineerComponent } from './pages/engineers/engineers';
import { AdminComponent } from './pages/admin/admin';
import { DispatcherComponent } from './pages/dispatcher/dispatcher';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'clients',
    component: ClientsComponent
  },
  {
    path: 'dispatcher',
    component: DispatcherComponent
  },
  {
    path: 'engineers',
    component: EngineerComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }
];