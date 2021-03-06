import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import { AppAvailability } from '@ionic-native/app-availability';
import {Platform} from 'ionic-angular';
import {StorageProvider} from '../storageProvider';
import 'rxjs/add/operator/map';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';


declare var KakaoTalk:any;

@Injectable()
export class KakaoProvider {
  browserRef;
  email:string;
  phone:string;
  country:string;
  name:string;

  constructor(private platform:Platform,private http:Http
    ,private storageProvider:StorageProvider, private iab: InAppBrowser,
    private appAvailability: AppAvailability) {
      console.log("KakaoProvider");
  }

  login(){
    return new Promise((resolve,reject)=>{
          this.kakaologin(this.kakaoServerLogin,this).then((res:any)=>{
              resolve(res);
          }, (err)=>{
              reject(err);
          });
      });
  }

  kakaologin(handler,kakaoProvider){
      return new Promise((resolve,reject)=>{

      var scheme;
      if(this.platform.is('android')){
          scheme='com.kakao.talk';         
      }else if(this.platform.is('ios')){
          scheme='kakaotalk://';
      }else{
          console.log("unknown platform");
      }
      
      this.appAvailability.check(scheme).then(
          ()=> {  // Success callback
              console.log(scheme + ' is available. call KakaoTalk.login ');
              KakaoTalk.login(
                    (userProfile)=>{
                        console.log("userProfile:"+JSON.stringify(userProfile));
                        var id;
                        if(typeof userProfile === "string"){
                                id=userProfile;
                        }else{ // humm... userProfile data type changes. Why?
                                id=userProfile.id;
                        }
                        console.log('Successful kakaotalk login with'+id);
                        handler(id,kakaoProvider).then(
                        (result:any)=>{
                                    console.log("result comes:"+JSON.stringify(result)); 
                                    result.id="kakao_"+id;
                                    resolve(result);
                        },serverlogin_err=>{
                                    console.log("error comes:"+serverlogin_err);
                                    let reason={stage:"serverlogin_err",msg:serverlogin_err};
                                    reject(reason);
                        });
                    },
                    (err)=> {
                        console.log('Error logging in');
                        console.log(JSON.stringify(err));
                        let reason={stage:"login_err",msg:err}; 
                        reject(reason);
                    }
              ); 
          },
          ()=>{  // Error callback
              console.log(scheme + ' is not available');
              this.browserRef=this.iab.create("https://kauth.kakao.com/oauth/authorize?client_id="+this.storageProvider.kakaoTakitShop+"&redirect_uri="+this.storageProvider.kakaoOauthUrl+"&response_type=code","_blank");
              this.browserRef.on("exit").subscribe((event)=>{
                  console.log("InAppBrowserEvent(exit):"+JSON.stringify(event)); 
                  this.browserRef.close();
                  let reason={stage:"login_err",msg:"no input"}; 
                  reject(reason);
              });
              this.browserRef.on("loadstart").subscribe((event:InAppBrowserEvent)=>{
                  console.log("InAppBrowserEvent(loadstart):"+String(event.url)); 
                  var url=String(event.url);
                  if(url.startsWith(this.storageProvider.kakaoOauthUrl+"?code=")){
                      console.log("success to get code");
                      this.browserRef.close();
                      let authorize_code=event.url.substr(event.url.indexOf("code=")+5);
                      console.log("authorize_code:"+authorize_code);
                      // get token and then get user profile info
                      // request server login with authorize_code.                      
                      this.getKakaoToken( this.storageProvider.kakaoTakitShop,this.storageProvider.kakaoOauthUrl,authorize_code).then(
                          (token:any)=>{ 
                              console.log("access_token:"+token.access_token); 
                              this.getKakaoMe(token.access_token).then((profile:any)=>{
                                    console.log("getKakaoMe profile:"+JSON.stringify(profile)); 
                                    console.log('Successful kakaotalk login with'+profile.id);
                                    handler(profile.id,kakaoProvider).then(
                                        (result:any)=>{
                                                    console.log("result comes:"+result);
                                                    result.id="kakao_"+profile.id; 
                                                    resolve(result);
                                        },serverlogin_err=>{
                                                    console.log("error comes:"+serverlogin_err);
                                                    let reason={stage:"serverlogin_err",msg:serverlogin_err};
                                                    reject(reason);
                                        });
                              },(err)=>{
                                 console.log("getKakaoMe err"+JSON.stringify(err)); 
                                 let reason={stage:"getKakaoMe_err",msg:err}; 
                                 reject(reason);
                              });
                          },
                          (err)=>{
                              console.log("getKakaoToken err "+JSON.stringify(err));
                              let reason={stage:"login_err",msg:"getKakaoToken err "}; 
                              reject(err);
                          });
                  }
                  // Please add code for login failure here!
              });    
          });     
      });
  }

