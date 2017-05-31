
//import {StorageProvider} from '../../providers/storageProvider';
//import {ServerProvider} from '../../providers/serverProvider';

import { Component, ViewChild } from '@angular/core';

import { NavController ,Toolbar, Footer, Navbar, Searchbar} from 'ionic-angular';

import {Platform} from 'ionic-angular';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import { enableProdMode } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
    


  constructor(public navCtrl: NavController, private http:Http, public actionSheetCtrl: ActionSheetController) {
  }



  ionViewDidEnter(){

    
  }

}
