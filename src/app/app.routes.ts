import { Routes } from '@angular/router';
import { ImperativeSignalsDemoComponent } from './imperative-signals-demo/imperative-signals-demo.component';
import { RxjsDemoComponent } from './rxjs-demo/rxjs-demo.component';
import { DeclarativeSignalsDemoComponent } from './declarative-signals-demo/declarative-signals-demo.component';

export const routes: Routes = [
  { path: 'rxjs-demo', component: RxjsDemoComponent },
  {
    path: 'imperative-signals-demo',
    component: ImperativeSignalsDemoComponent,
  },
  {
    path: 'declarative-signals-demo',
    component: DeclarativeSignalsDemoComponent,
  },
  { path: '', redirectTo: '/rxjs-demo', pathMatch: 'full' },
];
