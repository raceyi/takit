import {Injectable} from '@angular/core';
import {Platform ,NavController} from 'ionic-angular';
import {SQLite} from 'ionic-native';
//import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
//import * as CryptoJS from 'crypto-js';
declare var CryptoJS:any;
import {ConfigProvider} from './configProvider';

@Injectable()
export class StorageProvider{
    db;
    public myshoplist=[];
    public myshop:any={}; // manager, takitId, ???
    public shopInfo:any;   // current shopInfo. shopname:shopInfo.shopName
    public shop:any;
    public nowMenuNO:string; // current selected menuNO. 메뉴 추가 같은 화면에서 두번 진행 시 이상한 값 들어오기 때문에 저장.
    public errorReason:string;
    public id:string;
    public printerName; // printerName saved
    public printerConnect=true;
    public navController:NavController;
    public login:boolean=false;
    public printOn:boolean=false;
    public amIGotNoti=false;
    public storeOpen=false;

    public tourMode=false;
    public tourEmail=this.configProvider.getTourEmail();
    public tourPassword=this.configProvider.getTourPassword();

    public email;
    public name;
    public phone;

    public cashAvailable;
    public totalSales;
    public maskAccount;
    public account;
    public bankName;
    public bankCode;
    public depositor;
    public isTestServer:boolean;
    public printer;

    public serverAddress:string=this.configProvider.getServerAddress();

    public awsS3OCR:string=this.configProvider.getAwsS3OCR();
    public awsS3:string=this.configProvider.getAwsS3();
    public homeJpegQuality=this.configProvider.getHomeJpegQuality();
    public menusInRow=this.configProvider.getMenusInRow();
    public timeout=this.configProvider.getTimeout(); //3 seconds
    public OrdersInPage:number=this.configProvider.getOrdersInPage(); // The number of orders shown in a page

    public userSenderID=this.configProvider.getUserSenderID(); //fcm senderID
    public kakaoTakitShop=this.configProvider.getKakaoTakitShop();////Rest API key
    public kakaoOauthUrl=this.configProvider.getKakaoOauthUrl(); //return url

    public version=this.configProvider.getVersion();

    public accountMaskExceptFront=this.configProvider.getAccountMaskExceptFront();
    public accountMaskExceptEnd=this.configProvider.getAccountMaskExceptEnd();

    constructor(private platform:Platform,private nativeStorage: NativeStorage,private configProvider:ConfigProvider){
        console.log("StorageProvider constructor");  
        if(this.serverAddress.endsWith('8000')){
            console.log("test server 8000");
            this.isTestServer = true;     
        }else{
            this.isTestServer = false;
        }
        this.nativeStorage.getItem("printOn").then((value:string)=>{
            console.log("printOn is "+value+" in storage");
            if(value==null || value==undefined){
                this.printOn=false;
            }else{
                this.printOn= (value.toLowerCase() === 'true');
            }
        });
        console.log("printOn is "+this.printOn);
        if(this.printOn){
            this.nativeStorage.getItem("print").then((value:string)=>{
            console.log("print is "+value+" in storage");
            this.printer= value;
            });
        }else{
            this.printer=undefined;
        }
    
    }

    reset(){
        this.myshoplist=[];
        this.myshop={}; 
        this.shopInfo=undefined;   
        this.id=undefined;

        this.printOn=false;
        this.amIGotNoti=false;
        this.storeOpen=false;

        this.email=undefined;
        this.name=undefined;
        this.phone=undefined;

        this.cashAvailable=undefined;
        this.totalSales=undefined;
        this.maskAccount=undefined;
        this.account=undefined;
        this.bankName=undefined;
        this.bankCode=undefined;
        this.depositor=undefined;
    }


    open(){
        return new Promise((resolve,reject)=>{
            var options={
                    name: "takit.db",
                    location:'default'
            };
            this.db=new SQLite();
            //this.local=new Storage(LocalStorage);
            this.db.openDatabase(options).then(()=>{
                resolve();
            },(error)=>{
                console.log("fail to open database");
                reject();
            });   
        });
    }

    decryptValue(identifier,value){
        var key=value.substring(0, 16);
        var encrypt=value.substring(16, value.length);
        console.log("value:"+value+" key:"+key+" encrypt:"+encrypt);
        var decrypted=CryptoJS.AES.decrypt(encrypt,key);
        if(identifier=="id"){ // not good idea to save id here. Please make a function like getId
            this.id=decrypted.toString(CryptoJS.enc.Utf8);
            console.log("save id into storageProvider "+this.id);
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

//    errorReasonSet(reason:string){
//        this.errorReason=reason;
//    }

    shopInfoSet(shopInfo:any){
        console.log("shopInfoSet:"+JSON.stringify(shopInfo));
        this.shopInfo=shopInfo;
    } 

    currentShopname(){
        return this.shopInfo.shopName;
    }

    public userInfoSetFromServer(userInfo:any){
        console.log("userInfoSetFromServer:"+JSON.stringify(userInfo));
        this.email=userInfo.email;
        this.name=userInfo.name;
        this.phone=userInfo.phone;
        this.tourMode=false;
    }
}


