import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MediaPlugin } from 'ionic-native';

/*
  Generated class for the MediaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MediaProvider {
   playing:boolean=false;
   onStatusUpdate = (status) => { 
                      console.log( "onStatusUpdate"+status);
                      if(status==4 && this.playing){
                        this.file.play();
                      }
                  };                              
   file;

  constructor(public http: Http) {
    console.log('Hello MediaProvider Provider');
  }

  init(){
    this.file = new MediaPlugin('file:///android_asset/www/assets/ordersound.mp3', this.onStatusUpdate);
  }

  play(){
      this.playing=true;
      this.file.init.then(() => {
        console.log('Playback Finished');
      }, (err) => {
        console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
      });
      // play the file
      this.file.play();
      //file.release(); hum... where should I call this function?
  }

  stop(){
    if(this.playing){
      this.playing=false;
      this.file.stop();
    }
  }

  release(){ //When should I call this function? When app terminates?

  }
}
