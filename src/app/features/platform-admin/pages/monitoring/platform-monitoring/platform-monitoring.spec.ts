import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformMonitoring } from './platform-monitoring';

describe('PlatformMonitoring', () => {
  let component: PlatformMonitoring;
  let fixture: ComponentFixture<PlatformMonitoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformMonitoring]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformMonitoring);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
