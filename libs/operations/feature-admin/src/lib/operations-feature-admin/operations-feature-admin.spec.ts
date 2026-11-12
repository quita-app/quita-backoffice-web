import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsFeatureAdmin } from './operations-feature-admin';

describe('OperationsFeatureAdmin', () => {
  let component: OperationsFeatureAdmin;
  let fixture: ComponentFixture<OperationsFeatureAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsFeatureAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsFeatureAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
