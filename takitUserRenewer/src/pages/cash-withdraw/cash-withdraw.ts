import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';

/**
 * Generated class for the CashWithdrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cash-withdraw',
  templateUrl: 'cash-withdraw.html',
})
export class CashWithdrawPage {
  verifiedAccount:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams
        ,public storageProvider:StorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashWithdrawPage');
  }

  back(){
      this.navCtrl.pop();
  }
}
