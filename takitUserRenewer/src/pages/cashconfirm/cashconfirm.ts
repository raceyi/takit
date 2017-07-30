import {Component,NgZone} from "@angular/core";
import {ViewController,NavParams,NavController,AlertController,App} from 'ionic-angular';
import {ServerProvider} from '../../providers/serverProvider';
import {StorageProvider} from '../../providers/storageProvider';
import {CashDepositDeletePage} from '../cash-deposit-delete/cash-deposit-delete';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-cashconfirm',
  templateUrl: 'cashconfirm.html',
})

export class CashConfirmPage{

  agreementShown:boolean=false;

  depositAmount;
  depositBank;
  depositMemo;
  depositDate;
  depositHour;

  tuno;
  customStr;

  inProgress=false;

  constructor(params: NavParams,public viewCtrl: ViewController
      ,private alertController:AlertController,public storageProvider:StorageProvider,
      private serverProvider:ServerProvider,private ngZone:NgZone,
      private navController: NavController,public app:App,
      public events: Events) {
      console.log('CashConfirmPage -constructor custom:'+ JSON.stringify(params.get('custom')));
      let custom=params.get('custom');
      this.customStr=JSON.stringify(custom); 

      this.depositAmount=parseInt(custom.amount);
      console.log("depositAmount:"+this.depositAmount);

      this.depositBank=custom.bankName;
      console.log("depositBank:"+this.depositBank);

      if(custom.hasOwnProperty("depositMemo")){
            this.depositMemo=custom.depositMemo;
      }else{
            this.depositMemo=custom.cashId;
      }

      console.log("depositBank:"+this.depositMemo);

      if(custom.hasOwnProperty("depositDate")){
            this.depositDate=custom.depositDate.substr(0,4)+"."+custom.depositDate.substr(5,2)+"."+custom.depositDate.substr(8,2);
            if(custom.hasOwnProperty("depositHour")){
                this.depositHour=custom.depositHour;        
            }               
      }

      console.log("depositDate:"+this.depositDate);
      this.tuno=custom.cashTuno;
      
      console.log("tuno:"+this.tuno);

      this.storageProvider.cashAddInProgress(this.customStr,viewCtrl);  

      //this.events.publish("cash:confirm"); 
      /*   
      for(var i=0;i<this.storageProvider.alertViewCtrls.length;i++)
      {
            console.log("remove alertView");
            this.navController.removeView(this.storageProvider.alertViewCtrls[i]);
      }  
      this.storageProvider.alertViewCtrls=[];
      */
  }

  dismiss() {
    this.removeDuplicate();
    this.viewCtrl.dismiss();
    this.storageProvider.cashInfoUpdateEmitter.emit("cashupdate");
  }

  confirmDismiss(){
    this.removeDuplicate();
     this.viewCtrl.dismiss();
  }

  cashInComplete(){
      if(!this.inProgress){
          this.inProgress=true;
          let body = JSON.stringify({cashId:this.storageProvider.cashId, amount:this.depositAmount, cashTuno:this.tuno});          
          console.log("cashInComplete:"+body);
          this.serverProvider.post(this.storageProvider.serverAddress+"/addCash",body).then((res:any)=>{
                    console.log("addCash:"+JSON.stringify(res));
                    if(res.result=="success"){
                      this.storageProvider.cashInfoUpdateEmitter.emit("cashupdate");
                      this.removeDuplicate();
                      this.viewCtrl.dismiss();
                    }else{ 
                          if(res.error=="already checked cash"){
                              let alert = this.alertController.create({
                                  title: "이미 확인된 입금입니다.",
                                  buttons: [
                                      {
                                          text:'OK',
                                          handler:()=>{
                                                console.log("이미 확인된 입금입니다.");
                                                this.removeDuplicate();
                                                this.viewCtrl.dismiss(); 
                                          }
                                       }]
                              });
                              alert.present();
                          }else{
                            let alert = this.alertController.create({
                                title: "캐쉬입금에 실패했습니다. 전체내역에서 입금 확인이 가능합니다.",
                                buttons: [
                                      {
                                          text:'OK',
                                          handler:()=>{
                                                this.removeDuplicate();
                                                this.viewCtrl.dismiss(); 
                                          }
                                       }]
                            });
                            alert.present();
                          }
                    }
                    this.inProgress=false;
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
                    this.inProgress=false;
          });         
      }else{
            let alert = this.alertController.create({
                title: "서버에 충전확인 요청 중입니다.",
                buttons: ['OK']
            });
            alert.present();
      }
  }

  deleteDeposit(){
       var param:any={tuno:this.tuno,
                        depositAmount:this.depositAmount,
                        depositBank:this.depositBank,
                        depositMemo:this.depositMemo,
                        depositDate:this.depositDate,
                        depositHour:this.depositHour};
       this.removeDuplicate();      
       this.viewCtrl.dismiss();
       this.app.getRootNav().push(CashDepositDeletePage,param);
  }

  removeDuplicate(){
       this.storageProvider.cashRemoveInProgress(this.customStr,this.viewCtrl);
       //hum... just remove one? yes. Workaround code 
       for(var i=0;i<this.storageProvider.cashInProgress.length;i++){
            console.log("removeDuplicate "+i);
            if(this.storageProvider.cashInProgress[i].cashStr==this.customStr){
                //console.log("0.removeView-hum..."+this.app.getRootNav().getViews().length);
                //console.log("1.removeView-hum..."+this.navController.getViews().length);
                //console.log("removeView "+this.customStr);
                this.navController.removeView(this.storageProvider.cashInProgress[i].viewController);
                this.storageProvider.cashInProgress.splice(i,1);
                 console.log("call splice with "+i);
                break;                                            
           }
       }
  }

  deposit(){
        console.log("deposit...");
        this.ngZone.run(()=>{
            this.agreementShown=true;
        });
  }

}



