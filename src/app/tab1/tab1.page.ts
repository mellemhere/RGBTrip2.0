import {Component, OnInit} from '@angular/core';
import iro from '@jaames/iro';

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

    constructor() {
    }

    ngOnInit(): void {
        this.colorWheel = iro.ColorPicker('#colorWheelDemo');
    }

    public changeColor(color) {
        this.colorWheel.color.hexString = color;
    }

}
