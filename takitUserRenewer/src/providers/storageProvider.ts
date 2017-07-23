import {Injectable,EventEmitter} from '@angular/core';
import {Platform,Tabs,NavController} from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
//import {Http,Headers} from '@angular/http';
import {ConfigProvider} from './configProvider';

//import {Storage} from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import * as CryptoJS from 'crypto-js';

@Injectable()
export class StorageProvider{
    public db;
    public shoplist=[];
    public takitId:string; //current selected takitId;
    public shopInfo:any;   // current shopInfo. shopname:shopInfo.shopName
    public shoplistCandidate=[];
    //public errorReason:string;
    public cart:any;
    public id:string;
    public messageEmitter= new EventEmitter();
    public tabMessageEmitter = new EventEmitter();
    public cashInfoUpdateEmitter= new EventEmitter();
    public GCMCashUpdateEmitter= new EventEmitter();
    //public versionChecker= new EventEmitter();
    public shopTabRef:Tabs;
    public tabRef:Tabs;
    public login:boolean=false;
    public navController:NavController;
    public email:string="";
    public name:string="";
    public phone:string="";
    public couponList=[];
    public emailLogin:boolean;

    public shopResponse:any;
    public run_in_background=false;
    public order_in_progress_24hours=false;
    public deposit_in_latest_cashlist=false;
    public tourMode=false;
    public isAndroid;
    public cashId="";
    public cashAmount:number;
    //public cashConfirmInfo={depositTime:null,amount:null,bankCode:null,depositMemo:null};
    public nowCoupons=[];

    public backgroundMode=false; // true in background mode

    public refundBank:string="";
    public refundAccount:string="";
    
    public cashMenu: string = "cashIn"; 

    public shopSelected:boolean=false; //used by home.ts and tabs.ts
    public orderPageEntered:boolean=false; //used by order.ts and shoptabs.ts
    public shoptabsShown:boolean=false; // used by shoptabs.ts and app.html

    public keyboardHandlerRegistered=false;
    /////////////////////////////////////
    public avoids=[]; // So far, just for tour mode
    /////////////////////////////////////
    // cash receipt issue
    public receiptIssue=false;
    public receiptId:string;
    public receiptType:string="IncomeDeduction";  

    public taxIssueCompanyName:string;
    public taxIssueEmail:string;
    /////////////////////////////////////
    // 캐쉬정보 수동입력 
    public depositBank;
    public depositBranch;
    public depositBranchInput;

    public iphone5=false;

    public loginViewCtrl;

    public cashInProgress=[];
    public orderInProgress=[];


    /* 농협 계좌 이체가능 은행 */
    banklist=[  {name:"국민",value:"004"},
                {name:"기업",value:"003"},
                {name:"농협",value:"011"},
                {name:"신한",value:"088"},
                {name:"우리",value:"020"},
                {name:"KEB하나",value:"081"},  
                {name:"SC제일",value:"023"},
                {name:"경남",value:"039"},
                {name:"광주",value:"034"},
                {name:"대구",value:"031"},
                {name:"부산",value:"032"},
                {name:"산업",value:"002"},
                {name:"상호저축",value:"050"},
                {name:"새마을금고",value:"045"},
                {name:"수협",value:"007"}, 
                {name:"신협",value:"048"}, 
                {name:"우체국",value:"071"},
                {name:"전북",value:"037"},
                {name:"제주",value:"035"},
                {name:"한국씨티",value:"027"},
                {name:"산림조합",value:"064"},
                {name:"BOA",value:"060"},
                {name:"도이치",value:"055"},
                {name:"HSBC",value:"054"},
                {name:"제이피모간체이스",value:"057"},
                {name:"중국공상",value:"062"},
                {name:"비엔피파리바",value:"061"}];


    public serverAddress:string= this.configProvider.getServerAddress();

    public awsS3OCR:string=this.configProvider.getAwsS3OCR();
    public awsS3:string=this.configProvider.getAwsS3();
    public homeJpegQuality=this.configProvider.getHomeJpegQuality();
    public menusInRow=this.configProvider.getMenusInRow();
    public OrdersInPage:number=this.configProvider.getOrdersInPage(); // The number of orders shown in a page 
    public TransactionsInPage:number=10; // The number of orders shown in a page 

    public userSenderID=this.configProvider.getUserSenderID(); //fcm senderID

    public version=this.configProvider.getVersion();
    public kakaoTakitUser=this.configProvider.getKakaoTakitUser();////Rest API key
    public kakaoOauthUrl=this.configProvider.getKakaoOauthUrl(); 

