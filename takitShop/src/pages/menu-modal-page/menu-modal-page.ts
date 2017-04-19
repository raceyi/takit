import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the MenuMoalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-modal-page',
  templateUrl: 'menu-modal-page.html',
})
export class MenuModalPage {

    menu;
    options;
    optionsEn;
    addFlag=false;


  constructor(public params:NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
      console.log(params.get('menu'));
      this.menu=params.get('menu');
      //this.options=JSON.parse(this.menu.options)[0];
      //this.optionsEn=JSON.parse(this.menu.optionsEn)[0];

      if(this.menu === []){
        console.log("menu add modal");
        this.addFlag=true;
      }
  }
  
  modifyMenuInfo(){

  }

  addMenuInfo(){

  }

  addOption(){
      
  }

  close() {
        let data = { 'result': 'close' };
        this.viewCtrl.dismiss(data);
  }

}
