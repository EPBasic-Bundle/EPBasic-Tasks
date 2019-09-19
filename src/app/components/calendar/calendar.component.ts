import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    CalendarEvent, CalendarDateFormatter, DAYS_OF_WEEK,
    CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView
} from 'angular-calendar';
import { CustomDateFormatter } from './date-formatter.provider';

@Component({
    selector: 'app-calendar-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./calendar.component.scss'],
    templateUrl: './calendar.component.html',
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CustomDateFormatter
        }
    ]
})

export class CalendarComponent {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

    locale = 'es';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [
        {
            title: 'Examen MME',
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            color: {
                primary: '#ff8040',
                secondary: '#ff8000'
            },
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            title: 'Examen SOM',
            start: addHours(startOfDay(new Date()), 2),
            end: new Date(),
            color: {
                primary: '#00ff00',
                secondary: '#777777'
            },
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        }
    ];

    activeDayIsOpen = true;

    constructor(
        private modalService: NgbModal,
    ) { }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
        console.log(this.events);
    }

    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modalService.open(this.modalContent, { size: 'xl' });
    }

    addEvent(): void {
        this.events = [
            ...this.events, {
                title: '',
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: {
                    primary: '#777777',
                    secondary: '#777777'
                },
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true
                }
            }
        ];
    }

    uploadEvent(eventToUpload: CalendarEvent) {
        console.log('Evento a subir', eventToUpload);
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter(event => event !== eventToDelete);

        console.log('Evento eliminado (Eliminar de la BD)');
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    openEventsModal(content) {
        this.modalService.open(content, { size: 'xl' });
    }
}
