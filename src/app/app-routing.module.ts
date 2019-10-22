import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TrainingComponent} from './pages/training/training.component';
import {UsersComponent} from './pages/users/users.component';
import {ThemesComponent} from './pages/themes/themes.component';
import {PermisstionsGuard} from './utils/permisstions.guard';


const appRoutes: Routes = [
  {
    path: 'testing',
    component: TrainingComponent
  },
  {
    path: 'users',
    canActivate: [PermisstionsGuard],
    component: UsersComponent
  },
  {
    path: 'themes',
    canActivate: [PermisstionsGuard],
    component: ThemesComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
