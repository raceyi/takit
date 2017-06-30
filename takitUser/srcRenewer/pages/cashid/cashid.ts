import {Component,ViewChild,NgZone} from "@angular/core";
import {AlertController,NavController,App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServerProvider} from '../../providers/serverProvider';
import { DepositCashTutorialPage } from '../deposit-cash-tutorial/deposit-cash-tutorial';
//import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';


//declare var window:any;

@Component({
  selector:'page-cashid',
  templateUrl: 'cashid.html',
})

export class CashIdPage {

    cashId:string="";
    password:string="";
    passwordConfirm:string="";

    cashIdComment=true;
    passwordComment=true;
    passwordMismatch=true;

    public browserRef;

    constructor(private app:App,private navController:NavController,
        private alertController:AlertController,private serverProvider:ServerProvider
        ,public ngZone:NgZone, public storageProvider:StorageProvider){
        console.log("CashIdPage construtor");
        if(storageProvider.cashId.length>0){
            this.cashId=storageProvider.cashId;
        }
    }

    checkValidity(){
        this.cashIdComment=true;
        this.passwordComment=true;
        this.passwordMismatch=true;
        console.log("checkValidity");

        var valid=/[0-9a-zA-Z]{5,7}/.test(this.cashId.trim());

        if(this.cashId.trim().length<5 || this.cashId.trim().length>7 || valid==false){
            console.log("cashId is invalid");
            this.ngZone.run(()=>{
                this.cashIdComment=false;
            });
            return false;
        } 
        valid=/[0-9]{6}/.test(this.password);
        if(this.password.length!=6 || valid==false){
            this.ngZone.run(()=>{
                this.passwordComment=false;
            });
            return false;
        }
        if(this.password!=this.passwordConfirm){
            this.ngZone.run(()=>{
                this.passwordMismatch=false;
            });
            return false;
        }
        return true;
    }

    configureCashId(){
        if(this.storageProvider.cashId.length==0){ // create cashId
            if(this.checkValidity()){
             let body = JSON.stringify({cashId:this.cashId.trim().toUpperCase(),password:this.password});
                console.log("[configureCashId]body:"+body);
                this.serverProvider.post(this.storageProvider.serverAddress+"/createCashId",body).then((res:any)=>{
                    console.log("configureCashId:"+JSON.stringify(res));
                    if(res.result=="success"){
                            this.storageProvider.cashId=this.cashId.trim().toUpperCase();
                            this.storageProvider.cashAmount=0;
                            let alert = this.alertController.create({
                                    title: "캐쉬아이디 만들기에 성공했습니다.",
                                    subTitle:"충전방법 설명으로 이동합니다.",
                                    buttons: [
                                    {
                                        text: 'OK',
                                        handler: () => {
                                            // show cashId and then go back cash UI
                                            //    this.app.getRootNav().pop().then(()=>{
                                            //        this.app.getRootNav().push(TutorialPage);
                                            //    });
                                            this.navController.push(DepositCashTutorialPage).then(()=>{
                                                const index = this.navController.getActive().index;
                                                this.navController.remove(index-1);
                                            });
                                        }
                                    }]
                                });
                            alert.present();
                    }else{ 
                        if(res.hasOwnProperty("error") && res.error=="duplicationCashId"){
                            let alert = this.alertController.create({
                                title: this.cashId.trim().toUpperCase()+"(이)가 이미 존재합니다. 캐쉬아이디를 변경해주시기바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }else{
                            let alert = this.alertController.create({
                                title: "캐쉬아이디 설정에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    }
                },(err)=>{
                    if(err=="NetworkFailure"){
                        let alert = this.alertController.create({
                            title: "서버와 통신에 문제가 있습니다.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }else{
                            let alert = this.alertController.create({
                                title: "캐쉬아이디 설정에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.",
                                buttons: ['OK']
                            });
                            alert.present();
                    }
                });
            }            
        }else{ // change password only... Please check if password changes or not by calling server call.
            this.checkExistingCashPassword().then((res)=>{
                // password is the same as previous one. Just skip it.
                console.log("password doesn't change");
                this.app.getRootNav().pop();
            },(err)=>{
                if(err=="passwordMismatch"){
                    if(this.checkValidity()){
                    let body = JSON.stringify({cashId:this.storageProvider.cashId,password:this.password});
                        console.log("modifyCashPwd");
                        this.serverProvider.post(this.storageProvider.serverAddress+"/modifyCashPwd",body).then((res:any)=>{
                            if(res.result=="success"){
                               let alert = this.alertController.create({
                                    title: "비밀번호 수정에 성공했습니다.",
                                    buttons:[
                                    {
                                        text: 'OK',
                                        handler: () => {
                                            this.app.getRootNav().pop();
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
                }
            });
        }
    }

    checkExistingCashPassword(){
         return new Promise((resolve, reject) => {
                let body = JSON.stringify({cashId:this.storageProvider.cashId,password:this.password});
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






