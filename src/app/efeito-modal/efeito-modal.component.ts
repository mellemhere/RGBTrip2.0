import {Component, OnInit} from '@angular/core';
import {Effect, WsControllerService} from '../ws-controller.service';

@Component({
    selector: 'app-efeito-modal',
    templateUrl: './efeito-modal.component.html',
    styleUrls: ['./efeito-modal.component.scss'],
})
export class EfeitoModalComponent implements OnInit {


    constructor(public wsService: WsControllerService) {
    }

    ngOnInit() {
    }

    public intensityChange() {
        this.wsService.sendMessage('effect_prop_intensity', {val: (this.wsService.currentEffect as Effect).intensity});
    }

    public velocityChange() {
        this.wsService.sendMessage('effect_prop_velocity', {val: (this.wsService.currentEffect as Effect).velocity});
    }

    public stopEffect() {
        console.log('Pendindo para parar');
        this.wsService.sendMessage('effect_stop', true);
    }
}
