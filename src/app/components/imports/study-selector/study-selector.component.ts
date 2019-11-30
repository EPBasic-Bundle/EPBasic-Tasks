import { Component, OnInit } from '@angular/core';
import { Study } from '../../../models/model';
import { ToastService } from '../../../services/toast.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-study-selector',
    templateUrl: './study-selector.component.html',
    styleUrls: ['./study-selector.component.scss']
})
export class StudySelectorComponent implements OnInit {
    studies: Study[] = [];

    sYearIdx;
    sStudyIdx;

    step = 1;
    editMode: boolean = false;

    constructor(
        private apiService: ApiService,
        public toastService: ToastService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.getStudies();
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
    changeYear(year_id) {
        this.apiService.get('change-year/' + year_id).subscribe(
            resp => {
                this.apiService.setStorage(resp);

                this.router.navigate(['/']);
            }
        );
    }

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
