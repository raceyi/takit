import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
/**
 * Generated class for the SignupPaymentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup-payment',
  templateUrl: 'signup-payment.html',
})
export class SignupPaymentPage {
  cashId:string;
  cashIdGuideHide:boolean=false;
  cashIdGuide:string;
  validCashId:boolean=false;
  receiptType:string;
  langauge:string;

  constructor(public storageProvider:StorageProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.cashIdGuide="대소문자 구분없음";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPaymentPage');
    this.receiptType="IncomeDeduction"; //Please initialize receiptType here not constructor
  }

  back(){
    this.navCtrl.pop();
    //move into tabs page
  }

}
