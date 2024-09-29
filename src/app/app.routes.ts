import { Routes } from '@angular/router';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { RxjsDemoComponent } from './rxjs-demo/rxjs-demo.component';
import { StatesDemoComponent } from './states-demo/states-demo.component';

export const routes: Routes = [
  { path: 'rxjs-demo', component: RxjsDemoComponent },
  { path: 'signals-demo', component: SignalsDemoComponent },
  { path: 'states-demo', component: StatesDemoComponent },
  { path: '', redirectTo: '/states-demo', pathMatch: 'full' },
];
