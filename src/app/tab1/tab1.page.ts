import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  audioList: string[] = [];

  constructor(private alertController: AlertController,
    private media: Media,
    private file: File,
    public platform: Platform) { }

  ionViewDidEnter() {
    this.file.listDir(this.file.externalDataDirectory, '')
      .then((res) => { 
        console.log('dir entry:', res);
        for (let entry of res) {
          if(entry.isFile && entry.name.endsWith('.aac'))
          this.audioList.push(entry.name);
        }

      }).catch((err) => console.error('listDir :', err));

  }

  ionViewDidLeave() {
    this.audioList = [];
  }
  async record() {

    let date = new Date();
    let fileName = 'rec-' + date.getDate() + date.getMonth() + date.getFullYear()
      + date.getHours() + date.getMinutes() + date.getSeconds() + '.aac';

    let filePath = this.file.tempDirectory;
    if (this.platform.is('android'))
      filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '');


    let audio: MediaObject = this.media.create(filePath + fileName);
    audio.startRecord();

    const alert = await this.alertController.create({
      header: 'RECORDING...',
      buttons: [
        {
          text: 'FINISH',
          role: 'cancel',
          handler: () => {
            audio.stopRecord();
            this.audioList.push(fileName);
            audio.release();
          }
        }
      ]
    });

    await alert.present();
  }

  async playAudio(fileName: string) {

    let filePath = this.file.tempDirectory;
    if (this.platform.is('android'))
      filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '');

    let audio: MediaObject = this.media.create(filePath + fileName);
    audio.play();

    const alert = await this.alertController.create({
      header: 'PLAYING...',
      buttons: [
        {
          text: 'Stop',
          role: 'cancel',
          handler: () => {
            audio.stop();
            audio.release();
          }
        }
      ]
    });

    await alert.present();

  }
  async editFile(fileName: string) {
    const alert = await this.alertController.create({
      header: 'Rename!',
      inputs: [
        {
          name: 'newFile',
          type: 'text',
          placeholder: fileName.split('.')[0]
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
            let newFileName = obj.newFile + '.aac';
            this.file.moveFile(this.file.externalDataDirectory,fileName,
              this.file.externalDataDirectory,newFileName)
            .then(()=> {
              this.audioList[this.audioList.indexOf(fileName)] = newFileName;
            })
            .catch( (err)=> console.error('rename failed',err));
          }
        }
      ]
    });
    await alert.present();
  }
  deleteFile(fileName: string) {
    this.file.removeFile(this.file.externalDataDirectory,fileName)
      .catch((err)=>console.error('file delete error',err));
    this.audioList.splice(this.audioList.indexOf(fileName),1);
  }
}
