import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TimetableComponent } from './components/timetable/timetable.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ColorPickerComponent } from './components/imports/color-picker/color-picker.component';
import { PdfReaderComponent } from './components/imports/pdf-reader/pdf-reader.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ApiService } from './services/api.service';
import { IdentityGuard } from './guards/identity.guard';
import { SubjectComponent } from './components/subject/subject.component';
import { TaskComponent } from './components/task/task.component';
import { AuthComponent } from './components/auth/auth.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BookComponent } from './components/book/book.component';
import { NgxUploaderModule } from 'ngx-uploader';

registerLocaleData(localeEs);

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ErrorComponent,
        CalendarComponent,
        TimetableComponent,
        ColorPickerComponent,
        SubjectComponent,
        TaskComponent,
        AuthComponent,
        SettingsComponent,
        PdfReaderComponent,
        BookComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        NgbModule,
        BrowserAnimationsModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        PdfViewerModule,
        NgxUploaderModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'es' },
        ApiService,
        IdentityGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
