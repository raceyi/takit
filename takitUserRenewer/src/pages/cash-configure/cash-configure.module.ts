import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashConfigurePage } from './cash-configure';

@NgModule({
  declarations: [
    CashConfigurePage,
  ],
  imports: [
    IonicPageModule.forChild(CashConfigurePage),
  ],
  exports: [
    CashConfigurePage
  ]
})
export class CashConfigurePageModule {}
