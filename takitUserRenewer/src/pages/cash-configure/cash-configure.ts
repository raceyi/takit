import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import {CashPassword } from '../cash-password/cash-password';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';

/**
 * Generated class for the CashConfigurePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cash-configure',
  templateUrl: 'cash-configure.html',
})
export class CashConfigurePage {

  cashIdPassword:string;
  cashIdPasswordConfirm:string;
  passwordConfirmString:string="";
  passwordString:string="";
  authVerified:boolean=false;

  public browserRef;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public translateService: TranslateService, private alertController:AlertController,
  public storageProvider:StorageProvider,private iab: InAppBrowser,
  private serverProvider:ServerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashConfigurePage');
  }

   myCallbackFunction = (_params) => {
      return new Promise((resolve, reject) => {
          console.log("password params:"+_params);
          this.cashIdPassword=_params;
          this.passwordString="******";
          resolve();
      });
  }

  myCallbackConfirmFunction = (_params) => {
      return new Promise((resolve, reject) => {
          console.log("password confirm params:"+_params);
          this.cashIdPasswordConfirm=_params;
          this.passwordConfirmString="******";
          resolve();
      });
  }

  passwordInput(){
    this.navCtrl.push(CashPassword,{callback: this.myCallbackFunction, order:false,title:"새캐쉬비밀번호"});
  }

  passwordCheckInput(){
    this.navCtrl.push(CashPassword,{callback: this.myCallbackConfirmFunction, order:false,title:"새캐쉬비밀확인"});
  }

  phoneAuth(){
      this.authVerified=true;
      console.log("mobileAuth");
      this.mobileAuth().then((res)=>{
          this.authVerified=true;
      },(err)=>{
               if(err=="invalidUserInfo"){
                                    console.log("invalidUserInfo");
                                    this.translateService.get('userNameDiffers').subscribe( userNameDiffers=>{
                                        this.translateService.get('modifyUserName').subscribe( modifyUserName=>{
                                                let alert = this.alertController.create({
                                                        title: userNameDiffers,//'사용자 정보가 일치하지 않습니다.',
                                                        subTitle: modifyUserName,//'회원정보를 수정해주시기 바랍니다',
                                                        buttons: ['OK']
                                                    });
                                                    alert.present();
                                            })
                                        })
                                }
          
      });
  }

  mobileAuth(){    
    
    return new Promise((resolve,reject)=>{
      // move into CertPage and then 
      if(this.storageProvider.isAndroid){
            this.browserRef=this.iab.create(this.storageProvider.certUrl,"_blank" ,'toolbar=no');
      }else{ // ios
            console.log("ios");
            this.browserRef=this.iab.create(this.storageProvider.certUrl,"_blank" ,'location=no,closebuttoncaption=종료');
      }
      
              this.browserRef.on("exit").subscribe((event)=>{
                  console.log("InAppBrowserEvent(exit):"+JSON.stringify(event)); 
                  this.browserRef.close();
              });
              this.browserRef.on("loadstart").subscribe((event:InAppBrowserEvent)=>{
                
                  console.log("InAppBrowserEvent(loadstart):"+String(event.url));
                  if(event.url.startsWith("https://takit.biz/oauthSuccess")){ // Just testing. Please add success and failure into server 
                        console.log("cert success");
                        var strs=event.url.split("userPhone=");    
                        if(strs.length>=2){
                            var nameStrs=strs[1].split("userName=");
                            if(nameStrs.length>=2){
                                var userPhone=nameStrs[0];
                                var userSexStrs=nameStrs[1].split("userSex=");
                                var userName=userSexStrs[0];
                                 console.log("userPhone:"+userPhone+" userName:"+userName);
                                let body = JSON.stringify({userPhone:userPhone,userName:userName});
                                this.serverProvider.post(this.storageProvider.serverAddress+"/validUserInfo",body).then((res:any)=>{
                                    if(res.result=="success"){
                                        // forward into cash id page
                                        resolve();
                                    }else{
                                        // change user info
                                        //

                                        reject("invalidUserInfo");
                                    }
                                },(err)=>{
                                    if(err=="NetworkFailure"){
                                        this.translateService.get('NetworkProblem').subscribe(
                                        NetworkProblem => {
                                                this.translateService.get('checkNetwork').subscribe(
                                                    checkNetwork => {
                                                        let alert = this.alertController.create({
                                                            title: NetworkProblem,
                                                            subTitle: checkNetwork,//'네트웍상태를 확인해 주시기바랍니다',
                                                            buttons: ['OK']
                                                        });
                                                        alert.present();
                                                    });
                                        });
                                    }
                                    reject(err);
                                });

                            ///////////////////////////////
                        }
                        }
                        this.browserRef.close();
                  }else if(event.url.startsWith("https://takit.biz/oauthFailure")){
                        console.log("cert failure");
                        this.browserRef.close();
                         reject();
                  }
              });
              
    });
    
  }

modify(){
    if(!this.authVerified){
                            let alert = this.alertController.create({
                                title: "휴대폰 본인인증을 수행해 주시기 바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                            return;
    }
    if(this.cashIdPassword!=this.cashIdPasswordConfirm){
                            let alert = this.alertController.create({
                                title: "비밀번호가 일치하지 않습니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                            return;
    }

    this.checkExistingCashPassword().then((res)=>{
                // password is the same as previous one. Just skip it.
                console.log("password doesn't change");
                this.navCtrl.pop();
            },(err)=>{
                if(err=="passwordMismatch"){
                    let body = JSON.stringify({cashId:this.storageProvider.cashId,password:this.cashIdPassword});
                        console.log("modifyCashPwd");
                        this.serverProvider.post(this.storageProvider.serverAddress+"/modifyCashPwd",body).then((res:any)=>{
                            if(res.result=="success"){
                               let alert = this.alertController.create({
                                    title: "비밀번호 수정에 성공했습니다.",
                                    buttons:[
                                    {
                                        text: 'OK',
                                        handler: () => {
                                            this.navCtrl.pop();
                                        }
                                    }]
                                });
                                alert.present();
                            }else{
                                let alert = this.alertController.create({
                                    title: "캐쉬 비밀번호 설정에 실패했습니다.",
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                        },(err)=>{
                            if(err=="NetworkFailure"){
                                let alert = this.alertController.create({
                                    title: "서버와 통신에 문제가 있습니다.",
                                    buttons: ['OK']
                                });
                                alert.present();
                            }else{
                                console.log("createCashId error "+err);
                                let alert = this.alertController.create({
                                    title: "캐쉬 비밀번호 설정에 실패했습니다.",
                                    buttons: ['OK']
                                }); 
                                alert.present();
                            }   
                        });     
                    }   
                });   
  }

      checkExistingCashPassword(){
         return new Promise((resolve, reject) => {
                let body = JSON.stringify({cashId:this.storageProvider.cashId,password:this.cashIdPassword});
                this.serverProvider.post(this.storageProvider.serverAddress+"/checkCashInfo",body).then((res:any)=>{
                    if(res.result=="success"){
                        resolve(res);
                    }else{
                        reject("passwordMismatch");
                    }
                },(err)=>{
                    if(err=="NetworkFailure"){
                        let alert = this.alertController.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                        console.log("createCashId error "+err);
                    }
                    reject(err);
                });    
         });
    }
}