    public tourEmail=this.configProvider.getTourEmail();
    public tourPassword=this.configProvider.getTourPassword();
    public timeout=this.configProvider.getTimeout(); // 5 seconds

    public accountMaskExceptFront=this.configProvider.getAccountMaskExceptFront();
    public accountMaskExceptEnd=this.configProvider.getAccountMaskExceptEnd();

    public certUrl=this.configProvider.getCertUrl();
    
    ///////////////////////////////////////////////////////////////////
    public tutorialShownFlag=true; // If tutorial is shown or not,initialized as true. 
    public orderDoneFlag=false;


    public sejongShops=[];
    public wecookShops=[];
    public nearShops=[];

//"이외 금융기관 => 직접 입력(숫자)"  
//"지점 코드=>직접 입력(숫자)" http://www.kftc.or.kr/kftc/data/EgovBankList.do 금융회사명으로 조회하기 

    constructor(private sqlite: SQLite, private platform:Platform,
                private nativeStorage: NativeStorage,
                private configProvider:ConfigProvider){
        console.log("StorageProvider constructor"); 
        this.isAndroid = this.platform.is('android'); 
        //read orderDoneFlag.... for tabs;
        this.nativeStorage.getItem("orderDoneFlag").then((value:string)=>{
            console.log("value:"+value);
            if(value!=null){
                this.orderDoneFlag=true;
            }
        });        
    }

    open(){
        return new Promise((resolve,reject)=>{
            var options={
                    name: "takit.db",
                    location:'default'
            };
            
            this.sqlite.create(options)
            .then((db: SQLiteObject) => {
                this.db=db;
                this.db.executeSql("create table if not exists carts(takitId VARCHAR(100) primary key, cart VARCHAR(1024))").then(()=>{
                    console.log("success to create cart table");
                    resolve();
                }).catch(e => {
                    resolve(); // just ignore it if it exists. hum.. How can I know the difference between error and no change?
                });
            }).catch(e =>{
                console.log("fail to open database"+JSON.stringify(e));
                reject();
            });
        });
    }

    reset(){
        console.log("storageProvider.reset");
        if(this.db!=undefined) this.db.close();
        this.db=undefined;
        this.shoplist=[];
        this.takitId=undefined; 
        this.shopInfo=undefined;   
        this.shoplistCandidate=[];
        this.cart=undefined;
        this.id=undefined;
        this.email="";
        this.name="";
        this.phone="";
        this.shopResponse=undefined;
        this.run_in_background=false;
        this.order_in_progress_24hours=false;
        this.deposit_in_latest_cashlist=false;
        this.tourMode=false;
        this.cashId="";
        this.cashAmount=undefined;

        this.refundBank="";
        this.refundAccount="";
        this.cashMenu= "cashIn"; 
        /////////////////////////////////////
        // 캐쉬정보 수동입력 
        this.depositBank=undefined;
        this.depositBranch=undefined;
        this.depositBranchInput=undefined;
    }

    //delete an existing db and then open new one. Please check if it works or not. Hum.. it doesn't work 
    reopen(){
        return new Promise((resolve,reject)=>{
             console.log("reopen()");
             this.db.deleteDatabase({name: 'takit.db', location: 'default'}).then(()=>{
                 console.log("deleteDatabase successfully");
                 this.open().then(()=>{
                     console.log("db open successfully");
                     resolve();
                 },()=>{
                     console.log("db open failure");
                     reject();
                 });
             },(err)=>{
                 console.log("deleteDatabase failure");
                 reject();
             });
        });
    }

    getCartInfo(takitId){
        console.log("getCartInfo-enter");
        return new Promise((resolve,reject)=>{
                var queryString='SELECT * FROM carts where takitId=?';
                console.log("call queryString:"+queryString);
                this.db.executeSql(queryString,[takitId]).then((resp)=>{ // What is the type of resp? 
                    console.log("query result:"+JSON.stringify(resp));
                    var output=[];
                    if(resp.rows.length==1){
                        console.log("item(0)"+JSON.stringify(resp.rows.item(0)));
                        output.push(resp.rows.item(0)); 
                    }else if(resp.rows.length==0){
                        console.log(takitId+": no cart info");
                    }else{
                        console.log("DB error happens");
                        reject("invalid DB status");
                    }
                    resolve(output);
                }).catch(e => {
                     reject("DB error");
                });
         });
    }

