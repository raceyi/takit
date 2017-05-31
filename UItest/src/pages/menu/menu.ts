import { Component,ViewChild } from '@angular/core';

import { NavController, AlertController, Content} from 'ionic-angular';
import { ModalController, ViewController, NavParams } from 'ionic-angular';

import {Http,Headers} from '@angular/http';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  
  constructor(public navCtrl: NavController,private alertController:AlertController,
              public modalCtrl: ModalController,
              private http:Http) {
                console.log("addMenu page"); 
  }

  ionViewDidEnter(){ // Be careful that it should be DidEnter 
  }


}

