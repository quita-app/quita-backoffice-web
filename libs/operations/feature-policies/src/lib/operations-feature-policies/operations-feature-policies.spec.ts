import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsFeaturePolicies } from './operations-feature-policies';

describe('OperationsFeaturePolicies', () => {
  let component: OperationsFeaturePolicies;
  let fixture: ComponentFixture<OperationsFeaturePolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsFeaturePolicies],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsFeaturePolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
