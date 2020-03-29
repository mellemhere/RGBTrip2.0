import {Component, OnInit} from '@angular/core';
import iro from '@jaames/iro';
import {ModalController} from '@ionic/angular';
import {EfeitoEmAndamentoComponent} from '../efeito-em-andamento/efeito-em-andamento.component';
import {LightColors, MqttControllerService} from '../mqtt-controller.service';

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

    public togglePoolPower() {
        this.wsService.sendMessage('pool_power', {});
    }

    ngOnInit(): void {
        this.colorWheel = iro.ColorPicker('#colorWheelDemo', {
            width: 260
        });

        this.colorWheel.on('input:change', (color) => {
            const rgb = color.rgb;
            this.wsService.sendMessage('rgb_churras', rgb);
        });

    }

    public changeColor(color) {
        this.colorWheel.color.hexString = color;
        this.wsService.sendMessage('rgb_churras', this.colorWheel.color.rgb);
    }

    public changeColorPool(colorHEX: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHEX);
        const colorToSend = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : false;
        if (colorToSend) {
            this.wsService.sendMessage('rgb_pool', colorToSend);
        }
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
