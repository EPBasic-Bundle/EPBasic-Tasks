import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject, Timetable, Study } from '../../models/model';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    timetable: Timetable;
    subjects: Subject[] = [];
    subjectsOfDay;
    subjectsOfTomorrow: boolean;
    cSubjectsIds = [];
    weekDay;
    dayHour;

    studies: Study[] = [];

    loading = [false, false];

    sYearIdx;
    sStudyIdx;

    step = 1;
    editMode: boolean = false;

    constructor(
        private apiService: ApiService,
        public toastService: ToastService
    ) { }

    ngOnInit() {
        this.timeNow();
        this.getSubjectsWithAll();
        this.getTimetable();
        this.getStudies();
    }

    /*****************/
    /* IMPORTACIONES */
    /*****************/

    getTimetable() {
        this.loading[1] = true;

        this.apiService.get('timetable').subscribe(
            resp => {
                this.loading[1] = false;

                if (resp.status === 'success') {
                    this.timetable = resp.timetable;
                    this.timetable.subjects = resp.subjects;

                    const lastSubject = this.toMins(this.timetable.hours[this.timetable.hours.length - 1].hour_end);

                    if (lastSubject < this.toMins(this.dayHour)) {
                        if (this.weekDay >= 0 && this.weekDay < 4) {
                            this.subjectsOfTomorrow = true;
                        }

                        this.getSubjectsOfDay(1);
                    } else {
                        this.getSubjectsOfDay();
                    }
                }
            }, () => this.loading[1] = false
        );
    }

    getSubjectsWithAll() {
        this.loading[0] = true;

        this.apiService.get('subjects/allToDo').subscribe(
            resp => {
                this.loading[0] = false;

                if (resp.status === 'success') {
                    this.subjects = resp.subjects;

                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < this.subjects.length; i++) {
                        if (this.subjects[i].tasks[0] || this.subjects[i].exams[0]) {
                            this.collapse(this.subjects[i].id);
                        }
                    }
                }
            }, () => this.loading[0] = false
        );
    }

    getStudies() {
        this.apiService.get('studies').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies = resp.studies;

                    for (let i = 0; i < this.studies.length; i++) {
                        for (let e = 0; e < this.studies[i].years.length; e++) {
                            this.studies[i].years[e].start = this.formatDate(this.studies[i].years[e].start);
                            this.studies[i].years[e].end = this.formatDate(this.studies[i].years[e].end);

                            for (let o = 0; o < this.studies[i].years[e].evaluations.length; o++) {
                                this.studies[i].years[e].evaluations[o].start = this.formatDate(this.studies[i].years[e].evaluations[o].start);
                                this.studies[i].years[e].evaluations[o].end = this.formatDate(this.studies[i].years[e].evaluations[o].end);
                            }
                        }
                    }

                    console.log(this.studies);
                }
            }
        );
    }

    /*************/
    /* FUNCIONES */
    /*************/

    addZero(number: number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }

    getSubjectsOfDay(add = 0) {
        this.subjectsOfDay = [];
        let subjectRow;

        for (subjectRow of this.timetable.subjects) {
            this.subjectsOfDay.push(subjectRow[this.weekDay + add]);
        }
    }

    findSubject(subject_id: number) {
        const subjectData = this.subjects.find(subject => subject.id === subject_id);

        if (subjectData == null) {
            return {
                id: null,
                name: 'Error',
                primary_color: [{
                    id: null,
                    name: null
                }],
                secondary_color: [{
                    id: null,
                    name: null
                }]
            };
        }

        return subjectData;
    }

    inSubjectTime(h0, h1) {
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        return this.toMins(h0) <= mins && mins <= this.toMins(h1);
    }

    toMins(h) {
        const b = h.split(':');
        return b[0] * 60 + + b[1];
    }

    timeNow() {
        const date = new Date();
        this.weekDay = date.getDay() - 1;
        this.dayHour = date.getHours() + ':' + this.addZero(date.getMinutes());
    }

    /***********/
    /* COLAPSE */
    /***********/

    collapse(subject_id) {
        const cSubjectsIndex = this.cSubjectsIds.findIndex(i => i === subject_id);

        if (cSubjectsIndex >= 0) {
            this.cSubjectsIds.splice(cSubjectsIndex, 1);
        } else {
            this.cSubjectsIds.push(subject_id);
        }
    }

    isCollapsed(subject_id) {
        const cSubjectsIndex = this.cSubjectsIds.findIndex(i => i === subject_id);

        if (cSubjectsIndex >= 0) {
            return false;
        } else {
            return true;
        }
    }

    markTaskDone(subject_index, task_index) {
        const taskId = this.subjects[subject_index].tasks[task_index].id;

        this.apiService.get('task/done/' + taskId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects[subject_index].tasks.splice(task_index, 1);
                }
            }
        );
    }

    markExamDone(subject_index, exam_index) {
        const examId = this.subjects[subject_index].exams[exam_index].id;

        this.apiService.get('exam/done/' + examId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects[subject_index].exams.splice(exam_index, 1);
                }
            }
        );
    }

    /*********/
    /* STUDY */
    /*********/

    createStudy() {
        this.studies.push({
            id: 0,
            name: '',
        });
    }

    deleteStudyFront(index) {
        this.studies.splice(index, 1);
    }

    selectStudy(index) {
        this.sStudyIdx = index;

        this.step = 2;
    }

    /***************/
    /* STUDY CRUD */
    /**************/

    storeStudy(study, index) {
        this.apiService.post('study', study).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[index] = resp.study;
                    this.showToast('Estudio añadido correctamente', 'success');
                }
            }
        );
    }

    updateStudy(study, index) {
        this.apiService.put('study/' + study.id, study).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[index] = resp.study;
                    this.showToast('Estudio actualizado correctamente', 'success');
                }
            }
        );
    }

    deleteStudy(study_id, index) {
        this.apiService.delete('study/' + study_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies.splice(index, 1);
                    this.showToast('Estudio eliminado correctamente', 'success');
                }
            }
        );
    }

    /********/
    /* YEAR */
    /********/

    createYear() {
        if (!this.studies[this.sStudyIdx].years) {
            this.studies[this.sStudyIdx].years = [];
        }

        this.studies[this.sStudyIdx].years.push({
            id: 0,
            start: null,
            end: null,
            study_id: this.studies[this.sStudyIdx].id
        });
    }

    deleteYearFront(index) {
        this.studies[this.sStudyIdx].years.splice(index, 1);
    }

    selectYear(index) {
        this.sYearIdx = index;

        this.step = 3;
    }

    /***************/
    /* YEAR CRUD */
    /**************/

    storeYear(year, index) {
        year.start = this.formatDateDB(year.start);
        year.end = this.formatDateDB(year.end);

        this.apiService.post('year', year).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[this.sStudyIdx].years[index] = resp.year;

                    this.studies[this.sStudyIdx].years[index].start = this.formatDate(resp.year.start);
                    this.studies[this.sStudyIdx].years[index].end = this.formatDate(resp.year.end);

                    this.showToast('Año añadido correctamente', 'success');
                }
            }
        );
    }

    updateYear(year, index) {
        year.start = this.formatDateDB(year);
        year.end = this.formatDateDB(year);

        this.apiService.put('year/' + year.id, year).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[this.sStudyIdx].years[index] = resp.year;

                    this.studies[this.sStudyIdx].years[index].start = this.formatDate(resp.year.start);
                    this.studies[this.sStudyIdx].years[index].end = this.formatDate(resp.year.end);

                    this.showToast('Año actualizado correctamente', 'success');
                }
            }
        );
    }

    deleteYear(year_id, index) {
        this.apiService.delete('year/' + year_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[this.sStudyIdx].years.splice(index, 1);
                    this.showToast('Año eliminado correctamente', 'success');
                }
            }
        );
    }

    /**************/
    /* EVALUATION */
    /**************/

    createEvaluation() {
        if (!this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations) {
            this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations = [];
        }

        this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations.push({
            id: 0,
            start: null,
            end: null,
            year_id: this.studies[this.sStudyIdx].years[this.sYearIdx].id,
        });
    }

    deleteEvaluationFront(index) {
        this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations.splice(index, 1);
    }

    /***************/
    /* STUDY CRUD */
    /**************/

    storeEvaluation(evaluation, index) {
        evaluation.start = this.formatDateDB(evaluation.start);
        evaluation.end = this.formatDateDB(evaluation.end);

        this.apiService.post('evaluation', evaluation).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations[index] = resp.evaluation;

                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations[index].start = this.formatDate(resp.evaluation.start);
                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations[index].end = this.formatDate(resp.evaluation.end);

                    this.showToast('Evaluación añadido correctamente', 'success');
                }
            }
        );
    }

    updateEvaluation(evaluation, index) {
        evaluation.start = this.formatDateDB(evaluation);
        evaluation.end = this.formatDateDB(evaluation);

        this.apiService.put('evaluation/' + evaluation.id, evaluation).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations[index] = resp.evaluation;

                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations[index].start = this.formatDate(resp.evaluation.start);
                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations[index].end = this.formatDate(resp.evaluation.end);

                    this.showToast('Evaluación actualizado correctamente', 'success');
                }
            }
        );
    }

    deleteEvaluation(evaluation_id, index) {
        this.apiService.delete('evaluation/' + evaluation_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.studies[this.sStudyIdx].years[this.sYearIdx].evaluations.splice(index, 1);
                    this.showToast('Evaluación eliminado correctamente', 'success');
                }
            }
        );
    }

    /*********/
    /* OTROS */
    /*********/

    goBack() {
        this.step = this.step - 1;
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

    formatDateDB(date) {
        return (date.year + '-' + date.month + '-' + date.day);
    }

    formatDate(date) {
        date = new Date(date);

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }
}
