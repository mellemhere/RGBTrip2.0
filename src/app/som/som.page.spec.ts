import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SomPage } from './som.page';

describe('SomPage', () => {
  let component: SomPage;
  let fixture: ComponentFixture<SomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SomPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
