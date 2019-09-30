import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Subject, Unity, Book, Task } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
    subject: Subject;
    units: Unity[] = [];
    books: Book[] = [];
    tasksToDo: Task[] = [];

    images = ['books.png', 'paper.png'];

    modal;
    imagePickerModal;
    exercisesModal;

    sUnityIdx: number;
    sBookIdx: number;
    sTaskIdx: number;

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
                this.getTasksToDo();
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

    getTasksToDo() {
        this.apiService.get('tasks/todo/' + this.subjectId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.tasksToDo = resp.tasks;
                }
            }
        );
    }

    getTasks(unity_index) {
        this.apiService.get('tasks/' + this.units[unity_index].id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[unity_index].tasks = resp.tasks;
                }
            }
        );
    }

    /***********/
    /* COLAPSE */
    /***********/

    collapse(unity_index) {
        if (this.sUnityIdx === unity_index) {
            this.sUnityIdx = null;
        } else {
            this.sUnityIdx = unity_index;

            if (this.units[unity_index].id !== 0) {
                this.getTasks(unity_index);
            }
        }
    }

    isCollapsed(unity_index) {
        if (this.sUnityIdx === unity_index) {
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
        this.books[this.sBookIdx].image = image;

        this.imagePickerModal.close();
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
            auto_number = 1 + this.units[0].number;
        }

        this.units.unshift({
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
        if (this.sUnityIdx === unity_id) {
            this.sUnityIdx = null;
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
        const unity_index = this.sUnityIdx;

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
        this.units[this.sUnityIdx].tasks[this.sTaskIdx].book_id = book_id;
    }

    createPage() {
        const unity_index = this.sUnityIdx;
        const task_index = this.sTaskIdx;

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
        this.units[this.sUnityIdx].tasks[this.sTaskIdx].pages.splice(index, 1);
    }

    findExercise(number: number, index) {
        const page = this.units[this.sUnityIdx].tasks[this.sTaskIdx].pages[index];

        if (page.exercises) {
            return page.exercises.findIndex(exercise => exercise.number === number);
        } else {
            return -1;
        }
    }

    selectExercise(number: number, index) {
        const unity_index = this.sUnityIdx;
        const task_index = this.sTaskIdx;

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
        const page = this.units[this.sUnityIdx].tasks[this.sTaskIdx].pages[index];
        page.exercises.splice(this.findExercise(number, index), 1);
    }

    deleteTaskFront(index) {
        this.units[this.sUnityIdx].tasks.splice(index, 1);
    }

    /**************/
    /* TASKS CRUD */
    /**************/

    storeTask(task, index) {
        this.loading = true;
        this.apiService.post('task', task).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.units[this.sUnityIdx].tasks[index] = resp.task;
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
                    this.units[this.sUnityIdx].tasks[index] = resp.task;
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
                    this.units[this.sUnityIdx].tasks.splice(index, 1);
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
        this.sBookIdx = index;
        this.imagePickerModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    openExercisesModal(content, index) {
        this.sTaskIdx = index;
        this.exercisesModal = this.modalService.open(content, { centered: true });
    }

    closeExercisesModal() {
        this.exercisesModal.close();
    }

    /*********/
    /* OTROS */
    /*********/

    findBook(book_id) {
        return this.books.find(book => book.id === book_id);
    }
}
