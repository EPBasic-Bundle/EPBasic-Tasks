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

        if (identity) {
            return true;
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}
