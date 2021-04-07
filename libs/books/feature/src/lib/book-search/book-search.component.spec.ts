import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { clearSearch, searchBooks } from '@tmo/books/data-access';
import { BOOK_CONSTANT } from '../book.constant';
import { Subscription } from 'rxjs';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;
  let actionSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    actionSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Should dispatch searchBooks action after 500ms and search team is changed', fakeAsync(() => {
    component.searchForm.setValue({ term: 'java' });
    tick(300);
    expect(actionSpy).not.toHaveBeenCalled();
    component.searchForm.setValue({ term: 'javac' });
    tick(500);
    expect(actionSpy).toHaveBeenCalledWith(searchBooks({ term: 'javac' }));
  }));

  it('Should not dispatch searchBooks action when search term is not changed after 500ms', fakeAsync(() => {
    component.searchForm.setValue({ term: 'javascrip' });
    tick(500);
    expect(actionSpy).toHaveBeenNthCalledWith(1, searchBooks({ term: 'javascrip' }));
    component.searchForm.setValue({ term: 'javascr' });
    component.searchForm.setValue({ term: 'javascrip' });
    tick(500);
    expect(actionSpy).toHaveBeenNthCalledWith(1, searchBooks({ term: 'javascrip' }));
  }));

  it('should dispatch clearSearch when search term is empty and changed', fakeAsync(() => {
    component.searchForm.setValue({ term: BOOK_CONSTANT.EMPTY_STRING });
    tick(500);
    expect(actionSpy).toHaveBeenCalledWith(clearSearch());
  }));

  it('should unsubscibe subscription on ngOnDestroy',() => {
    component.subscription$ = new Subscription();
    spyOn(component.subscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription$.unsubscribe).toHaveBeenCalled();
  });
});
