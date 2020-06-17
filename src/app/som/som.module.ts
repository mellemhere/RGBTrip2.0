import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SomPage} from './som.page';
import {ExploreContainerComponentModule} from '../explore-container/explore-container.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        RouterModule.forChild([{path: '', component: SomPage}])
    ],
    declarations: [SomPage]
})
export class SomPageModule {
}
