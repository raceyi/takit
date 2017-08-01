import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'; 
import {ErrorPage} from '../pages/error/error';

import {FbProvider} from '../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../providers/LoginProvider/kakao-provider';
import {StorageProvider} from '../providers/storageProvider';
//import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

import {ServerProvider} from '../providers/serverProvider';

import {ConfigProvider} from '../providers/configProvider';
//import {UserInfoPage} from '../pages/user-info/user-info';
import { CashPage } from '../pages/cash/cash';
import { OrderPage } from '../pages/order/order';
//import { SearchPage } from '../pages/search/search';
import { ShopCartPage } from '../pages/shopcart/shopcart';
import { ShopExitPage } from '../pages/shopexit/shopexit';
import { ShopHomePage } from '../pages/shophome/shophome';
import { ShopMyPage } from '../pages/shopmypage/shopmypage';
import { ShopTabsPage } from '../pages/shoptabs/shoptabs';
import { PasswordPage } from '../pages/password/password';
import {CashConfirmPage} from '../pages/cashconfirm/cashconfirm';
import {CashIdPage} from '../pages/cashid/cashid';
import {BankBranchPage} from '../pages/bankbranch/bankbranch';
import {CashDepositDeletePage} from '../pages/cash-deposit-delete/cash-deposit-delete';
import {MultiloginPage} from '../pages/multilogin/multilogin';
//import {FaqPage} from '../pages/faq/faq';
import {TutorialPage} from '../pages/tutorial/tutorial';
import { ConfigureCashTutorialPage } from '../pages/configure-cash-tutorial/configure-cash-tutorial';
import { DepositCashTutorialPage } from '../pages/deposit-cash-tutorial/deposit-cash-tutorial';
import { OrderTutorialPage } from '../pages/order-tutorial/order-tutorial';
import { NotifierTutorialPage } from '../pages/notifier-tutorial/notifier-tutorial';
import { OrderDonePage } from '../pages/order-done/order-done';
import {CashPassword} from '../pages/cash-password/cash-password';
import {OldOrderPage } from '../pages/old-order/old-order';
import { MyTakitPage } from '../pages/my-takit/my-takit';
import {MyWalletPage} from '../pages/my-wallet/my-wallet';
//import { MorePage } from '../pages/more/more';
import {OrderHistoryPage} from '../pages/order-history/order-history';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import {ShopAboutPage} from '../pages/shop-about/shop-about';
import {MenuDetailPage} from '../pages/menu-detail/menu-detail';
import { OrderCompletePage } from '../pages/order-complete/order-complete';
import { SearchCouponPage } from '../pages/search-coupon/search-coupon';

import {TranslateModule, TranslateLoader,TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {Http,Headers} from '@angular/http';
import {HttpModule} from '@angular/http';


import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { DeviceAccounts } from '@ionic-native/device-accounts';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Sim } from '@ionic-native/sim';
import { AppAvailability } from '@ionic-native/app-availability';
import { Clipboard } from '@ionic-native/clipboard';
import { Keyboard } from '@ionic-native/keyboard';
import { Device } from '@ionic-native/device';
//import { Transfer } from '@ionic-native/transfer';
import { FocuserDirective } from '../directives/focuser/focuser';

import {EmailLoginPageModule} from '../pages/email-login/email-login.module';
import {SignupPaymentPageModule} from '../pages/signup-payment/signup-payment.module';
import {SignupPageModule} from '../pages/signup/signup.module';
import {FaqPageModule} from '../pages/faq/faq.module';
import {PolicyPageModule} from '../pages/policy/policy.module';
import {UserInfoPageModule} from '../pages/user-info/user-info.module';
import {MorePageModule} from '../pages/more/more.module';
import { BackgroundMode } from '@ionic-native/background-mode';
import {CashWithdrawPageModule} from '../pages/cash-withdraw/cash-withdraw.module';
import {CashDepositPage} from '../pages/cash-deposit/cash-deposit';
import {CashConfigurePageModule} from '../pages/cash-configure/cash-configure.module';
import {SearchPageModule} from '../pages/search/search.module';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,    
    ErrorPage,
    //UserInfoPage,
    CashPage,
    OrderPage,
    ShopCartPage,
    ShopExitPage,
    ShopHomePage,
    ShopMyPage,
    ShopTabsPage,
    PasswordPage,
    CashConfirmPage,
    CashIdPage,
    BankBranchPage,
    CashDepositDeletePage,
    MultiloginPage,
    //FaqPage,
    TutorialPage,
    ConfigureCashTutorialPage,
    DepositCashTutorialPage,
    OrderTutorialPage,
    NotifierTutorialPage,
    OrderDonePage,
    CashPassword,
    OldOrderPage,
    MyTakitPage,
    MyWalletPage,
    //MorePage,
    OrderHistoryPage,
    TransactionHistoryPage,
    ShopAboutPage,
    MenuDetailPage,
    OrderCompletePage,
    SearchCouponPage,
    CashDepositPage,
    FocuserDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{mode:'ios'}),
    EmailLoginPageModule,
    SignupPageModule,
    SignupPaymentPageModule,
    PolicyPageModule,
    UserInfoPageModule,
    FaqPageModule,
    MorePageModule,
    CashWithdrawPageModule,
    CashConfigurePageModule,
    SearchPageModule,
    NoopAnimationsModule,
    //IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    ErrorPage,
   // UserInfoPage,
    CashPage,
    OrderPage,
    ShopCartPage,
    ShopExitPage,
    ShopHomePage,
    ShopMyPage,
    ShopTabsPage,
    PasswordPage,
    CashConfirmPage,
    CashIdPage,
    BankBranchPage,
    CashDepositDeletePage,
    MultiloginPage,
    //FaqPage,
    TutorialPage,
    ConfigureCashTutorialPage,
    DepositCashTutorialPage,
    OrderTutorialPage,
    NotifierTutorialPage,
    OrderDonePage,
    CashPassword ,
    OldOrderPage,
    MyTakitPage,
    MyWalletPage,
    //MorePage,
    OrderHistoryPage,
    TransactionHistoryPage,
    ShopAboutPage,
    MenuDetailPage,
    OrderCompletePage,
    SearchCouponPage,
    CashDepositPage
  ],
  
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
              Network, 
              Facebook,
              InAppBrowser,
              Push,
              SplashScreen,
              StatusBar, 
              DeviceAccounts,
              SQLite,
              Sim,
              Clipboard,
              AppAvailability,
              Keyboard,
              Device,
              //Transfer,
              NativeStorage,
              BackgroundMode,
              ConfigProvider,
              StorageProvider,
              FbProvider,
              EmailProvider,
              KakaoProvider,
              ServerProvider
             ]
})

export class AppModule {}

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

