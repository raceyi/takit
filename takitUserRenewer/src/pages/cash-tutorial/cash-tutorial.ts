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
                    contents:"온라인 계좌이체시 고객님의 캐쉬아이디를 입력해주세요. 대소문자를 구분하지 않습니다. 1회 10만원 이하의 금액만 충전가능합니다.",selected:true},
    {img:'assets/cash_screen_02.png', title:"입금확인 > 충전완료",
      contents:"확인창의 법적 고지에 동의버튼을 클릭하시면 입금하신 금액만큼 캐쉬가 충전 됩니다.",selected:false},
    {img:'assets/cash_screen_03.png',title:"입금 수동 확인",
      contents:"캐쉬아이디 입력을 잊으셨나요? \n 캐쉬 충전의 하단 메세지를 클릭 후 이체 정보를 채워주세요. 받는 통장 표시내용은 본인의 실명입니다.",selected:false}];
    tutorialIdx = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                public app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashTutorialPage');
  }

  slideTap(){
      this.slides.slideNext();
      this.tutorialIdx=this.slides.getActiveIndex();
      if(this.tutorialIdx <= this.tutorials.length-1){
        for(let j=0; j<this.tutorials.length; j++){
            this.tutorials[j].selected = false;
        }
        this.tutorials[this.tutorialIdx].selected =true;
      }else{
          return;
      }
        console.log(this.tutorialIdx);
  }

  slideChanged(){
      this.tutorialIdx=this.slides.getActiveIndex();
      console.log("eventChanged:"+this.tutorialIdx);
      if(this.tutorialIdx <= this.tutorials.length-1){
        for(let j=0; j<this.tutorials.length; j++){
            this.tutorials[j].selected = false;
        }
        this.tutorials[this.tutorialIdx].selected =true;
      }else{
          return;
      }
  }

  enterLoginPage(){
      this.app.getRootNav().setRoot(LoginPage);
  }

}