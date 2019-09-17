import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isCollapsed = true;
    identity;

    constructor() {
        this.identity = {
            'id': 1,
            'name': 'Adur',
            'surname': 'Marques',
            'nick': 'adurtxi',
            'password': '',
            'email': 'adur.marques@gmail.com',
            'avatar': 'https://t3.ftcdn.net/jpg/01/04/10/10/240_F_104101070_wbEDt3CmlzqnPbdmOlVCL7Q7yu9mCduz.jpg',
        };
    }

    toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
    }
}
