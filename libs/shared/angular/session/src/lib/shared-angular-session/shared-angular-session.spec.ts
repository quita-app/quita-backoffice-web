import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedAngularSession } from './shared-angular-session';

describe('SharedAngularSession', () => {
  let component: SharedAngularSession;
  let fixture: ComponentFixture<SharedAngularSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAngularSession],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedAngularSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
