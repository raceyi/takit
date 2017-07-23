import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashWithdrawPage } from './cash-withdraw';

@NgModule({
  declarations: [
    CashWithdrawPage,
  ],
  imports: [
    IonicPageModule.forChild(CashWithdrawPage),
  ],
  exports: [
    CashWithdrawPage
  ]
})
export class CashWithdrawPageModule {}
