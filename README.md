# takit
Takit App source based on ionic2 and Server source based on node

License: GPL
  참조 코드로 공개합니다.

  특허 요소가 있는 일부 기능은 GPL로도 사용불가합니다.

# takitUser

 $ionic start takitUser --v2

 $cd takitUser
  => config.xml의 id,name 수정ex)biz.takitApp.user,타킷
     splash관련 사항 추가

    <widget id="biz.takitApp.user" ...>
    <name>타킷</name>
    ...
    <preference name="AutoHideSplashScreen" value="false" />

 $ionic platform add android@latest

 $ionic resources

 $ionic plugin add https://github.com/taejaehan/cordova-kakaotalk.git --variable KAKAO_APP_KEY={takitUser.kakao.appId}

  =>takitUser/platforms/android/cordova-plugin-htj-kakaotalk/user-kakao.gradle 파일에 sdk version수정
   현재 SDK버전: com.kakao.sdk:kakaotalk:1.1.21

 $ionic plugin add https://github.com/loicknuchel/cordova-device-accounts.git

 $ionic plugin add cordova-plugin-facebook4 --save --variable APP_ID="{takitUser.facebook.appId}" --variable APP_NAME="takitUser"

 $ionic plugin add cordova-plugin-network-information

 $ionic plugin add cordova-plugin-file-transfer

 $ionic plugin add cordova-plugin-camera

 $ionic plugin add cordova-plugin-filepath

 $ionic plugin add https://github.com/protonet/cordova-plugin-image-resizer.git

 $ionic plugin add phonegap-plugin-push --variable SENDER_ID={takitUser.fcm.senderId}

 $ionic plugin add cordova-sqlite-storage

 $ionic plugin add https://github.com/46cl/cordova-android-focus-plugin

 $ionic plugin add cordova-plugin-sim

 $ionic plugin add cordova-plugin-inappbrowser

 $ionic plugin add cordova-plugin-appavailability

 $ionic plugin add https://github.com/raceyi/GetEmail.git

 $ionic plugin add https://github.com/sidchilling/Phonegap-SMS-reception-plugin.git

 $ionic plugin add https://github.com/katzer/cordova-plugin-background-mode.git

 $npm install crypto-js

 $npm install @types/crypto-js --save

 $ionic g directive focuser

 $git checkout platforms/ios/타킷/Classes/AppDelegate.m
 
 $ionic build ios

 $git checkout platforms/android/src/com/htj/plugin/kakao/KakaoTalk.java

 $ionic run android --prod --device

   platforms/ios/타킷/타킷-Info.plist 수정

     <key>LSApplicationQueriesSchemes</key>
     <array>
        <string>kakaotalk</string>
     </array>

 xcode에서 옵션 수정
    open platforms/ios/타킷.xcodeproj
    Build Settings > Linking > Other Linker Flags > add '-all_load' (kakao plugin git)
    Capabilities->Push Notifications -> ON

 $cd ..

 $git checkout takitUser

 takitUser/src/providers/storageProvider.ts파일에 아래 변수 추가


     export class StorageProvider{

     public serverAddress:string="xxxx";
     public awsS3OCR:string="xxxx";
     public awsS3:string="xxxx";
     public homeJpegQuality=xxx;
     public menusInRow=x;
     public OrdersInPage:number=xx; // The number of orders shown in a page 

     public userSenderID="xxxx"; //fcm senderID

     public version="x.x.x";
     public kakaoTakitUser="xxx";////Rest API key
     public kakaoOauthUrl="xxx"; 

     public tourEmail="xxx";
     public tourPassword="xxx";
     public timeout=xxx; 
 
     .....
 
 $cd takitUser

 $ionic run android --prod --device

 $ionic run ios

# takitShop

   
