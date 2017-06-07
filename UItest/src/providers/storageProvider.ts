import {Injectable,EventEmitter} from '@angular/core';
import {Platform,Tabs,NavController} from 'ionic-angular';

///import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Http,Headers} from '@angular/http';
import {ConfigProvider} from './configProvider';
//import {Device} from 'ionic-native';
//import {Storage} from '@ionic/storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

declare var CryptoJS:any;

@Injectable()
export class StorageProvider{
    public db;
    public takitId:string; //current selected takitId;
    public shopInfo:any;   // current shopInfo. shopname:shopInfo.shopName
    //public errorReason:string;
    public id:string;
    public messageEmitter= new EventEmitter();
    public tabMessageEmitter = new EventEmitter();
    public cashInfoUpdateEmitter= new EventEmitter();
    public GCMCashUpdateEmitter= new EventEmitter();
    //public versionChecker= new EventEmitter();
    public shopTabRef:Tabs;
    public login:boolean=false;
    public navController:NavController;
    public shopResponse:any;
    public run_in_background=false;
    public order_in_progress_24hours=false;
    public deposit_in_latest_cashlist=false;
    public isAndroid;

    public shopSelected:boolean=false; //used by home.ts and tabs.ts
    public orderPageEntered:boolean=false; //used by order.ts and shoptabs.ts
    public shoptabsShown:boolean=false; // used by shoptabs.ts and app.html

    /////////////////////////////////////
    public avoids=[]; // So far, just for tour mode
    /////////////////////////////////////

    public iphone5=false;

    public loginViewCtrl;


    public serverAddress:string= this.configProvider.getServerAddress();

    public awsS3OCR:string=this.configProvider.getAwsS3OCR();
    public awsS3:string=this.configProvider.getAwsS3();
    public homeJpegQuality=this.configProvider.getHomeJpegQuality();
    public menusInRow=this.configProvider.getMenusInRow();
    public OrdersInPage:number=this.configProvider.getOrdersInPage(); // The number of orders shown in a page 
    public TransactionsInPage:number=10; // The number of orders shown in a page 

    public version=this.configProvider.getVersion();
    public timeout=this.configProvider.getTimeout(); // 5 seconds
    public certUrl=this.configProvider.getCertUrl();
    
    ///////////////////////////////////////////////////////////////////
    public orderDoneFlag=false;

//"이외 금융기관 => 직접 입력(숫자)"  
//"지점 코드=>직접 입력(숫자)" http://www.kftc.or.kr/kftc/data/EgovBankList.do 금융회사명으로 조회하기 

    constructor(private platform:Platform,
                //private storage:Storage,
                private http:Http,private configProvider:ConfigProvider){
        console.log("StorageProvider constructor"); 
        this.isAndroid = this.platform.is('android'); 
        //read orderDoneFlag.... for tabs;
        // this.storage.get("orderDoneFlag").then((value:string)=>{
        //     console.log("value:"+value);
        //     if(value!=null){
        //         this.orderDoneFlag=true;
        //     }
        // });        
    }


    // reset(){
    //     console.log("storageProvider.reset");
    //     if(this.db!=undefined) this.db.close();
    //     this.db=undefined;
    //     this.takitId=undefined; 
    //     this.shopInfo=undefined;   
    //     this.id=undefined;
    //     this.shopResponse=undefined;
    //     this.run_in_background=false;
    //     this.order_in_progress_24hours=false;
    //     this.deposit_in_latest_cashlist=false;

    //     /////////////////////////////////////
    // }

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


   // errorReasonSet(reason:string){
   //     this.errorReason=reason;
   // }

    shopInfoSet(shopInfo:any){
        console.log("shopInfoSet:"+JSON.stringify(shopInfo));
        this.shopInfo=shopInfo;
        console.log("discountRate:"+this.shopInfo.discountRate);
    } 

}


