import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsFeaturePayments } from './operations-feature-payments';

describe('OperationsFeaturePayments', () => {
  let component: OperationsFeaturePayments;
  let fixture: ComponentFixture<OperationsFeaturePayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsFeaturePayments],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsFeaturePayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
