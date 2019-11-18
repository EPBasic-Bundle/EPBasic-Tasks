import { Component, OnInit } from '@angular/core';
import { Task, Book } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

import * as moment from 'moment';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
    task: Task;
    book: Book;

    taskId;

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute
    ) {
        moment.locale('es');
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.taskId = params.id;

                this.getTask();
            }
        );
    }

    getTask() {
        this.apiService.get('task/' + this.taskId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.task = resp.task;

                    if (this.task.book_id) {
                        this.getBook();


                    }
                }
            }
        );
    }

    daysRemaining() {
        return moment(this.task.delivery_date).startOf('hour').fromNow()
    }

    deliveryDate() {
        return moment(this.task.delivery_date).format('LLL');
    }

    getBook() {
        this.apiService.get('book/' + this.task.book_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.book = resp.book;
                }
            }
        );
    }

    markAsDone(exercise_id, page_index, exercise_index) {
        this.apiService.get('exercise/done/' + exercise_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.task.pages[page_index].exercises[exercise_index] = resp.exercise;
                }
            }
        );
    }

    markAsDoneAll() {
        this.apiService.get('task/done/' + this.taskId).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.task.pages = resp.task.pages;
                    this.task.done = resp.task.done;
                }
            }
        );
    }
}
