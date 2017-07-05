import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html',
})
export class TransactionHistoryPage {
    transHistories=[{"transactionTime":"2017-06-12","shopName":"더큰도시락",
                "orderName":"매콤 제육 볶음 외 2개", "payMethod":"캐쉬결제","orderStatus":"cancelled","amount":"5000"},
                {"transactionTime":"2017-06-12","shopName":"더큰도시락",
                "orderName":"매콤 제육 볶음 외 2개", "payMethod":"캐쉬결제","orderStatus":"cancelled","amount":"9000"},
                {"transactionTime":"2017-06-12","shopName":"더큰도시락",
                "orderName":"매콤 제육 볶음 외 2개", "payMethod":"캐쉬결제","orderStatus":"completed","amount":"10,000"},
                {"transactionTime":"2017-06-12","shopName":"더큰도시락",
                "orderName":"매콤 제육 볶음 외 2개", "payMethod":"캐쉬결제","orderStatus":"cancelled","amount":"9000"},
                {"transactionTime":"2017-06-12","shopName":"더큰도시락",
                "orderName":"매콤 제육 볶음 외 2개", "payMethod":"캐쉬결제","orderStatus":"completed","amount":"5000"}];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionHistoryPage');
  }

}
