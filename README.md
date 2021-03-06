# takit
Takit App source based on ionic2 and Server source based on node

License: GPL
  참조 코드로 공개합니다.

  특허 요소가 있는 일부 기능은 GPL로도 사용불가합니다.

  타킷주식회사가 출원중인 "은행계좌의 거래내역API를 활용한 전자지급수단의 충전 시스템 및 방법"은 
 
  소액결제의 온라인 전용 상점에서 사용가능합니다.(오프라인 상점에서 사용불가)  

  (전자선불업자 요건을 갖추거나 예외규정적용이 가능한 업체에서 사용가능)

 !!!구글플레이스토어와 애플앱스토어에서 타킷을 다운받으시면됩니다.!!!
 
# takitUser

 $ionic start takitUser --type=ionic-angular

 $cd takitUser
  => config.xml의 id,name 수정 
     splash 관련 사항 추가

    <widget id="biz.takitApp.user" ...>
    <name>타킷</name>
    ...
    <preference name="AutoHideSplashScreen" value="false" />
    <preference name="orientation" value="portrait" />

 $ionic cordova platform add android@latest

 $ionic cordova platform add ios@latest

 $ git checkout takitUser/resources/icon.png 

 $ git checkout takitUser/resources/splash.png

 $ionic cordova resources

  처음 실행시 ionic email, password 입력

 $npm install --save @ionic-native/core@latest 

 $npm install --save @ionic-native/status-bar@latest 

 $npm install --save @ionic-native/splash-screen@latest

 $ionic cordova plugin add https://github.com/taejaehan/cordova-kakaotalk.git --variable KAKAO_APP_KEY={takitUser.kakao.appId}

  =>takitUser/platforms/android/cordova-plugin-htj-kakaotalk/user-kakao.gradle 파일에 sdk version수정

   현재 SDK버전: com.kakao.sdk:kakaotalk:1.4.1

 $ionic cordova plugin add cordova-device-accounts

 $npm install --save @ionic-native/device-accounts

 $ionic cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="{takitUser.facebook.appId}" --variable APP_NAME="takitUser"

 $npm install --save @ionic-native/facebook

 $ionic cordova plugin add cordova-plugin-network-information

 $npm install --save @ionic-native/network
 
 $ionic cordova plugin add phonegap-plugin-push@1.10.5 --variable SENDER_ID={takitUser.fcm.senderId}

 $npm install --save @ionic-native/push

 $ionic cordova plugin add cordova-sqlite-storage

 $npm install --save @ionic-native/sqlite

 $ionic cordova plugin add https://github.com/46cl/cordova-android-focus-plugin

 $ionic cordova plugin add cordova-plugin-sim

 $npm install --save @ionic-native/sim

 $ionic cordova plugin add cordova-plugin-inappbrowser

 $npm install --save @ionic-native/in-app-browser

 $ionic cordova plugin add cordova-plugin-appavailability

 $npm install --save @ionic-native/app-availability

 $ionic cordova plugin add https://github.com/katzer/cordova-plugin-background-mode.git#0.6.5

 $ npm install --save @ionic-native/background-mode

 $ ionic cordova plugin add danielsogl-cordova-plugin-clipboard

 $npm install --save @ionic-native/clipboard

 $ionic cordova plugin add cordova-plugin-nativestorage

 $npm install --save @ionic-native/native-storage 

 $ ionic cordova plugin add cordova-plugin-device
 
 $ npm install --save @ionic-native/device

 $ ionic cordova plugin add ionic-plugin-keyboard

 $ npm install --save @ionic-native/keyboard

 $ npm install @angular/animations@4.1.3 

 $npm install crypto-js

 $npm install @types/crypto-js --save

 $npm install ng2-translate --save

 $git checkout takitUser/platforms/ios/타킷/Classes/AppDelegate.m

   1. platforms/ios/타킷/타킷-Info.plist 수정

     <key>LSApplicationQueriesSchemes</key>
     <array>
        <string>kakaotalk</string>
     </array>

   2. workspace에서 옵션 수정

    open platforms/ios/타킷.xcworkspace

    Frameworks->KakaoOpenSDK.framework삭제후 최근 KakaoOpenSDK framework추가하기(Drag and Drop사용)

    Build Settings > Linking > Other Linker Flags > add '-all_load -framework "KakaoOpenSDK"' (kakao plugin git)

    Capabilities->Push Notifications -> ON
                ->Background Modes -> Audio,AirPlay, and Picture in Picture 선택 해제
 
    General-> Deployment Info->Devices를 iPhone으로 설정 
 
 $ionic cordova build ios

 $git checkout takitUser/platforms/android/src/com/htj/plugin/kakao/KakaoTalk.java

 $ionic cordova run android

 $cd ..

 $git checkout takitUser

 takitUser/src/providers/configProvider.ts파일 아래 형식으로 생성

    import {Injectable} from '@angular/core';

    @Injectable()
    export class ConfigProvider{

    public serverAddress:string="xxx";
    public awsS3OCR:string="xxx";
    public awsS3:string="xxx";
    public homeJpegQuality=xxx;
    public menusInRow=xxx;
    public OrdersInPage:number=xxx; // The number of orders shown in a page 

    public userSenderID=xxx; //fcm senderID

    public version="xxx";
    public kakaoTakitUser="xxx";////Rest API key
    public kakaoOauthUrl="xxx"; 

    public tourEmail="xxx";
    public tourPassword="xxx";
    public timeout=xxx; // 5 seconds

    constructor(){
        console.log("ConfigProvider constructor"); 
    }

    getServerAddress(){
        return this.serverAddress;
    }

    getAwsS3OCR(){
        return this.awsS3OCR;
    }

    getAwsS3(){
        return this.awsS3;
    }

    getHomeJpegQuality(){
        return this.homeJpegQuality;
    }

    getMenusInRow(){
        return this.menusInRow;
    }

    getOrdersInPage(){
        return this.OrdersInPage;
    }

    getUserSenderID(){
        return this.userSenderID;
    }

    getVersion(){
        return this.version;
    }

    getKakaoTakitUser(){
        return this.kakaoTakitUser;
    }

    getKakaoOauthUrl(){
        return this.kakaoOauthUrl;
    }

    getTourEmail(){
        return this.tourEmail;
    }

    getTourPassword(){
        return this.tourPassword;
    }

    getTimeout(){
        return this.timeout;
    }
    }

 $cd takitUser

 $ionic cordova run android --prod --device

 $ionic cordova build ios --prod

