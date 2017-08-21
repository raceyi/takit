import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,App,Slides } from 'ionic-angular';

/*
  Generated class for the OrderTutorial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-tutorial',
  templateUrl: 'order-tutorial.html'
})
export class OrderTutorialPage {

    @ViewChild(Slides) slides: Slides;

    tutorials = [{img:'assets/order_screen_01.png', title:"주문 접수 알림", 
                  contents:"상점에서 주문을 접수하면 주문 접수 알림이 옵니다. (앱 알림 오류 시에는 문자로 발송됩니다.)"},
                  {img:'assets/order_screen_02.png', title:"상품 준비완료 알림",
                  contents:"상점에서 준비가 완료되면 준비 완료 알림이 옵니다. (앱 알림 오류 시에는 문자로 발송됩니다.)"},
                  {img:'assets/order_screen_03.png', title:"알림 상세 내역",
                  contents:"알림을 클릭하여 주문 상세내역을 확인하세요. 준비완료된 상품은 상점에서 주문 번호 확인 후 가져가시면 됩니다."},
                 {img:'assets/order_screen_04.png', title:"최근 주문 내역", 
                  contents:"나의 타킷 > 최근주문 에서도 주문 상세 내역을 확인하실 수 있습니다."}]
      
      tutorialIdx = 0;

    trigger;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderTutorialPage');
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

  back(){
      this.navCtrl.pop({animate:true,animation: 'slide-up', direction:'back' });
  }
}
