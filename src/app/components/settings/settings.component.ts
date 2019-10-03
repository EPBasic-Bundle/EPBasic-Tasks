import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    identity;

    constructor(
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this.loadUser();
    }

    loadUser() {
        this.identity = this.apiService.getIdentity();
    }
}
