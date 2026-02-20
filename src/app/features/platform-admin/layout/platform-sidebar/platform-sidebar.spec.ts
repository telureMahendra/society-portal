import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformSidebar } from './platform-sidebar';

describe('PlatformSidebar', () => {
  let component: PlatformSidebar;
  let fixture: ComponentFixture<PlatformSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
