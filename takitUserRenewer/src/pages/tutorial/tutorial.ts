import { Component ,ViewChild} from '@angular/core';
import { App,NavController, NavParams ,Content, Slides} from 'ionic-angular';
import { StorageProvider} from '../../providers/storageProvider';
//import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { ConfigureCashTutorialPage } from '../configure-cash-tutorial/configure-cash-tutorial';
import { DepositCashTutorialPage } from '../deposit-cash-tutorial/deposit-cash-tutorial';
import { OrderTutorialPage } from '../order-tutorial/order-tutorial';
import { NotifierTutorialPage } from '../notifier-tutorial/notifier-tutorial';
import {CashTutorialPage} from '../cash-tutorial/cash-tutorial';

import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../login/login';
import {TutorialLastPage} from '../tutorial-last/tutorial-last';

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
  @ViewChild(Slides) slides: Slides;

    tutorialImg = ['assets/01_main.png','assets/02_main.png',
                    'assets/03_my_takit.png','assets/04_cash.png','assets/05_cash_bg.png'];
    //tutorialLastImg = 'assets/05_cash_bg.png';                
    tutorialIdx=0;

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
/*
 startTakit(){
    console.log("startTakit");
    this.storageProvider.tutorialShownFlag=true;
    if(this.navCtrl.canGoBack())
        this.navCtrl.pop();
    else
        this.app.getRootNav().setRoot(LoginPage);    
  }
*/

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
    slideTap(){
        this.slides.slideNext();
        this.tutorialIdx=this.slides.getActiveIndex();
        console.log(this.tutorialIdx);
    }

    slideChanged(){
        this.tutorialIdx=this.slides.getActiveIndex();
        console.log("eventChanged:"+this.tutorialIdx);
        
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
