import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialLastPage } from './tutorial-last';

@NgModule({
  declarations: [
    TutorialLastPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialLastPage),
  ],
  exports: [
    TutorialLastPage
  ]
})
export class TutorialLastPageModule {}
