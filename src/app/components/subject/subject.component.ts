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
    selectedUnityIndex: number;
    selectedBookIndex: number;
    selectedTaskIndex: number;
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

    collapse(unity_index) {
        if (this.selectedUnityIndex === unity_index) {
            this.selectedUnityIndex = null;
        } else {
            this.selectedUnityIndex = unity_index;

            this.apiService.get('tasks/' + this.units[unity_index].id).subscribe(
                resp => {
                    if (resp.status === 'success') {
                        this.units[unity_index].tasks = resp.tasks;
                    }
                }
            );
        }
    }

    isCollapsed(unity_index) {
        if (this.selectedUnityIndex === unity_index) {
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

    storeBook(book, index) {
        this.loading = true;
        this.apiService.post('book', book).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.books[index] = resp.book;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    updateBook(book, index) {
        this.loading = true;
        this.apiService.put('book/' + book.id, book).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.books[index] = resp.book;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    deleteBook(book_id, index) {
        this.loading = true;
        this.apiService.delete('book/' + book_id).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.books.splice(index, 1);
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

    storeUnity(unity, index) {
        this.loading = true;
        this.apiService.post('unity', unity).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units[index] = resp.unity;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    updateUnity(unity, index) {
        this.loading = true;
        this.apiService.put('unity/' + unity.id, unity).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units[index] = resp.unity;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    deleteUnity(unity_id, index) {
        if (this.selectedUnityIndex === unity_id) {
            this.selectedUnityIndex = null;
        }

        this.loading = true;
        this.apiService.delete('unity/' + unity_id).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units.splice(index, 1);
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    /*********/
    /* TASKS */
    /*********/

    createTask() {
        const unity_index = this.selectedUnityIndex;

        if (!this.units[unity_index].tasks) {
            this.units[unity_index].tasks = [];
        }

        this.units[unity_index].tasks.push({
            id: 0,
            subject_id: this.subject.id,
            book_id: null,
            unity_id: this.units[unity_index].id,
            title: '',
            description: '',
            delivery_date: null,
            done: false
        });
    }

    selectBook(book_id) {
        this.units[this.selectedUnityIndex].tasks[this.selectedTaskIndex].book_id = book_id;
    }

    createPage() {
        const unity_index = this.selectedUnityIndex;
        const task_index = this.selectedTaskIndex;

        if (!this.units[unity_index].tasks[task_index].pages) {
            this.units[unity_index].tasks[task_index].pages = [];
        }

        this.units[unity_index].tasks[task_index].pages.push({
            id: 0,
            task_id: this.units[unity_index].tasks[task_index].id,
            number: null,
        });
    }

    deletePageFront(index) {
        this.units[this.selectedUnityIndex].tasks[this.selectedTaskIndex].pages.splice(index, 1);
    }

    findExercise(number: number, index) {
        const page = this.units[this.selectedUnityIndex].tasks[this.selectedTaskIndex].pages[index];

        if (page.exercises) {
            return page.exercises.findIndex(exercise => exercise.number === number);
        } else {
            return -1;
        }
    }

    selectExercise(number: number, index) {
        const unity_index = this.selectedUnityIndex;
        const task_index = this.selectedTaskIndex;

        if (!this.units[unity_index].tasks[task_index].pages[index].exercises) {
            this.units[unity_index].tasks[task_index].pages[index].exercises = [];
        }

        this.units[unity_index].tasks[task_index].pages[index].exercises.push({
            id: 0,
            page_id: null,
            number,
            done: false
        });
    }

    deleteExercise(number, index) {
        const page = this.units[this.selectedUnityIndex].tasks[this.selectedTaskIndex].pages[index];
        page.exercises.splice(this.findExercise(number, index), 1);
    }

    deleteTaskFront(index) {
        this.units[this.selectedUnityIndex].tasks.splice(index, 1);
    }

    /**************/
    /* TASKS CRUD */
    /**************/

    storeTask(task, index) {
        console.log(task);
        this.loading = true;
        this.apiService.post('task', task).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units[this.selectedUnityIndex].tasks[index] = resp.task;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    updateTask(task, index) {
        task.pages = [];

        this.loading = true;
        this.apiService.put('task/' + task.id, task).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units[this.selectedUnityIndex].tasks[index] = resp.task;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    deleteTask(task_id, index) {
        this.loading = true;
        this.apiService.delete('task/' + task_id).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units[this.selectedUnityIndex].tasks.splice(index, 1);
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

    openExercisesModal(content, index) {
        this.selectedTaskIndex = index;
        this.modal = this.modalService.open(content, { centered: true });
    }
}
