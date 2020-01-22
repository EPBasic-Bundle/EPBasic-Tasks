import { Component, OnInit } from '@angular/core';
import { Evaluation, Subject, ReportCard } from '../../models/model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-marks',
    templateUrl: './marks.component.html',
    styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements OnInit {
    evaluations: Evaluation[] = [];
    report_cards: ReportCard[] = [];

    subjects: Subject[] = [];
    subject: Subject;

    sEvaluationId: number = null;
    sType: number = null;

    loading: boolean;
    editMode: boolean = false;

    rows: number;
    rowIndex: number;

    sUnityId: number;

    tasks_marks = [];
    exams_marks = [];
    projects_marks = [];

    constructor(
        private apiService: ApiService,
        public toastService: ToastService
    ) { }

    ngOnInit() {
        this.getEvaluations();
        this.getSubjects();
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

    getEvaluations() {
        this.loading = true;

        this.apiService.get('evaluations').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.evaluations = resp.evaluations;

                    this.getReportCards();
                }
            }, () => {
                this.loading = false;
            }
        );
    }

    getReportCards() {
        this.loading = true;

        this.apiService.get('report-cards').subscribe(
            resp => {
                this.loading = false;

                if (resp.status === 'success') {
                    this.report_cards = resp.report_cards;
                }
            }, () => {
                this.loading = false;
            }
        );
    }

    selectEvaluation(evaluation_id) {
        this.sEvaluationId = evaluation_id;
    }

    storeReportCard(report_card) {
        this.apiService.post('report-card', report_card).subscribe(
            resp => {
                if (resp.status === 'success') {
                    if (report_card.id != 0) {
                        this.showToast('Boletín actualizado correctamente', 'success');
                    } else {
                        this.showToast('Boletín creado correctamente', 'success');
                    }

                    this.getReportCards();
                }
            }
        );
    }

    undefine() {
        this.sEvaluationId = null;
        this.sType = null;
    }

    /**************/
    /* CALCULADOR */
    /**************/

    getSubject(id) {
        this.apiService.get('subject/evaluationWithAll/' + id + '/' + this.sEvaluationId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subject = resp.subject;
                    this.clearData();
                }
            }
        );
    }

    collapse(unity_id) {
        if (this.sUnityId == unity_id) {
            this.sUnityId = null;
        } else {
            this.sUnityId = unity_id;
        }
    }

    isCollapsed(unity_id) {
        if (this.sUnityId === unity_id) {
            return false;
        } else {
            return true;
        }
    }

    addMark(object, type) {
        switch (type) {
            case 1: {
                if (this.isAdded(object.id, type) == true) {
                    this.tasks_marks.splice(
                        this.tasks_marks.findIndex(task_mark => task_mark.id === object.id), 1
                    );
                } else {
                    let mark = 0;

                    if (this.subject.tasks_has_mark == true) {
                        mark = object.mark;
                    } else if (object.done == true) {
                        mark = 10;
                    }

                    this.tasks_marks.push({
                        'id': object.id,
                        'title': object.title,
                        'mark': mark
                    });
                }
                break;
            }
            case 2: {
                if (this.isAdded(object.id, type) == true) {
                    this.exams_marks.splice(
                        this.exams_marks.findIndex(exams_mark => exams_mark.id === object.id), 1
                    );
                } else {
                    this.exams_marks.push({
                        'id': object.id,
                        'title': object.title,
                        'mark': object.mark
                    });
                }
                break;
            }
            case 3: {
                if (this.isAdded(object.id, type) == true) {
                    this.projects_marks.splice(
                        this.projects_marks.findIndex(projects_mark => projects_mark.id === object.id), 1
                    );
                } else {
                    this.projects_marks.push({
                        'id': object.id,
                        'title': object.title,
                        'mark': object.mark
                    });
                }
                break;
            }
        }
    }

    isAdded(id, type) {
        switch (type) {
            case 1: {
                if (this.tasks_marks.findIndex(task_mark => task_mark.id === id) >= 0) {
                    return true;
                }
                return false;
            }
            case 2: {
                if (this.exams_marks.findIndex(exam_mark => exam_mark.id === id) >= 0) {
                    return true;
                }
                return false;
            }
            case 3: {
                if (this.projects_marks.findIndex(project_mark => project_mark.id === id) >= 0) {
                    return true;
                }
                return false;
            }
        }
    }

    calcTotal(marks) {
        if (marks[0]) {
            let calc = 0;

            for (let i = 0; i < marks.length; i++) {
                calc += parseFloat(marks[i].mark);
            }

            return Math.round((calc / marks.length) * 100) / 100;
        }

        return 0;
    }

    calcAverage(marks, percentage) {
        if (marks[0]) {
            let calc = 0;

            for (let i = 0; i < marks.length; i++) {
                calc += parseFloat(marks[i].mark);
            }

            return Math.round(((calc / marks.length) * +percentage)) / 100;
        }

        return 0;
    }

    clearData() {
        this.tasks_marks = [];
        this.exams_marks = [];
        this.projects_marks = [];
    }

    /*********/
    /* OTROS */
    /*********/

    findSubject(subject_id: number) {
        const subject = this.subjects.find(subject => subject.id === subject_id);

        if (subject == null) {
            return { name: 'Error' };
        }

        return subject;
    }

    findEvaluationIdx(evaluation_id) {
        return this.evaluations.findIndex(evaluation => evaluation.id === evaluation_id);
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
