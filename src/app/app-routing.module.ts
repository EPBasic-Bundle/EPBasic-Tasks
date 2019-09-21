import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentityGuard } from './guards/identity.guard';

import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimetableComponent } from './components/timetable/timetable.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: 'timetable',
        component: TimetableComponent,
        canActivate: [IdentityGuard]
    },
    {
        path: '**',
        component: ErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
