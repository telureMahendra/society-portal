import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyList } from './society-list';

describe('SocietyList', () => {
  let component: SocietyList;
  let fixture: ComponentFixture<SocietyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
