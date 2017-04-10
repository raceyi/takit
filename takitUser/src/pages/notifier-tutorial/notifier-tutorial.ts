import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the NotifierTutorial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notifier-tutorial',
  templateUrl: 'notifier-tutorial.html'
})
export class NotifierTutorialPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifierTutorialPage');
  }
  
  dismiss(){
     this.navCtrl.pop();
  } 
}
