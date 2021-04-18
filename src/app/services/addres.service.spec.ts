import { TestBed } from '@angular/core/testing';

import { AddresService } from './addres.service';

describe('AddresService', () => {
  let service: AddresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
