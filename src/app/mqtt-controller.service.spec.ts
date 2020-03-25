import { TestBed } from '@angular/core/testing';

import { MqttControllerService } from './mqtt-controller.service';

describe('MqttControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqttControllerService = TestBed.get(MqttControllerService);
    expect(service).toBeTruthy();
  });
});
