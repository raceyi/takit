import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Media, MediaObject } from '@ionic-native/media';
import { Platform } from 'ionic-angular';


/*
  Generated class for the MediaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MediaProvider {
   playing:boolean=false;
   /*
   onStatusUpdate = (status) => { 
                      console.log( "onStatusUpdate"+status);
                      if(status==4 && this.playing){
                        this.file.play();
                      }
                  };                              
   */               
   file;

  constructor(public http: Http,private platform:Platform,private media: Media) {
    console.log('Hello MediaProvider Provider');
    platform.ready().then(() => {
      this.file = this.media.create('file:///android_asset/www/assets/ordersound.mp3');
      this.file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
      this.file.onSuccess.subscribe(() => {
        console.log('Action is successful');
        if(this.playing)
          this.file.play();
        
      });
      this.file.onError.subscribe(error => console.log('Error!', error));
    });

  }


  play(){
      this.playing=true;
      // play the file
      this.file.play();
      //file.release(); hum... where should I call this function?
  }

  stop(){
    console.log("mediaProvider - stop");
    if(this.playing){
      this.playing=false;
      this.file.stop();
    }
  }

  release(){ //When should I call this function? When app terminates?

  }
}
