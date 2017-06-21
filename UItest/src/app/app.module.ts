import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CustomIconsModule } from 'ionic2-custom-icons';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { MyWalletPage } from '../pages/my-wallet/my-wallet';
import { MyTakitPage } from '../pages/my-takit/my-takit';
import {OrderHistoryPage} from '../pages/order-history/order-history';
import { ShopHomePage } from '../pages/shop-home/shop-home';
import { OldOrderPage } from '../pages/old-order/old-order';
import { ShopAboutPage } from '../pages/shop-about/shop-about';
import { OrderPage } from '../pages/order/order';
import { MorePage } from '../pages/more/more';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import { MenuDetailPage } from '../pages/menu-detail/menu-detail';
import { ShopCartPage } from '../pages/shop-cart/shop-cart';
import { OrderCompletePage } from '../pages/order-complete/order-complete';


import {ServerProvider} from '../providers/serverProvider';
import {StorageProvider} from '../providers/storageProvider';
import {ConfigProvider} from '../providers/configProvider';

//import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    MyWalletPage,
    MyTakitPage,
    OrderHistoryPage,
    ShopHomePage,
    OldOrderPage,
    ShopAboutPage,
    OrderPage,
    MorePage,
    TransactionHistoryPage,
    MenuDetailPage,
    ShopCartPage,
    OrderCompletePage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{mode:'ios'}),
    CustomIconsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    MyWalletPage,
    MyTakitPage,
    OrderHistoryPage,
    ShopHomePage,
    OldOrderPage,
    ShopAboutPage,
    OrderPage,
    MorePage,
    TransactionHistoryPage,
    MenuDetailPage,
    ShopCartPage,
    OrderCompletePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
                StorageProvider,
                ConfigProvider,
                ServerProvider
              ]
})
export class AppModule {}

