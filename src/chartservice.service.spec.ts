import { TestBed } from '@angular/core/testing';

import { chartserviceService } from '../chartservice.service';

describe('ChartserviceService', () => {
  let service: chartserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(chartserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
