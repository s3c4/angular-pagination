import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Photos } from '../../interfaces/photos.interface';
import { Pagination } from '../../interfaces/pagination.component';
import { FormGroup } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  // keep the original photos
  public originalPhotos: Photos.Photo[];
  // keep all photos without filter
  public photos: Photos.Photo[];
  // keep photos viewed by user in a specific moment
  public viewPhotos: Photos.Photo[];
  // default 10 photos per page
  public photosPerPage = 10;
  // options page 10, 25, 50, 100 - we can add more here
  public perPageOptions: Pagination.PerPageOption[];
  // keep the number of pagination based on how many items per page are viewed ex: from [1, 2, ... 120] -> we will have 120
  public numberOfPages: Array<number> = [];
  // default first page active
  public activePage = 1;
  // search form
  public searchFrom: FormGroup;

  // -->Inject: http service in component
  constructor(private httpService: HttpService) { }

  // -->Use: ngOnInit life cycle. Here all variables are known
  public ngOnInit(): void {
    // -->Set: the options of per page options
    this.perPageOptions = Pagination.PerPageOptions;
    // -->Set: the first number of items per page from PerPageOptions
    this.photosPerPage = this.perPageOptions[0].value;
    // -->Set: new search form
    this.searchFrom = Pagination.newSearchForm();
    // -->Get: photos from api
    this.httpService.getJson<Photos.Photo[]>()
      .subscribe((photos: Photos.Photo[]) => {
        // -->Set: original photos
        this.originalPhotos = photos;
        // -->Set: all photos
        this.photos = photos;
        // -->Set: options for pagination
        this.setOptions();
    });
    // -->Track: value changes on text input
    this.searchFrom.get('text')
      .valueChanges
      .debounceTime(400) // wait 400ms for user to stop writing
      .distinctUntilChanged() // refilter if the search text is distinct
      .subscribe((searchText: string) => {
          // -->Set: original photo
          this.photos = this.originalPhotos;
          // -->Filter: photos based on search text
          this.photos = this.photos.filter((photo) => photo.title.includes(searchText));
          // -->Set: options for pagination
          this.setOptions();
      });
  }

  // -->Set: the number of photos per page
  public changePerPage(option): void {
    // -->Set: photos per page based on user preferences
    this.photosPerPage = option.value;
    // -->Reset: active page to 1
    this.activePage = 1;
    // -->Set: options for pagination
    this.setOptions();
  }

  // -->Set: the visibility of number of pages
  public numberOfPageVisible(numberOfPage: number): boolean {
    return ([
      1,
      this.activePage - 2,
      this.activePage - 1,
      this.activePage,
      this.activePage + 1,
      this.activePage + 2,
      this.numberOfPages[this.numberOfPages.length - 1]
    ].includes(numberOfPage));
  }

  // -->Set: number of page selected
  public changePage(numberOfPage: number): void {
    if (numberOfPage > 0 && numberOfPage <= this.numberOfPages[this.numberOfPages.length - 1]) {
      // -->Set: active page
      this.activePage = numberOfPage;
      // -->Set: options for pagination
      this.setOptions();
    }
  }

  // -->Set: options for pagination
  private setOptions(): void {
    // -->Set: the view photos for selected options
    this.viewPhotos = this.photos.slice((this.activePage - 1) * this.photosPerPage, this.activePage * this.photosPerPage);
    // -->Reset: number of pages
    this.numberOfPages = [];
    // -->Set: number of pages
    for (let i = 1; i <= this.photos.length / this.photosPerPage; i++) {
      this.numberOfPages.push(i);
    }
  }

}
