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
    loading: boolean;

    rows: number;
    rowIndex: number;
    modal;

    subjects: Subject[] = [];

    timetable: Timetable;

    selectedRowIndex: number;
    subjectSelected: number;
    subjectRow: number;
    subjectCol: number;

    hour_start = {
        hour: 10,
        minute: 0
    };

    hour_end = {
        hour: 10,
        minute: 0
    };

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.getSubjects();
        this.getTimetable();
    }

    /*****************/
    /* IMPORTACIONES */
    /*****************/

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

    /**********/
    /* MODALS */
    /**********/

    openModal(content, size, centered) {
        this.modal = this.modalService.open(content, { size, centered });
    }

    openSubjectSelectorModal(content, data) {
        this.subjectRow = data[0];
        this.subjectCol = data[1];

        this.modal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    openHoursSelectorModal(content, index) {
        this.selectedRowIndex = index;

        this.modal = this.modalService.open(content, { centered: true });
    }

    /*************/
    /* TIMETABLE */
    /*************/

    createTable() {
        this.timetable = {
            id: 1,
            user_id: 1,
            rows: this.rows,
            hours: [],
            subjects: []
        };

        this.addRows(+this.rows);
    }

    addRows(rows) {
        this.rows = +this.rows;

        let subjects;

        for (let i of Array(rows)) {
            subjects = [];

            this.timetable.hours.push(
                {
                    id: null,
                    hour_start: '00:00',
                    hour_end: '23:59',
                }
            );

            for (let e of Array(5)) {
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

    updateCell(subject_id: number) {
        this.timetable.subjects[this.subjectRow][this.subjectCol].subject_id = subject_id;

        this.modal.close();
    }

    deleteRow(index: number) {
        this.timetable.subjects.splice(index, 1);
        this.timetable.hours.splice(index, 1);
    }

    setTime() {
        const hour_start = this.addZero(this.hour_start.hour) + ':' + this.addZero(this.hour_start.minute);
        const hour_end = this.addZero(this.hour_end.hour) + ':' + this.addZero(this.hour_end.minute);

        this.timetable.hours[this.selectedRowIndex].hour_start = hour_start;
        this.timetable.hours[this.selectedRowIndex].hour_end = hour_end;
    }

    addZero(number: number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }

    /******************/
    /* TIMETABLE CRUD */
    /*****************/

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

    /************/
    /* SUBJECT */
    /***********/

    createSubject() {
        this.subjects.push(
            {
                id: 0,
                user_id: null,
                name: '',
                primary_color: null,
                secondary_color: null
            });
    }

    setColor(type: string, i: number, color: string) {
        switch (type) {
            case 'primary_color':
                this.subjects[i].primary_color = color;
                break;
            case 'secondary_color':
                this.subjects[i].secondary_color = color;
                break;
            default:
                break;
        }
    }

    deleteSubjectFront(index) {
        this.subjects.splice(index, 1);
    }

    /******************/
    /* SUBJECT CRUD */
    /*****************/

    storeSubject(subject) {
        this.loading = true;
        this.apiService.post('subject', subject).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getSubjects();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    updateSubject(subject) {
        this.loading = true;
        this.apiService.put('subject/' + subject.id, subject).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getSubjects();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    deleteSubject(subject_id) {
        this.loading = true;
        this.apiService.delete('subject/' + subject_id).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.getSubjects();
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }

    /*********/
    /* OTROS */
    /*********/

    findSubject(subject_id: number) {
        return this.subjects.find(subject => subject.id === subject_id);
    }

    markSubjectInTimetable(subject_id) {
        this.subjectSelected = subject_id;
    }

    subjectIsSelected(subject_id) {
        if (this.subjectSelected === subject_id) {
            return true;
        } else {
            return false;
        }
    }
}
