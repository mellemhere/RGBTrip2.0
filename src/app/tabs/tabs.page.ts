import {Component} from '@angular/core';
import {LoadingController} from "@ionic/angular";
import {MqttControllerService} from "../mqtt-controller.service";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {


    private loading;

    constructor(public loadingController: LoadingController,
                private mqttController: MqttControllerService) {
        if (mqttController.isConnectd()) {
            this.showLoadding();
        }

        mqttController.onDisconnect(() => {
            this.showLoadding();
        });
    }

    private async showLoadding() {
        this.loading = await this.loadingController.create({
            message: 'Conectado as luzes'
        });
        await this.loading.present();

        this.mqttController.onConnected(() => {
            this.loading.dismiss();
        });
    }


}