    saveCartInfo(takitId,cart){ // insert and update
      return new Promise((resolve,reject)=>{  
          console.log("saveCartInfo");
         this.getCartInfo(takitId).then((resp:any)=>{
             var queryString:string;
             if(resp.length==0){ // insert
                 queryString="INSERT INTO carts (cart,takitId) VALUES (?,?)";
             }else{ // update
                 queryString="UPDATE carts SET cart=? WHERE takitId=?";;
             }
             console.log("query:"+queryString);
            this.db.executeSql(queryString,[cart,takitId]).then((resp)=>{
                console.log("[saveCartInfo]resp:"+JSON.stringify(resp));
                this.cart=JSON.parse(cart);
                console.log("[saveCartInfo]cart:"+JSON.stringify(this.cart));
                console.log("[saveCartInfo]cart.menus:"+JSON.stringify(this.cart.menus));
                resolve();
            }).catch(e => {
                console.log("saveCartInfo insert error:"+JSON.stringify(e));
                reject("DB error");
            },);
         },()=>{

         });
      });
    }

   dropCartInfo(){
       return new Promise((resolve,reject)=>{
           this.db.executeSql("drop table if exists carts").timeout(1000/* 1 second */).then(
               ()=>{
                    console.log("success to drop cart table");
                    resolve();
           }).catch(e => {
                    console.log("fail to drop cart table "+JSON.stringify(e));
                    reject();
                },);
       });
   }

    loadCart(takitId){
        this.getCartInfo(takitId).then((result:any)=>{
          if(result.length==1){
              console.log("existing cart:"+JSON.stringify(result[0]));
              var cartStr=result[0].cart;
              this.cart=JSON.parse(cartStr);
              console.log("cart:"+JSON.stringify(this.cart));
              console.log("cart.menus:"+JSON.stringify(this.cart.menus));

          }else{
              console.log(" getCartInfo:none");
              // 장바구니가 비었습니다. 
              this.cart={menus:[],total:0};
          }
        },(err)=>{
            console.log("loadCart error");
        });
    }

