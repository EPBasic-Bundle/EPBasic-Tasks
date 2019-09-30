import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
    url;
    identity;
    token;
    headers;

    baseURL: string = environment.server;

    constructor(
        public http: HttpClient,
        private router: Router,
    ) {
        this.getToken();
        this.getIdentity();
    }

    get(url): Observable<any> {
        let headers;

        if (this.token && this.identity) {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', this.token);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }

        return this.http.get(this.baseURL + url, { headers });
    }

    getFile(url): Observable<any> {
        let headers;

        if (this.token && this.identity) {
            headers = new HttpHeaders().set('Content-Type', 'Access-Control-Expose-Headers')
                .set('Authorization', this.token);

            return this.http.get(this.baseURL + url, { responseType: 'blob', headers });
        }
    }

    post(url, params): Observable<any> {
        const json = JSON.stringify(params);
        const jsonParams = 'json=' + json;

        if (this.token && this.identity) {
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', this.token);

            return this.http.post(this.baseURL + url, jsonParams, { headers });
        } else {
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

            return this.http.post(this.baseURL + url, jsonParams, { headers });
        }
    }

    put(url, data): Observable<any> {
        if (this.token && this.identity) {
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', this.token);
            const json = JSON.stringify(data);
            const params = 'json=' + json;

            return this.http.put(this.baseURL + url, params, { headers });
        }
    }

    delete(url): Observable<any> {
        if (this.token && this.identity) {
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', this.token);
            return this.http.delete(this.baseURL + url, { headers });
        }
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity && identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

    logout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        this.router.navigate(['/']);
    }

    external(url): Observable<any> {
        return this.http.get(url);
    }
}
