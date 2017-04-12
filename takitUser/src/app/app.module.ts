import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'; 
import {ErrorPage} from '../pages/error/error';

import {FbProvider} from '../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../providers/LoginProvider/kakao-provider';
import {StorageProvider} from '../providers/storageProvider';
import { IonicStorageModule } from '@ionic/storage';

import {ServerProvider} from '../providers/serverProvider';

import {ConfigProvider} from '../providers/configProvider';
import {SignupPage} from '../pages/signup/signup';
import {SignupSubmitPage} from '../pages/signup_submit/signup_submit';
import {ServiceInfoPage} from '../pages/serviceinfo/serviceinfo';
import {UserInfoPage} from '../pages/userinfo/userinfo';
import { CashPage } from '../pages/cash/cash';
import { OrderPage } from '../pages/order/order';
import { SearchPage } from '../pages/search/search';
import { ShopCartPage } from '../pages/shopcart/shopcart';
import { ShopExitPage } from '../pages/shopexit/shopexit';
import { ShopHomePage } from '../pages/shophome/shophome';
import { ShopMyPage } from '../pages/shopmypage/shopmypage';
import { ShopTabsPage } from '../pages/shoptabs/shoptabs';
import { PasswordPage } from '../pages/password/password';
import {CashConfirmPage} from '../pages/cashconfirm/cashconfirm';
import {CashIdPage} from '../pages/cashid/cashid';
import {BankBranchPage} from '../pages/bankbranch/bankbranch';
import {IOSAlertPage} from '../pages/ios-alert/ios-alert';
import {CashDepositDeletePage} from '../pages/cash-deposit-delete/cash-deposit-delete';
import {MultiloginPage} from '../pages/multilogin/multilogin';
import {FaqPage} from '../pages/faq/faq';
import {TutorialPage} from '../pages/tutorial/tutorial';
import { ConfigureCashTutorialPage } from '../pages/configure-cash-tutorial/configure-cash-tutorial';
import { DepositCashTutorialPage } from '../pages/deposit-cash-tutorial/deposit-cash-tutorial';
import { OrderTutorialPage } from '../pages/order-tutorial/order-tutorial';
import { NotifierTutorialPage } from '../pages/notifier-tutorial/notifier-tutorial';

import {TranslateModule, TranslateLoader,TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {Http,Headers} from '@angular/http';

import {Focuser} from '../components/focuser/focuser';

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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,    
    ErrorPage,
    SignupPage,
    SignupSubmitPage,
    ServiceInfoPage,
    UserInfoPage,
    CashPage,
    OrderPage,
    SearchPage,
    ShopCartPage,
    ShopExitPage,
    ShopHomePage,
    ShopMyPage,
    ShopTabsPage,
    PasswordPage,
    Focuser,
    CashConfirmPage,
    CashIdPage,
    BankBranchPage,
    IOSAlertPage,
    CashDepositDeletePage,
    MultiloginPage,
    FaqPage,
    TutorialPage,
    ConfigureCashTutorialPage,
    DepositCashTutorialPage,
    OrderTutorialPage,
    NotifierTutorialPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
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
    SignupPage,
    SignupSubmitPage,
    ServiceInfoPage,
    UserInfoPage,
    CashPage,
    OrderPage,
    SearchPage,
    ShopCartPage,
    ShopExitPage,
    ShopHomePage,
    ShopMyPage,
    ShopTabsPage,
    PasswordPage,
    CashConfirmPage,
    CashIdPage,
    BankBranchPage,
    IOSAlertPage,
    CashDepositDeletePage,
    MultiloginPage,
    FaqPage,
    TutorialPage,
    ConfigureCashTutorialPage,
    DepositCashTutorialPage,
    OrderTutorialPage,
    NotifierTutorialPage  
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
