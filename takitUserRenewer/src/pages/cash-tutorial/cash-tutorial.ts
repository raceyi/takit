import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App,Slides } from 'ionic-angular';
import {LoginPage} from '../login/login';

/**
 * Generated class for the CashTutorialPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cash-tutorial',
  templateUrl: 'cash-tutorial.html',
})
export class CashTutorialPage {
    @ViewChild(Slides) slides: Slides;

    tutorials = [{img:'assets/cash_screen_01.png', title:"온라인 계좌이체", 
                    contents:"온라인 계좌이체시 고객님의 캐쉬아이디를 입력해주세요. 대소문자를 구분하지 않습니다. 1회 10만원 이하의 금액만 충전가능합니다."},
    {img:'assets/cash_screen_02.png', title:"입금 확인 / 충전완료",
      contents:"계좌이체 후 15초 내로 입금 확인 알림이 옵니다. 알림을 클릭하여 법적 고지에 동의 하시면 충전이 완료됩니다. (단 매일 00:00~00:30, 매월 3주 월요일 23:55~04:00 에는 이용제한시간 이후 메시지가 전달됩니다.)"},
    {img:'assets/cash_screen_04.png', title:"거래 내역 조회 > 캐쉬 충전 확인",
      contents:"입금 확인 알림은 네트워크 상황에 따라 전달되지 않을 수 있습니다. 내 지갑 > 거래 내역 모두 조회에서 '캐쉬 충전 확인' 버튼을 클릭하여 충전을 완료할 수 있습니다."},
    {img:'assets/cash_screen_03.png',title:"입금 수동 확인",
      contents:"내 지갑 > 충전 > 캐쉬아이디를 입력을 잊으셨나요? 를 클릭 후 이체 정보를 채워주세요. 받는 통장 표시내용은 본인의 실명입니다."}];
    tutorialIdx = 0;

    trigger;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public app:App) {
                if(navParams.get('trigger')){
                    this.trigger = navParams.get('trigger');
                }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashTutorialPage');
  }

  slideTap(){
      this.slides.slideNext();
      this.tutorialIdx=this.slides.getActiveIndex();
        console.log(this.tutorialIdx);
  }

  slideChanged(){
      this.tutorialIdx=this.slides.getActiveIndex();
      console.log("eventChanged:"+this.tutorialIdx);
      if(this.tutorialIdx===this.tutorials.length-1){
          this.slides.lockSwipeToNext(true);
          this.slides.lockSwipeToPrev(false);
      }else if(this.tutorialIdx === 0){
          this.slides.lockSwipeToPrev(true);
          this.slides.lockSwipeToNext(false);
      }else{
          this.slides.lockSwipeToNext(false);
          this.slides.lockSwipeToPrev(false);
      }
      
  }

  enterLoginPage(){
      if(!this.trigger){
        this.app.getRootNav().setRoot(LoginPage);
      }else if(this.trigger){
          console.log(this.trigger);
        this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
      }
  }

}
