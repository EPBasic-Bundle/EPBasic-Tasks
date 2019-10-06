import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Subject, Unity, Book, Task } from '../../models/model';
import { environment } from '../../../environments/environment';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { ToastService } from '../../services/toast.service';

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
    pdfUploaderModal;

    sUnityIdx: number;
    sBookIdx: number;
    sTaskIdx: number;

    subjectId;

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;

    baseURL: string = environment.server;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        public toastService: ToastService
    ) {
        this.options = { concurrency: 1, maxUploads: 3 };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

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
            last_seen_page: null,
            image: 'default.png',
            pdf_name: null
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
        this.apiService.post('book', book).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.books[index] = resp.book;
                    this.showToast('Libro añadido correctamente', 'success');
                }
            }
        );
    }

    updateBook(book, index) {
        this.apiService.put('book/' + book.id, book).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.books[index] = resp.book;
                    this.showToast('Libro actualizado correctamente', 'success');
                }
            }
        );
    }

    deleteBook(book_id, index) {
        this.apiService.delete('book/' + book_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.books.splice(index, 1);
                    this.showToast('Libro eliminado correctamente', 'success');
                }
            }
        );
    }

    // SUBIDA
    onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this.files.push(output.file);
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    // update current data in files array for uploading file
                    const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this.files[index] = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this.files = this.files.filter((file: UploadFile) => file !== output.file);
                break;
            case 'dragOver':
                this.dragOver = true;
                break;
            case 'dragOut':
            case 'drop':
                this.dragOver = false;
                break;
            case 'done':
                this.files.forEach(
                    file => {
                        this.books[this.sBookIdx].pdf_name = file.response.pdf;
                        console.log(file.response);
                        this.pdfUploaderModal.close();
                    }
                );
                break;
        }
    }

    startUpload(url): void {
        const event: UploadInput = {
            type: 'uploadAll',
            url: this.baseURL + url + '/' + this.books[this.sBookIdx].id,
            method: 'POST',
            data: { foo: 'file' },
            headers: { 'Authorization': this.apiService.token }
        };

        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
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
        this.apiService.post('unity', unity).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[index] = resp.unity;
                    this.showToast('Unidad añadida correctamente', 'success');
                }
            }
        );
    }

    updateUnity(unity, index) {
        this.apiService.put('unity/' + unity.id, unity).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[index] = resp.unity;
                    this.showToast('Unidad actualizada correctamente', 'success');
                }
            }
        );
    }

    deleteUnity(unity_id, index) {
        if (this.sUnityIdx === unity_id) {
            this.sUnityIdx = null;
        }

        this.apiService.delete('unity/' + unity_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units.splice(index, 1);
                    this.showToast('Unidad eliminada correctamente', 'success');
                }
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
        this.apiService.post('task', task).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[this.sUnityIdx].tasks[index] = resp.task;
                    this.showToast('Tarea añadida correctamente', 'success');
                }
            }
        );
    }

    updateTask(task, index) {
        task.pages = [];

        this.apiService.put('task/' + task.id, task).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[this.sUnityIdx].tasks[index] = resp.task;
                    this.showToast('Tarea actualizada correctamente', 'success');
                }
            }
        );
    }

    deleteTask(task_id, index) {
        this.apiService.delete('task/' + task_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[this.sUnityIdx].tasks.splice(index, 1);
                    this.showToast('Tarea eliminada correctamente', 'success');
                }
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

    openPDFUploaderModal(content, index) {
        this.sBookIdx = index;
        this.pdfUploaderModal = this.modalService.open(content, { centered: true });
    }


    openExercisesModal(content, index) {
        this.sTaskIdx = index;
        this.exercisesModal = this.modalService.open(content, { centered: true });
    }

    closeExercisesModal() {
        this.exercisesModal.close();
    }

    closePDFUploaderModal() {
        this.pdfUploaderModal.close();
    }

    /*********/
    /* OTROS */
    /*********/

    findBook(book_id) {
        return this.books.find(book => book.id === book_id);
    }

    showToast(text, type) {
        switch (type) {
            case 'success': {
                this.toastService.show(text, { classname: 'bg-dark text-light', delay: 5000 });
                break;
            }
            case 'danger': {
                this.toastService.show(text, { classname: 'bg-danger text-light', delay: 5000 });
                break;
            }
        }
    }
}
