import {Component, OnInit} from '@angular/core';
import {MqttControllerService} from '../mqtt-controller.service';

@Component({
    selector: 'app-efeito-modal',
    templateUrl: './efeito-modal.component.html',
    styleUrls: ['./efeito-modal.component.scss'],
})
export class EfeitoModalComponent implements OnInit {


    constructor(public wsService: MqttControllerService) {
    }

    ngOnInit() {
    }

}
