import {Component} from "@angular/core";
import {Platform} from 'ionic-angular';
import {NavController,App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FbProvider} from '../../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../../providers/LoginProvider/kakao-provider';
//import {Storage} from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';


import {TabsPage} from '../tabs/tabs';
import {LoginPage} from '../login/login';
import {MultiloginPage} from '../multilogin/multilogin';
import { TranslateService} from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})

export class ErrorPage{
     //public reason:string="";
     //android_platform:boolean;

     constructor(private navController: NavController,
        private platform:Platform,public storageProvider:StorageProvider,
        public fbProvider:FbProvider, public kakaoProvider:KakaoProvider,
        public emailProvider:EmailProvider,private nativeStorage: NativeStorage,private app:App,
        private translateService:TranslateService, private splashScreen: SplashScreen){

         console.log("ErrorPage constructor");
         //this.android_platform=this.platform.is('android');
         //this.reason=this.storageProvider.errorReason;

        if(!navigator.language.startsWith("ko")){
            translateService.setDefaultLang('en');
            translateService.use('en');
        }else{
            translateService.setDefaultLang('ko');
            translateService.use('ko');
        }
     }

     ionViewDidLoad(){
        console.log("ErrorPage did enter");
        this.splashScreen.hide();
     }

     terminate(event){
        console.log("terminate");
        this.platform.exitApp();
     }

    loginWithExistingId(){
                var id=this.storageProvider.id;
                if(id=="facebook"){
                    this.fbProvider.login().then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    console.log("res.email:"+res.email +"res.name:"+res.name);
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.emailLogin=false;
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    console.log("shoplist...:"+JSON.stringify(this.storageProvider.shoplist));
                                    this.app.getRootNav().setRoot(TabsPage);
                                }else if(res.result=='failure' && res.result=='invalidId'){
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.app.getRootNav().setRoot(LoginPage);   
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.app.getRootNav().setRoot(MultiloginPage,{id:"facebook"});
                                }else{
                                    console.log("invalid result comes from server-"+JSON.stringify(res));
                                    //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다');
                                    this.app.getRootNav().setRoot(ErrorPage);   
                                }
                            },login_err =>{
                                console.log("move into ErrorPage-"+JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                //this.app.getRootNav().setRoot(ErrorPage);
                    });
                }else if(id=="kakao"){ //kakao login
                        //console.log("kakao login is not implemented yet");
                        // read kakao id and try server login
                        this.kakaoProvider.login().then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    //save shoplist
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.emailLogin=false;
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    this.app.getRootNav().setRoot(TabsPage);
                                }else if(res.result=='failure' && res.result=='invalidId'){
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.app.getRootNav().setRoot(LoginPage);
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.app.getRootNav().setRoot(MultiloginPage,{id:"kakao"});
                                }else{
                                    console.log("invalid result comes from server-"+JSON.stringify(res));
                                    //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다');
                                    //this.app.getRootNav().setRoot(ErrorPage);   
                                }
                            },login_err =>{
                                console.log(JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                //this.app.getRootNav().setRoot(ErrorPage);
                            });
                }else{ // email login 
                        this.nativeStorage.getItem("password").then((value:string)=>{
                        var password=this.storageProvider.decryptValue("password",decodeURI(value));
                        this.emailProvider.EmailServerLogin(id,password).then((res:any)=>{
                                console.log("MyApp:"+JSON.stringify(res));
                                if(res.result=="success"){
                                    if(res.userInfo.hasOwnProperty("shopList")){
                                        //save shoplist
                                        this.storageProvider.shoplistSet(JSON.parse(res.userInfo.shopList));
                                    }
                                    this.storageProvider.emailLogin=true;
                                    this.storageProvider.userInfoSetFromServer(res.userInfo);
                                    this.app.getRootNav().setRoot(TabsPage);
                                }else if(res.result=='failure'&& res.error=='multiLogin'){
                                        // How to show user a message here? move into error page?
                                        // Is it possible to show alert here?
                                    this.app.getRootNav().setRoot(MultiloginPage,{id:id});
                                }else{ 
                                    console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                    this.app.getRootNav().setRoot(LoginPage);
                                }
                            },login_err =>{
                                console.log(JSON.stringify(login_err));
                                //this.storageProvider.errorReasonSet('로그인 에러가 발생했습니다'); 
                                //this.app.getRootNav().setRoot(ErrorPage);
                        });
                        },(error)=>{
                                console.log("사용자 정보에 문제가 발생했습니다. 로그인 페이지로 이동합니다.");
                                this.app.getRootNav().setRoot(LoginPage);
                        });
                }
    }

    tryLogin(event){
        if(this.storageProvider.id==undefined){
                this.nativeStorage.getItem("id").then((value:string)=>{
                        console.log("value:"+value);
                        if(value==null){
                            console.log("id doesn't exist");
                            this.app.getRootNav().setRoot(LoginPage); 
                            return;
                        }else{
                            var id=this.storageProvider.decryptValue("id",decodeURI(value));
                            console.log("id:"+id);
                            this.loginWithExistingId();
                        }
                });        
        }else{
            this.loginWithExistingId();
        }
    }
}
