import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,Slides } from 'ionic-angular';
import { App, ViewController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {OrderHistoryPage} from '../order-history/order-history';
/*
  Generated class for the MyTakit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-takit',
  templateUrl: 'my-takit.html'
})
export class MyTakitPage {
     @ViewChild(Slides) slides: Slides;

     histories = [{"selected":true,"shopName":"더큰도시락", "takitId":"세종대@더큰도시락","orderName":"돈까스도시락", "amount":"3500","imagePath":"세종대@더큰도시락;1_돈까스도시락",
                "orderStatus":"paid","orderedTime":"2017-06-01 20:15:13.000"},
                {"selected":false,"shopName":"더큰도시락","takitId":"세종대@더큰도시락","orderName":"대왕참치마요", "amount":"4000","imagePath":"세종대@더큰도시락;3_대왕참치마요",
                "orderStatus":"completed","orderedTime":"2017-05-31 20:15:13.000"},
                {"selected":false,"shopName":"헨델과 그레텔","takitId":"세종대@HandelandGretel","orderName":"아메리카노", "amount":"3000","imagePath":"세종대@HandelandGretel;1_아메리카노",
                "orderStatus":"completed","orderedTime":"2017-05-31 13:15:13.000"},
                {"selected":false,"shopName":"더큰도시락","takitId":"세종대@더큰도시락","orderName":"커플1", "amount":"3800","imagePath":"세종대@더큰도시락;2_커플1",
                "orderStatus":"completed","orderedTime":"2017-05-31 12:00:13.000"},
                {"selected":false,"shopName":"가로수 그늘 아래","takitId":"ORDER@GAROSU","orderName":"카페라떼", "amount":"3000","imagePath":"ORDER@GAROSU;1_카페라떼",
                "orderStatus":"completed","orderedTime":"2017-05-20 14:09:13.000"}];

    items=[{"takitId":"세종대@더큰도시락","name":"더큰도시락","visit":"1일 전 방문","img":"세종대@더큰도시락_main"},
            {"takitId":"ORDER@GAROSU","name":"가로수그늘아래","visit":"2일 전 방문","img":"ORDER@GAROSU_main"},
            {"takitId":"세종대@HandelandGretel","name":"헨델과그레텔","visit":"2일 전 방문","img":"세종대@HandelandGretel_main"},
            {"takitId":"세종대@Pandorothy","name":"Pandorothy","visit":"7일 전 방문","img":"세종대@Pandorothy_main"}];

     circle = ["UItest/circle1.png","UItest/circle2.png"];
  constructor(public navCtrl: NavController, public navParams: NavParams,
                public viewCtrl: ViewController,
                 public appCtrl: App,public storageProvider:StorageProvider) {

                }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTakitPage');
  }

  showAllHistory(){
     // this.viewCtrl.dismiss();
     // this.appCtrl.getRootNav().push(OrderHistoryPage);
   this.navCtrl.push(OrderHistoryPage);
  }

  historyChanged(){
      let i = this.slides.getActiveIndex();
      if(i === 1){
        this.histories[0].selected=false;
        this.histories[3].selected = true;
      }else if(i === 0){
        this.histories[0].selected=true;
        this.histories[3].selected=false;
      }
  }

   goHome(){
      this.navCtrl.parent.select(0);
  }

}
