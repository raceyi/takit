import {Injectable,EventEmitter} from '@angular/core';
//import {Platform} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
//import {Storage} from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

import {FbProvider} from './LoginProvider/fb-provider';
import {KakaoProvider} from './LoginProvider/kakao-provider';
import {EmailProvider} from './LoginProvider/email-provider';

import {StorageProvider} from './storageProvider';

import 'rxjs/add/operator/map';

@Injectable()
export class ServerProvider{
  constructor(private http:Http
            ,private nativeStorage: NativeStorage
            ,private fbProvider:FbProvider
            ,private kakaoProvider:KakaoProvider
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
           // this.http.post(request,body,{headers: headers}).timeout(this.storageProvider.timeout).map(res=>res.json()).subscribe((res)=>{
            this.http.post(request,body,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{               
                console.log("post version:"+res.json().version+" version:"+this.storageProvider.version);
                resolve(res.json());                    
            },(err)=>{
                console.log("post-err:"+JSON.stringify(err));
                if(err.hasOwnProperty("status") && err.status==401){
                    //login again with id
                    this.loginAgain().then(()=>{
                        //call http post again
                         //this.http.post(request,body,{headers: headers}).timeout(this.storageProvider.timeout).map(res=>res.json()).subscribe((res)=>{
                        this.http.post(request,body,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{
                            console.log("post version:"+res.json().version+" version:"+this.storageProvider.version);
                            if(parseFloat(res.json().version)>parseFloat(this.storageProvider.version)){
                                console.log("post invalid version");
                                this.storageProvider.tabMessageEmitter.emit("invalidVersion");
                            }
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
                                    if(parseFloat(res.version)>parseFloat(this.storageProvider.version)){
                                        console.log("post invalid version");
                                        this.storageProvider.tabMessageEmitter.emit("invalidVersion");
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
                                    if(parseFloat(res.version)>parseFloat(this.storageProvider.version)){
                                        console.log("post invalid version");
                                        this.storageProvider.tabMessageEmitter.emit("invalidVersion");
                                    }
                                    resolve();
                                    //save shoplist
                                    resolve();
                                }else
                                    reject("HttpFailure");
                            },login_err =>{
                                    reject("NetworkFailure");
                    });
                }else{ // email login 
                    this.nativeStorage.getItem("password").then((value:string)=>{
                        var password=this.storageProvider.decryptValue("password",decodeURI(value));
                        this.emailProvider.EmailServerLogin(this.storageProvider.id,password).then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    if(parseFloat(res.version)>parseFloat(this.storageProvider.version)){
                                        console.log("post invalid version");
                                        this.storageProvider.tabMessageEmitter.emit("invalidVersion");
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

  orderNoti(){
      return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let body = JSON.stringify({});
            this.post(encodeURI(this.storageProvider.serverAddress+"/orderNotiMode"),body).then((res:any)=>{
                  console.log("res:"+JSON.stringify(res));
                  console.log("orderNotiMode-res.result:"+res.result);
                  if(res.result=="success"){
                    resolve(res.orders);
                  }else{
                    reject("HttpFailure");
                  }
            },(err)=>{
                reject(err);  
            });
      });
  }

  saveOrder(body){
      return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("saveOrder:"+body);
            this.post(encodeURI(this.storageProvider.serverAddress+"/saveOrder"),body).then((res:any)=>{
                  console.log("res:"+JSON.stringify(res));
                  console.log("saveOrder-res.result:"+res.result);
                  if(res.result=="success"){
                    //resolve(res.orders);
                    resolve(res);
                  }else{
                    reject(res.error);
                  }
            },(err)=>{
                reject(err);  
            });
            this.nativeStorage.setItem("orderDoneFlag","true");
      });
  }
/*
    getShopInfo(takitId){
        return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("takitId:"+takitId);
            //console.log("!!!server:"+ this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId);
            let body={takitId:takitId,version:this.storageProvider.version};
            this.post("/cafe/shopHome",JSON.stringify(body)).then((res)=>{
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
            //console.log("get version:"+res.json().version);
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

    getShopInfo(takitId){
        return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log("takitId:"+takitId);
            //console.log("!!!server:"+ this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId);
            this.get(encodeURI(this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId)).then((res)=>{
                    //console.log("res:"+JSON.stringify(res));
                    resolve(res);
                },(err)=>{
                reject("http error");  
                });
        });   
    }


    updateCashAvailable(){
        return new Promise((resolve,reject)=>{
                        let body = JSON.stringify({cashId:this.storageProvider.cashId});
                        console.log("getBalanceCash "+body);
                        this.post(this.storageProvider.serverAddress+"/getBalanceCash",body).then((res:any)=>{
                            console.log("getBalanceCash res:"+JSON.stringify(res));
                            if(res.result=="success"){
                                this.storageProvider.cashAmount=res.balance;
                                resolve();
                            }else{
                                reject(res.error);
                            }
                        },(err)=>{
                                 reject(err);                                  
                        });
        });
    }

    postAnonymous(request,bodyIn){
       console.log("!!!!post:"+bodyIn);
       let bodyObj=JSON.parse(bodyIn);
       bodyObj.version=this.storageProvider.version;
       let body=JSON.stringify(bodyObj);
       console.log("request:"+request);

       return new Promise((resolve,reject)=>{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
           // this.http.post(request,body,{headers: headers}).timeout(this.storageProvider.timeout).map(res=>res.json()).subscribe((res)=>{
            this.http.post(request,body,{headers: headers}).timeout(this.storageProvider.timeout).subscribe((res)=>{               
                console.log("post version:"+res.json().version+" version:"+this.storageProvider.version);
                resolve(res.json());                    
            },(err)=>{
                console.log("post-err:"+JSON.stringify(err));
                reject(err);
            });
       });
    }

    getOldOrders(){
        return new Promise((resolve,reject)=>{
            //takitId old-order.ts에서 변경
            let body = JSON.stringify({takitId:this.storageProvider.takitId});
            console.log("getOldOrders "+body);
            this.post(this.storageProvider.serverAddress+"/getOldOrders",body).then((res:any)=>{
                console.log("getOldOrders res:"+JSON.stringify(res));
                if(res.result=="success"){
                    //this.storageProvider.=res.balance;
                    resolve(res.oldOrders);
                }else{
                    reject(res.error);
                }
            },(err)=>{
                reject(err);                                  
            });
        });
    }

    getKeywordShops(serviceName){
        return new Promise((resolve,reject)=>{
            //takitId old-order.ts에서 변경
            let body = JSON.stringify({serviceName:serviceName});
            console.log("getKeywordShops "+body);
            this.post(this.storageProvider.serverAddress+"/getKeywordShops",body).then((res:any)=>{
                console.log("getKeywordShops res:"+JSON.stringify(res));
                if(res.result=="success"){
                    //this.storageProvider.=res.balance;
                    resolve(res.shopInfos);
                }else{
                    reject(res.error);
                }
            },(err)=>{
                reject(err);                                  
            });
        });
    }
}




