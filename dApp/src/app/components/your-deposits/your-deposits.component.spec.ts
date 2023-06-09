import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourDepositsComponent } from './your-deposits.component';

describe('YourDepositsComponent', () => {
  let component: YourDepositsComponent;
  let fixture: ComponentFixture<YourDepositsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourDepositsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
