import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAdminLayout } from './platform-admin-layout';

describe('PlatformAdminLayout', () => {
  let component: PlatformAdminLayout;
  let fixture: ComponentFixture<PlatformAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformAdminLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformAdminLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
