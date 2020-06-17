import {Component, OnInit} from '@angular/core';
import iro from '@jaames/iro';
import {LightColors, WsControllerService} from '../ws-controller.service';

@Component({
    selector: 'app-manual',
    templateUrl: 'manual.page.html',
    styleUrls: ['manual.page.scss']
})
export class ManualPage implements OnInit {

    private colorWheel;
    public syncPool = false;

    public hotColors = [
        '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#673ab7', '#000000'
    ];

    constructor(private wsService: WsControllerService) {
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

}
