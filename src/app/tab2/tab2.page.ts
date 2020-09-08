import { Component } from '@angular/core';
import { PhotoService, Photo } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.photoService.loadSaved();
  }

  async operation(photo: Photo) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          this.photoService.delete(photo);
        }
      }, {
        text: 'Open',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
          this.photoService.view(photo.nativeURL);
        }
      },
      {
        text: 'Rename',
        icon: 'create',
        handler: () => {
          console.log('Rename clicked');
          this.photoService.rename(photo);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
