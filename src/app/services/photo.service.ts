import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
//import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AlertController, Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private camera: Camera,
    private photoViewer: PhotoViewer,
    private file:File,
    private webView: WebView,
    private alertController:AlertController) { }
  

  takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      let fileName = imageData.split('/').pop();
      console.log(fileName,imageData);
      this.photos.unshift({
        nativeURL:imageData,
        webview: this.webView.convertFileSrc(imageData),
        name: fileName
      });
    }, (err) => {
      console.error("Camera issue: " + err);
    });
  }

  loadSaved() {
    this.file.listDir(this.file.externalCacheDirectory, '')
      .then((res) => { 
        console.log('dir entry:', res);
        for (let entry of res) {
          if(entry.isFile && entry.name.endsWith('.jpg'))
            this.photos.push({
              nativeURL: entry.nativeURL,
              webview: this.webView.convertFileSrc(entry.nativeURL),
              name: entry.name
            });
        }
      }).catch((err) => console.error('listDir :', err));
  }

  view(photoURI) {
    this.photoViewer.show(photoURI);
  }

  delete (photo: Photo) {
    this.file.removeFile(this.file.externalCacheDirectory,photo.name)
      .catch((err) => console.error('error while delete',err));
    this.photos.splice(this.photos.indexOf(photo),1);
  }

  async rename(photo: Photo) {
    const alert = await this.alertController.create({
      header: 'Rename!',
      inputs: [
        {
          name: 'newFile',
          type: 'text',
          placeholder: photo.name.split('.')[0]
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          
        }, {
          text: 'Ok',
          handler: (obj) => {
            let newFileName = obj.newFile + '.jpg';
            this.file.moveFile(this.file.externalCacheDirectory,photo.name,
              this.file.externalCacheDirectory,newFileName)
            .then((fileURI)=> {
              this.photos[this.photos.indexOf(photo)] = {
                nativeURL: fileURI.nativeURL,
                webview: this.webView.convertFileSrc(fileURI.nativeURL),
                name: fileURI.name
              };
            })
            .catch( (err)=> console.error('rename failed',err));
          }
        }
      ]
    });
    await alert.present();
  }

}

export class Photo {
  nativeURL: string;
  webview: string;
  name: string;
}
