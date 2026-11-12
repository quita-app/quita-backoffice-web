import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedAngularRealtime } from './shared-angular-realtime';

describe('SharedAngularRealtime', () => {
  let component: SharedAngularRealtime;
  let fixture: ComponentFixture<SharedAngularRealtime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAngularRealtime],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedAngularRealtime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
