import {Component,ViewChild} from "@angular/core";
import {App, MenuController,Platform,NavController,Content, Slides} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import {OldOrderPage } from '../old-order/old-order';
import {MenuDetailPage} from '../menu-detail/menu-detail';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

//import {Gesture} from 'ionic-angular/gestures/gesture'; //available gestures: "doubletap","tap","rotate",???

//import {ShopTabsPage} from '../shoptabs/shoptabs';
import {ShopHomePage} from '../shophome/shophome';
//declare var moment:any;
//declare var cordova:any;
//declare var ImageResizer:any;

@Component({
   selector: 'page-home',  
  templateUrl: 'home.html',
})

export class HomePage{
     @ViewChild("homeContent") contentRef: Content;
     @ViewChild(Slides) slides: Slides;
     shopSelected=false;
     filename: string = '';
     distanceSelected=1;

      events=[{"selected":true, "img":"UItest/coupon1.png"},
            {"selected":false,"img":"UItest/coupon2.png"},
            {"selected":false,"img": "UItest/event1.jpg"},
            {"selected":false,"img": "UItest/event2.jpg"}];

      circle = ["UItest/circle1.png","UItest/circle2.png"];

    //    bestMenus = [{"menuName":"수제등심돈까스", "price":"5500", "imagePath":"세종대@더큰도시락;1_수제등심돈까스"},
    //               {"menuName":"대왕참치마요", "price":"3500", "imagePath":"세종대@더큰도시락;3_대왕참치마요"},
    //               {"menuName":"삼식스페셜", "price":"3500", "imagePath":"세종대@더큰도시락;9_삼식스페셜"},
    //               {"menuName":"매콤규동", "price":"3500", "imagePath":"세종대@더큰도시락;13_매콤규동"}];

    
    selectedTakitId;

    selectSejong=false;
    selectWecook=false;
    nearShops = [];
    reviewCount:number;

     constructor(private platform:Platform,private navController: NavController,
        private app: App, menu:MenuController,public storageProvider:StorageProvider,
        private http:Http,private serverProvider:ServerProvider, private splashScreen: SplashScreen){
         console.log("homePage constructor screen:"+ window.screen.availWidth+" "+window.screen.width+" "+window.screen.availHeight+ " "+window.screen.height);
         //console.log("cordova.file.dataDirectory:"+cordova.file.dataDirectory);
         //this.nearShops=storageProvider.shoplist;
         this.getSejong();
     }

     ionViewDidLoad(){
        console.log("HomePage did enter");
        this.splashScreen.hide();
    }

     ionViewWillEnter(){
         this.shopSelected=false;
         console.log("homePage-ionViewWillEnter");
         console.log("home-shoplist:"+JSON.stringify(this.storageProvider.shoplist));
         /*
         if(this.storageProvider.shoplist==null || this.storageProvider.shoplist.length==0){
             //move into search page
             console.log("move into search page");
             var t: Tabs = this.navController.parent;
             t.select(1);
         }
         */

        this.calcVisitedDiff(this.storageProvider.shoplist);
        console.log("calcVisitedDiff result:"+JSON.stringify(this.storageProvider.shoplist));
    
        this.contentRef.resize();

     }

