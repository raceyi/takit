import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {CashTutorialPage} from '../cash-tutorial/cash-tutorial';
import { StorageProvider} from '../../providers/storageProvider';

/**
 * Generated class for the TutorialLastPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tutorial-last',
  templateUrl: 'tutorial-last.html',
})
export class TutorialLastPage {

  constructor(public navCtrl: NavController, private app: App, 
              public storageProvider:StorageProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialLastPage...');
  }

  enterCashTutorial(){
    this.app.getRootNav().setRoot(CashTutorialPage);   
  }

   startTakit(){
    console.log("startTakit");
    this.storageProvider.tutorialShownFlag=true;
  //  if(this.navCtrl.canGoBack())
  //      this.navCtrl.pop();
  //  else
        this.app.getRootNav().setRoot(LoginPage);    
  }

}
