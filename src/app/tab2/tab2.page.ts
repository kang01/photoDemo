import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  currentImage: any;
  photos = [];
  constructor( 
    private camera: Camera,
    private photoLibrary: PhotoLibrary, 
    private storage: Storage,
    private imagePicker: ImagePicker,
    private base64: Base64,
    private webview: WebView) {
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadSaved();
  }
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum :true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      this.photos.unshift(this.currentImage);
      this.storage.set('photos', this.photos);
    }, (err) => {
     // Handle error
     console.log("Camera issue:" + err);
    });
  }
  loadSaved(){
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }
  // 从相册中取照片
  takefromgalery(){
    var cameraOptions= {
      quality : 75,
      destinationType : this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.SAVEDPHOTOALBUM,    //相册类型
      allowEdit : true,
      encodingType : this.camera.EncodingType.JPEG,
      targetWdith : 100,
      targetHeight : 100,
      saveToPhotoAlbum : false
    }
    this.imagePicker.getPictures(cameraOptions).then((results) => {
      
      var self= this;
      for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          // var canvas = document.createElement("canvas");
          // canvas.width = 500;
          // canvas.height = 500;
          // var ctx = canvas.getContext("2d");
          // var image = new Image();
          // image.src =  this.webview.convertFileSrc(results[i]);
          // image.onload = function (ev) {
          //   ctx.drawImage(image, 0, 0);
          //   var base64 = canvas.toDataURL('image/jpeg', 0.7);
          //   self.photos.unshift(base64);
          // };
          // var url = self.webview.convertFileSrc(results[i]);
          self.base64.encodeFile(results[i]).then((base64File: string) => {
            // console.log(base64File);
            self.photos.unshift(base64File);
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => { });
  
  }
  saveImage(image){
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: (library) => {
          library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
          this.photoLibrary.saveImage(image,'aaa').then(()=>{
            alert('保存成功');
          })
        },
        error: err => { alert('失败2') },
        complete: () => { console.log('done getting photos'); }
      })

    })
  }
  onHold(){
    
  }
}
