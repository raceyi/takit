import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CashConfigurePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cash-configure',
  templateUrl: 'cash-configure.html',
})
export class CashConfigurePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
     console.log('constructor CashConfigurePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashConfigurePage');
  }

  phoneAuth(){
    
  }


}
