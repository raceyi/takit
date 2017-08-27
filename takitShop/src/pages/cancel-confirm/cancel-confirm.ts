import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CancelConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cancel-confirm',
  templateUrl: 'cancel-confirm.html',
})
export class CancelConfirmPage {
  reason:string;
  reasonType:string;
  callback;
  order;

  constructor(public navCtrl: NavController, 
        private alertController:AlertController,
        public navParams: NavParams) {
    this.callback = this.navParams.get("callback");            
    this.order = this.navParams.get("order"); 
    console.log("order:"+JSON.stringify(this.order));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelConfirmPage');
  }

  changeReasonType(reasonType){
    this.reasonType=reasonType;
  }

  cancelOrder(){
    console.log("cancelOrder");
    if(!this.reasonType){
            let alert = this.alertController.create({
                title: '취소사유를 선택해주세요.',
                buttons: ['OK']
            });
            alert.present()
            return;
    }
    if(this.reasonType=='기타-상세입력' && !this.reason){
            let alert = this.alertController.create({
                title: '상세한 취소 사유를 입력해주세요.',
                buttons: ['OK']
            });
            alert.present()
            return;
    }
    let reason:string;
    if(this.reasonType=='기타-상세입력')
        reason=this.reason;
    else
        reason=this.reasonType;    
    this.callback(this.order, reason).then(()=>{
        this.navCtrl.pop();
    },(err)=>{
        let alert = this.alertController.create({
                title: '주문취소에 실패했습니다.',
                buttons: ['OK']
            });
            alert.present()
            return;
    });
    
  }

  back(){
    console.log("back");
    this.navCtrl.pop();
  }

}
