import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';

/*
  Generated class for the IOSAlert page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ios-alert',
  templateUrl: 'ios-alert.html'
})
export class IOSAlertPage {

  messageEmitterSubscription;

  constructor(public navCtrl: NavController,private viewCtrl: ViewController, public navParams: NavParams) {
    /*
     this.messageEmitterSubscription= this.storageProvider.GCMCashUpdateEmitter.subscribe(()=> {
       this.viewCtrl.dismiss();; // Does it work?
     });
     */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IOSAlertPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
