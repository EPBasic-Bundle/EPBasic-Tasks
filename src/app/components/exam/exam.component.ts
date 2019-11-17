import { Component, OnInit } from '@angular/core';
import { Exam } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  exam: Exam;

  examId;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.examId = params.id;

        this.getExam();
      }
    );
  }

  getExam() {
    this.apiService.get('exam/' + this.examId).subscribe(
      resp => {
        if (resp.status === 'success') {
          this.exam = resp.exam;
        }
      }
    );
  }

  markAsDone() {
    this.apiService.get('exam/done/' + this.examId).subscribe(
      resp => {
        if (resp.status === 'success') {
          this.exam.done = resp.exam.done;
        }
      }
    );
  }
}
