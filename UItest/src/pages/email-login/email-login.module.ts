import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailLoginPage } from './email-login';

@NgModule({
  declarations: [
    EmailLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailLoginPage),
  ],
  exports: [
    EmailLoginPage
  ]
})
export class EmailLoginPageModule {}
