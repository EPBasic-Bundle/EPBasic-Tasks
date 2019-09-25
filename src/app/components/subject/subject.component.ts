import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Subject, Unity, Book } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
    subject: Subject;
    units: Unity[] = [];

    images = ['books.png', 'paper.png'];

    books: Book[] = [];

    modal;
    selectedUnity: number;
    selectedBookIndex: number;
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
                this.getUnits();
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

    getUnits() {
        this.apiService.get('units/' + this.subjectId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units = resp.units;
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
            image: 'default.png'
        });
    }

    selectImage(image) {
        this.books[this.selectedBookIndex].image = image;

        this.modal.close();
    }

    deleteBookFront(index) {
        this.books.splice(index, 1);
    }

    /******************/
    /* BOOK CRUD */
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

    createUnity() {
        let auto_number = 1;

        if (this.units[0]) {
            auto_number = 1 + this.units[this.units.length - 1].number;
        }

        this.units.push({
            id: 0,
            subject_id: this.subject.id,
            number: auto_number,
            tasks: []
        });
    }


    deleteUnityFront(index) {
        this.units.splice(index, 1);
    }

    /******************/
    /* UNITS CRUD */
    /*****************/

    storeUnity(unity) {
        this.loading = true;
        this.apiService.post('unity', unity).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getUnits();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    updateUnity(unity) {
        this.loading = true;
        this.apiService.put('unity/' + unity.id, unity).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getUnits();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    deleteUnity(unity_id) {
        if (this.selectedUnity === unity_id) {
            this.selectedUnity = null;
        }

        this.loading = true;
        this.apiService.delete('unity/' + unity_id).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getUnits();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    /**********/
    /* MODALS */
    /**********/

    openModal(content, size, centered) {
        this.modal = this.modalService.open(content, { size, centered });
    }

    openImagePickerModal(content, index) {
        this.selectedBookIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm', centered: true });
    }
}
