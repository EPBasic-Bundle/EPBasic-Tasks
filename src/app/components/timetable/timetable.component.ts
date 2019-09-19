import { Component, OnInit } from '@angular/core';
import { Subject } from '../../models/model';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
    subjects: Subject[] =
    [
        {
            id: 1,
            name: 'MME',

        },
        {
            id: 2,
            name: 'SOM',

        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
