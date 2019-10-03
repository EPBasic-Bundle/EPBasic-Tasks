import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject, Timetable, Task } from '../../models/model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    loading: boolean;
    weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    timetable: Timetable;
    subjects: Subject[] = [];
    subjectsOfDay;
    subjectsOfTomorrow: boolean;
    cSubjectsIds = [];
    weekDay;
    dayHour;

    constructor(
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.timeNow();
        this.getSubjectsWithTasks();
        this.getTimetable();
    }

    /*****************/
    /* IMPORTACIONES */
    /*****************/

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

    getSubjectsWithTasks() {
        this.apiService.get('subjects/tasks/').subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects = resp.subjects;

                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < this.subjects.length; i++) {
                        if (this.subjects[i].tasks[0]) {
                            this.collapse(this.subjects[i].id);
                        }
                    }
                }
            }
        );
    }

    /*************/
    /* FUNCIONES */
    /*************/

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

    timeNow() {
        const date = new Date();
        this.weekDay = date.getDay() - 1;
        this.dayHour = date.getHours() + ':' + this.addZero(date.getMinutes());
    }

    /***********/
    /* COLAPSE */
    /***********/

    collapse(subject_id) {
        const cSubjectsIndex = this.cSubjectsIds.findIndex(i => i === subject_id);

        if (cSubjectsIndex >= 0) {
            this.cSubjectsIds.splice(cSubjectsIndex, 1);
        } else {
            this.cSubjectsIds.push(subject_id);
        }
    }

    isCollapsed(subject_id) {
        const cSubjectsIndex = this.cSubjectsIds.findIndex(i => i === subject_id);

        if (cSubjectsIndex >= 0) {
            return false;
        } else {
            return true;
        }
    }
}
