import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestCreateFormComponent } from './payment-request-create-form.component';

describe('PaymentRequestCreateFormComponent', () => {
  let component: PaymentRequestCreateFormComponent;
  let fixture: ComponentFixture<PaymentRequestCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRequestCreateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRequestCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
