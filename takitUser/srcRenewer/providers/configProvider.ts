import {Injectable} from '@angular/core';

@Injectable()
export class ConfigProvider{

    //public serverAddress:string="https://takit.biz:443";
    public serverAddress:string="https://takit.biz:8000";

    public awsS3OCR:string="https://s3.ap-northeast-2.amazonaws.com/seerid.html/";
    public awsS3:string="https://s3.ap-northeast-2.amazonaws.com/seerid.cafe.image/";
    public homeJpegQuality=100;
    public menusInRow=3;
    public OrdersInPage:number=10; // The number of orders shown in a page 

    public userSenderID="836964428266"; //fcm senderID

    public version="0.03"; //server version
    public kakaoTakitUser="04457a1cc7e876475f8ab431f63a2060";////Rest API key
    public kakaoOauthUrl="https://takit.biz/oauth"; 

    public certUrl="https://takit.biz:8443/kcpcert/kcpcert_start.jsp";
    public tourEmail="help-ios@takit.biz";
    public tourPassword="i2p4h5o&ne";
    public timeout=10000; // 10 seconds
    public accountMaskExceptFront=3;
    public accountMaskExceptEnd=5;
    
    constructor(){
        console.log("ConfigProvider constructor"); 
    }

    getAccountMaskExceptFront(){
        return this.accountMaskExceptFront;
    }

    getAccountMaskExceptEnd(){
        return this.accountMaskExceptEnd;
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

    getCertUrl(){
        return this.certUrl;
    }
}



