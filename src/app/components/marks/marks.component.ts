import { Component, OnInit } from '@angular/core';
import { Evaluation, Subject } from '../../models/model';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-marks',
    templateUrl: './marks.component.html',
    styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements OnInit {
    evaluations: Evaluation[] = [];
    sEvaluations: Evaluation[] = [];

    subjects: Subject[] = [];

    sEvaluationId: number;

    loading: boolean;
    editMode: boolean = false;

    rows: number;
    rowIndex: number;

    constructor(
        private apiService: ApiService
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

        this.apiService.get('evaluations/marks').subscribe(
            resp => {
                this.loading = false;

                if (resp.status === 'success') {
                    this.evaluations = resp.evaluations;

                    this.sEvaluationId = this.evaluations[0].id;
                }
            }, () => {
                this.loading = false;
            }
        );
    }

    selectEvaluation(evaluation_id) {
        this.sEvaluationId = evaluation_id;
    }

    saveMarks() {

    }

    addRows(rows) {
        const index = this.findEvaluationIdx(this.sEvaluationId);

        let number;

        for (let i of Array(rows)) {

            if (!this.evaluations[0]) {
                number = 0;
            } else {
                number = this.evaluations[index].marks.length;
            }

            this.evaluations[index].marks.splice(this.rowIndex, 0, {
                id: null,
                subject_id: this.subjects[number].id,
                evaluation_id: this.evaluations[index].id,
                mark_wd: 0,
                mark: 0
            });
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
}
