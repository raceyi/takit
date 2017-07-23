import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {StorageProvider} from '../../providers/storageProvider';

declare var moment:any;

/**
 * Generated class for the CashDepositPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cash-deposit',
  templateUrl: 'cash-deposit.html',
})
export class CashDepositPage {
  manualCheckHidden:boolean=true;
  transferDate;
  depositBank:string="-1";
  depositMemo:string="";
  cashId:string="kalen75";
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
        public translateService: TranslateService,
        public storageProvider:StorageProvider) {

    let d = new Date();
   // console.log(" moment:"+moment().format("YYYY-MM-DDThh:mmZ"));
    let mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1); // getMonth() is zero-based
    let dd  = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    let hh = d.getHours() <10? "0"+d.getHours(): d.getHours();
    let dString=d.getFullYear()+'-'+(mm)+'-'+dd+'T'+hh+":00";//+moment().format("Z");

    this.transferDate=dString;          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashDepositPage');
  }

  manualCheckOpen(){
      this.manualCheckHidden=!this.manualCheckHidden;
  }

  back(){
    this.navCtrl.pop();
  }
}
