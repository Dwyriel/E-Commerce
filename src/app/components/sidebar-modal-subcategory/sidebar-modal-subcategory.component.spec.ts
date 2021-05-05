import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SidebarModalSubcategory } from './sidebar-modal-subcategory.component';

describe('SidebarModalSubcategoryComponent', () => {
  let component: SidebarModalSubcategory;
  let fixture: ComponentFixture<SidebarModalSubcategory>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarModalSubcategory ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarModalSubcategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
