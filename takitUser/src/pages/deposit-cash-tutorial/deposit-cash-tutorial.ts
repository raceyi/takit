import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storageProvider';
/*
  Generated class for the DepositCashTutorial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-deposit-cash-tutorial',
  templateUrl: 'deposit-cash-tutorial.html'
})

export class DepositCashTutorialPage {
  cashId:string;

  slidesContent = [
    {
      title: "캐쉬 입금 메시지 수신",
      description: "30초내로 <b>메시지</b>가 고객님께 전달됩니다.<br>메시지를 클릭해주세요.<br><br>단 00:00~00:30 ,매달 3주 월요일 23:55~04:00에는 이용제한시간 이후 메시지가 전달됩니다.",
      image: "assets/cash/pushMsg.jpg",
    },
    {
      title: "입금 확인/충전완료",
      description: "메시지를 클릭하시면 확인 화면이 나옵니다.<br>법적고지에 <b>동의</b>하시고 <b>하단 버튼을 클릭</b>하시면 입금하신 금액만큼 캐쉬가 <b>충전</b>됩니다.",
      image: "assets/cash/notification.jpg",
    },
    {
      title: "수동확인하기",
      description: "캐쉬아이디입력을 잊으셨나요? <br>캐쉬의 충전하기 화면 하단 버튼을 클릭후 이체정보를 채워주세요. 받는 통장 표시내용은 본인의 실명입니다.",
      image: "assets/cash/manual.png",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,public storageProvider:StorageProvider) {
      if(storageProvider.tourMode){
        this.cashId="캐쉬아이디";
      }else if(storageProvider.cashId!=undefined && storageProvider.cashId.length>=5){
        this.cashId=storageProvider.cashId;
      }else{
        this.cashId="캐쉬아이디";
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepositCashTutorialPage');
  }

  dismiss(){
    this.navCtrl.pop();
  }
}
