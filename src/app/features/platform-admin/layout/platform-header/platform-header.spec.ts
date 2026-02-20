import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformHeader } from './platform-header';

describe('PlatformHeader', () => {
  let component: PlatformHeader;
  let fixture: ComponentFixture<PlatformHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
