import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsDataAccess } from './operations-data-access';

describe('OperationsDataAccess', () => {
  let component: OperationsDataAccess;
  let fixture: ComponentFixture<OperationsDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
