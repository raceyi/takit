import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import {Storage} from '@ionic/storage';

import {FbProvider} from './LoginProvider/fb-provider';
import {KakaoProvider} from './LoginProvider/kakao-provider';
import {EmailProvider} from './LoginProvider/email-provider';

import {StorageProvider} from './storageProvider';

import 'rxjs/add/operator/map';

@Injectable()
export class ServerProvider{
  constructor(private platform:Platform,private http:Http
            ,private storage:Storage
            ,private fbProvider:FbProvider,private kakaoProvider:KakaoProvider
            ,private emailProvider:EmailProvider
            ,private storageProvider:StorageProvider) {

      console.log("ServerProvider constructor");
  }

  post(request,body){
       return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post(this.storageProvider.serverAddress+request,body,{headers: headers}).timeout(this.storageProvider.timeout).map(res=>{ console.log("headers:"+JSON.stringify(res.headers)); 
                res.headers.forEach((element,name)=>{ 
                    console.log(JSON.stringify(element));
                    console.log("name:"+name);
                    if(name=='version'){
                        if(element[0]!=" "){
                            console.log("client version doesn't match with server version");
                        }
                    }
                });
                return res.json(); }).subscribe((res)=>{
                resolve(res);                    
            },(err)=>{
                if(err.hasOwnProperty("status") && err.status==401){
                    //login again with id
                    this.loginAgain().then(()=>{
                        //call http post again
                         this.http.post(this.storageProvider.serverAddress+request,body,{headers: headers}).timeout(this.storageProvider.timeout).map(res=>res.json()).subscribe((res)=>{
                            resolve(res);  
                         },(err)=>{
                             reject("NetworkFailure");
                         });
                    },(err)=>{
                        reject(err);
                    });
                }else{
                    reject("NetworkFailure");
                }
            });
       });
  }
  
  loginAgain(){
      return new Promise((resolve,reject)=>{
        console.log("[loginAgain] id:"+this.storageProvider.id);
                if(this.storageProvider.id=="facebook"){
                    this.fbProvider.login().then((res:any)=>{
                                if(res.result=="success"){
                                    resolve();
                                }else
                                    reject("HttpFailure");
                            },login_err =>{
                                reject("NetworkFailure");
                    });
                }else if(this.storageProvider.id=="kakao"){ //kakao login
                        console.log("kakao login is not implemented yet");
                        this.kakaoProvider.login().then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    resolve();
                                }else
                                    reject("HttpFailure");
                            },login_err =>{
                                    reject("NetworkFailure");
                    });
                }else{ // email login 
                    this.storage.get("password").then((value:string)=>{
                        var password=this.storageProvider.decryptValue("password",decodeURI(value));
                        this.emailProvider.EmailServerLogin(this.storageProvider.id,password).then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    resolve();
                                }else
                                    reject("HttpFailure");
                            },login_err =>{
                                    reject("NetworkFailure");
                        });
                    });
                }
        });
  }

  updateCashAvailable(){
      return new Promise((resolve,reject)=>{
           let body = JSON.stringify({takitId:this.storageProvider.myshop.takitId});
           console.log("/shop/getBalance "+body);
           this.post("/shop/getBalance",body).then((res:any)=>{
                console.log("res:"+JSON.stringify(res));
                if(res.result=="success"){
                    this.storageProvider.cashAvailable=res.balance;
                    this.storageProvider.totalSales=res.sales;
                    resolve(res);
                }else{
                    reject("캐쉬정보를 가져오는데 실패했습니다.");
                }
           },(err)=>{
                    reject(err);
           });
      });
  }

}




