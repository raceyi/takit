import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,Slides, AlertController } from 'ionic-angular';
import { App, ViewController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {OrderHistoryPage} from '../order-history/order-history';
import { ShopHomePage } from '../shophome/shophome';
import {SearchPage} from '../search/search';
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

     historyOrders =[];

     showHistory=false;
     favoriteShops=[];

     circle = ["UItest/circle1.png","UItest/circle2.png"];
     lastOrderMonth:string="1개월"

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public alertCtrl : AlertController,private app:App,
                public viewCtrl: ViewController,public serverProvider:ServerProvider,
                 public appCtrl: App,public storageProvider:StorageProvider) {
                   

            }

  ionViewWillEnter() {
    console.log('ionViewDidEnter MyTakitPage');
    this.serverProvider.getOrders("1month").then((res:any)=>{
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

    this.serverProvider.getFavoriteShops().then((res:any)=>{
        console.log("getOrders type of res:"+typeof res)
        console.log(res);
        if(res.result==="success" && Array.isArray(res.shopInfos)){
            this.favoriteShops=res.shopInfos;
        }else if(res.result==="success" && res.shopInfos==='not exist shop'){
            this.favoriteShops=[];
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

    //this.shopSelected=false;

  }

  showAllHistory(){
     // this.viewCtrl.dismiss();
     // this.appCtrl.getRootNav().push(OrderHistoryPage);
     this.appCtrl.getRootNav().push(OrderHistoryPage,{historyOrders:this.historyOrders},{animate:false});

}

//   historyChanged(){
//       let i = this.slides.getActiveIndex();
//       if(i === 1){
//         this.histories[0].selected=false;
//         this.histories[3].selected = true;
//       }else if(i === 0){
//         this.histories[0].selected=true;
//         this.histories[3].selected=false;
//       }
//   }

  changeMonthSelect(){
      console.log("changeMonthSelect:"+this.lastOrderMonth);
  }

   goHome(){
      this.navCtrl.parent.select(0);
  }

  enterShopHome(shopInfo){
      if(!this.storageProvider.shopSelected){
        console.log("this.shopSelected true");

        this.storageProvider.shopSelected=true;
        setTimeout(() => {
            console.log("reset shopSelected:"+this.storageProvider.shopSelected);
            this.storageProvider.shopSelected=false;
        }, 1000); //  seconds     

        this.serverProvider.getShopInfo(shopInfo.takitId).then((res:any)=>{
            this.storageProvider.shopResponse=res;
            console.log("push ShopHomePage at home.ts");
            console.log("this.storageProvider.shopResponse: "+JSON.stringify(this.storageProvider.shopResponse));
            this.appCtrl.getRootNav().push(ShopHomePage,{takitId:shopInfo.takitId, bestMenus:JSON.parse(res.shopInfo.bestMenus)});
        },(err)=>{
            console.log("error:"+JSON.stringify(err));
                this.storageProvider.shopSelected=false;
        });
    }else{
        console.log("this.shopSelected works!");
    }

  }

    search(){
        console.log("search click");
        this.app.getRootNav().push(SearchPage);
    }


}
