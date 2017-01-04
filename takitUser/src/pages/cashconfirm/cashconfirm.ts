import {Component,NgZone} from "@angular/core";
import {ViewController,NavParams,AlertController} from 'ionic-angular';
import {ServerProvider} from '../../providers/serverProvider';
import {StorageProvider} from '../../providers/storageProvider';

@Component({
  selector: 'page-cashconfirm',
  templateUrl: 'cashconfirm.html',
})

export class CashConfirmPage{

  depositAmount;
  depositBank;
  depositMemo;
  depositDate;
  tuno;
  userAgree=false;
  //enableCheckBox=true;
  
  constructor(params: NavParams,private viewCtrl: ViewController
      ,private alertController:AlertController,public storageProvider:StorageProvider,
      private serverProvider:ServerProvider,private ngZone:NgZone) {
      console.log('CashConfirmPage -constructor custom:'+ params.get('custom'));
      let custom=params.get('custom');
      this.depositAmount=parseInt(custom.amount);
      this.depositBank=custom.bankName;
      this.depositMemo=custom.cashId;
      var date:string=custom.transactionTime;
      console.log("date:"+date);
      this.depositDate=date.substr(0,4)+"."+date.substring(4,2)+"."+date.substr(6,2);     
      this.tuno=custom.cashTuno;
  }

  ionViewDidEnter(){
      console.log("ionicViewDidEnter");
      this.ngZone.run(()=>{
        //  this.enableCheckBox=false;
      });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  agreeChange(flag){
    console.log("[agreeChange] userAgree:"+flag);
    this.ngZone.run(()=>{
        this.userAgree=flag;
    });
  }

  cashInComplete(){
      if(this.userAgree){
          let body = JSON.stringify({cashId:this.depositMemo, amount:this.depositAmount, cashTuno:this.tuno});
          console.log("cashInComplete:"+body);
          this.serverProvider.post(this.storageProvider.serverAddress+"/addCash",body).then((res:any)=>{
                    console.log("addCash:"+JSON.stringify(res));
                    if(res.result=="success"){
                              let body = JSON.stringify({cashId:this.storageProvider.cashId});
                              console.log("getBalanceCash "+body);
                              this.serverProvider.post(this.storageProvider.serverAddress+"/getBalanceCash",body).then((res:any)=>{
                                  console.log("getBalanceCash res:"+JSON.stringify(res));
                                  if(res.result=="success"){
                                      this.storageProvider.cashAmount=res.balance;
                                  }else{
                                      let alert = this.alertController.create({
                                          title: "캐쉬정보를 가져오지 못했습니다.",
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
                                              console.log("Hum...getBalanceCash-HttpError");
                                          } 
                              });

                         this.viewCtrl.dismiss();
                    }else{ 
                          if(res.error=="already checked cash"){
                              let alert = this.alertController.create({
                                  title: "이미 확인된 입금입니다.",
                                  buttons: ['OK']
                              });
                              alert.present();
                          }else{
                            let alert = this.alertController.create({
                                title: "캐쉬입금에 실패했습니다. 전체내역에서 입금 확인이 가능합니다.",
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
      }else{
            let alert = this.alertController.create({
                title: "법적 경고 사항에 동의해 주시기 바랍니다.",
                buttons: ['OK']
            });
            alert.present();
      }
  }
}



