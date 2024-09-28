import { Routes } from '@angular/router';
import { SecondComponent } from './second/second.component';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';

export const routes: Routes = [
  { path: 'signals-demo', component: SignalsDemoComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '', redirectTo: '/signals-demo', pathMatch: 'full' },
];
