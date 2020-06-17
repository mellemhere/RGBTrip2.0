import {Component, OnInit} from '@angular/core';
import {Effect, WsControllerService} from '../ws-controller.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-efeito-modal',
    templateUrl: './efeito-modal.component.html',
    styleUrls: ['./efeito-modal.component.scss'],
})
export class EfeitoModalComponent implements OnInit {

    private interval;

    constructor(public wsService: WsControllerService, public modalCtrl: ModalController) {
        this.interval = setInterval(() => {
            try {
                if (wsService.currentEffect === false) {
                    this.modalCtrl.dismiss();
                    clearInterval(this.interval);
                }
            } catch (e) {
                clearInterval(this.interval);
            }
        });
    }

    ngOnInit() {
    }

    public intensityChange() {
        // this.wsService.sendMessage('effect_prop_intensity', {val: (this.wsService.currentEffect as Effect).intensity});
    }

    public velocityChange() {
        // this.wsService.sendMessage('effect_prop_velocity', {val: (this.wsService.currentEffect as Effect).velocity});
    }

    public stopEffect() {
        console.log('Enviando pedido de event stop.');
        this.wsService.sendMessage('effect_stop', true);
    }
}
