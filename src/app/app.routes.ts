import { Routes } from '@angular/router';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { RxjsDemoComponent } from './rxjs-demo/rxjs-demo.component';

export const routes: Routes = [
  { path: 'signals-demo', component: SignalsDemoComponent },
  { path: 'rxjs-demo', component: RxjsDemoComponent },
  { path: '', redirectTo: '/signals-demo', pathMatch: 'full' },
];
