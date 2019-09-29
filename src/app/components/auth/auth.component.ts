import { Component, OnInit } from '@angular/core';
import { User } from '../../models/model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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

    constructor(
        private apiService: ApiService,
        private router: Router,
        ) {
        this.user = new User(null, null, null, null, null, 'ROLE_USER', null);
     }

    ngOnInit() {
        this.token = this.apiService.getToken();
        if (this.token !== null) {
            this.router.navigate(['home']);
        }
        auth();
    }

    // Login
    onSubmitLogin(form) {
        this.loading = true;
        this.apiService.post('login', this.user).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    localStorage.setItem('identity', JSON.stringify(resp.identity));
                    localStorage.setItem('token', JSON.stringify(resp.token));

                    this.apiService.token = resp.token;

                    this.router.navigate(['home']);
                } else {
                }
            }, (error) => {
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
                form.reset();
            }, () => this.loading = false
        );
    }

}
