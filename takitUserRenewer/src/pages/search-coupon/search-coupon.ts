import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';


/**
 * Generated class for the SearchCouponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-search-coupon',
  templateUrl: 'search-coupon.html',
})
export class SearchCouponPage {

    coupons=[];
    menuNO:string;
    categoryNO:string;
    constructor(public navCtrl: NavController, public navParams: NavParams,
                public alertCtrl:AlertController,
                    public storageProvider:StorageProvider, public serverProvider:ServerProvider
                    ) {

        this.menuNO=navParams.get('menuNO');
        let body = {takitId:this.storageProvider.takitId}
        this.serverProvider.post(this.storageProvider.serverAddress+"/getCoupons",JSON.stringify(body)).then((res:any)=>{
            console.log("searchCoupon result:"+JSON.stringify(res));
            if(res.result==="success"){
                //this.storageProvider.nowCoupons=res.coupons;
                for(let i=0; i<res.coupons.length; i++){
                    if(res.coupons[i].hasOwnProperty("availMenus")){ //coupon db에 쿠폰사용가능메뉴 field가 있고,
                        if(!res.coupons[i].availMenus.includes(this.menuNO)){ //해당 메뉴가 포함 되어 있을때
                            res.coupons.splice(i,0);
                        }
                    }

                    if(res.coupons[i].hasOwnProperty("availCategories")){ //coupon db에 쿠폰사용가능카테고리 field가 있고,
                        if(!res.coupons[i].availCategories.includes(this.categoryNO)){//해당 카테고리가 포함 되어 있을때
                            res.coupons.splice(i,1);
                        }
                    }

                    if(res.coupons[i].hasOwnProperty("exceptMenu")){ //coupon db에 쿠폰사용제외 field가 있고,
                        if(res.coupons[i].exceptMenu.includes(this.menuNO)){
                            res.coupons.splice(i,1);
                        }
                    }
                }
            
            //this.coupons=res.coupons;
            
            ///coupon auto complete
            
            
            }else{
                console.log("searchCoupon post error?"+JSON.stringify(res));
            }
        },err=>{
            console.log("searchCoupon error:"+JSON.stringify(err));
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchCouponPage');
    }

    downloadCoupon(coupon){
      console.log("downloadCoupon");

        //그냥 복사해도 되는 것인가??????? 주소값 복사가 될 것 같은데...?
        // let couponList=this.storageProvider.couponList;
        // couponList.push(coupon.couponNO);

        // console.log("now couponList:"+couponList);
        // console.log("storageProvider couponList:"+this.storageProvider.couponList);

        // let options={couponList:JSON.stringify(couponList)};
        // ///다운로드 했을 때 push해야 함.
        // this.serverProvider.post(this.storageProvider.serverAddress+"/downloadCoupon",JSON.stringify(options)).then((res:any)=>{
        //     if(res.result==="success"){
        //         let alert = this.alertCtrl.create({
        //                         title: '쿠폰이 다운로드 되었습니다.',
        //                         buttons: ['OK']
        //                     });
        //         alert.present();
        //         this.storageProvider.couponList.push(coupon.couponNO);
        //         this.storageProvider.nowCoupons.push(coupon);
        //     }else if(res.result === "failure"){
        //         console.log("downloadCoupon:"+res.error);
        //         let alert = this.alertCtrl.create({
        //                         title: '쿠폰 다운로드에 실패하였습니다.',
        //                         buttons: ['OK']
        //                     });
        //         alert.present();
        //     }
        // },err=>{
        //     console.log("downloadCoupon:"+JSON.stringify(err));
        // }).catch(err=>{
        //     console.log("downloadCoupon:"+JSON.stringify(err));
        // });


        
    }

}
