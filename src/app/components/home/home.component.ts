import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject, Timetable } from '../../models/model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    loading: boolean;
    subjects: Subject[] = [];
    weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    timetable: Timetable;
    subjectsOfDay;
    weekDay: number;
    dayHour: string;

    constructor(
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.getSubjects();
        this.getTimetable();
        this.dayOfWeek();
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
                this.getSubjectsOfDay();
            }
        );
    }

    /*************/
    /* FUNCIONES */
    /*************/

    dayOfWeek() {
        const date = new Date();
        this.weekDay = date.getDay() - 1;
        this.dayHour = date.getHours() + ':' + date.getMinutes();
    }

    getSubjectsOfDay() {
        this.subjectsOfDay = [];
        let subjectRow;

        for (subjectRow of this.timetable.subjects) {
            this.subjectsOfDay.push(subjectRow[this.weekDay]);
        }
    }

    findSubject(subject_id: number) {
        return this.subjects.find(subject => subject.id === subject_id);
    }

    inSubjectTime(h0, h1) {
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        return this.toMins(h0) <= mins && mins <= this.toMins(h1);
    }

    toMins(h) {
        const b = h.split(':');
        return b[0] * 60 + + b[1];
    }
}
