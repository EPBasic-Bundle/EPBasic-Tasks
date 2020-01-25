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
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CalendarModule as SCalendarModule } from '@syncfusion/ej2-angular-calendars';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxUploaderModule } from 'ngx-uploader';
import { ChartsModule } from 'ng2-charts';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { ColorPickerComponent } from './components/imports/color-picker/color-picker.component';
import { PdfReaderComponent } from './components/imports/pdf-reader/pdf-reader.component';
import { ToastComponent } from './components/imports/toast/toast.component';
import { StudySelectorComponent } from './components/imports/study-selector/study-selector.component';
import { MarkChartsComponent } from './components/imports/mark-charts/mark-charts.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { ErrorComponent } from './components/error/error.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ApiService } from './services/api.service';
import { IdentityGuard } from './guards/identity.guard';
import { SubjectComponent } from './components/subject/subject.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { TaskComponent } from './components/task/task.component';
import { AuthComponent } from './components/auth/auth.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BookComponent } from './components/book/book.component';
import { ExamComponent } from './components/exam/exam.component';
import { MarksComponent } from './components/marks/marks.component';

import { UnitsPipe } from './pipes/units.pipe';
import { EventsPipe } from './pipes/event.pipe';
import { ReportCardsPipe } from './pipes/report_cards.pipe';

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
        SubjectsComponent,
        TaskComponent,
        AuthComponent,
        SettingsComponent,
        PdfReaderComponent,
        BookComponent,
        ToastComponent,
        ExamComponent,
        StudySelectorComponent,
        MarksComponent,
        UnitsPipe,
        EventsPipe,
        ReportCardsPipe,
        MarkChartsComponent
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
        NgxUploaderModule,
        NgxEditorModule,
        UiSwitchModule,
        NgxSkeletonLoaderModule,
        SCalendarModule,
        ChartsModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'es' },
        ApiService,
        IdentityGuard
    ],
    bootstrap: [AppComponent],
    exports: [ToastComponent]
})
export class AppModule { }
