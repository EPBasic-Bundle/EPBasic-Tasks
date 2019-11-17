import { Component, OnInit } from '@angular/core';
import { Task, Book } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

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
    ) { }

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
