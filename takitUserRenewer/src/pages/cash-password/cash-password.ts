import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController, App} from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
import {ServerProvider} from '../../providers/serverProvider';
import { OrderCompletePage } from '../order-complete/order-complete';

/**
 * Generated class for the CashPassword page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cash-password',
  templateUrl: 'cash-password.html',
})

export class CashPassword {
  passwordInput=[' ',' ',' ',' ',' ',' '];
  password=[' ',' ',' ',' ',' ',' '];
  cursor:number=0;
  body;
  trigger;
  confirmInProgress=false;
  title:string;
  callback;
//  order:boolean=false;

  constructor(private app:App,public navCtrl: NavController,  
              public navParams: NavParams,public storageProvider:StorageProvider,
              private serverProvider:ServerProvider,private alertController:AlertController) {

    this.body=navParams.get("body");
    this.trigger=navParams.get("trigger");

    this.callback = this.navParams.get("callback");                
    this.title=navParams.get("title");

    console.log("body:"+JSON.stringify(this.body));
  }

 buttonPressed(val:number){
        console.log("cursor:"+this.cursor+" val:"+val);
        if(val==-1 ){
            console.log("val is -1");
            this.cursor = (this.cursor>=1) ? (this.cursor-1 ): this.cursor;
            this.password[this.cursor]=' ';
            this.passwordInput[this.cursor]=' ';
        }else if(val==-10){
            console.log("val is -10");
            for(var i=0;i<6;i++){
                this.password[i]=' ';
                this.passwordInput[i]=' ';
            }
            this.cursor = 0;
        }else if(this.cursor<6){
            if(this.cursor!=0){
              this.password[this.cursor-1]='*';
            }
            if(this.cursor==5){
                this.passwordInput[this.cursor]=val.toString();  
                this.password[this.cursor++]='*';
            }else{
                this.passwordInput[this.cursor]=val.toString();  
                this.password[this.cursor++]=val.toString();
            }
            console.log("this.password:"+this.password);
        }
  }

  cancel(){
    console.log("cancel");
    this.navCtrl.pop();
  }

  confirm(){
    console.log("confirm");
    if(this.callback){
        for(let i=0;i<6;i++){
            if(this.passwordInput[i]==' '){
                let alert = this.alertController.create({
                        title: '비밀번호 6자리를 입력해주시기바랍니다.',
                        buttons: ['OK']
                    });
                    alert.present();
                    this.confirmInProgress=false;
                    return;        
            }
        }
        var cashPassword="";
        cashPassword=cashPassword.concat(this.passwordInput[0],this.passwordInput[1],this.passwordInput[2],
                    this.passwordInput[3],this.passwordInput[4],this.passwordInput[5]);
        this.callback(cashPassword).then(()=>{
            this.navCtrl.pop();
        });
        return;
    }else{
        if(!this.confirmInProgress){
            this.confirmInProgress=true;

            for(let i=0;i<6;i++){
                if(this.passwordInput[i]==' '){
                    let alert = this.alertController.create({
                            title: '비밀번호를 입력해주시기바랍니다.',
                            buttons: ['OK']
                        });
                        alert.present();
                        this.confirmInProgress=false;
                        return;        
                }
            }
            var cashPassword="";
            cashPassword=cashPassword.concat(this.passwordInput[0],this.passwordInput[1],this.passwordInput[2],
                                this.passwordInput[3],this.passwordInput[4],this.passwordInput[5]);

            console.log("passwordInput:");
            for(let i=0;i<6;i++){
                console.log(this.passwordInput[i]);
            }

            this.body.password=cashPassword;
            console.log("body:"+JSON.stringify(this.body));
            this.serverProvider.saveOrder(JSON.stringify(this.body)).then((res:any)=>{    
                        console.log(JSON.stringify(res)); 
                        let result:string=res.result;
                        if(result=="success"){
                            if(this.trigger=="cart"){
                                    let cart={menus:[],total:0};
                                    this.storageProvider.saveCartInfo(this.storageProvider.takitId,JSON.stringify(cart)).then(()=>{
                                        
                                    },()=>{
                                            //move into shophome
                                            let alert = this.alertController.create({
                                                    title: '장바구니 정보 업데이트에 실패했습니다',
                                                    buttons: ['OK']
                                                });
                                                alert.present();
                                    });
                            }
                            this.storageProvider.order_in_progress_24hours=true;
                            this.storageProvider.messageEmitter.emit(res.order);
                            console.log("storageProvider.run_in_background: "+this.storageProvider.run_in_background);
                            //this.storageProvider.cashInfoUpdateEmitter.emit("all");
                            this.storageProvider.cashInfoUpdateEmitter.emit("cashupdate");
                            this.storageProvider.cashInfoUpdateEmitter.emit("cashAmountUpdate");
                            if(this.storageProvider.run_in_background==false){
                                //refresh cashAmount
                                let confirm = this.alertController.create({
                                    title: '주문완료['+res.order.orderNO+']'+' 앱을 계속 실행하여 주문알림을 받으시겠습니까?',
                                    message: '앱이 중지되면 주문알림을 못받을수 있습니다.',
                                    buttons: [
                                    {
                                        text: '아니오',
                                        handler: () => {
                                            console.log('Disagree clicked');
                                            // report it to tabs page
                                            this.storageProvider.tabMessageEmitter.emit("stopEnsureNoti"); 
                                            this.navCtrl.push(OrderCompletePage,{order:res.order,trigger:"order"});
                                            //this.app.getRootNav().pop();
                                            // if(this.trigger=="order"){
                                            //     this.app.getRootNav().pop();
                                            // }
                                            //this.storageProvider.shopTabRef.select(3);
                                            this.confirmInProgress=false;    
                                            return;
                                        }
                                    },
                                    {
                                        text: '네',
                                        handler: () => {
                                            this.storageProvider.tabMessageEmitter.emit("wakeupNoti");
                                            //this.navCtrl.pop();
                                            //this.app.getRootNav().pop();
                                            // if(this.trigger=="order"){
                                            //     this.app.getRootNav().pop();
                                            // }
                                             this.navCtrl.push(OrderCompletePage,{order:res.order,trigger:"order"});
                                            //this.storageProvider.shopTabRef.select(3);
                                            this.confirmInProgress=false;
                                            return;
                                        }
                                    }
                                    ]
                                });
                                confirm.present();
                            }else{
                                console.log("give alert on order success");
                                let alert = this.alertController.create({
                                        title: '주문에 성공하였습니다.'+'주문번호['+res.order.orderNO+']',
                                        subTitle: '[주의]앱을 종료하시면 주문알림을 못받을수 있습니다.' ,
                                        buttons: ['OK']
                                });
                                alert.present().then(()=>{
                                    this.navCtrl.push(OrderCompletePage,{order:res.order,trigger:"order"});
                                    //this.app.getRootNav().pop();
                                    // if(this.trigger=="order"){
                                    //     this.app.getRootNav().pop();
                                    //     this.confirmInProgress=false;
                                    // }
                                    //this.storageProvider.shopTabRef.select(3);
                                    this.confirmInProgress=false;
                                });  
                            }
                            
                        }else{
                            let alert = this.alertController.create({
                                title: '주문에 실패하였습니다.',
                                subTitle: '다시 주문해주시기 바랍니다.',
                                buttons: ['OK']

                            });
                            alert.present();
                            this.navCtrl.pop();
                            //this.app.getRootNav().pop();
                            this.confirmInProgress=false;
                        }
                },(error)=>{
                        console.log("saveOrder err "+error);
                        if(error=="NetworkFailure"){
                            let alert = this.alertController.create({
                                    title: '서버와 통신에 문제가 있습니다',
                                    subTitle: '네트웍상태를 확인해 주시기바랍니다',
                                    buttons: ['OK']
                                });
                                alert.present();
                        }else if(error=="shop's off"){
                            let alert = this.alertController.create({
                                    title: '상점이 문을 열지 않았습니다.',
                                    buttons: ['OK']
                                });
                                alert.present();
                        }else if(error=="invalid cash password"){
                            let alert = this.alertController.create({
                                    title: '비밀번호가 일치하지 않습니다.',
                                    buttons: ['OK']
                                });
                                alert.present();
                        }else{
                            let alert = this.alertController.create({
                                    title: '주문에 실패했습니다.',
                                    buttons: ['OK']
                                });
                                alert.present();                     
                        }
                        this.navCtrl.pop();
                        this.confirmInProgress=false;
                })      
            }
    }
  }

  back(){
      this.navCtrl.pop();
  }  
}