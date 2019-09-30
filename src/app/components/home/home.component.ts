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
    weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    timetable: Timetable;
    subjectsOfDay;
    weekDay: number;
    dayHour: string;

    subjectsOfTomorrow: boolean;
    constructor(
        private apiService: ApiService
    ) {}

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

                    const lastSubject = this.toMins(this.timetable.hours[this.timetable.hours.length - 1].hour_end);

                    if (lastSubject < this.toMins(this.dayHour)) {
                        this.subjectsOfTomorrow = true;

                        this.getSubjectsOfDay(1);
                    } else {
                        this.getSubjectsOfDay();
                    }
                }
            }
        );
    }

    /*************/
    /* FUNCIONES */
    /*************/

    dayOfWeek() {
        const date = new Date();
        this.weekDay = date.getDay() - 1;
        this.dayHour = date.getHours() + ':' + this.addZero(date.getMinutes());
    }

    addZero(number: number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }

    getSubjectsOfDay(add = 0) {
        this.subjectsOfDay = [];
        let subjectRow;

        for (subjectRow of this.timetable.subjects) {
            this.subjectsOfDay.push(subjectRow[this.weekDay + add]);
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
