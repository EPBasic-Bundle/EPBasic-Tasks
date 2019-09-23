import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Subject, Unit, Book } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
    subject: Subject;
    units: Unit[] = [
        {
            id: 1,
            subject_id: 1,
            number: 2,
            tasks: [
                {
                    id: 1,
                    subject_id: 1,
                    book_id: 1,
                    title: 'Elefantes para merendar',
                    description: 'Elefantes para comer',
                    delivery_date: '2019-09-23',
                    done: true,
                }
            ]
        },
        {
            id: 2,
            subject_id: 1,
            number: 3,
            tasks: [
                {
                    id: 1,
                    subject_id: 1,
                    book_id: 1,
                    title: 'Elefantes para merendar',
                    description: 'Elefantes para comer',
                    delivery_date: '2019-09-23',
                    done: false,
                },
                {
                    id: 1,
                    subject_id: 1,
                    book_id: 1,
                    title: 'Elefantes para merendar',
                    description: 'Elefantes para comer',
                    delivery_date: '2019-09-23',
                    done: true,
                }
            ]
        }
    ];

    books: Book[] = [];

    modal;
    selectedUnity;
    subjectId;
    loading: boolean;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.subjectId = params.id;

                this.getSubject();
                this.getBooks();
            }
        );
    }

    /*****************/
    /* IMPORTACIONES */
    /*****************/

    getSubject() {
        this.apiService.get('subject/' + this.subjectId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subject = resp.subject;
                }
            }
        );
    }

    getBooks() {
        this.apiService.get('books/' + this.subjectId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.books = resp.books;
                }
            }
        );
    }

    /***********/
    /* COLAPSE */
    /***********/

    collapse(unity_id) {
        if (this.selectedUnity === unity_id) {
            this.selectedUnity = null;
        } else {
            this.selectedUnity = unity_id;
        }
    }

    isCollapsed(unity_id) {
        if (this.selectedUnity === unity_id) {
            return false;
        } else {
            return true;
        }
    }

    /*********/
    /* BOOKS */
    /*********/

    createBook() {
        this.books.push({
            id: 0,
            name: '',
            subject_id: this.subject.id,
            pages_quantity: 0,
            image: null
        });
    }


    deleteBookFront(index) {
        this.books.splice(index, 1);
    }

     /******************/
    /* SUBJECT CRUD */
    /*****************/

    storeBook(book) {
        this.loading = true;
        this.apiService.post('book', book).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getBooks();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    updateBook(book) {
        this.loading = true;
        this.apiService.put('book/' + book.id, book).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getBooks();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    deleteBook(book_id) {
        this.loading = true;
        this.apiService.delete('book/' + book_id).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getBooks();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    /*********/
    /* Units */
    /*********/

    createUnit() {
        this.units.push({
            id: 0,
            subject_id: this.subject.id,
            number: 0,
            tasks: []
        });
    }


    deleteUnitFront(index) {
        this.units.splice(index, 1);
    }

    /**********/
    /* MODALS */
    /**********/

    openModal(content, size, centered) {
        this.modal = this.modalService.open(content, { size, centered });
    }

}
