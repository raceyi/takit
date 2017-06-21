import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
//import { TransactionHistoryPage } from '../transaction-history/transaction-history';
import { TransactionHistoryPage } from '../transaction-history/transaction-history';
/*
  Generated class for the MyWallet page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-wallet',
  templateUrl: 'my-wallet.html'
})
export class MyWalletPage {
    myWalletType:string = "cash";
    cardList = [{"name":"신한","img":"UItest/card1.png"},
                {"name":"삼성","img":"UItest/card2.png"},
                {"name":"신한","img":"UItest/card3.png"},
                {"name":"삼성","img":"UItest/card4.png"},
                {"name":"IBK","img":"UItest/card5.jpg"}];
    events=["UItest/coupon1.png","UItest/coupon2.png","UItest/event1.jpg","UItest/event2.jpg"];


  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyWalletPage');
  }

  goHome(){
      this.navCtrl.parent.select(0);
  }

  showTransactionHistory(){
    this.navCtrl.push(TransactionHistoryPage);
  }

}
