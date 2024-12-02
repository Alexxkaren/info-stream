import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';

export const routes: Routes = [

    { path: '', component: MainPageComponent },
    { path: 'login', component: LoginComponent },
];
