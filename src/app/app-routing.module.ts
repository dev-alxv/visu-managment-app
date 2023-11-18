import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './app-auth.guard';

import { LoginComponent } from './presentation/modules/login/login.component';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'ui-style-guide',
    loadChildren: () => import('./presentation/modules/ui-style-guide/ui-style-guide.module').then(m => m.UiStyleGuideModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'orders',
    loadChildren: () => import('./presentation/modules/orders/orders.module').then(m => m.OrdersModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'new-order',
    loadChildren: () => import('./presentation/modules/new-order/new-order.module').then(m => m.NewOrderModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'support',
    loadChildren: () => import('./presentation/modules/support/support.module').then(m => m.SupportModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'home',
    loadChildren: () => import('./presentation/modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
