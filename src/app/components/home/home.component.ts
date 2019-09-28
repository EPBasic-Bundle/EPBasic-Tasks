import { Component, OnInit } from '@angular/core';
import { User } from '../../models/model';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    identity;
    token;
    url;
    user: User;
    message: string;
    status: string;
    loading: boolean;

    constructor(
       private apiService: ApiService
       ) {
       this.user = new User(null, null, null, null, null, 'ROLE_USER', null);
    }

    ngOnInit() {}

    // Login
    onSubmitLogin(form) {
        this.loading = true;
        this.apiService.post('login', this.user).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {

                    localStorage.setItem('identity', JSON.stringify(resp.identity));
                    localStorage.setItem('token', JSON.stringify(resp.token));
                    form.reset();

                    this.apiService.token = resp.token;
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
