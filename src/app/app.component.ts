import { Component, DoCheck } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {
    isCollapsed = true;
    identity;

    constructor(
        private apiService: ApiService
    ) {}

    toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
    }

    ngDoCheck() {
        this.loadUser();
    }

    loadUser() {
        this.identity = this.apiService.getIdentity();
    }

    logout() {
        this.apiService.logout();
    }
}
