import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedAngularUi } from './shared-angular-ui';

describe('SharedAngularUi', () => {
  let component: SharedAngularUi;
  let fixture: ComponentFixture<SharedAngularUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAngularUi],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedAngularUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
