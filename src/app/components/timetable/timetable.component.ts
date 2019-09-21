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

    timetable: Timetable = {
        "id": 1,
        "user_id": 1,
        "rows": "2",
        "hours": [
            "8:30-9:25",
            "9:25-10:30",
            "10:20 - 11:15",
            "11:15 - 11:45",
            "11:45 - 12:40",
            "12:40 - 13:35",
            "13:35 - 14:30"
        ],
        "subjects": [
            [
                {
                    "id": null,
                    "cell": "6524g3lsait",
                    "subject_id": 5
                },
                {
                    "id": null,
                    "cell": "hjnskbetkkk",
                    "subject_id": 3
                },
                {
                    "id": null,
                    "cell": "ntijq4bia2i",
                    "subject_id": 5
                },
                {
                    "id": null,
                    "cell": "xuzjehinwa",
                    "subject_id": 5
                },
                {
                    "id": null,
                    "cell": "kagozwnfmht",
                    "subject_id": 5
                }
            ],
            [
                {
                    "id": null,
                    "cell": "c7njrqx3qmc",
                    "subject_id": 6
                },
                {
                    "id": null,
                    "cell": "c9ep36bofc",
                    "subject_id": 6
                },
                {
                    "id": null,
                    "cell": "69rviwn9c2o",
                    "subject_id": 6
                },
                {
                    "id": null,
                    "cell": "3v118veq3dp",
                    "subject_id": 6
                },
                {
                    "id": null,
                    "cell": "edtl25efft9",
                    "subject_id": 4
                }
            ]
        ]
    }


    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit() { }

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

        for (let e of Array(rows)) {
            subjects = [];

            for (let i of Array(5)) {
                subjects.push(
                    {
                        id: null,
                        cell: Math.random().toString(36).substring(2, 15),
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

    store() {
        console.log(this.timetable);
    }
}
