import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourBorrowalsComponent } from './your-borrowals.component';

describe('YourBorrowalsComponent', () => {
  let component: YourBorrowalsComponent;
  let fixture: ComponentFixture<YourBorrowalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourBorrowalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourBorrowalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
