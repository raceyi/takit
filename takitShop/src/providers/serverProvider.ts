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

  post(request,bodyIn){
      console.log("!!!!post:"+bodyIn);
       let bodyObj=JSON.parse(bodyIn);
       bodyObj.version=this.storageProvider.version;
       let body=JSON.stringify(bodyObj);
       console.log("request:"+request);

       return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("bodyIn:"+bodyIn);

            this.http.post(this.storageProvider.serverAddress+request,body,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{
                resolve(res.json());                   
            },(err)=>{
                console.log("post-err:"+JSON.stringify(err));
                if(err.hasOwnProperty("status") && err.status==401){
                    //login again with id
                    this.loginAgain().then(()=>{
                        //call http post again
                         this.http.post(this.storageProvider.serverAddress+request,body,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{
                            resolve(res.json());  
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
                                    if(res.version!=this.storageProvider.version){
                                        console.log("post invalid version");
                                    }
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
                                    if(res.version!=this.storageProvider.version){
                                        console.log("post invalid version");
                                    }
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
                                    if(res.version!=this.storageProvider.version){
                                        console.log("post invalid version");
                                    }
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

/*
    getShopInfo(takitId){
        return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("takitId:"+takitId);
            console.log("!!!server:"+ this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId);
            let body={takitId:takitId,version:this.storageProvider.version};
            this.post("/cafe/shopHome",JSON.stringify(body)).then((res)=>{
            //this.get(encodeURI(this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId)).then((res)=>{
                    console.log("res:"+JSON.stringify(res));
                    //this.shopResponse=res.json();
                    resolve(res);
                },(err)=>{
                reject("http error");  
                });
        });   
    }
*/

    get(request){
      // console.log("!!!!get:"+request);
       return new Promise((resolve,reject)=>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.get(request,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{
            resolve(res.json());
        },(err)=>{
                if(err.hasOwnProperty("status") && err.status==401){
                    //login again with id
                    this.loginAgain().then(()=>{
                        //call http post again
                         this.http.get(request,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{
                            resolve(res.json());  
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
/*
    getShopInfo(takitId){
        return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("takitId:"+takitId);
            //console.log("!!!server:"+ this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId);
            this.get(encodeURI(this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId)).then((res)=>{
                    //console.log("res:"+JSON.stringify(res));
                    //this.shopResponse=res.json();
                    resolve(res);
                },(err)=>{
                reject("http error");  
                });
        });   
    }
*/
getShopInfo(takitId){
        return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("takitId:"+takitId);
            console.log("!!!server:"+ this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId);
            this.get(encodeURI(this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId)).then((res)=>{
                    console.log("res:"+JSON.stringify(res));
                    resolve(res);
                },(err)=>{
                reject("http error");  
                });
        });   
    }

}




