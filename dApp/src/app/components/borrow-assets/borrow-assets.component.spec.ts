import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowAssetsComponent } from './borrow-assets.component';

describe('BorrowAssetsComponent', () => {
  let component: BorrowAssetsComponent;
  let fixture: ComponentFixture<BorrowAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
