import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Cart } from './cart/cart';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'toy/:id',
    component: Details
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: '**',
    redirectTo: ''
  }
];


