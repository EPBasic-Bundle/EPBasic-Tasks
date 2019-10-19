import { Component, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/models/model';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [ApiService]
})

export class SettingsComponent {
    loading: boolean;
    status;
    user: User;
    identity;
    token;
    url;
    message;

    constructor(
        private apiService: ApiService,
        public toastService: ToastService
    ) {
        this.user = new User(null, null, null, null, null, null, null);
        this.identity = this.apiService.getIdentity();
        this.token = this.apiService.getToken();
        this.url = environment.server;

        // Rellenar objeto usuario
        this.user = new User(
            this.identity.sub,
            this.identity.name,
            this.identity.surname,
            this.identity.email,
            null,
        );
    }

    onSubmit() {
        this.loading = true;
        this.apiService.put('user/update', this.user).subscribe(
            response => {
                this.loading = false;
                if (response.status === 'success') {
                    this.showToast('El usuario se ha actualizado correctamente', 'success');
                    localStorage.setItem('identity', JSON.stringify(this.user));
                } else {
                    this.loading = false;
                    this.showToast('El usuario no se ha actualizado correctamente', 'danger');
                }
            },
            () => {
                this.loading = false;
                this.showToast('Error al actualizar el usuario', 'danger');
            }
        );
    }

    showToast(text, type) {
        switch (type) {
            case 'success': {
                this.toastService.show(text, { classname: 'bg-dark text-light', delay: 5000 });
                break;
            }
            case 'danger': {
                this.toastService.show(text, { classname: 'bg-danger text-light', delay: 5000 });
                break;
            }
        }
    }
}