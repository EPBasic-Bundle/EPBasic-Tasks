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
    subject: Subject;

    modal;
    percentajesModal;

    sSubjectIdx: number;

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
            secondary_color: '#fff',
            tasks_percentage: 0,
            exams_percentage: 0,
            projects_percentage: 0,
            behavior_percentage: 0,
            tasks_has_mark: false,
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

    setPercentage(type, percentage) {
        let subject = this.subjects[this.sSubjectIdx];

        switch (type) {
            case 1:
                subject.tasks_percentage = percentage;
                break;
            case 2:
                subject.exams_percentage = percentage;
                break;
            case 3:
                subject.projects_percentage = percentage;
                break;
            case 4:
                subject.behavior_percentage = percentage;
                break;
        }

        this.subjects[this.sSubjectIdx] = subject;
    }

    calcTotalPercentage(subject) {
        return subject.tasks_percentage + subject.exams_percentage + subject.projects_percentage + subject.behavior_percentage;
    }

    calcPercentageToBeAssigned() {
        const subject = this.subjects[this.sSubjectIdx];

        return 100 - this.calcTotalPercentage(subject);
    }

    isSelected(type, percentage) {
        const subject = this.subjects[this.sSubjectIdx];

        switch (type) {
            case 1:
                if (subject.tasks_percentage == percentage) {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if (subject.exams_percentage == percentage) {
                    return true;
                } else {
                    return false;
                }
            case 3:
                if (subject.projects_percentage == percentage) {
                    return true;
                } else {
                    return false;
                }
            case 4:
                if (subject.behavior_percentage == percentage) {
                    return true;
                } else {
                    return false;
                }
        }
    }

    deleteSubjectFront(index) {
        this.subjects.splice(index, 1);
    }

    getSubject(id) {
        this.apiService.get('subject/all/' + id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.subject = resp.subject;
                }
            }
        );
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

    /**********/
    /* MODALS */
    /**********/

    openModal(content, size, centered) {
        this.modal = this.modalService.open(content, { size, centered });
    }

    openPercentajesModal(content, index) {
        let subject = this.subjects[index];

        if (subject.tasks_percentage == null) {
            subject.tasks_percentage = 0;
        } if (subject.exams_percentage == null) {
            subject.exams_percentage = 0;
        } if (subject.projects_percentage == null) {
            subject.projects_percentage = 0;
        } if (subject.behavior_percentage == null) {
            subject.behavior_percentage = 0;
        }

        this.subjects[index] = subject;

        this.sSubjectIdx = index;
        this.percentajesModal = this.modalService.open(content, { size: 'lg' });
    }

    closePercentageModal() {
        this.percentajesModal.close();
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
