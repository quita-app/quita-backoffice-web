import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsFeatureQueue } from './operations-feature-queue';

describe('OperationsFeatureQueue', () => {
  let component: OperationsFeatureQueue;
  let fixture: ComponentFixture<OperationsFeatureQueue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsFeatureQueue],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsFeatureQueue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
