import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable()

export class IdentityGuard implements CanActivate {

    constructor(
       private router: Router,
       private apiService: ApiService
    ) {}

    canActivate() {
        const identity = this.apiService.getIdentity();
        const token = this.apiService.getToken();

        if (identity) {
            if (token !== null && token !== 'undefined') {
                return true;
            } else {
                return false;
            }
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
