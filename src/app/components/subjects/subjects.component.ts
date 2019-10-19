import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { Subject } from '../../models/model';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
    subjects: Subject[];
    modal;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        public toastService: ToastService
    ) { }

    ngOnInit() {
        this.getSubjects();
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

     /************/
    /* SUBJECT */
    /***********/

    createSubject() {
        this.subjects.push({
            id: 0,
            user_id: null,
            name: '',
            primary_color: '#fff',
            secondary_color: '#fff'
        });
    }

    setColor(type: string, i: number, color: string) {
        switch (type) {
            case 'primary_color':
                this.subjects[i].primary_color = color;

                if (this.subjects[i].secondary_color = '#fff') {
                    this.subjects[i].secondary_color = color;
                }
                break;
            case 'secondary_color':
                this.subjects[i].secondary_color = color;
                break;
            default:
                break;
        }
    }

    deleteSubjectFront(index) {
        this.subjects.splice(index, 1);
    }

    /******************/
    /* SUBJECT CRUD */
    /*****************/

    storeSubject(subject, index) {
        this.apiService.post('subject', subject).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects[index] = resp.subject;
                    this.showToast('Asignatura creada correctamente', 'success');
                }
            }
        );
    }

    updateSubject(subject, index) {
        this.apiService.put('subject/' + subject.id, subject).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects[index] = resp.subject;
                    this.showToast('Asignatura actualizada correctamente', 'success');
                }
            }
        );
    }

    deleteSubject(subject_id, index) {
        this.apiService.delete('subject/' + subject_id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subjects.splice(index, 1);
                    this.showToast('Asignatura eliminada correctamente', 'success');
                }
            }
        );
    }

    openModal(content, size, centered) {
        this.modal = this.modalService.open(content, { size, centered });
    }

    showToast(text, type) {
        switch (type) {
            case 'success': {
                this.toastService.show(text, { classname: 'bg-dark text-light', delay: 5000 });
                break;
            }
            case 'danger': {
                this.toastService.show(text, { classname: 'bg-danger text-light', delay: 5000 });
                break;
            }
        }
    }
}
