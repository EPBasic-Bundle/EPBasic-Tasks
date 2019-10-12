import { Component, OnInit } from '@angular/core';
import { Book, Unity } from '../../models/model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
    pdf;
    units: Unity[];
    stringToSearch;

    book: Book;
    bookId;

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute
        ) {
            this.bookId = 28;
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.bookId = params.id;

                if (+params.page > 0) {
                    this.getBook(+params.page + 1)
                } else {
                    this.getBook();
                }
            }
        );

    }

    getBook(page = null) {
        this.apiService.get('book/' + this.bookId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.book = resp.book;

                    if (this.book.pdf_name != null) {
                        if (page == null) {
                            page = this.book.last_seen_page;
                        }

                        this.pdf = {
                            book_id: this.book.id,
                            render_text: true,
                            zoom: 0.7,
                            autoresize: true,
                            show_all: false,
                            pages_quantity: (this.book.pages_quantity * 10),
                            page,
                            src: 'https://api.store.epbasic.eu/api/book/getPDF/' + this.book.pdf_name
                        };
                    }

                    this.getUnits();
                }
            }
        );
    }

    getUnits() {
        this.apiService.get('units/' + this.book.subject_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units = resp.units;
                }
            }
        );
    }
}
