import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelConfirmPage } from './cancel-confirm';

@NgModule({
  declarations: [
    CancelConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelConfirmPage),
  ],
})
export class CancelConfirmPageModule {}
