import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Engineers } from './engineers';

describe('Engineers', () => {
  let component: Engineers;
  let fixture: ComponentFixture<Engineers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Engineers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Engineers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
