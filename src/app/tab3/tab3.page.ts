import { Component } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  blue: boolean = true;

  constructor(private bluetooth: BluetoothLE) { }

  ngOnInit() {
    this.bluetooth.initialize()
      .subscribe((res) => {
        console.log('bluetooth status:', res.status);
        if (res.status === "enabled")
          this.blue = true;
        else
          this.blue = false;
      });
  }

  toggle() {
    if(this.blue) {
      this.bluetooth.enable();
    } else {
      this.bluetooth.disable();
    }
  }
}
