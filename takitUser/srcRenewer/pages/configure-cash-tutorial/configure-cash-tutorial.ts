import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ConfigureCashTutorial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-configure-cash-tutorial',
  templateUrl: 'configure-cash-tutorial.html'
})
export class ConfigureCashTutorialPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigureCashTutorialPage');
  }

  dismiss(){
     this.navCtrl.pop();
  } 
}
