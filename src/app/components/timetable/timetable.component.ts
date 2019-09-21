import { Component, OnInit } from '@angular/core';
import { Subject, Timetable } from '../../models/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
    rows: number;
    rowIndex: number;
    modal;
    selectedSubject;
    editionActivatedInRow;
    editionActivatedInSubject

    subjects: Subject[] =
        [
            {
                id: 0,
                name: 'Libre',

            },
            {
                id: 1,
                name: 'MME',

            },
            {
                id: 2,
                name: 'SOM',

            },
            {
                id: 3,
                name: 'AOF',

            },
            {
                id: 4,
                name: 'Inglés',

            },
            {
                id: 5,
                name: 'FOL',

            },
            {
                id: 6,
                name: 'Redes'
            }
        ];

    timetable: Timetable;

    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit() {}

    openModal(content) {
        this.modal = this.modalService.open(content, { size: 'xl' });
    }

    createTable() {
        this.timetable = {
            id: 1,
            user_id: 1,
            rows: this.rows,
            hours: ['8:30-9:25', '9:25-10:30', '10:20 - 11:15', '11:15 - 11:45', '11:45 - 12:40', '12:40 - 13:35', '13:35 - 14:30'],
            subjects: []
        }

        this.addRows(+this.rows);
    }

    addRows(rows) {
        let subjects;
        this.timetable.subjects;

        let number = 1;

        for (let e of Array(rows)) {
            subjects = [];

            for (let i of Array(5)) {
                subjects.push(
                    {
                        id: null,
                        cell: number++,
                        subject_id: 0,
                    }
                );
            }

            this.timetable.subjects.splice(this.rowIndex, 0, subjects);
        }
    }

    deleteRow(index) {
        this.timetable.subjects.splice(index, 1);
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

    findSubject(subject_id) {
        return this.subjects.find(subject => subject.id === subject_id);
    }

}