     loadShopInfo(takitId){
         return new Promise((resolve,reject)=>{
                var queryString='SELECT * FROM shoplist where takitId=?';
                console.log("queryString:"+queryString);
                this.storageProvider.db.executeSql(queryString,[takitId]).then((resp)=>{ // What is the type of resp? 
                    console.log("query result:"+JSON.stringify(resp));
                    var param=resp;
                    if(resp.res.rows.length==1){ 
                        param.item=resp.res.rows.item(0);
                    }
                    resolve(JSON.stringify(param));
                }).catch(e => {
                    console.log("loadShopInfo query err");
                    //console.log(JSON.stringify(e));
                    reject();
                });
         });
     }
/*
    insertShop(takitId,s3key,filenamefullpath){
         var filename=filenamefullpath.substr(cordova.file.dataDirectory.length);
         var queryString="INSERT INTO shoplist (takitId, s3key,filename) VALUES (?,?,?)";
         console.log("queryString:"+queryString);
         this.storageProvider.db.executeSql.query(queryString,[takitId,s3key,filename]).then((resp)=>{
             console.log("resp:"+JSON.stringify(resp));
         },(error)=>{
             console.log("shop insert error");
             //console.log(JSON.stringify(error));
         });
    }

    updateShop(takitId,s3key,filenamefullpath){
        var filename=filenamefullpath.substr(cordova.file.dataDirectory.length);
         return new Promise((resolve,reject)=>{
            var queryString="UPDATE shoplist SET filename=?, s3key=? WHERE takitId=?";
            console.log("queryString:"+queryString);
            this.storageProvider.db.executeSql.query(queryString,[filename,s3key,takitId]).then((resp)=>{
                console.log("resp:"+JSON.stringify(resp));
                resolve(resp);
            },(error)=>{
                console.log("shop update error");
                //console.log(JSON.stringify(error));
                reject(error);
            });
         });
    }

    fileDownload(takitId,s3uri,foldername,filename){
        return new Promise((resolve,reject)=>{
            var ft = new Transfer();
            var uri = encodeURI(s3uri);

            console.log("call Transfer.download s3uri:"+s3uri+" filename:"+filename);

            ft.download(
                uri,
                foldername+filename,
                false).then((result:any)=>{
                   console.log("result:"+JSON.stringify(result));
                   var dirname=moment().format("YYYY-MM-DD-HH-mm-ss-SSS")+'/';
                   var options ={
                    uri: foldername+filename,
                    folderName:foldername+dirname,
                    quality: this.storageProvider.homeJpegQuality,
                    width:480,
                    height:160};
                    //width:window.innerWidth,// 200,
                    //height:window.innerHeight/5};

                   ImageResizer.resize(options, // Any other plugins? or please change plugin.
                     function(image){
                            console.log("resize: success "+image);
                            console.log("length:"+ cordova.file.dataDirectory.length); 
                            console.log("result:"+JSON.stringify(result));

                            var idx=image.lastIndexOf('/');
                            var reduceddirname=image.substring(0,idx);
                            var reducedfilename=image.substr(idx+1);
                            console.log("reduceddirname:"+reduceddirname +" reducedfilename:"+reducedfilename);

                            File.removeFile(cordova.file.dataDirectory,filename) // Humm... how about iphone? Please check platform and directory
                                .then(result=>{
                                            console.log("removeFile("+filename+") success reducedfilename:"+reducedfilename);
                                            console.log("prevdir:"+foldername+dirname+"prevfile:"+reducedfilename+" nextdir:"+foldername+"next filename:"+filename);
                                            File.moveFile(reduceddirname//foldername+dirname
                                            ,reducedfilename,foldername,filename) // Humm... how about iphone? Please check platform and directory 
                                                .then(result=>{
                                                        console.log("moveFile success:"+filename);
                                                        resolve(foldername+filename);
                                                        File.removeDir(foldername, dirname)
                                                        .then(result=>{
                                                            console.log("remove "+dirname);
                                                        },err=>{
                                                            console.log("removeDir error:"+JSON.stringify(err));
                                                        });
                                                    },err=>{
                                                        console.log("moveFile err:"+JSON.stringify(err)+" "+filename);
                                                        reject({reason:"moveFile",error:err});
                                                    });
                                            
                                        },err=>{
                                            console.log("removeFile err:"+JSON.stringify(err));
                                            reject({reason:"removeFile",error:err});
                                        }); 
                     },function(){
                         console.log("resize: false");
                         reject({reason:"resize"});
                     });
                }).catch((error:any)=>{
                    console.log("error:"+JSON.stringify(error));
                    reject({reason:"download",error:error}); 
                });
            });
    }
*/
    removeSelected(takitId){
        console.log("removeSelected:"+takitId);
        //this.storageProvider.shoplist.findIndex( );
    }