  getKakaoMe(access_token){
      return new Promise((resolve, reject)=>{
              console.log("getKakaoMe token:"+access_token);
              let headers = new Headers();
              headers.append('Authorization', 'Bearer '+access_token);
              headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
             this.http.get("https://kapi.kakao.com/v1/user/me",{headers: headers}).subscribe((res)=>{
                 var profile=res.json();
                 resolve(profile); 
             },(err)=>{
              console.log("err:"+JSON.stringify(err));
                 reject(err);
             });
         });
  }

  getKakaoToken(app_key,redirect_uri,authorize_code){
      return new Promise((resolve, reject)=>{
              console.log("getKakaoToken authorize_code:"+authorize_code);

              let body = 'grant_type=authorization_code'+
                         '&client_id='+app_key+
                         '&redirect_uri='+redirect_uri+
                         '&code='+authorize_code;
              let headers = new Headers();
              headers.append('Content-Type', 'application/x-www-form-urlencoded');
             console.log("body:"+body); 
             this.http.post("https://kauth.kakao.com/oauth/token",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 console.log("getKakaoToken success:"+JSON.stringify(res));
                 resolve(res); 
             },(err)=>{
              console.log("err:"+JSON.stringify(err));
                 reject(err);
             });
         });
  }

  kakaoServerLogin(kakaoid,kakaoProvider:KakaoProvider){
      return new Promise((resolve, reject)=>{
              console.log("kakaoServerLogin");
              let body = JSON.stringify({referenceId:"kakao_"+kakaoid,version:kakaoProvider.storageProvider.version});
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log("server:"+ kakaoProvider.storageProvider.serverAddress);

             kakaoProvider.http.post(kakaoProvider.storageProvider.serverAddress+"/shop/kakaoLogin",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                 resolve(res); // 'success'(move into home page) or 'invalidId'(move into signup page)
             },(err)=>{
                 console.log("kakaologin no response");
                 reject("kakaologin no response");
             });
         });
  }
  
  logout(){
    return new Promise((resolve,reject)=>{   
       var scheme;
      if(this.platform.is('android')){
          scheme='com.kakao.talk';         
      }else if(this.platform.is('ios')){
          scheme='kakaotalk://';
      }else{
          console.log("unknown platform");
          reject("unknown platform");
          return;
      }

       this.appAvailability.check(scheme).then(
          ()=> {  // Success callback
              KakaoTalk.logout().then(()=>{
                    console.log("logout");
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    console.log("server: "+ this.storageProvider.serverAddress);
                    let body = JSON.stringify({version:this.storageProvider.version});
                    
                    this.http.post(this.storageProvider.serverAddress+"/shop/logout",body,{headers: headers}).map(res=>res.json()).subscribe((res)=>{
                        resolve(res);
                    },(err)=>{
                        console.log("logout no response "+JSON.stringify(err));
                        reject("logout no response");
                    });
                },
                (err)=>{ // KakaoTalk.logout failure
                      reject("KakaoTalk.logout failure");
                });
          },()=>{  // Error callback
              console.log("KakaoTalk doesn't exist");
              reject("KakaoTalk doesn't exist");
          });
    });
  }



}


