import { Component } from '@angular/core';
import { NavController, NavParams,App, AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import { ServerProvider } from '../../providers/serverProvider';
import {TabsPage} from '../tabs/tabs';
import { OrderCompletePage } from '../order-complete/order-complete';

/*
  Generated class for the OrderHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html'
})
export class OrderHistoryPage {
   //historyOrders = [];
   
    historyOrders=[];
    lastOrderMonth="1개월";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appCtrl:App, public alertCtrl:AlertController, public serverProvider:ServerProvider,
                public storageProvider:StorageProvider) {
                    this.historyOrders=navParams.get('historyOrders');
                //     this.historyOrders = [{"takitId":"세종대@더큰도시락","orderName":"돈까스도시락", "amount":"3500","imagePath":"세종대@더큰도시락;1_돈까스도시락",
                // "orderStatus":"paid","orderedDate":"2017-06-01" , "orderedTime":"20:15"},
                // {"takitId":"세종대@더큰도시락","orderName":"대왕참치마요", "amount":"4000","imagePath":"세종대@더큰도시락;3_대왕참치마요",
                // "orderStatus":"completed","orderedDate":"2017-05-31", "orderedTime":"20:15"},
                // {"takitId":"세종대@HandelandGretel","orderName":"아메리카노", "amount":"3000","imagePath":"세종대@HandelandGretel;1_아메리카노",
                // "orderStatus":"completed","orderedDate":"2017-05-31", "orderedTime":"13:15"},
                // {"takitId":"세종대@더큰도시락","orderName":"커플1", "amount":"3800","imagePath":"세종대@더큰도시락;2_커플1",
                // "orderStatus":"completed","orderedDate":"2017-05-31", "orderedTime":"12:00"},
                // {"takitId":"ORDER@GAROSU","orderName":"카페라떼", "amount":"3000","imagePath":"ORDER@GAROSU;1_카페라떼",
                // "orderStatus":"completed","orderedDate":"2017-05-20", "orderedTime":"14:09"},
                // {"takitId":"ORDER@GAROSU","orderName":"초코라떼 외 1종", "amount":"7000","imagePath":"ORDER@GAROSU;2_초코라떼",
                // "orderStatus":"cancelled","orderedDate":"2017-05-19", "orderedTime":"20:15"},
                // {"takitId":"세종대@더큰도시락","orderName":"돈까스도시락", "amount":"3500","imagePath":"세종대@더큰도시락;1_돈까스도시락",
                // "orderStatus":"paid","orderedDate":"2017-05-13", "orderedTime":"18:31"},
                // {"takitId":"세종대@HandelandGretel","orderName":"아메리카노", "amount":"300","imagePath":"세종대@HandelandGretel;1_아메리카노",
                // "orderStatus":"completed","orderedDate":"2017-05-13", "orderedTime":"13:15"}];

                }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderHistoryPage');
  }

  changeMonthSelect(){
    let month="1month";
    switch(this.lastOrderMonth){
        case '2개월': month="2month"; break;
        case '3개월': month="3month"; break;
        case '4개월': month="4month"; break;
    }

    this.serverProvider.getOrders(month).then((res:any)=>{
        console.log("getOrders type of res:"+typeof res)
        console.log(res);
        if(res.result==="success" && Array.isArray(res.orders)){
            this.historyOrders=res.orders;
        }else if(res.result==="success" && res.orders==='0'){
            this.historyOrders=[];
        }else{
            let alert = this.alertCtrl.create({
                title: '서버와 통신에 문제가 있습니다',
                subTitle: '네트웍상태를 확인해 주시기바랍니다',
                buttons: ['OK']
            });
            alert.present();
        }
    },err=>{
        let alert = this.alertCtrl.create({
            title: '서버와 통신에 문제가 있습니다',
            subTitle: '네트웍상태를 확인해 주시기바랍니다',
            buttons: ['OK']
        });
        alert.present();
    });
  }

  enterOrderComplete(order){
      
    this.navCtrl.push(OrderCompletePage,{order:order});
  }

  goHome(){
      //this.navCtrl.parent.parent.select(0); 안됨
      //this.navCtrl.popToRoot(); 아님
      this.appCtrl.getRootNav().push(TabsPage,{},{animate:false});
  }

  closeHistory(){
      this.navCtrl.pop({animate:false});
  }

}
