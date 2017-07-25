import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';

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
   //@ViewChild('infiniteScroll') infiniteScrollRef: InfiniteScroll;

    transactions=[
      {"style":{'background-color':'yellow','height':'50px'},"transactionType":"deposit","type":"캐쉬충전", "confirm":"0","date":"2017-06-12","bankName":"우리","amount":"5000","nowBalance":"5000"},
      {"style":{'background-color':'white','height':'50px'},"transactionType":"deposit","type":"캐쉬충전", "confirm":"1","date":"2017-06-12","bankCode":"032","amount":"5000","nowBalance":"10000"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"payment","type":"캐쉬구매","date":"2017-06-12","amount":"3000","nowBalance":"7000","takitId":"세종대@더큰도시락", "orderName":"매콤 제육 볶음 외 2개................................."},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"payment","type":"캐쉬구매","date":"2017-06-12","amount":"3000","nowBalance":"4000","takitId":"세종대@더큰도시락", "orderName":"돈까스 외 2개"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"cancel","type":"캐쉬구매취소","date":"2017-06-12","amount":"1193000","nowBalance":"7000","takitId":"세종대@더큰도시락", "orderName":"돈까스 외 2개"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"refund","type":"캐쉬환불","date":"2017-06-12","amount":"3000","nowBalance":"4000","bankName":"우리", "accountMask":"1002-xxxx-3434"},
      {"style":{'background-color':'white','height':'100px'},"transactionType":"refund","type":"캐쉬환불","date":"2017-06-12","amount":"3000","nowBalance":"1000","bankName":"022", "fee":"400","accountMask":"1002-xxxx-3434"}];

  constructor(public navCtrl: NavController, public navParams: NavParams
              ,public storageProvider:StorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionHistoryPage');
    //this.infiniteScrollRef.enable(false);
  }

  toggleTransaction(tr){

  }

  doInfinite(infiniteScroll){
 /*   
    this.getTransactions(this.lastTuno,true).then((res:any)=>{
        //console.log("res:"+JSON.stringify(res));
        if(res.cashList=="0"){
            console.log("res:"+JSON.stringify(res));
            infiniteScroll.enable(false);
            this.infiniteScroll=false;
        }else{
            this.updateTransaction(res.cashList);
            console.log("call complete");
            infiniteScroll.complete();
            this.infiniteScrollRef=infiniteScroll;
        }
    },(err)=>{
                if(err=="NetworkFailure"){
                        this.translateService.get('NetworkProblem').subscribe(
                            NetworkProblem => {
                                     this.translateService.get('checkNetwork').subscribe(
                                        checkNetwork => {
                                            let alert = this.alertCtrl.create({
                                                title: NetworkProblem,
                                                subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                            });
                }else{
                    this.translateService.get('failedGetCashHistory').subscribe(
                                        failedGetCashHistory => {
                                            let alert = this.alertCtrl.create({
                                                title: failedGetCashHistory, //'캐쉬 내역을 가져오지 못했습니다.',
                                                buttons: ['OK']
                                            });
                                            alert.present();
                                        });
                }
    });
    */

  }
}
