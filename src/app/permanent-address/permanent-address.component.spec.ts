import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentAddressComponent } from './permanent-address.component';

describe('PermanentAddressComponent', () => {
  let component: PermanentAddressComponent;
  let fixture: ComponentFixture<PermanentAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermanentAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermanentAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
