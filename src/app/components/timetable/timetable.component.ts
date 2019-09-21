import { Component, OnInit } from '@angular/core';
import { Subject, Timetable } from '../../models/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
    subject: Subject;
    loading: boolean;

    rows: number;
    rowIndex: number;
    modal;

    selectedSubject: number;
    editionActivatedInRow: number;
    editionActivatedInSubject: number;

    subjects: Subject[];

    timetable: Timetable;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal
    ) {
        this.subject = new Subject(null, null, null, null);
    }

    ngOnInit() {
        this.getSubjects();
        this.getTimetable();
    }

    getSubjects() {
        this.apiService.get('subjects').subscribe(
            resp => {
                this.subjects = resp.subjects;
            }
        );
    }

    getTimetable () {
        this.apiService.get('timetable').subscribe(
            resp => {
                this.timetable = resp.timetable;
                this.timetable.subjects = resp.subjects;
            }
        );
    }

    openModal(content, size) {
        this.modal = this.modalService.open(content, { size });
    }

    createTable() {
        this.timetable = {
            id: 1,
            user_id: 1,
            rows: this.rows,
            hours: [],
            subjects: []
        }

        this.addRows(+this.rows);
    }

    addRows(rows) {
        this.rows = +this.rows;

        let subjects;
        this.timetable.subjects;

        for (let e of Array(rows)) {
            subjects = [];

            this.timetable.hours.push(
                {
                    id: null,
                    hour_start: '00:00',
                    hour_end: '23:59',
                }
            );

            for (let i of Array(5)) {
                subjects.push(
                    {
                        id: null,
                        subject_id: this.subjects[0].id,
                    }
                );
            }

            this.timetable.subjects.splice(this.rowIndex, 0, subjects);
        }
    }

    findSubject(subject_id) {
        return this.subjects.find(subject => subject.id === subject_id);
    }

    deleteRow(index) {
        this.timetable.subjects.splice(index, 1);
        this.timetable.hours.splice(index, 1);
    }

    activateEdition(rowIndex, subjectIndex) {
        this.editionActivatedInRow = rowIndex;
        this.editionActivatedInSubject = subjectIndex;
    }

    editionActivated(rowIndex, subjectIndex) {
        if (this.editionActivatedInRow == rowIndex && this.editionActivatedInSubject == subjectIndex) {
            return true;
        } else {
            return false;
        }
    }

    updateCell(rowIndex, subjectIndex) {
        this.timetable.subjects[rowIndex][subjectIndex].subject_id = +this.selectedSubject;

        this.selectedSubject = null;
    }

    storeTimetable() {
        this.loading = true;
        this.apiService.post('timetable', this.timetable).subscribe(
            resp => {
                this.loading = false;

                if (resp.status === 'success') {
                    this.getTimetable();
                } else {
                }
            }, (error) => {
                this.loading = false;

            }
        );
    }

    storeSubject(form) {
        this.loading = true;
        this.apiService.post('subject', this.subject).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getSubjects();
                    form.reset();
                }
            }, () => {
                this.loading = false;
            }
        );
    }
}
