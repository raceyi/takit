import {Injectable} from '@angular/core';

@Injectable()
export class ConfigProvider{
    public serverAddress:string="https://takit.biz:443"; // server ip and port

    public awsS3OCR:string="https://s3.ap-northeast-2.amazonaws.com/seerid.html/";
    public awsS3:string="https://s3.ap-northeast-2.amazonaws.com/seerid.cafe.image/";
    public homeJpegQuality=100;
    public menusInRow=3;

    public version="0.0.1";
    public OrdersInPage=10;

    public userSenderID="986862676163";
    public kakaoTakitShop="0a5f4d92e9429bb3e70f9db22833f70b"; //Rest API key
    public kakaoOauthUrl="https://takit.biz/oauth"; 
    public timeout=5000;

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


