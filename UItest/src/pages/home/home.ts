import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    public awsS3:string="https://s3.ap-northeast-2.amazonaws.com/seerid.cafe.image/";
    items=[{"takitId":"세종대@더큰도시락","name":"더큰도시락","visit":"1일 전 방문","img":"세종대@더큰도시락_main"},
            {"takitId":"ORDER@GAROSU","name":"가로수그늘아래","visit":"2일 전 방문","img":"ORDER@GAROSU_main"},
            {"takitId":"세종대@HandelandGretel","name":"헨델과그레텔","visit":"2일 전 방문","img":"세종대@HandelandGretel_main"},
            {"takitId":"세종대@Pandorothy","name":"Pandorothy","visit":"7일 전 방문","img":"세종대@Pandorothy_main"}];
    


  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
