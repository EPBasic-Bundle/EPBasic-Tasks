import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
    pdf;

    constructor() { }

    ngOnInit() {
        this.pdf = {
            render_text: true,
            zoom: 0.7,
            autoresize: true,
            show_all: 'false',
            show_borders: true,
            page: 20,
            src: './assets/mme.pdf'
        };
    }

}
