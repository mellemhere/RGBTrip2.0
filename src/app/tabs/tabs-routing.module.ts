import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'manual',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../manual/manual.module').then(m => m.ManualPageModule)
          }
        ]
      },
      {
        path: 'efeitos',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../efeitos/efeitos.module').then(m => m.EfeitosPageModule)
          }
        ]
      },
      {
        path: 'som',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../som/som.module').then(m => m.SomPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/manual',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/manual',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
