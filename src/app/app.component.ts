import { Component, DoCheck, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import * as AOS from 'aos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {
    isCollapsed = true;
    identity;
    userChangeModal;
    loguedUsers;
    deleteUsers: boolean = false;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private router: Router,
    ) { }

    ngOnInit() {
        AOS.init();
    }

    toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
    }

    ngDoCheck() {
        this.loadUser();
    }

    loadUser() {
        this.identity = this.apiService.getIdentity();
    }

    /*********/
    /* USERS */
    /*********/

    changeUser(userIdx) {
        this.closeUserChangeModal();
        localStorage.setItem('userIdx', userIdx);
        this.router.navigate(['/']);
    }

    goToAddAccountPage() {
        this.closeUserChangeModal();
        this.router.navigate(['/add-account']);
    }

    blockUser() {
        this.apiService.blockUser();
    }

    logout() {
        this.apiService.logout();
    }

    enableDeleteUsers(action) {
        if (action === 1) {
            this.deleteUsers = true;
        } else {
            this.deleteUsers = false;
        }
    }

    deleteUser(userIdx) {
        this.loguedUsers.splice(userIdx, 1);

        this.apiService.removeUserOfStorage(userIdx);

        this.deleteUsers = false;
    }

    /**********/
    /* MODALS */
    /**********/

    openUserChangeModal(content) {
        this.loguedUsers = this.apiService.getLoguedUsers();

        this.userChangeModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    closeUserChangeModal() {
        this.userChangeModal.close();
    }
}