    getSelected(takitId){
         console.log("getSelected:"+takitId);

/*      below code doesn't work. 
        var views=this.app.getRootNav().getViews();
        for(var i=0;i<views.length;i++){
            if(views[i] instanceof ShopTabsPage){
                console.log("ShopTabs already is pushed");
                return;
            }
        }
*/      
        if(!this.storageProvider.shopSelected){
            console.log("this.shopSelected true");
            this.storageProvider.shopSelected=true;
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
      console.log("enterOldOrder");
      this.navController.push(OldOrderPage,{takitId:takitId},{animate:true,animation: 'slide-up',direction: 'forward' });
  }

  showMoreMenus(shop){
    if(shop.showMore===undefined || shop.showMore===false){
        shop.showMore=true;
    }else{
        shop.showMore=false;
    }

    console.log("showMoreMenus:"+shop.showMore);
  }

  goHome(){
      this.navController.parent.select(0);
  }

  calcVisitedDiff(shopList){
    
    for(let i=0; i<shopList.length; i++ ){
        if(shopList[i].visitedTime!==undefined){
            console.log("calcVisitedDiff");
            console.log(new Date().getTime()-new Date(shopList[i].visitedTime).getTime());
            shopList[i].visitedDiff = (new Date().getTime() - new Date(shopList[i].visitedTime).getTime())/86400000; 
            shopList[i].visitedDiff = parseInt(shopList[i].visitedDiff);
        //(today's milliseconds - visitedTime milliseconds)% 1 day's milliseconds
        
        }  
    }
    console.log("shopList calcVisitedDiff:"+JSON.stringify(shopList));    
    
  }

  showBestMenus(i){
      if(this.nearShops[i].bestMenus===null || this.nearShops[i].bestMenus===undefined){
          //this.nearShops[i].bestMenus=[];
          return false;
      }else{
          this.nearShops[i].bestMenus=JSON.parse(this.nearShops[i].bestMenus);
          return true;
      }

  }

  getSejong(){
      this.selectSejong = true;
      if(this.storageProvider.sejongShops!==undefined){
          this.serverProvider.getKeywordShops("세종대").then((res:any)=>{

                console.log("getSejong success:"+JSON.stringify(res));
                res.forEach(shop => {
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
                });
                
                this.storageProvider.sejongShops=res;
                this.nearShops = res;
                
          },(err)=>{
                console.log("error:"+JSON.stringify(err));
          });
      }else{
          this.nearShops=this.storageProvider.sejongShops;
      }
  }

  getWecook(){
      this.selectWecook = true;
      if(this.storageProvider.wecookShops!==undefined){
          this.serverProvider.getKeywordShops("wecook").then((res:any)=>{
                res.forEach(shop => {
                    if(shop.bestMenus ===null){
                        shop.bestMenus=[];
                    }else{
                        shop.bestMenus = JSON.parse(shop.bestMenus);
                    } 

                    console.log("shop.bestMenus:"+shop.bestMenus);
                    if(shop.reviewList === null){
                        shop.reviewList=[];
                    }else{
                        shop.reviewList = JSON.parse(shop.reviewList);
                    }
                    console.log("shop.reviewList:"+shop.reviewList);
                });
                this.storageProvider.sejongShops=res;
                this.nearShops = res;
                                
          },(err)=>{
                console.log("error:"+JSON.stringify(err));
          });
      }else{
          this.nearShops=this.storageProvider.wecookShops;
      }
  }

  enterMenuDetail(){
    let option={};
    this.serverProvider.post(this.storageProvider.serverAddress+"/getMenu",JSON.stringify(option)).then((res:any)=>{
        if(res.result==="success"){
            this.navController.push(MenuDetailPage,{menu:res.menu});
        }else if(res.result === "failure"){
            console.log("enterMenuDetail server failure:"+res.error);
        }
    }).catch(err=>{
        console.log(err);
    });
  }
}


