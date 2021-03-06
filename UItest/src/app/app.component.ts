import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import {SlideUpTransition} from '../classes/slide-up-transition';
import { Config } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(public config: Config,platform: Platform) {
  this.config.setTransition('slide-up', SlideUpTransition);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //splashScreen.hide();
    });
  }
}
