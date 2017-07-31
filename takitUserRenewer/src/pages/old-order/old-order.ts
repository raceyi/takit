import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {MenuDetailPage} from '../menu-detail/menu-detail';

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

    oldOrders = [];
    array=new Array(4);
    //takitId:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storageProvider:StorageProvider, public serverProvider:ServerProvider) {
    console.log("OldOrderPage constructor 1");
    this.storageProvider.takitId=navParams.get('takitId');
    console.log("OldOrderPage constructor 2");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OldOrderPage');
    //need to get sorting data
  }

  ionViewWillEnter(){
      
    console.log('ionViewDidEnter OldOrderPage');
    this.serverProvider.getOldOrders().then((res:any)=>{
        if(res.result === "success" && Array.isArray(res.oldOrders)){
            console.log("getOldOrders success:"+JSON.stringify(res.oldOrders));
            this.oldOrders=res.oldOrders;
        }else{
            console.log(JSON.stringify(res));
        }
    },err=>{
        console.log("getOldOrders error:"+JSON.stringify(err));
    });
  }

  enterMenuDetail(order,shopName){
    let option={menuNO:order.menuNO,menuName:order.menuName,cashId:this.storageProvider.cashId,takitId:this.storageProvider.takitId};

    this.serverProvider.post(this.storageProvider.serverAddress+"/enterMenuDetail",JSON.stringify(option))
    .then((res:any)=>{
        if(res.result === "success"){
            this.storageProvider.shopInfoSet(res.shopInfo);
            this.storageProvider.cashAmount=res.balance;
            this.navCtrl.push(MenuDetailPage,{menu:res.menu,shopName:this.storageProvider.shopInfo.shopName});
        }else{
            console.log("enterMenuDetail server failure:"+JSON.stringify(res.error));
        }
    }).catch(err=>{
        console.log("enterMenuDetail:"+JSON.stringify(err));
    });

    // Promise.all([this.serverProvider.post(this.storageProvider.serverAddress+"/getMenu",JSON.stringify(getMenuOption)),
    //             this.serverProvider.getShopInfoPost(this.storageProvider.takitId),]).then((values:any)=>{
    //     console.log("values0:"+JSON.stringify(values));
    //     console.log("values1:"+JSON.stringify(values[1]));
    //     if(values[0].result==="success" && values[1].result==="success"){
    //         this.storageProvider.shopInfoSet(values[1].shopInfo);
    //         console.log("shopName:"+this.storageProvider.shopInfo.shopName);
    //         this.navCtrl.push(MenuDetailPage,{menu:values[0].menu,shopName:this.storageProvider.shopInfo.shopName});
    //     }else if(values[0].result === "failure" || values[1].result === "failure"){
    //         console.log("enterMenuDetail server failure:"+JSON.stringify(values));
    //         // con/sole.log("enterMenuDetail server failure:"+values[1].error);
    //     }else{
    //         console.log("what is problem???");
    //     }
    // }).catch(err=>{
    //     console.log(err);
    // });
  }

   closePage(){
       this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
   }
  

}
