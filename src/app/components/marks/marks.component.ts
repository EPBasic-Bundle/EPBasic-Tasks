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

    getSubject(id) {
        this.apiService.get('subject/evaluationWithAll/' + id + '/' + this.sEvaluationId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subject = resp.subject;
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
