import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsFeatureImports } from './operations-feature-imports';

describe('OperationsFeatureImports', () => {
  let component: OperationsFeatureImports;
  let fixture: ComponentFixture<OperationsFeatureImports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsFeatureImports],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsFeatureImports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
