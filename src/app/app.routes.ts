import { Routes } from '@angular/router';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { RxjsDemoComponent } from './rxjs-demo/rxjs-demo.component';
import { DeclarativeSignalsDemoComponent } from './declarative-signals-demo/declarative-signals-demo.component';

export const routes: Routes = [
  { path: 'rxjs-demo', component: RxjsDemoComponent },
  { path: 'signals-demo', component: SignalsDemoComponent },
  {
    path: 'declarative-signals-demo',
    component: DeclarativeSignalsDemoComponent,
  },
  { path: '', redirectTo: '/rxjs-demo', pathMatch: 'full' },
];
