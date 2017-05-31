import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { MenuPage } from '../pages/menu/menu';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';


//import {ServerProvider} from '../providers/serverProvider';
//import {StorageProvider} from '../providers/storageProvider';
//import {ConfigProvider} from '../providers/configProvider';

import {Http,Headers} from '@angular/http';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    MenuPage,
    TabsPage,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    MenuPage,
    TabsPage,
    HomePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}
              ]
})
export class AppModule {}
