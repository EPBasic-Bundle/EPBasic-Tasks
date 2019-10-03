import { Component, DoCheck, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import * as AOS from 'aos';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {
    isCollapsed = true;
    identity;

    constructor(
        private apiService: ApiService
    ) {}

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

    logout() {
        this.apiService.logout();
    }
}