# takitShop

$ionic start takitShop 

$cd takitShop => config.xml의 id,name 수정
  splash관련 사항 추가 

     <widget id="biz.takitApp.shop" ...>
     <name>타킷운영자</name>
     ...

$ionic cordova platform add android

$ionic cordova platform add ios

$ionic resources

$ionic cordova plugin add https://github.com/taejaehan/cordova-kakaotalk.git --variable KAKAO_APP_KEY={takitShop.kakao.appId} 

=>platforms/android/cordova-plugin-htj-kakaotalk/shop-kakao.gradle 파일에 sdk version수정 

  현재SDK버전: com.kakao.sdk:kakaotalk:1.4.1 (KakaoTalk.java파일 수정=>git checkout takitShop이수행함)

$ionic cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="{takitShop.facebook.appId}" --variable APP_NAME="takitShop"

$npm install --save @ionic-native/facebook

$ionic cordova plugin add cordova-plugin-network-information

$npm install --save @ionic-native/network

$ionic cordova plugin add cordova-plugin-file-transfer

$npm install --save @ionic-native/transfer

$ionic cordova plugin add cordova-plugin-camera

$npm install --save @ionic-native/camera

$ionic cordova plugin add cordova-plugin-file

$npm install --save @ionic-native/file

$ionic cordova plugin add cordova-plugin-filepath

$npm install --save @ionic-native/file-path

$ionic cordova plugin add phonegap-plugin-push@1.10.5 --variable SENDER_ID={takitShop.fcm.senderId}

$npm install --save @ionic-native/push

$ionic cordova plugin add cordova-plugin-inappbrowser 

$npm install --save @ionic-native/in-app-browser

$ionic cordova plugin add cordova-plugin-appavailability

$npm install --save @ionic-native/app-availability

$ionic cordova plugin add https://github.com/atmosuwiryo/Cordova-Plugin-Bluetooth-Printer

$ionic cordova plugin add https://github.com/katzer/cordova-plugin-background-mode.git#0.6.5

$ionic cordova plugin add cordova-plugin-media

$npm install --save @ionic-native/media

