import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { OperationsComponent } from './pages/operations/operations.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ScheduledOperationsComponent } from './pages/scheduled-operations/scheduled-operations.component';
import { FixedPointsComponent } from './pages/fixed-points/fixed-points.component';
import { PredictionsComponent } from './pages/predictions/predictions.component';
import { QuickStartComponent } from './pages/quick-start/quick-start.component';
import { UploadComponent } from './pages/upload/upload.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { WhenWillComponent } from './pages/when-will/when-will.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'operations',
    component: OperationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'scheduledoperations',
    component: ScheduledOperationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fixedpoints',
    component: FixedPointsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'predictions',
    component: PredictionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quickstart',
    component: QuickStartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'whenwill',
    component: WhenWillComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
