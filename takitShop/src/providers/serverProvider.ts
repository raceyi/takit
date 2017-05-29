import {Injectable} from '@angular/core';
import { AlertController, Platform} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
//import {Storage} from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import {FbProvider} from './LoginProvider/fb-provider';
import {KakaoProvider} from './LoginProvider/kakao-provider';
import {EmailProvider} from './LoginProvider/email-provider';

import {StorageProvider} from './storageProvider';

import 'rxjs/add/operator/map';

@Injectable()
export class ServerProvider{
    fileTransfer: TransferObject = this.transfer.create();
    //fileTransfer: TransferObject;
    private loading:any;

  constructor(private platform:Platform,private http:Http,
            private nativeStorage: NativeStorage,private transfer: Transfer,
            private alertController:AlertController,
            private fbProvider:FbProvider,private kakaoProvider:KakaoProvider,
            private emailProvider:EmailProvider,
            private storageProvider:StorageProvider) {

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
                    this.nativeStorage.getItem("password").then((value:string)=>{
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



  addCategory(category){
      category.takitId = this.storageProvider.shopInfo.takitId;
      return new Promise((resolve,reject)=>{
           let body = JSON.stringify(category);
           console.log("/shop/addCategory "+body);
           this.post("/shop/addCategory",body).then((res:any)=>{
                console.log("res:"+JSON.stringify(res));
                if(res.result=="success"){
                    resolve();
                }else{
                    reject("카테고리 추가에 실패했습니다.");
                }
           },(err)=>{
                    reject(err);
           });
      });
  }

  modifyCategory(category){
    category.takitId = this.storageProvider.shopInfo.takitId;
        return new Promise((resolve,reject)=>{
            let body = JSON.stringify(category);
            console.log("/shop/modifyCategory "+body);
            this.post("/shop/modifyCategory",body).then((res:any)=>{
                console.log("res:"+JSON.stringify(res));
                if(res.result=="success"){
                    resolve();
                }else{
                    reject("카테고리 수정에 실패했습니다.");
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
            // this.post('/cafe/shopHome',{takitId:takitId})
            // .then(res=>{
            //     resolve(res);
            // },(err)=>{
            //     reject("http error"); 
            // })
            this.get(encodeURI(this.storageProvider.serverAddress+"/cafe/shopHome?takitId="+takitId)).then((res)=>{
                    console.log("res:"+JSON.stringify(res));
                    resolve(res);
                },(err)=>{
                reject("http error");  
            });
        });   
    }

    addMenuInfo(menu){
        return new Promise((resolve,reject)=>{
            let body = JSON.stringify(menu);
            this.post("/shop/addMenu",body).then((res:any)=>{
                console.log(res);
                resolve(res);
            },(err)=>{
                reject("serverProvider addMenuInfo error");
            });
        });
    }


  onProgress(progressEvent: ProgressEvent){
      let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      console.log("progress:"+progress);
      if(progress==100){
      }
  }

  fileTransferFunc(imageURI,menu){
      //사용자가 이미지 이름 변경했을 수도 있으므로 입력된 imagePath값으로 함
    return new Promise((resolve,reject)=>{
        if(imageURI !== undefined){
            //let filename= imageURI.substr(imageURI.lastIndexOf('/') + 1); 
            console.log("imageURI:"+imageURI);
            console.log("filename:"+menu.imagePath);
            let options :FileUploadOptions = {
                fileKey: 'file',
                fileName: menu.imagePath,
                mimeType: 'image/jpeg',
                params: {
                    fileName: this.storageProvider.myshop.takitId+"_"+menu.imagePath,
                    takitId:this.storageProvider.myshop.takitId,
                    menuNO :menu.menuNO,
                    menuName:menu.menuName
                }
            }; 
            this.fileTransfer.onProgress(this.onProgress);

                ///////////////////////////////
            this.loading=this.alertController.create({
                    title:"사진을 업로드하고 있습니다"
                    });
            this.loading.present();
                ///////////////////////////////
            console.log("fileTransfer.upload");

            this.fileTransfer.upload(imageURI, this.storageProvider.serverAddress+"/shop/uploadMenuImage", options, false)
            .then((response: any) => {
                console.log("upload:"+JSON.stringify(response));
                let result=JSON.parse(response.response);
                console.log("result.result:"+result.result);
                resolve(result);
                this.loading.dismiss();
            },err=>{
                reject(err);
            });
        }else{
            let alert = this.alertController.create({
                title : "사진을 선택해주세요.",
                buttons : ['확인']
            });
            alert.present();
        }
    });

  }

    modifyMenuInfo(menu){
        
        return new Promise((resolve,reject)=>{
            this.post("/shop/modifyMenu",JSON.stringify(menu)).then((res:any)=>{
                console.log(res);
                resolve(res);
            },(err)=>{
                reject(err);
            });
        });
    }

    removeMenu(menu){
        return new Promise((resolve,reject)=>{
            this.post('/shop/removeMenu',JSON.stringify(menu)).then((res:any)=>{
                console.log(res);
                resolve(res);
            },(err)=>{
                reject(err);
            });
        });
    }

    removeCategory(category){
        console.log(category);
        let body ={"categoryNO":category.categoryNO,
                    "sequence":category.sequence,
                    "takitId":this.storageProvider.myshop.takitId}
        return new Promise((resolve,reject)=>{
            this.post('/shop/removeCategory',JSON.stringify(body))
            .then((res:any)=>{
                console.log(res);
                resolve(res);
            },(err)=>{
                reject(err);
            });
        });
    }
}
