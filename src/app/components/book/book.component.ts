import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
    pdf;
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

                this.getBook();
            }
        );
    }

    getBook() {
        this.apiService.get('book/' + this.bookId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.book = resp.book;

                    if (this.book.pdf_name != null) {
                        this.pdf = {
                            render_text: true,
                            zoom: 0.7,
                            autoresize: true,
                            show_all: false,
                            page: 1,
                            src: 'https://api.store.epbasic.eu/api/book/getPDF/' + this.book.pdf_name
                        };
                    }
                }
            }
        );
    }
}
