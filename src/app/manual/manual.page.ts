import {Component, OnInit} from '@angular/core';
import iro from '@jaames/iro';
import {ModalController} from '@ionic/angular';
import {EfeitoEmAndamentoComponent} from '../efeito-em-andamento/efeito-em-andamento.component';
import {LightColors, MqttControllerService} from '../mqtt-controller.service';
import {Observable} from "rxjs";

@Component({
    selector: 'app-manual',
    templateUrl: 'manual.page.html',
    styleUrls: ['manual.page.scss']
})
export class ManualPage implements OnInit {

    private colorWheel;
    public syncPool = false;

    private hotColors = [
        '#FFFFFF', '#FF0000', '#7CFC00', '#FFA500', '#FFFF00', '#FF00FF', '#00FFFF', '#00BFFF', '#0000FF', '#800000'
    ];

    constructor(public modalController: ModalController, private wsService: MqttControllerService) {
        this.wsService.state.subscribe((currentState) => {
            this.syncPool = currentState.sync;
            this.changeColorRGB(currentState.light);
        });
    }

    public syncChanged() {
        this.wsService.sendMessage('sync', this.syncPool);
    }

    ngOnInit(): void {
        this.colorWheel = iro.ColorPicker('#colorWheelDemo', {
            width: 260
        });

        this.colorWheel.on('input:change', (color) => {
            const rgb = color.rgb;
            this.wsService.sendMessage('rgb_change', rgb);
        });

    }

    public changeColor(color) {
        this.colorWheel.color.hexString = color;
        this.wsService.sendMessage('rgb_change', this.colorWheel.color.rgb);
    }

    public changeColorRGB(rgbColor: LightColors) {
        this.colorWheel.color.rgb = rgbColor;
    }

    async showCurrentlyInEffectModal() {
        const modal = await this.modalController.create({
            component: EfeitoEmAndamentoComponent,
            backdropDismiss: false,
            cssClass: 'efeito-em-andamento-modal',
            mode: 'md'
        });
        await modal.present();
    }

}
