import {Component,NgZone,ViewChild} from '@angular/core';

import {HomePage} from '../home/home';
//import {CashPage} from '../cash/cash';
//import {SearchPage} from '../search/search';
import {CashConfirmPage} from '../cashconfirm/cashconfirm';
import {ErrorPage} from '../error/error';
import {LoginPage} from '../login/login';
//import {TutorialPage} from '../tutorial/tutorial';
import { OrderDonePage } from '../order-done/order-done';
import { MyTakitPage } from '../my-takit/my-takit';
import {MyWalletPage} from '../my-wallet/my-wallet';
import { MorePage } from '../more/more';

import {Platform,IonicApp,MenuController,Tabs} from 'ionic-angular';
import {NavParams,ViewController,App,NavController,AlertController,ModalController,Events} from 'ionic-angular';
import {Device} from '@ionic-native/device';
import {Http,Headers} from '@angular/http';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
//import {Storage} from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService} from 'ng2-translate/ng2-translate';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { BackgroundMode } from '@ionic-native/background-mode';

import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';

//import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';

//declare var cordova:any;

@Component({
  templateUrl: 'tabs.html',
  selector:'page-tabs'  
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tabHome:any=HomePage;
  tabMyTakit:any=MyTakitPage;
  tabMyWallet:any=MyWalletPage;
  tabMore:any=MorePage;

  pushNotification:PushObject;
  askExitAlert:any;
  
  public isTestServer=false;

  constructor(translateService: TranslateService, public modalCtrl: ModalController,private navController: NavController,private app:App,private platform:Platform,public viewCtrl: ViewController,
    public storageProvider:StorageProvider,private http:Http, private alertController:AlertController,private ionicApp: IonicApp,
    private menuCtrl: MenuController,public ngZone:NgZone,private serverProvider:ServerProvider,
    private nativeStorage: NativeStorage, private push: Push,private navParams: NavParams,
    private device:Device,private backgroundMode:BackgroundMode,public events: Events) {
        if(this.storageProvider.serverAddress.endsWith('8000')){
            this.isTestServer=true;
        }    

    console.log("navigator.language:"+navigator.language);   
    if(!navigator.language.startsWith("ko")){
        translateService.setDefaultLang('en');
        translateService.use('en');
    }else{
        translateService.setDefaultLang('ko');
        translateService.use('ko');
    }
    
    if(this.navParams.get("guidePage")==true){
        console.log("tabs constructor,guidePage is true");
    }
    // this tells the tabs component which Pages
    // should be each tab's root Page


    if(!this.storageProvider.isAndroid){
        console.log("device.model:"+device.model);
        if(device.model.includes('6') || device.model.includes('5')){ //iphone 5,4
            console.log("reduce font size"); // how to apply this?
            this.storageProvider.iphone5=true;
        }else{
            console.log("iphone 6 or more than 6");
        }
    }

    //Please login and then do registration for gcm msg
    // and then move into home page
    if(this.storageProvider.tourMode==false){
        console.log("call registerPushService");
        this.registerPushService(); 
    }
    if(this.storageProvider.cashId!=undefined && this.storageProvider.cashId.length>=5){
        let body = JSON.stringify({cashId:this.storageProvider.cashId});
        console.log("getBalanceCash "+body);
        this.serverProvider.post(this.storageProvider.serverAddress+"/getBalanceCash",body).then((res:any)=>{
            console.log("getBalanceCash res:"+JSON.stringify(res));
            if(res.result=="success"){
                this.storageProvider.cashAmount=res.balance;
            }else{
                let alert = this.alertController.create({
                    title: "캐쉬정보를 가져오지 못했습니다.",
                    buttons: ['OK']
                });
                alert.present();
            }
        },(err)=>{
                    if(err=="NetworkFailure"){
                                let alert = this.alertController.create({
                                    title: "서버와 통신에 문제가 있습니다.",
                                    buttons: ['OK']
                                });
                                alert.present();
                    }else{
                        console.log("Hum...getBalanceCash-HttpError");
                    } 
        });
    }
  }

 ionViewDidLoad(){ 
  //get discount rate of each shoptab
  this.storageProvider.tabRef=this.tabRef;
  this.storageProvider.shoplist.forEach(shop=>{
      let body = JSON.stringify({takitId:shop.takitId});
      console.log("request discount rate of "+shop.takitId);
        this.serverProvider.post(this.storageProvider.serverAddress+"/getDiscountRate",body).then((res:any)=>{
            console.log("getDiscountRate-res:"+JSON.stringify(res));
            if(res.result=="success"){
                console.log("res.discountRate:"+res.discountRate);
                this.ngZone.run(()=>{
                    shop.discountRate=res.discountRate;    
                });
                console.log("tab takitId:"+ shop.takitId +"discountRate:"+shop.discountRate);
                //console.log("shopinfo:"+JSON.stringify(this.storageProvider.shoplist));
            }else{
                console.log("couldn't get discount rate of "+shop.takitId+" due to unknwn reason");
            }
        },(err)=>{
                if(err=="NetworkFailure"){
                            let alert = this.alertController.create({
                                title: "서버와 통신에 문제가 있습니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                 }else{
                     console.log("Hum...getDiscountRate-HttpError");
                 } 
        })    
  });

 if(this.storageProvider.tourMode==false){    
    //open database file
        console.log("open db");
        this.storageProvider.open().then(()=>{

        },()=>{
            let alert = this.alertController.create({
                            title: "디바이스 문제로 인해 장바구니가 정상동작하지 않습니다.",
                            buttons: ['OK']
                        });
            alert.present();

        })

        this.storageProvider.tabMessageEmitter.subscribe((cmd)=>{
            if(cmd=="stopEnsureNoti"){
                this.backgroundMode.disable();
                this.ngZone.run(()=>{
                        this.storageProvider.run_in_background=false;
                        //change color of notification button
                });
                this.stopEnsureNoti().then(()=>{
                        console.log("stopEnsureNoti was sent to Server");
                },(err)=>{
                        console.log("stopEnsureNoti error "+err);
                        if(err=="NetworkFailure"){
                            let alert = this.alertController.create({
                                title: "서버와 통신에 문제가 있습니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                });
            }else if(cmd=="wakeupNoti"){ //wake up notification
                this.wakeupNoti().then(()=>{
                this.backgroundMode.enable(); 
                this.ngZone.run(()=>{
                        this.storageProvider.run_in_background=true;
                        //change color of notification button
                });
                },(err)=>{
                        console.log("wakeupNoti error "+err);
                        if(err=="NetworkFailure"){
                            let alert = this.alertController.create({
                                title: "서버와 통신에 문제가 있습니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                });
            }else if(cmd=="invalidVersion"){
                 console.log("invalid app version");
                let alert = this.alertController.create({
                                    title: "앱을 업데이트해주세요.",
                                    subTitle: "앱이 정상동작하지 않을수 있습니다.",
                                    buttons: ['OK']
                                });
                    alert.present();
            }
        }); 

    // register backbutton handler
        let ready = true;
    //refer to https://github.com/driftyco/ionic/issues/6982
        this.platform.registerBackButtonAction(()=>{
                console.log("Back button action called");

                let activePortal = this.ionicApp._loadingPortal.getActive() ||
                this.ionicApp._modalPortal.getActive() ||
                this.ionicApp._toastPortal.getActive() ||
                this.ionicApp._overlayPortal.getActive();

                if (activePortal) {
                ready = false;
                activePortal.dismiss();
                activePortal.onDidDismiss(() => { ready = true; });

                console.log("handled with portal");
                return;
                }

                if (this.menuCtrl.isOpen()) {
                this.menuCtrl.close();

                console.log("closing menu");
                return;
                }

                let view = this.navController.getActive();
                //let page = view ? this.navController.getActive().instance : null;

                if (this.app.getRootNav().getActive()==this.viewCtrl){
                    console.log("Handling back button on  tabs page");
                    if(this.storageProvider.order_in_progress_24hours){
                            this.alertController.create({
                                title: '앱을 종료하시겠습니까?',
                                message: '진행중인 주문에 대해 주문알림을 받지 못할수 있습니다.',
                                buttons: [
                                    {
                                        text: '아니오',
                                        handler: () => {
                                        }
                                    },
                                    {
                                        text: '네',
                                        handler: () => {
                                        console.log("call stopEnsureNoti");
                                        console.log("cordova.plugins.backgroundMode.disable");
                                        this.backgroundMode.disable();
                                        this.ngZone.run(()=>{
                                            this.storageProvider.run_in_background=false;
                                            //change color of notification button
                                        });
                                        this.stopEnsureNoti().then(()=>{
                                                console.log("success stopEnsureNoti()");
                                                this.storageProvider.db.close(()=>{
                                                    this.platform.exitApp();
                                                },(err)=>{
                                                    console.log("!!!fail to close db!!!");
                                                    this.platform.exitApp();
                                                });
                                                //this.platform.exitApp();
                                        },(err)=>{
                                                console.log("fail in stopEnsureNoti() - Whan can I do here? nothing");
                                                this.storageProvider.db.close(()=>{
                                                    this.platform.exitApp();
                                                },(err)=>{
                                                    console.log("!!!fail to close db!!!");
                                                    this.platform.exitApp();
                                                });
                                                //this.platform.exitApp();
                                        });
                                        }
                                    }
                                ]
                            }).present();
                    }else{
                            this.backgroundMode.disable();
                            this.storageProvider.db.close(()=>{
                                this.platform.exitApp();
                            },(err)=>{
                                console.log("!!!fail to close db!!!");
                                this.platform.exitApp();
                            });
                            //this.platform.exitApp();
                    }
                }else if(this.app.getRootNav().getActive()==this.storageProvider.loginViewCtrl){
                    console.log("exit App at loginPage in Android");
                    this.platform.exitApp();
                }else if (this.navController.canGoBack() || view && view.isOverlay) {
                    console.log("popping back");
                    this.navController.pop();
                }else{
                    console.log("What can I do here? which page is shown now? Error or LoginPage");
                    this.storageProvider.db.close(()=>{
                        this.platform.exitApp();
                    },(err)=>{
                        console.log("!!!fail to close db!!!");
                        this.platform.exitApp();
                    });
                    //this.platform.exitApp();
                }
            }, 100/* high priority rather than login page */);
    
        /////////////////////////////////////// 
        this.platform.pause.subscribe(()=>{
            console.log("pause event comes");
            this.storageProvider.backgroundMode=true;
        }); //How about reporting it to server?

        this.platform.resume.subscribe(()=>{
            console.log("resume event comes.send app:foreground");
            this.storageProvider.backgroundMode=false;
        }); //How about reporting it to server?

        this.backgroundMode.on("enable").subscribe(()=>{
            console.log("background mode has been activated");
            this.storageProvider.backgroundMode=true;
        });

        this.backgroundMode.on("deactivate").subscribe(()=> {
        console.log("background mode has been deactivated");
        this.storageProvider.backgroundMode=false;
        });

        this.backgroundMode.setDefaults({
            title:  '타킷이 실행중입니다',
            ticker: '주문알림 대기',
            text:   '타킷이 실행중입니다'
        });
        
        //get the orders in progress within 24 hours from server
        this.serverProvider.orderNoti().then((orders:any)=>{
            if(orders==undefined || orders==null ||orders.length==0){
                console.log('no orders in progress');
                this.storageProvider.order_in_progress_24hours=false;
                this.backgroundMode.disable(); 
                this.ngZone.run(()=>{
                        this.storageProvider.run_in_background=false;
                        //change color of notification button
                });
                // report it to server
                this.stopEnsureNoti().then(()=>{
                    console.log("stopEnsureNoti success"); 
                },(err)=>{
                    console.log(" stopEnsureNot failure-What should I do here?");
                }); 
                return;
            }else{    
                this.storageProvider.order_in_progress_24hours=true;            
                this.wakeupNoti().then(()=>{
                    console.log('cordova.plugins.backgroundMode.enable');
                    this.backgroundMode.enable(); 
                        this.ngZone.run(()=>{
                            this.storageProvider.run_in_background=true;
                            //change color of notification button
                        });
                },(err)=>{
                        let alert = this.alertController.create({
                            title: "주문 알림을 키는데 실패했습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                });
            }
        },(err)=>{
            if(err=="NetworkFailure"){
                let alert = this.alertController.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
            }else{
                console.log("getOrderInProgress error");
            }
        });
 }else{
        console.log("tour mode is true-openDB");
        this.storageProvider.open().then(()=>{

        },()=>{
            let alert = this.alertController.create({
                            title: "디바이스 문제로 인해 장바구니가 정상동작하지 않습니다.",
                            buttons: ['OK']
                        });
            alert.present();

        });
        //this.tabRef.select(3); //move into tutorial page. Why page scroll doesn't work correctly?
        //backbutton handler(?) 장바구니 나가기 모드가 있어야 한다. back button이 정상 동작하는지 보면 된다.
        //ionViewWillUnload가 정상 동작하는지 보자.
 }
}

  ionViewWillLeave(){

  }

  ionViewWillUnload(){
    console.log("!!!ionViewWillUnload-tabs-tourMode:"+this.storageProvider.tourMode);
    if(this.storageProvider.tourMode==true){
        //drop table
        console.log("tourMode drop table this.storageProvider.db:"+this.storageProvider.db);
        this.storageProvider.dropCartInfo().then(()=>{
            this.storageProvider.db.close();    
        },()=>{
            this.storageProvider.db.close();
        });
    }else{
        if(this.storageProvider.db!=undefined){
            this.storageProvider.db.close(()=>{

            },(err)=>{
                console.log("!!!fail to close db!!!");
            });
        }
    }
  }

  home(event){
    console.log("home tab selected"); 
  }

  search(event){
    console.log("search tab selected"); 
 }

  cash(event){
     console.log("cash tab selected"); 
     
  }

    registerPushService(){ // Please move this code into tabs.ts
            this.pushNotification=this.push.init({
                android: {
                    senderID: this.storageProvider.userSenderID,
                    sound: "true"
                },
                ios: {
                    senderID: this.storageProvider.userSenderID,
                    //"gcmSandbox": "false", //code for production mode
                    "gcmSandbox": "true",  //code for development mode
                    "alert": "true",
                    "sound": "true",
                    "badge": "true",
                    //"clearBadge": "true" ios???
                },
                windows: {}
            });
                        
            this.pushNotification.on('registration').subscribe((response:any)=>{

              console.log("registration:"+JSON.stringify(response));
              console.log("registration..."+response.registrationId);
              var platform;
              if(this.platform.is("android")){
                  platform="android";
              }else if(this.platform.is("ios")){
                  platform="ios";

              }else{
                  platform="unknown";
              }

              let body = JSON.stringify({registrationId:response.registrationId, platform: platform});
              //let headers = new Headers();
              //headers.append('Content-Type', 'application/json');
              console.log("server:"+ this.storageProvider.serverAddress +" body:"+JSON.stringify(body));
              this.serverProvider.post(this.storageProvider.serverAddress+"/registrationId",body).then((res:any)=>{
                  console.log("registrationId sent successfully");
                  var result:string=res.result;
                  if(result=="success"){

                  }else{
                    
                  }
             },(err)=>{
                 if(err=="NetworkFailure"){
                        console.log("registrationId sent failure");
                        //this.storageProvider.errorReasonSet('네트웍 연결이 원할하지 않습니다'); 
                        //Please move into ErrorPage!
                        this.app.getRootNav().setRoot(ErrorPage);
                 }else{
                     console.log("Hum...registrationId-HttpError");
                 } 
                });
            });

            this.pushNotification.on('notification').subscribe((data:any)=>{
/*                
//                  let custom = {"cashTuno":"20170103075617278","cashId":"TAKIT02","transactionType":"deposit","amount":1,"transactionTime":"20170103","confirm":0,"bankName":"농협은행"}
                  let custom ={"depositMemo":"타킷 주식회사","amount":"100003","depositDate":"2017-01-06","branchName":"본점영업부","cashTuno":"20170106093158510","bankName":"농협"}
                  let cashConfirmModal = this.modalCtrl.create(CashConfirmPage, { custom: custom });
                  cashConfirmModal.present();
*/
/*                 
                if(!this.storageProvider.isAndroid){
                    console.log("ios -- data.sound:"+data.sound);
                    var snd =  new MediaPlugin(data.sound);
                    snd.play();
                }
*/                
                console.log("[home.ts]pushNotification.on-data:"+JSON.stringify(data));
                console.log("[home.ts]pushNotification.on-data.title:"+JSON.stringify(data.title));
                
                var additionalData:any=data.additionalData;
                console.log("addiontalData.GCMType:"+additionalData.GCMType);
                //Please check if type of custom is object or string. I have no idea why this happens.
                if(additionalData.GCMType==="order"){
                    if(typeof additionalData.custom === 'string'){ 
                        this.storageProvider.messageEmitter.emit(JSON.parse(additionalData.custom));//  만약 shoptab에 있다면 주문목록을 업데이트 한다. 만약 tab이라면 메시지를 보여준다. 
                    }else{ //object
                        this.storageProvider.messageEmitter.emit(additionalData.custom);
                    }
                    ////////////////////////////////////////////////////////////////
                    /*
                    console.log("show alert");
                    let alert = this.alertController.create({
                        title: data.title,
                        subTitle: data.message,
                        buttons: ['OK']
                    });
                    alert.present();
                    */
                    if((!this.storageProvider.isAndroid && !this.storageProvider.backgroundMode) //ios resume event comes before notification.
                        ||(this.storageProvider.isAndroid && !this.storageProvider.orderExistInProgress(additionalData.custom))){ // android resume event comes late.
                        let orderDoneModal;
                        if(typeof additionalData.custom === 'string'){ 
                            orderDoneModal= this.modalCtrl.create(OrderDonePage, { title:data.title,message:data.message,custom: JSON.parse(additionalData.custom) });
                        }else{ // object 
                            console.log("obj comes");
                            orderDoneModal= this.modalCtrl.create(OrderDonePage, {  title:data.title,message:data.message,custom: additionalData.custom });
                        }
                        orderDoneModal.present();
                    }
                    
                    //////////////////////////////////////////////////////////////
                    // check if order in progress exists or not
                    this.serverProvider.orderNoti().then((orders:any)=>{
                          if(orders==undefined || orders==null || orders.length==0){
                              // off run_in_background 
                              console.log("no more order in progress within 24 hours");
                              console.log("cordova.plugins.backgroundMode.disable");
                              this.backgroundMode.disable();
                              this.ngZone.run(()=>{
                                    this.storageProvider.run_in_background=false;
                                    this.storageProvider.order_in_progress_24hours=false;
                                    //change color of notification button
                              });
                          }
                    },(err)=>{
                        console.log("getOrdersInProgress error");
                        let alert = this.alertController.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                    });
                }else if(additionalData.GCMType==="cash"){
                  console.log("cash-additionalData.custom:"+additionalData.custom);
                  if((!this.storageProvider.isAndroid && !this.storageProvider.backgroundMode) //ios resume event comes before notification.
                        ||(this.storageProvider.isAndroid && !this.storageProvider.cashExistInProgress(additionalData.custom))){ // android resume event comes late.
                        let cashConfirmModal;
                        if(typeof additionalData.custom === 'string'){ 
                            cashConfirmModal= this.modalCtrl.create(CashConfirmPage, { custom: JSON.parse(additionalData.custom) });
                        }else{ // object 
                            console.log("obj comes");
                            cashConfirmModal= this.modalCtrl.create(CashConfirmPage, { custom: additionalData.custom });
                        }
                        console.log("GCMCashUpdateEmitter");
                        this.storageProvider.GCMCashUpdateEmitter.emit();
                        cashConfirmModal.present();
                  }
                }else if(additionalData.GCMType==="multiLogin"){
                    // logout and move into login page
                    this.nativeStorage.clear(); 
                    this.nativeStorage.remove("id"); //So far, clear() doesn't work. Please remove this line later
                    this.nativeStorage.remove("refundBank");
                    this.nativeStorage.remove("refundAccount");
                    this.storageProvider.reset();
                    this.storageProvider.dropCartInfo().then(()=>{
                            console.log("call setRoot with LoginPage");
                            this.app.getRootNav().setRoot(LoginPage);
                    },(error)=>{
                        console.log("fail to dropCartInfo");
                            console.log("call setRoot with LoginPage");
                            this.app.getRootNav().setRoot(LoginPage);
                    });  
                }
                if(additionalData.GCMType!=="cash" && additionalData.GCMType!=="multiLogin"){
                        this.confirmMsgDelivery(additionalData.notId).then(()=>{
                            console.log("confirmMsgDelivery success");
                        },(err)=>{
                            if(err=="NetworkFailure"){
                                let alert = this.alertController.create({
                                    title: "서버와 통신에 문제가 있습니다.",
                                    buttons: ['OK']
                                });
                                alert.present();
                            }else{
                                console.log("hum...successGCM-HttpFailure");
                            }
                        });
                }                
            });

            this.pushNotification.on('error').subscribe((e:any)=>{
                console.log(e.message);
            });
    }

    confirmMsgDelivery(messageId){
        return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("messageId:"+messageId);
            console.log("!!!server:"+ this.storageProvider.serverAddress);
            let body = JSON.stringify({messageId:messageId});

            this.serverProvider.post(this.storageProvider.serverAddress+"/successGCM",body).then((res:any)=>{    
                  console.log("res:"+JSON.stringify(res));
                  resolve();
            },(err)=>{
                reject(err);  
            });
      });   
    }

  configureBackgrondMode(){
    console.log("[configureBackgrondMode]");
    // give notification on to off
    if(this.storageProvider.run_in_background){
      this.alertController.create({
                  title: '주문 알림모드를 종료하시겠습니까?',
                  message: '진행중인 주문에 대해 주문알림을 받지 못할수 있습니다.',
                  buttons: [
                     {
                        text: '아니오',
                        handler: () => {
                        }
                     },
                     {
                        text: '네',
                        handler: () => {
                                this.stopEnsureNoti().then(()=>{
                                                console.log('cordova.plugins.backgroundMode.disable');
                                                this.backgroundMode.disable(); //takitShop always runs in background Mode
                                                this.ngZone.run(()=>{
                                                    this.storageProvider.run_in_background=false;
                                                    //change color of notification button
                                                });
                                },(err)=>{
                                        let alert = this.alertController.create({
                                                title: "주문알림을 끄는데 실패했습니다.",
                                                buttons: ['OK']
                                            });
                                            alert.present();  
                                });
                        }
                     }
                  ]
               }).present();
    }else {
      // please ask server the current orders in progress and then show user this notification. 
      this.alertController.create({
                  title: '주문 알림 모드를 실행하시겠습니까?',
                  message: '진행중인 주문 종료시까지 타킷이 계속 실행됩니다.',
                  buttons: [
                     {
                        text: '아니오',
                        handler: () => {
                        }
                     },
                     {
                        text: '네',
                        handler: () => {
                                console.log('enable background mode');
                                this.wakeupNoti().then(()=>{
                                    this.backgroundMode.enable(); 
                                    this.ngZone.run(()=>{
                                        this.storageProvider.run_in_background=true;
                                        //change color of notification button
                                    });
                                },(err)=>{
                                    console.log("wakeupNoti fail");
                                    let alert = this.alertController.create({
                                        title: "주문알림을 키는데 실패했습니다.",
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                });
                        }
                     }
                  ]
               }).present();
    }
  }

  getColorBackgroundMode(){
    if(this.storageProvider.run_in_background){
      return "primary";
    }else{
      return "gray";
    }
  }

  stopEnsureNoti(){
        return new Promise((resolve,reject)=>{
            console.log("!!!server:"+ this.storageProvider.serverAddress+"/sleepMode");
            let body = JSON.stringify({});

            //Why default timeout doesn't work?
            this.serverProvider.post(this.storageProvider.serverAddress+"/sleepMode",body).then((res:any)=>{    
                  console.log("sleepMode-res:"+JSON.stringify(res));
                  if(res.result=="success"){
                    resolve();
                  }else{
                    reject("HttpFailure");
                  }
            },(err)=>{
                reject(err);  
            });
      });    
  }

  wakeupNoti(){
        return new Promise((resolve,reject)=>{
            console.log("!!!server:"+ this.storageProvider.serverAddress+"/wakeMode");
            let body = JSON.stringify({});

            this.serverProvider.post(this.storageProvider.serverAddress+"/wakeMode",body).then((res:any)=>{
                  console.log("wakeMode-res:"+JSON.stringify(res));
                  console.log("res is ..."+res.result);
                  if(res.result=="success"){
                    resolve();
                  }else{
                    reject("HttpFailure");
                  }
            },(err)=>{
                reject(err);  
            });
      });    
  }

  goHome(){
      console.log("goHome");
      this.navController.parent.select(0);
  }

 ionViewWillEnter(){
     console.log("ionViewWillEnter-tabsPage ");

 }

 ionViewDidEnter(){
     this.storageProvider.shopSelected=false;
     console.log("ionViewDidEnter-tabsPage shopSelected is false");
 }
 
}
