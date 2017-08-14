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

    tutorials = [{img:'assets/order_screen_01.png', title:"주문기록 확인하기", 
                    contents:"나의 타킷 페이지 > 최근주문 에서 내 주문 기록을 확인 하고, 각 주문내역에서 주문 진행상황을 볼 수 있습니다."},
    {img:'assets/order_screen_02.png', title:"주문 진행 확인",
      contents:"주문 접수 진행 상황을 확인하고, 준비 완료 후 알람으로 알려줍니다."}]
      
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