$ionic cordova plugin add cordova-plugin-nativestorage

$npm install --save @ionic-native/native-storage 

$npm install crypto-js

$npm install @types/crypto-js --save

$npm install ionic-native --save

$git checkout platforms/ios/타킷운영자/Classes/AppDelegate.m 

$ionic cordova build ios

$git checkout platforms/android/src/com/htj/plugin/kakao/KakaoTalk.java

$npm install @ionic/app-scripts@1.3.12 

$ionic cordova build android

 takitShop/platforms/ios/타킷운영자/타킷운영자-Info.plist

    <key>LSApplicationQueriesSchemes</key>
    <array>
    <string>kakaotalk</string>
    </array>

 xcode에서 옵션 수정및 코드 수정(참조 kakao plugin git) 

    open platforms/ios/타킷운영자.xcodeproj

    Frameworks->KakaoOpenSDK.framework삭제후 최근 KakaoOpenSDK framework추가하기(Drag and Drop사용)

    Build Settings > Linking > Other Linker Flags > add '-all_load -framework "KakaoOpenSDK"' (kakao plugin git)

    Capabilities->Push Notifications -> ON

    General-> Deployment Info->Devices를 iPhone으로 설정(?)

$git checkout takitShop

  takitShop/src/providers/configProvider.ts파일 아래 형식으로 생성

    import {Injectable} from '@angular/core';

    @Injectable()
    export class ConfigProvider{
    public serverAddress:string="XXX"; // server ip and port

    public awsS3OCR:string="XXX";
    public awsS3:string="XXX";
    public homeJpegQuality=XXX;
    public menusInRow=XXX;

    public version="XXX";
    public OrdersInPage=XXX;

    public userSenderID="XXX";
    public kakaoTakitShop="XXX"; //Rest API key
    public kakaoOauthUrl="XXX"; 
    public timeout=XXX;

    constructor(){
        console.log("ConfigProvider constructor"); 
    }

    getServerAddress(){
        return this.serverAddress;
    }

    getAwsS3(){
        return this.awsS3;
    }
    getAwsS3OCR(){
        return this.awsS3OCR;
    }

    getHomeJpegQuality(){
        return this.homeJpegQuality;
    }

    getMenusInRow(){
        this.menusInRow;
    }

    getVersion(){
        return this.version;
    }

    getOrdersInPage(){
        return this.OrdersInPage;
    }

    getUserSenderID(){
        return this.userSenderID;
    }

    getKakaoTakitShop(){
        return this.kakaoTakitShop;
    }

    getKakaoOauthUrl(){
        return this.getKakaoOauthUrl;
    }

    getTimeout(){
        return this.timeout;
    }
    }


 $ionic cordova run android --prod --device

 $ionic cordova run ios

Schedule

Ionic2 무료 강의

2시간으로 구성된 Ionic2 소개 강의

(타킷 오픈 소스 소개 포함)

강의 장소 섭외 도움주실분 연락주세요~~

kalen.lee@takit.biz

Ionic2 주말 유료 강의(6주, 매회 3시간)

Takit open source기반 실제 앱/서비스 개발 교육

1.주차(개발환경 설정,기초) 

  환경 설정: node, ionic2, 해킨토시, Android, iPhone App빌드/실행

javascript 구조(promise, async call)

  ionic2 기본 코드(앵귤러 기본 문법포함),디렉토리 구조 설명

2.  ionic UI 컴포넌트 및 theme설정 


3.주차(plugin사용)

  ionic2에서 주요 plugin사용하기.  plugin 만들기.

  로그인(카카오, 페이스북) plugin 

  카메라, 파일 upload plugin등


4.주차(서버와 통신)

 node server만들기(aws EC2 사용,기초 aws사용법)

 http를 통한 서버와 통신 코드 작성(서버&클라이언트)

 file전송하기(upload,download, 서버&클라이언트)


5. push 메시지 구현하기(앱, server) 및 notification 특성(background,forground, 앱종료시)

 push 메시지 설정하기(apple developer, google firebase)

 휴대폰 본인 인증 연동 예시(inAppBrowser 사용)

 ionic UI컴포넌트(infinite scroll)

6.주차(그외 사항들)

 directive 정의

 그외 코드(back key handler, zone, emitter사용을 통한 event전달)

 app스토어 등록방법

 Q&A,보충설명등
  
 
