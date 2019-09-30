import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
    task: Task;
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
                }
            }
        );
    }

    markAsDone(exercise_id, page_index, exercise_index) {
        this.apiService.post('exercise/done/' + exercise_id, null).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.task.pages[page_index].exercises[exercise_index] = resp.exercise;
                }
            }
        );
    }

    markAsDoneAll() {
        this.apiService.post('exercises/done/' + this.taskId, null).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.task.pages = resp.task.pages;
                    this.task.done = resp.task.done;
                }
            }
        );
    }
}
