import { TestBed } from '@angular/core/testing';

import { PlatformAuth } from './platform-auth';

describe('PlatformAuth', () => {
  let service: PlatformAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
