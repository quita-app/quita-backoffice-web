import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedAngularDataAccess } from './shared-angular-data-access';

describe('SharedAngularDataAccess', () => {
  let component: SharedAngularDataAccess;
  let fixture: ComponentFixture<SharedAngularDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAngularDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedAngularDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
