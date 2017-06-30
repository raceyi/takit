import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import {Platform} from 'ionic-angular';
import {StorageProvider} from '../storageProvider';
import { Device } from '@ionic-native/device';
import 'rxjs/add/operator/map';
import { Facebook } from '@ionic-native/facebook';


@Injectable()
export class FbProvider {
  email:string;
  phone:string;
  country:string;
  name:string;

  constructor(private platform:Platform,private http:Http
        ,public storageProvider:StorageProvider, public fb: Facebook,
        private device:Device) {
      console.log("FbProvider");
  }

  login(){
      return new Promise((resolve,reject)=>{
          this.fblogin(this.facebookServerLogin,this).then((res:any)=>{
              resolve(res);
          }, (err)=>{
              reject(err);
          });
      });
  }

  fblogin(handler,fbProvider){    
      return new Promise((resolve,reject)=>{
               if(this.platform.is('cordova')) {
                    fbProvider.fb.getLoginStatus().then((status_response) => { 
                    console.log(JSON.stringify(status_response));
                    if(status_response.status=='connected'){
                       console.log("conneted status");
                       //console.log(status_response.userId); //please save facebook id 
                       fbProvider.fb.api("me/?fields=id,email,last_name,first_name", ["public_profile","email"]).then((api_response) =>{
                            console.log(JSON.stringify(api_response));
                            console.log("call server facebook login!!! referenceId:"+api_response.id);
                            handler(api_response.id,fbProvider,status_response.authResponse.accessToken)
                                  .then(
                                      (result:any)=>{
                                                   console.log("result comes:"+JSON.stringify(result)); 
                                                   var param=result;
                                                   param.id="facebook_"+api_response.id;
                                                   if(api_response.hasOwnProperty("email")){
                                                          param.email=api_response.email;
                                                   }
                                                   if(api_response.hasOwnProperty("last_name") &&
                                                          api_response.hasOwnProperty("first_name")){
                                                          param.name=api_response.last_name+api_response.first_name;   
                                                   }
                                                   resolve(param);
                                      },serverlogin_err=>{
                                                   console.log("error comes:"+serverlogin_err);
                                                   let reason={stage:"serverlogin_err",msg:serverlogin_err};
                                                   reject(reason);
                                      });
                        },(api_err)=>{
                            console.log("facebook.api error:"+JSON.stringify(api_err));
                            let reason={stage:"api_err",msg:api_err}; 
                            reject(reason);
                        }); 
                    }else{ // try login
                       console.log("Not connected status");
                       fbProvider.fb.login(["public_profile","email"]).then((login_response:any) => {
                            console.log(JSON.stringify(login_response));
                            //console.log(login_response.userId);
                            fbProvider.fb.api("me/?fields=id,email,last_name,first_name", ["public_profile","email"]).then((api_response) =>{
                                console.log(JSON.stringify(api_response));
                                fbProvider.fb.getAccessToken().then(accessToken=>{ 
                                       console.log("accessToken:"+accessToken);
                                       console.log("call server facebook login!!!");
                                       handler(api_response.id,fbProvider,accessToken)
                                       .then(
                                          (result:any)=>{
                                                      console.log("result comes:"+result); 
                                                      var param=result;
                                                      param.id="facebook_"+api_response.id;
                                                      if(api_response.hasOwnProperty("email")){
                                                          param.email=api_response.email;
                                                      }
                                                      if(api_response.hasOwnProperty("last_name") &&
                                                          api_response.hasOwnProperty("first_name")){
                                                          param.name=api_response.last_name+api_response.first_name;   
                                                      }
                                                      resolve(param);
                                          },serverlogin_err=>{ 
                                                      console.log(serverlogin_err);
                                                      let reason={stage:"serverlogin_err",msg:serverlogin_err};
                                                      reject(reason);
                                          });
                                  },token_err=>{
                                       console.log("access token error:"+JSON.stringify(token_err));
                                       let reason={stage:"token_err",msg:token_err};
                                       reject(reason);
                                  });
                              },(api_err)=>{
                                  console.log(JSON.stringify(api_err));
                                  let reason={stage:"api_err",msg:api_err};
                                  reject(reason);
                              }); 
                        },(login_err)=>{
                            console.log(JSON.stringify(login_err));
                            let reason={stage:"login_err",msg:login_err};
                            reject(reason);
                        }); 
                    }
                },(status_err) =>{
                    console.log(JSON.stringify(status_err)); 
                    let reason={stage:"status_err",msg:status_err};
                    reject(reason);
                });
        }else{
                console.log("Please run me on a device");
                let reason={stage:"cordova_err",msg:"run me on device"};
                reject(reason);
        }
     });
 }
 
  facebookServerLogin(facebookid,fbProvider:FbProvider,token){
      return new Promise((resolve, reject)=>{
              console.log("facebookServerLogin facebookid"+facebookid);

              let body = JSON.stringify({referenceId:"facebook_"+facebookid,token:token,uuid:this.device.uuid,version:fbProvider.storageProvider.version});

              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server:"+ fbProvider.storageProvider.serverAddress);

              fbProvider.http.post(fbProvider.storageProvider.serverAddress+"/facebooklogin",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{              
                 console.log("facebook login res:"+JSON.stringify(res));
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("facebooklogin no response");
                 reject("facebooklogin no response");
             });
         });
  }

  facebookServerSignup(facebookid,name,email,country,phone,receiptIssue,receiptId,receiptType){
      return new Promise((resolve, reject)=>{
              console.log("facebookServerSignup !!!");
              let receiptIssueVal;
              if(receiptIssue){
                    receiptIssueVal=1;
              }else{
                    receiptIssueVal=0;
              }
              let body = JSON.stringify({referenceId:facebookid,name:name,
                                            email:email,country:country,phone:phone,
                                            receiptIssue:receiptIssueVal,receiptId:receiptId,receiptType:receiptType,
                                            uuid:this.device.uuid,version:this.storageProvider.version});
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server: "+ this.storageProvider.serverAddress+ " body:"+body);

             this.http.post(this.storageProvider.serverAddress+"/signup",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("signup no response "+JSON.stringify(err));
                 reject("signup no response");
             });
         });
  }

  logout(){
      return new Promise((resolve,reject)=>{
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    console.log("server: "+ this.storageProvider.serverAddress);

                    this.http.post(this.storageProvider.serverAddress+"/logout",JSON.stringify({version:this.storageProvider.version}),{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                        this.fb.logout().then((result)=>{
                             resolve(res); 
                        },(err)=>{
                              resolve(res);
                        });
                    },(err)=>{
                        //console.log("logout no response "+JSON.stringify(err));
                        reject(err);
                    });
      });
  }

  unregister(){
      return new Promise((resolve,reject)=>{
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server: "+ this.storageProvider.serverAddress);

             this.http.post(this.storageProvider.serverAddress+"/unregister",JSON.stringify({version:this.storageProvider.version}) ,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 console.log("unregister "+JSON.stringify(res));
                 this.fb.logout();
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("unregister no response "+JSON.stringify(err));
                 reject("unregister no response");
             });
  });
}

}

