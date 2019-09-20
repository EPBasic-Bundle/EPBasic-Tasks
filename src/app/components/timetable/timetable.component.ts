import { Component, OnInit } from '@angular/core';
import { Subject, Timetable } from '../../models/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
    rows;
    modal;

    subjects: Subject[] =
        [
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
        id: 1,
        user_id: 1,
        rows: 7,
        hours: ['8:30-9:25', '9:25-10:30', '10:20 - 11:15', '11:45 - 12:40', '12:40 - 13:35', '13:35 - 14:30'],
        subjects: [
            [
                {
                    id: 1,
                    subject_id: 1,
                },
                {
                    id: 2,
                    subject_id: 2,
                },
                {
                    id: 3,
                    subject_id: 3,
                },
                {
                    id: 4,
                    subject_id: 6,
                },
                {
                    id: 5,
                    subject_id: 5,
                }
            ],
            [
                {
                    id: 6,
                    subject_id: 1,
                },
                {
                    id: 7,
                    subject_id: 2,
                },
                {
                    id: 8,
                    subject_id: 6,
                },
                {
                    id: 9,
                    subject_id: 4,
                },
                {
                    id: 10,
                    subject_id: 5,
                }
            ]
        ]
    };

    constructor(
        private modalService: NgbModal
    ) {
        this.rows = Array(this.timetable.rows).fill(0).map((x, i) => i);
    }

    ngOnInit() {
    }

    openModal(content) {
        this.modal = this.modalService.open(content, { size: 'xl' });
    }

    findSubject(subject_id) {
        if (subject_id !== 0 || subject_id !== null) {
            return this.subjects.find(subject => subject.id === subject_id).name;
        }
        return;
    }
}