    decryptValue(identifier,value){
        var key=value.substring(0, 16);
        var encrypt=value.substring(16, value.length);
        console.log("value:"+value+" key:"+key+" encrypt:"+encrypt);
        var decrypted=CryptoJS.AES.decrypt(encrypt,key);
        if(identifier=="id"){ // not good idea to save id here. Please make a function like getId
            this.id=decrypted.toString(CryptoJS.enc.Utf8);
        }
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    encryptValue(identifier,value){
        var buffer="";
        for (var i = 0; i < 16; i++) {
            buffer+= Math.floor((Math.random() * 10));
        }
        console.log("buffer"+buffer);
        var encrypted = CryptoJS.AES.encrypt(value, buffer);
        console.log("value:"+buffer+encrypted);
        
        if(identifier=="id") // not good idea to save id here. Please make a function like saveId
            this.id=value;
        return (buffer+encrypted);    
    }

    shoplistSet(shoplistValue){
        if(shoplistValue==null)
            this.shoplist=[];
        else
            this.shoplist=shoplistValue;
        console.log("shoplistSet:"+JSON.stringify(shoplistValue));    
    }

    shoplistUpdate(shop){
        var update=[];
        for(var i=0;i<this.shoplist.length;i++){
            if(this.shoplist[i].takitId!=shop.takitId){
                update.push(this.shoplist[i]);
            }
        }
        console.log("shoplist:"+JSON.stringify(update));
        update.unshift(shop);
        this.shoplist=update;
        console.log("after shoplist update:"+JSON.stringify(this.shoplist));        
    }

    shoplistCandidateUpdate(shop){
        var update=[];
        if(this.shoplistCandidate)
        for(var i=0;i<this.shoplistCandidate.length;i++){
            if(this.shoplistCandidate[i].takitId!=shop.takitId){
                update.push(this.shoplistCandidate[i]);
            }
        }
        console.log("shoplistCandidate:"+JSON.stringify(update));
        update.unshift(shop);
        this.shoplistCandidate=update;
        console.log("after shoplist update:"+JSON.stringify(this.shoplistCandidate));        
    }

   // errorReasonSet(reason:string){
   //     this.errorReason=reason;
   // }

    shopInfoSet(shopInfo:any){
        console.log("shopInfoSet:"+JSON.stringify(shopInfo));
        this.shopInfo=shopInfo;
        console.log("discountRate:"+this.shopInfo.discountRate);
    } 

    currentShopname(){
        return this.shopInfo.shopName;
    }

    userInfoSet(email,name,phone,receiptIssue,receiptId,receiptType){
        this.email=email;
        this.name=name;
        this.phone=phone;
        this.tourMode=false;
        if(receiptIssue=="1"){
            this.receiptIssue=true;
        }else{
            this.receiptIssue=false;
        }
        this.receiptId=receiptId;
        this.receiptType=receiptType;  
        if(!this.receiptIssue|| this.receiptIssue==undefined){
            this.receiptIssue=false;
            this.receiptType="IncomeDeduction";//default value   
        }
    }

    userInfoSetFromServer(userInfo:any){
        this.email=userInfo.email;
        this.name=userInfo.name;
        this.phone=userInfo.phone;
        this.couponList=JSON.parse(userInfo.couponList); ///userInfo의 couponList
        if(userInfo.receiptIssue=="1"){
            this.receiptIssue=true;
        }else{
            this.receiptIssue=false;
        }
        this.receiptId=userInfo.receiptId;
        this.receiptType=userInfo.receiptType;  
        if(!this.receiptIssue|| this.receiptIssue==undefined){
            this.receiptIssue=false;
            this.receiptType="IncomeDeduction";//default value   
        }
        
        if(!userInfo.hasOwnProperty("cashId") || userInfo.cashId==null || userInfo.cashId==undefined){
            this.cashId="";
        }else{
            this.cashId=userInfo.cashId;
        }
        console.log("[userInfoSetFromServer]cashId:"+this.cashId);
        this.tourMode=false;

        if(!userInfo.hasOwnProperty("taxIssueEmail") || userInfo.taxIssueEmail==null || userInfo.taxIssueEmail==undefined){
            this.taxIssueEmail=userInfo.taxIssueEmail;
        }

        if(!userInfo.hasOwnProperty("taxIssueCompanyName") || userInfo.taxIssueCompanyName==null || userInfo.taxIssueCompanyName==undefined){
            this.taxIssueCompanyName=userInfo.taxIssueCompanyName;
        }
    }

    orderExistInProgress(orderId){
        console.log("orderInProgress.length:"+this.orderInProgress.length);    
        for(var i=0;i<this.orderInProgress.length;i++){
            console.log("orderInProgress["+i+"]:"+JSON.stringify(this.orderInProgress[i]));
            if(this.orderInProgress[i]!=undefined && this.orderInProgress[i].order.orderId==orderId){
                return true;
            }
        }    
        return false;

    }

    orderAddInProgress(order,viewController){
        this.orderInProgress.push({order:order,viewController:viewController});
        /////////////////////////////////////////////
        for(var i=0;i<this.orderInProgress.length;i++)
            console.log("Add-orderInProgress["+i+"]:"+JSON.stringify(this.orderInProgress[i].order));
    }

    orderRemoveInProgress(orderId,viewController){
        var idx=-1;
        for(let i=0;i<this.orderInProgress.length;i++){
            if(this.orderInProgress[i].order.orderId==orderId 
                && this.orderInProgress[i].viewController==viewController){
                    console.log("i:"+i);
                    idx=i;
                    break;
                }
        }
        if(idx>=0){
            console.log("call splice with "+idx);
            this.orderInProgress.splice(idx,1);
        }
        /////////////////////////////////////////////    
        for(let i=0;i<this.orderInProgress.length;i++)
            console.log("Remove-orderInProgress["+i+"]:"+JSON.stringify(this.orderInProgress[i].order));
    }

    cashExistInProgress(cash){
        var cashStr;
        if(typeof cash !== 'string'){  
            cashStr=JSON.stringify(cash);
        }else
            cashStr=cash;
        console.log("cashAddInProgress.length:"+this.cashAddInProgress.length);    
        for(var i=0;i<this.cashAddInProgress.length;i++){
            console.log("cashAddInProgress["+i+"]:"+JSON.stringify(this.cashAddInProgress[i]));
            if(this.cashAddInProgress[i]!=undefined && this.cashAddInProgress[i].cashStr==cashStr){
                return true;
            }
        }    
        return false;
    }

    cashAddInProgress(cashStr,viewController){
        this.cashInProgress.push({cashStr:cashStr,viewController:viewController});
        /////////////////////////////////////////////
        for(var i=0;i<this.cashInProgress.length;i++)
            console.log("Add-cashInProgress["+i+"]:"+this.cashInProgress[i].cashStr);
    }

    cashRemoveInProgress(cash,viewController){
        let idx=-1;
        for(let i=0;i<this.cashInProgress.length;i++){
            if(this.cashInProgress[i].cashStr==cash 
                && this.cashInProgress[i].viewController==viewController){
                    console.log("i:"+i);
                    idx=i;
                    break;
                }
        }
        if(idx>=0){
            console.log("call splice with "+idx);
            this.cashInProgress.splice(idx,1);
        }
        /////////////////////////////////////////////    
        for(let i=0;i<this.cashInProgress.length;i++)
            console.log("Remove-cashInProgress["+i+"]:"+this.cashInProgress[i].cashStr);
    }    
}


