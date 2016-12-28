import {Injectable} from '@angular/core';
import {Platform ,NavController} from 'ionic-angular';
import {SQLite} from 'ionic-native';
//import * as CryptoJS from 'crypto-js';
declare var CryptoJS:any;
import {ConfigProvider} from './configProvider';

@Injectable()
export class StorageProvider{
    db;
    public myshoplist=[];
    public myshop:any={}; // manager, takitId, ???
    public shopInfo:any;   // current shopInfo. shopname:shopInfo.shopName
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
    public email;
    public name;
    public phone;

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

    constructor(private platform:Platform,private configProvider:ConfigProvider){
        console.log("StorageProvider constructor");         
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

    errorReasonSet(reason:string){
        this.errorReason=reason;
    }

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


