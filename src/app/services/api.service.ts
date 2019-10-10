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

    /********/
    /* AUTH */
    /********/

    setStorage(resp) {
        let tokens = JSON.parse(localStorage.getItem('tokens'));
        let identities = JSON.parse(localStorage.getItem('identities'));
        let userIdx;
        let set: boolean;

        if (tokens && tokens[0] && identities && identities[0]) {
            const identityIndex = identities.findIndex(identity => identity.sub === resp.identity.sub);

            if (identityIndex < 0 || identityIndex == null) {
                tokens.push(resp.token);
                identities.push(resp.identity);
    
                userIdx = tokens.length - 1;
                set = true;
            }
        } else {
            tokens = [resp.token];
            identities = [resp.identity];
            userIdx = 0;
            set = true;
        }

        if (set === true) {
            localStorage.setItem('identities', JSON.stringify(identities));
            localStorage.setItem('tokens', JSON.stringify(tokens));
            localStorage.setItem('userIdx', userIdx);
        }
    }

    removeUserOfStorage(userIdx) {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const identities = JSON.parse(localStorage.getItem('identities'));

        identities.splice(userIdx, 1);
        tokens.splice(userIdx, 1);

        if (userIdx === 0) {
            userIdx = 0;
        } else {
            userIdx = --userIdx;
        }
      
        localStorage.setItem('identities', JSON.stringify(identities));
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('userIdx', JSON.stringify(userIdx));
    }

    getUserIdx() {
        const userIdx = JSON.parse(localStorage.getItem('userIdx'));

        if (userIdx != null) {
            return JSON.parse(localStorage.getItem('userIdx'));
        }

        return 0;
    }

    getIdentity() {
        const identities = JSON.parse(localStorage.getItem('identities'));

        if (identities && identities !== 'undefined') {
            this.identity = identities[this.getUserIdx()];
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getLoguedUsers() {
        let loguedUsers = JSON.parse(localStorage.getItem('identities'));

        if (!loguedUsers || !loguedUsers[0]) {
            loguedUsers = null;
        }

        return loguedUsers;
    }

    getBlockedUsers() {
        let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers'));

        if (!blockedUsers || !blockedUsers[0]) {
            blockedUsers = null;
        }

        return blockedUsers;
    }

    getToken() {
        const tokens = JSON.parse(localStorage.getItem('tokens'));

        if (tokens && tokens !== 'undefined') {
            this.token = tokens[this.getUserIdx()];
        } else {
            this.token = null;
        }

        return this.token;
    }

    /********/
    /* CRUD */
    /********/

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

    external(url): Observable<any> {
        return this.http.get(url);
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

    /**********/
    /* LOGOUT */
    /**********/

    blockUser() {
        let userIdx = this.getUserIdx();
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const identities = JSON.parse(localStorage.getItem('identities'));

        let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers'));
        const identity = this.getIdentity();

        if (blockedUsers && blockedUsers[0]) {
            blockedUsers.push(identity);
        } else {
            blockedUsers = [identity];
        }

        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));

        tokens.splice(userIdx, 1);
        identities.splice(userIdx, 1);

        if (userIdx === 0) {
            userIdx = 0;
        } else {
            userIdx = --userIdx;
        }

        localStorage.setItem('identities', JSON.stringify(identities));
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('userIdx', userIdx);

        this.router.navigate(['/']);
    }

    deleteBlockUser(user_id) {
        const blockedUsers = this.getBlockedUsers();

        const blockedUserIndex = blockedUsers.find(user => user.sub === user_id);

        blockedUsers.splice(blockedUserIndex, 1);

        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    }

    logout() {
        localStorage.removeItem('identities');
        localStorage.removeItem('tokens');
        localStorage.removeItem('userIdx');

        this.identity = null;
        this.token = null;

        this.router.navigate(['/']);
    }
}
