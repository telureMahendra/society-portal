import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdomainList } from './subdomain-list';

describe('SubdomainList', () => {
  let component: SubdomainList;
  let fixture: ComponentFixture<SubdomainList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubdomainList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubdomainList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
