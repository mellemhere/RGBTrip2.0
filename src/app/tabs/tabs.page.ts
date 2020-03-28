import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {MqttControllerService} from '../mqtt-controller.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {


    private loading: boolean | HTMLIonLoadingElement = false;

    constructor(public loadingController: LoadingController,
                private mqttController: MqttControllerService) {
        mqttController.connection.subscribe(async (state) => {
            this.handleLoading(state);
        });
    }

    private async handleLoading(state: boolean) {
        if (!state && this.loading === false) {
            this.loading = await this.loadingController.create({
                message: 'Conectado as luzes'
            });
            await this.loading.present();
        } else if (this.loading !== false && state) {
            (this.loading as HTMLIonLoadingElement).dismiss();
            this.loading = false;
        }
    }


}
