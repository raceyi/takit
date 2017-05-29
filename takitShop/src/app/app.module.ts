import { NgModule,ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {FbProvider} from '../providers/LoginProvider/fb-provider';
import {EmailProvider} from '../providers/LoginProvider/email-provider';
import {KakaoProvider} from '../providers/LoginProvider/kakao-provider';
import {PrinterProvider} from '../providers/printerProvider';
import {StorageProvider} from '../providers/storageProvider';
import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import {ServerProvider} from '../providers/serverProvider';
import {ConfigProvider} from '../providers/configProvider';
import {MediaProvider} from '../providers/mediaProvider';

import { Storage } from '@ionic/storage';
import {LoginPage} from '../pages/login/login';
import {ErrorPage} from '../pages/error/error';
import {PrinterPage} from '../pages/printer/printer';
import {SelectorPage} from '../pages/selector/selector';
import {ShopTablePage} from '../pages/shoptable/shoptable';
import {UserSecretPage} from '../pages/usersecret/usersecret';
import {ServiceInfoPage} from '../pages/serviceinfo/serviceinfo';
import {CashPage} from '../pages/cash/cash';
import {UserInfoPage} from '../pages/userinfo/userinfo';
import {SalesPage} from '../pages/sales-page/sales-page';
import { EditMenuPage } from '../pages/edit-menu-page/edit-menu-page';
import { MenuModalPage} from '../pages/menu-modal-page/menu-modal-page';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { AppAvailability } from '@ionic-native/app-availability';
import {Focuser} from '../components/focuser/focuser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ErrorPage,
    SelectorPage,
    ShopTablePage,
    UserSecretPage,
    PrinterPage,
    ServiceInfoPage,
    CashPage,
    UserInfoPage,
    SalesPage,
    EditMenuPage,
    MenuModalPage,
    Focuser,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{mode:'ios'}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ErrorPage,
    SelectorPage,
    ShopTablePage,
    UserSecretPage,
    PrinterPage,
    ServiceInfoPage,
    CashPage,
    UserInfoPage,
    SalesPage,
    EditMenuPage,
    MenuModalPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    Network, 
    Facebook,
    InAppBrowser,
    Push,
    SplashScreen,
    StatusBar, 
    AppAvailability,
    MediaPlugin,
    FbProvider,
    Camera,
    Transfer,
    File,
    NativeStorage,
    EmailProvider,
    KakaoProvider,
    ConfigProvider,
    StorageProvider,
    PrinterProvider,
    MediaProvider,
    ServerProvider]
})
export class AppModule {}
