import { Component ,ViewChild} from '@angular/core';
import { App,NavController, NavParams,Slides ,Content} from 'ionic-angular';
import { StorageProvider} from '../../providers/storageProvider';
//import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { ConfigureCashTutorialPage } from '../configure-cash-tutorial/configure-cash-tutorial';
import { DepositCashTutorialPage } from '../deposit-cash-tutorial/deposit-cash-tutorial';
import { OrderTutorialPage } from '../order-tutorial/order-tutorial';
import { NotifierTutorialPage } from '../notifier-tutorial/notifier-tutorial';

import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../login/login';
/*
  Generated class for the Tutorial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  @ViewChild('tutorialContent') tutorialContentRef: Content;

  stage="configureCash";
  
  constructor(public navCtrl: NavController, private nativeStorage: NativeStorage,
      public storageProvider:StorageProvider,private app: App,private splashScreen: SplashScreen) {
    console.log("tutorialPage constructor tutorialShownFlag:"+this.storageProvider.tutorialShownFlag);
    //read each stage from storage.
    this.nativeStorage.setItem('tutorialShownFlag',"true");
  }
 
  ionViewDidLoad(){
        console.log("TutorialPage did enter");
        this.splashScreen.hide();
        this.tutorialContentRef.resize();
    }

 startTakit(){
    console.log("startTakit");
    this.storageProvider.tutorialShownFlag=true;
    if(this.navCtrl.canGoBack())
        this.navCtrl.pop();
    else
        this.app.getRootNav().setRoot(LoginPage);    
  }

  configureCash(){
      this.navCtrl.push(ConfigureCashTutorialPage);
      this.stage="despoitCash";
  }

  depositCash(){
      this.navCtrl.push(DepositCashTutorialPage);
      this.stage="order";
  }

 order(){
    //save each stage into storage
      this.navCtrl.push(OrderTutorialPage);
      this.stage="notifier";
  }

notifier(){
    //save each stage into storage
      this.navCtrl.push(NotifierTutorialPage);
      this.stage="startTakit";
  }
}
