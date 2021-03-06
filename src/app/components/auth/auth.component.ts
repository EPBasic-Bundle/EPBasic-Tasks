import { Component, OnInit } from '@angular/core';
import { User } from '../../models/model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

declare const auth: any;

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    identity;
    token;
    url;
    user: User;
    message: string;
    status: string;
    loading: boolean;
    blockedUsers;
    userUnblockModal;
    pinCode: number;
    sBlockedUserId: number;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private modalService: NgbModal,
        public toastService: ToastService
    ) {
        this.user = new User(null, null, null, null, null, 'ROLE_USER', null);
    }

    ngOnInit() {
        if (this.router.url !== '/add-account') {
            this.token = this.apiService.getToken();
            if (this.token !== null) {
                this.router.navigate(['home']);
            }
        }

        auth();
        this.getBlockedUsers();
    }

    getBlockedUsers() {
        this.blockedUsers = this.apiService.getBlockedUsers();
    }

    // Login
    onSubmitLogin() {
        this.loading = true;

        this.apiService.post('login', this.user).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.apiService.setStorage(resp);

                    this.router.navigate(['home']);
                } else {
                    this.showToast('Usuario o contraseña incorrectos', 'danger');
                }
            }, () => {
                this.showToast('Error de servidor', 'danger');
                this.loading = false;
            }
        );
    }

    // Register
    onSubmitRegister(form) {
        this.loading = true;
        this.apiService.post('register', this.user).subscribe(
            resp => {
                this.loading = false;

                if (resp.status === 'success') {
                    form.reset();
                    this.showToast('Usuario creado correctamente', 'success');
                } else {
                    this.showToast('El mail ya está en uso', 'danger');
                }

            }, () => {
                this.showToast('Error de servidor', 'danger');
                this.loading = false;
            }
        );
    }

    //Desbloquear usuario
    unBlockUser() {
        this.apiService.get('user/pinCode/' + this.sBlockedUserId + '/' + +this.pinCode).subscribe(
            (resp) => {
                if (resp.status === 'success') {
                    this.apiService.setStorage(resp);

                    this.apiService.deleteBlockUser(this.sBlockedUserId);

                    this.closeUserUnblockModal();

                    this.router.navigate(['home']);
                }
            }
        );
    }

    /**********/
    /* MODALS */
    /**********/

    openUserUnblockModal(content, id) {
        this.sBlockedUserId = id;
        this.userUnblockModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    closeUserUnblockModal() {
        this.userUnblockModal.close();
    }

    /**********/
    /* OTHERS */
    /**********/

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
