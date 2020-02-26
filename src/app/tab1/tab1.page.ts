import {Component, OnInit} from '@angular/core';
import iro from '@jaames/iro';
import {ModalController} from '@ionic/angular';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {EfeitoEmAndamentoComponent} from '../efeito-em-andamento/efeito-em-andamento.component';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    private colorWheel;
    private hotColors = [
        '#FFFFFF', '#FF0000', '#7CFC00', '#FFA500', '#FFFF00', '#FF00FF', '#00FFFF', '#00BFFF', '#0000FF', '#800000'
    ];

    constructor(public modalController: ModalController) {
    }

    ngOnInit(): void {
        this.colorWheel = iro.ColorPicker('#colorWheelDemo');
    }

    public changeColor(color) {
        this.colorWheel.color.hexString = color;
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
