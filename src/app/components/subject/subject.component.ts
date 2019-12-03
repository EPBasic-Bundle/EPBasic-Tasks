import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Subject, Unity, Book, Task, Exam, Timetable, Evaluation } from '../../models/model';
import { environment } from '../../../environments/environment';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { ToastService } from '../../services/toast.service';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

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
    examsToDo: Exam[] = [];
    tasks: Task[];
    exams: Exam[];
    timetable: Timetable;
    subjects: Subject[];
    evaluations: Evaluation[];

    images = ['books.png', 'paper.png', 'pdf.png'];

    modal;
    imagePickerModal;
    exercisesModal;
    pdfUploaderModal;
    unityDeleteModal;
    dateSelectorModal;
    descriptionModal;
    evaluationSelectorModal;

    sUnityIdx: number;
    sBookIdx: number;
    sTaskIdx: number;
    sExamIdx: number;
    sTSubjectIdxs;

    sUnityId: number;
    sEvaluationId: number;

    dateSelectorType: number;

    settedDateTimeStart: string;
    settedDateTimeEnd: string;

    subjectId;

    selectableDays;

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;

    baseURL: string = environment.server;

    loading = [false, false];

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        public toastService: ToastService
    ) {
        this.options = { concurrency: 1, maxUploads: 3 };
        this.files = [];
        this.uploadInput = new EventEmitter<UploadInput>();
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.subjectId = +params.id;

                if (this.subjectId > 0) {
                    this.getSubject();
                    this.getBooks();
                    this.getTasksToDo();
                    this.getExamsToDo();

                    this.getSubjects();
                    this.getTimetable();
                }
            }
        );
    }

    /*****************/
    /* IMPORTACIONES */
    /*****************/

    getSubject() {
        this.loading[0] = true;

        this.apiService.get('subject/' + this.subjectId).subscribe(
            resp => {
                this.loading[0] = false;

                if (resp.status === 'success') {
                    this.subject = resp.subject;

                    this.getEvaluations();
                    this.getUnits();
                }
            }, () => this.loading[0] = false
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

                    this.autoCollapse();
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

    getExamsToDo() {
        this.apiService.get('exams/todo/' + this.subjectId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.examsToDo = resp.exams;
                }
            }
        );
    }

    getTasks(unity_id) {
        this.apiService.get('tasks/' + unity_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.tasks = resp.tasks;
                }
            }
        );
    }

    getExams(unity_id) {
        this.apiService.get('exams/' + unity_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.exams = resp.exams;
                }
            }
        );
    }

    getSubjects() {
        this.apiService.get('subjects').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects = resp.subjects;
                }
            }
        );
    }

    getTimetable() {
        this.apiService.get('timetable').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.timetable = resp.timetable;
                    this.timetable.subjects = resp.subjects;
                }
            }
        );
    }

    getEvaluations() {
        this.apiService.get('evaluations').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.evaluations = resp.evaluations;
                }
            }
        );
    }

    /***********/
    /* COLLAPSE */
    /***********/

    autoCollapse() {
        let unity_id;

        if (this.subject.current_unity > 0) {
            unity_id = this.subject.current_unity;
        } else {
            unity_id = this.units[0].id;
        }

        this.selectEvaluation(this.units.find(unity => unity.id == unity_id).evaluation_id);

        this.collapse(unity_id);
    }

    collapse(unity_id) {
        this.exams = [];
        this.tasks = [];

        if (this.sUnityId == unity_id) {
            this.sUnityId = null;
        } else {
            this.sUnityId = unity_id;

            this.getTasks(unity_id);
            this.getExams(unity_id);
        }
    }

    isCollapsed(unity_id) {
        if (this.sUnityId === unity_id) {
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

    /**************/
    /* BOOK CRUD */
    /*************/

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
                    const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this.files[index] = output.file;
                }
                break;
            case 'removed':
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

                        this.updateBook(this.books[this.sBookIdx], this.sBookIdx);
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
            evaluation_id: this.evaluations[0].id,
            number: auto_number,
            tasks: []
        });
    }

    setCurrentUnity(unity_id) {
        this.apiService.get('subject/set-current-unity/' + unity_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subject = resp.subject;

                    this.autoCollapse();
                }
            }
        );
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

                    this.autoCollapse();
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

                    if (this.unityDeleteModal) {
                        this.unityDeleteModal.close();
                    }
                }
            }
        );
    }

    /*********/
    /* TASKS */
    /*********/

    createTask() {
        if (!this.tasks) {
            this.tasks = [];
        }

        this.tasks.push({
            id: 0,
            subject_id: this.subject.id,
            book_id: null,
            unity_id: this.sUnityId,
            title: '',
            description: '',
            delivery_date: null,
            mark: null,
            done: false
        });
    }

    selectBook(book_id) {
        this.tasks[this.sTaskIdx].book_id = book_id;
    }

    createPage() {
        const task_index = this.sTaskIdx;

        if (!this.tasks[task_index].pages) {
            this.tasks[task_index].pages = [];
        }

        this.tasks[task_index].pages.push({
            id: 0,
            task_id: this.tasks[task_index].id,
            number: null,
        });
    }

    deletePageFront(index) {
        this.tasks[this.sTaskIdx].pages.splice(index, 1);
    }

    findExercise(number: number, index) {
        const page = this.tasks[this.sTaskIdx].pages[index];

        if (page.exercises) {
            return page.exercises.findIndex(exercise => exercise.number === number);
        } else {
            return -1;
        }
    }

    selectExercise(number: number, index) {
        const task_index = this.sTaskIdx;

        if (!this.tasks[task_index].pages[index].exercises) {
            this.tasks[task_index].pages[index].exercises = [];
        }

        this.tasks[task_index].pages[index].exercises.push({
            id: 0,
            page_id: null,
            number,
            done: false
        });
    }

    deleteExercise(number, index) {
        const page = this.tasks[this.sTaskIdx].pages[index];
        page.exercises.splice(this.findExercise(number, index), 1);
    }

    markTaskDone(index) {
        const taskId = this.tasks[index].id;

        this.apiService.get('task/done/' + taskId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.tasks[index] = resp.task;

                    this.getTasksToDo();
                }
            }
        );
    }

    deleteTaskFront(index) {
        this.tasks.splice(index, 1);
    }

    /**************/
    /* TASKS CRUD */
    /**************/

    storeTask(task, index) {
        this.apiService.post('task', task).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.tasks[index] = resp.task;
                    this.showToast('Tarea añadida correctamente', 'success');

                    if (this.tasks[index].delivery_date !== null) {
                        this.storeEvent(1);
                    }

                    this.getTasksToDo();
                }
            }
        );
    }

    updateTask(task, index) {
        task.pages = [];

        this.apiService.put('task/' + task.id, task).subscribe(
            resp => {
                if (resp.status === 'success') {
                    const frontTask = this.tasks[index];

                    this.tasks[index] = resp.task;
                    this.showToast('Tarea actualizada correctamente', 'success');


                    this.apiService.get('event/task/' + this.tasks[index].id).subscribe(
                        resp => {
                            if (resp.status === 'success') {
                                let event = resp.event;

                                if (event == null) {
                                    this.storeEvent(1);
                                } else {
                                    if (event.start !== this.settedDateTimeStart) {
                                        this.updateEvent(event);
                                    }
                                }
                            }
                        }
                    );

                    this.getTasksToDo();
                }
            }
        );
    }

    deleteTask(task_id, index) {
        this.apiService.delete('task/' + task_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.tasks.splice(index, 1);
                    this.showToast('Tarea eliminada correctamente', 'success');

                    this.getTasksToDo();
                }
            }
        );
    }

    /*********/
    /* EXAMS */
    /*********/

    createExam() {
        if (!this.exams) {
            this.exams = [];
        }

        this.exams.unshift({
            id: 0,
            title: '',
            description: '',
            subject_id: this.subject.id,
            unity_id: this.sUnityId,
            mark: null,
            done: false,
            exam_date: null
        });
    }

    markExamDone(index) {
        const examId = this.exams[index].id;

        this.apiService.get('exam/done/' + examId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.exams[index] = resp.exam;

                    this.getExamsToDo();
                }
            }
        );
    }

    deleteExamFront(index) {
        this.exams.splice(index, 1);
    }

    /******************/
    /* EXAMS CRUD */
    /*****************/

    storeExam(exam, index) {
        this.apiService.post('exam', exam).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.exams[index] = resp.exam;
                    this.showToast('Examen añadido correctamente', 'success');

                    if (this.exams[index].exam_date != null) {
                        this.storeEvent(2);
                    }

                    this.getExamsToDo();
                }
            }
        );
    }

    updateExam(exam, index) {
        this.apiService.put('exam/' + exam.id, exam).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.exams[index] = resp.exam;
                    this.showToast('Examen actualizado correctamente', 'success');

                    this.getExamsToDo();
                }
            }
        );
    }

    deleteExam(exam_id, index) {
        this.apiService.delete('exam/' + exam_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.exams.splice(index, 1);
                    this.showToast('Examen eliminado correctamente', 'success');

                    this.getExamsToDo();
                }
            }
        );
    }

    /******************/
    /* DATE SELECTOR */
    /*****************/

    selectTSubject(rowIndex, subjectIndex) {
        const date = new Date();

        this.sTSubjectIdxs = [subjectIndex, rowIndex];

        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        const monthDaysQ = new Date(year, month, 0).getDate();

        const diference = this.sTSubjectIdxs[0] - (date.getDay() - 1);

        let nextSubjectDay = date.getDate() + diference;

        if (diference <= 0) {
            nextSubjectDay = nextSubjectDay + 7;
        }

        let nextSubjectsDays = [];

        for (let e of [1, 2, 3, 4, 5, 6]) {
            if (e !== 1) {
                nextSubjectDay = nextSubjectDay + 7;
            }

            if (nextSubjectDay > monthDaysQ) {
                nextSubjectDay = nextSubjectDay - monthDaysQ;
                ++month;

                if (month > 12) {
                    month = 1;
                    ++year;
                }
            }

            nextSubjectsDays.push(
                {
                    year,
                    month,
                    day: nextSubjectDay,
                    hour_start: this.timetable.hours[rowIndex].hour_start,
                    hour_end: this.timetable.hours[rowIndex].hour_end
                }
            );
        }

        this.selectableDays = nextSubjectsDays;
    }

    setDate(selectedDay) {
        const settedDate = (selectedDay.year + '/' + selectedDay.month + '/' + selectedDay.day);

        this.settedDateTimeStart = (settedDate + ' ' + selectedDay.hour_start);
        this.settedDateTimeEnd = (settedDate + ' ' + selectedDay.hour_end);

        switch (this.dateSelectorType) {
            case 1:
                this.tasks[this.sTaskIdx].delivery_date = settedDate;
                break;
            case 2:
                this.exams[this.sExamIdx].exam_date = settedDate;
                break;
        }

        this.dateSelectorModal.close();
    }

    generateEvent(type) {
        let event = {
            id: null,
            start: this.settedDateTimeStart,
            end: this.settedDateTimeEnd,
            title: null,
            primary_color: this.subject.primary_color,
            secondary_color: this.subject.secondary_color,
            task_id: null,
            exam_id: null,
        }

        switch (type) {
            case 1:
                event.task_id = this.tasks[this.sTaskIdx].id;
                event.title = 'Tarea ' + this.subject.name;
                break;
            case 2:
                event.exam_id = this.exams[this.sExamIdx].id;
                event.title = 'Examen ' + this.subject.name;
                break;
        }

        return event;
    }

    /**************/
    /* EVENT CRUD */
    /*************/

    storeEvent(type) {
        this.apiService.post('event', this.generateEvent(type)).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.showToast('Evento creado correctamente', 'success');
                }
            }
        );
    }

    updateEvent(event) {
        event.start = this.settedDateTimeStart;
        event.end = this.settedDateTimeEnd;

        this.apiService.put('event/' + event.id, event).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.showToast('Evento actualizado correctamente', 'success');
                }
            }
        );
    }

    /**************/
    /* EVALUATION */
    /**************/

    changeEvaluation(evaluation_id) {
        this.units[this.sUnityIdx].evaluation_id = evaluation_id;

        this.closeEvaluationSelectorModal();
    }

    selectEvaluation(evaluation_id) {
        this.sEvaluationId = evaluation_id;
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

    openUnityDeleteModal(content, index) {
        this.sUnityIdx = index;
        this.unityDeleteModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    openDateSelectorModal(content, index, type) {
        this.dateSelectorType = type;

        switch (type) {
            case 1:
                this.sTaskIdx = index;
                break;
            case 2:
                this.sExamIdx = index;
                break;
        }

        this.dateSelectorModal = this.modalService.open(content, { size: 'xl', centered: true });
    }

    openDescriptionModal(content, index, type) {
        this.sTaskIdx = -1;
        this.sExamIdx = -1;

        switch (type) {
            case 1:
                this.sTaskIdx = index;
                break;
            case 2:
                this.sExamIdx = index;
                break;
        }

        this.descriptionModal = this.modalService.open(content, { size: 'lg', centered: true });
    }

    openEvaluationSelectorModal(content, index) {
        this.sUnityIdx = index;

        this.evaluationSelectorModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    closeUnityDeleteModal() {
        this.unityDeleteModal.close();
    }

    closePDFUploaderModal() {
        this.pdfUploaderModal.close();
    }

    closeExercisesModal() {
        this.exercisesModal.close();
    }

    closeDateSelectorModal() {
        this.dateSelectorModal.close();
    }

    changeToModal(closeModal, openModal, size, centered) {
        closeModal.close();
        this.openModal(openModal, size, centered);
    }

    closeDescriptionModal() {
        this.descriptionModal.close();
    }

    closeEvaluationSelectorModal() {
        this.evaluationSelectorModal.close();
    }

    /*********/
    /* FINDS */
    /*********/

    findBook(book_id) {
        return this.books.find(book => book.id === book_id);
    }

    findSubject(subject_id: number) {
        return this.subjects.find(subject => subject.id === subject_id);
    }

    /*********/
    /* OTROS */
    /*********/

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
