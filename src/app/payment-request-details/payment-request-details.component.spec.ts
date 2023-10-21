import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestDetailsComponent } from './payment-request-details.component';

describe('PaymentRequestDetailsComponent', () => {
  let component: PaymentRequestDetailsComponent;
  let fixture: ComponentFixture<PaymentRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
