import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, App } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import { OldOrderPage } from '../old-order/old-order';
import { ShopHomePage } from '../shop-home/shop-home';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(Slides) slides: Slides;

    public awsS3:string="https://s3.ap-northeast-2.amazonaws.com/seerid.cafe.image/";
    awsHtml:string = "https://s3.ap-northeast-2.amazonaws.com/seerid.html/";
    items=[{"takitId":"세종대@더큰도시락","name":"더큰도시락","visit":"1일 전 방문","img":"세종대@더큰도시락_main"},
            {"takitId":"ORDER@GAROSU","name":"가로수그늘아래","visit":"2일 전 방문","img":"ORDER@GAROSU_main"},
            {"takitId":"세종대@HandelandGretel","name":"헨델과그레텔","visit":"2일 전 방문","img":"세종대@HandelandGretel_main"},
            {"takitId":"세종대@Pandorothy","name":"Pandorothy","visit":"7일 전 방문","img":"세종대@Pandorothy_main"}];
    events=[{"selected":true, "img":"UItest/coupon1.png"},
            {"selected":false,"img":"UItest/coupon2.png"},
            {"selected":false,"img": "UItest/event1.jpg"},
            {"selected":false,"img": "UItest/event2.jpg"}];
    eventIdx:number=1;

    circle = ["UItest/circle1.png","UItest/circle2.png"]

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public storageProvider:StorageProvider, private app:App) {
                    
                }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    
  }

  eventChanged(){
      
      let i = this.slides.getActiveIndex();
      console.log("eventChanged:"+i);
      if(i <= this.events.length-1){
        for(let j=0; j<this.events.length; j++){
            this.events[j].selected = false;
        }
        this.events[i].selected =true;
      }else{
          return;
      }
  }

  enterOldOrder(takitId){
      //1. need to sorting data by many order
      //and send it oldOrderPage
      //2. or send takitId and can get sorting datas
      this.navCtrl.push(OldOrderPage,{"takitId":takitId});
  }

  enterShopHome(takitId){
      //tab bar 가림
      //this.app.getRootNav().push(ShopHomePage,{"takitId":takitId});
      this.app.getRootNav().push(ShopHomePage,{"takitId":takitId},{animate:true,animation: 'slide-up', direction: 'forward' });
  }

}
