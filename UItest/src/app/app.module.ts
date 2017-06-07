import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MenuPage } from '../pages/menu/menu';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { MyWalletPage } from '../pages/my-wallet/my-wallet';
import { MyTakitPage } from '../pages/my-takit/my-takit';
import {OrderHistoryPage} from '../pages/order-history/order-history';
import { ShopHomePage } from '../pages/shop-home/shop-home';
import { OldOrderPage } from '../pages/old-order/old-order';
import { ShopAboutPage } from '../pages/shop-about/shop-about';



import {ServerProvider} from '../providers/serverProvider';
import {StorageProvider} from '../providers/storageProvider';
import {ConfigProvider} from '../providers/configProvider';

import {Http,Headers} from '@angular/http';
//import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    MenuPage,
    TabsPage,
    HomePage,
    MyWalletPage,
    MyTakitPage,
    OrderHistoryPage,
    ShopHomePage,
    OldOrderPage,
    ShopAboutPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    TabsPage,
    HomePage,
    MyWalletPage,
    MyTakitPage,
    OrderHistoryPage,
    ShopHomePage,
    OldOrderPage,
    ShopAboutPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
                StorageProvider,
                ConfigProvider,
                ServerProvider
              ]
})
export class AppModule {}
