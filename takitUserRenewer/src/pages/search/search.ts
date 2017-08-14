import { Component,NgZone } from '@angular/core';
import { App, IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {MenuDetailPage} from '../menu-detail/menu-detail';
import { ShopHomePage } from '../shophome/shophome';

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  identifier:string="";
  brand:string="";
  nearShops=[];

  lastIndex=0;
  countPerSearch=6; // Please read this value from storageProvider later.

  infiniteScroll;

  constructor(public navCtrl: NavController, public navParams: NavParams,
          private serverProvider:ServerProvider,public storageProvider:StorageProvider,
          private translateService:TranslateService,private alertController:AlertController,
          public ngZone:NgZone,private app: App) {
      console.log("searchPage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  back(){
      this.navCtrl.pop();  
  }

 doInfinite(infiniteScroll){
    if(this.infiniteScroll==undefined)
        this.infiniteScroll=infiniteScroll;
    this.searchShopInfo(infiniteScroll);
  }

  searchUpdate(){
    this.nearShops=[];
    this.lastIndex=0;
    this.searchShopInfo(null);
  }

  searchShopInfo(infiniteScroll){    
      console.log("searchShopInfo");

      let body;
      
      if(this.brand.trim().length==0 && this.identifier.trim().length==0){
                let alert = this.alertController.create({
                            title: '검색어를 입력해 주시기바랍니다',
                            buttons: ['OK']
                        });
                        alert.present();     
                        return;
      }
      
      if(this.brand.trim().length>0 && this.identifier.trim().length>0){
           body =JSON.stringify({
                        serviceName: this.identifier,
                        shopName:this.brand,
                        offset: this.lastIndex,
                        count: this.countPerSearch
                    });
      }else if(this.brand.trim().length>0){
           body =JSON.stringify({
                        shopName:this.brand,
                        offset: this.lastIndex,
                        count: this.countPerSearch
                    });
      }else if(this.identifier.trim().length>0){
           body =JSON.stringify({
                        serviceName: this.identifier,
                        offset: this.lastIndex,
                        count: this.countPerSearch
                    });
      }else 
        return;

      this.serverProvider.post(this.storageProvider.serverAddress+"/searchTakitId",body).then((res:any)=>{
            //console.log("searchTakitId res: "+JSON.stringify(res));
            if(res.result=="success"){
                        console.log("shopInfo.length:"+res.shopInfo.length);
                        console.log("shopInfo:"+JSON.stringify(res));
                        if(res.shopInfo.length==0 && infiniteScroll==null){
                            console.log("shopInfos 0");
                            this.nearShops=[];
                            this.lastIndex=0;
                            if(this.infiniteScroll!=undefined){
                                this.infiniteScroll.enable(true);
                            }
                        }else if(res.shopInfo.length==0 && infiniteScroll!=null){
                            infiniteScroll.complete();
                            infiniteScroll.enable(false);                            
                        }else{
                            if(this.lastIndex==0)
                                this.nearShops=[];
                            this.ngZone.run(()=>{
                                for(let i=0;i<res.shopInfo.length;i++){
                                    let shop=res.shopInfo[i];
                                    if(shop.bestMenus ===null){
                                        shop.bestMenus=[];
                                    }else{
                                        shop.bestMenus = JSON.parse(shop.bestMenus);
                                    } 
                                    if(shop.reviewList === null){
                                        shop.reviewList=[];
                                    }else{
                                        shop.reviewList = JSON.parse(shop.reviewList);
                                    }
                                    this.nearShops.push(shop); 
                                }
                                this.lastIndex=this.nearShops.length;
                                console.log("ngZone-nearShop:"+JSON.stringify(this.nearShops));
                            });
                            if(infiniteScroll!=null){
                                infiniteScroll.complete();
                                if(res.shopInfo.length<this.countPerSearch){
                                    infiniteScroll.enable(false);
                                }else
                                    infiniteScroll.enable(true);
                            }
                            if(this.infiniteScroll!=undefined){
                                if(res.shopInfo.length==this.countPerSearch)
                                    this.infiniteScroll.enable(true);
                            }
                        }
            }else{
                        let alert = this.alertController.create({
                            title: '서버로부터의 잘못된 응답을 받았습니다. 잠시후 다시 시도해주시기 바랍니다',
                            subTitle: res.error,
                            buttons: ['OK']
                        });
                        alert.present();
                        if(infiniteScroll!=null){
                            infiniteScroll.complete();
                        }
            }
      },(error)=>{
          if(error=="NetworkFailure"){
                      this.translateService.get('NetworkProblem').subscribe(
                      NetworkProblem => {
                              this.translateService.get('checkNetwork').subscribe(
                                  checkNetwork => {
                                      let alert = this.alertController.create({
                                          title: NetworkProblem,
                                          subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                          buttons: ['OK']
                                      });
                                      alert.present();
                                  });
                      });

          }else{
                        let alert = this.alertController.create({
                            title: '서버로부터의 응답이 없습니다. 잠시후 다시 시도해주시기 바랍니다',
                            buttons: ['OK']
                        });
                        alert.present();
          }
        if(infiniteScroll!=null){
            infiniteScroll.complete();
        }
      });
  }

    getSelected(takitId){
         console.log("!!!!!!!!!getSelected:"+takitId);
   
        if(!this.storageProvider.shopSelected){
            console.log("this.shopSelected true");
            this.storageProvider.shopSelected=true;
             setTimeout(() => {
                console.log("reset shopSelected:"+this.storageProvider.shopSelected);
                this.storageProvider.shopSelected=false;
            }, 1000); //  seconds     

            this.serverProvider.getShopInfo(takitId).then((res:any)=>{
                this.storageProvider.shopResponse=res;
                console.log("push ShopHomePage at home.ts");
                console.log("this.storageProvider.shopResponse: "+JSON.stringify(this.storageProvider.shopResponse));
                this.app.getRootNav().push(ShopHomePage,{takitId:takitId, bestMenus:JSON.parse(res.shopInfo.bestMenus)});
            },(err)=>{
                console.log("error:"+JSON.stringify(err));
                 this.storageProvider.shopSelected=false;
            });
        }else{
            console.log("this.shopSelected works!");
        }
        //this.app.getRootNav().push(FaqPage);
    }   

  showMoreMenus(shop){
    if(shop.showMore===undefined || shop.showMore===false){
        shop.showMore=true;
    }else{
        shop.showMore=false;
    }

    console.log("showMoreMenus:"+shop.showMore);
    console.log("shop.bestMenus:"+JSON.stringify(shop.bestMenus));
  }

    enterMenuDetail(menu,shop){
    let option={menuNO:menu.menuNO,menuName:menu.menuName,cashId:this.storageProvider.cashId,takitId:shop.takitId};

    this.serverProvider.post(this.storageProvider.serverAddress+"/enterMenuDetail",JSON.stringify(option))
    .then((res:any)=>{
        if(res.result === "success"){
            this.storageProvider.shopInfoSet(res.shopInfo);
            this.storageProvider.cashAmount=res.balance;
            this.app.getRootNav().push(MenuDetailPage,{menu:res.menu,shopName:shop.shopName});
        }else{
            console.log("enterMenuDetail server failure:"+JSON.stringify(res.error));
        }
    }).catch(err=>{
        console.log("enterMenuDetail:"+JSON.stringify(err));
    });
  }

}
