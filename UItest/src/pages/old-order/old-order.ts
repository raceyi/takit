import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the OldOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-old-order',
  templateUrl: 'old-order.html'
})
export class OldOrderPage {

    oldOrders = [{"takitId":"세종대@더큰도시락","orderName":"돈까스도시락", "amount":"3500","imagePath":"세종대@더큰도시락;1_돈까스도시락",
                "orderStatus":"paid", "orderCount":"20", "orderedDate":"2017-06-01" , "orderedTime":"20:15"},
                {"takitId":"세종대@더큰도시락","orderName":"대왕참치마요", "amount":"4000","imagePath":"세종대@더큰도시락;3_대왕참치마요",
                "orderStatus":"completed","orderCount":"15", "orderedDate":"2017-05-31", "orderedTime":"20:15"},
                {"takitId":"세종대@더큰도시락","orderName":"커플1", "amount":"3800","imagePath":"세종대@더큰도시락;2_커플1",
                "orderStatus":"completed","orderCount":"8","orderedDate":"2017-05-30", "orderedTime":"13:15"},
                {"takitId":"세종대@더큰도시락","orderName":"돈까스도시락", "amount":"3500","imagePath":"세종대@더큰도시락;1_돈까스도시락",
                "orderStatus":"completed","orderCount":"5","orderedDate":"2017-05-13", "orderedTime":"12:00"},
                {"takitId":"세종대@더큰도시락","orderName":"버섯불고기도시락", "amount":"3800","imagePath":"세종대@더큰도시락;1_버섯불고기도시락",
                "orderStatus":"completed","orderCount":"3","orderedDate":"2017-05-10", "orderedTime":"14:09"},
                {"takitId":"세종대@더큰도시락","orderName":"김치찌개", "amount":"3500","imagePath":"세종대@더큰도시락;14_김치찌개",
                "orderStatus":"cancelled","orderCount":"1","orderedDate":"2017-05-8", "orderedTime":"20:15"},
                {"takitId":"세종대@더큰도시락","orderName":"마루도시락", "amount":"5300","imagePath":"세종대@더큰도시락;8_마루도시락",
                "orderStatus":"paid", "orderCount":"1", "orderedDate":"2017-05-13", "orderedTime":"18:31"},
                {"takitId":"세종대@더큰도시락","orderName":"치킨카레", "amount":"3800","imagePath":"세종대@HandelandGretel;11_치킨카레",
                "orderStatus":"completed","orderCount":"1","orderedDate":"2017-05-13", "orderedTime":"13:15"}];
    
    array=new Array(4);

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OldOrderPage');
    //need to get sorting data
  }

}
