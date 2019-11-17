import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarDateFormatter, DAYS_OF_WEEK, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { CustomDateFormatter } from './date-formatter.provider';
import { ApiService } from '../../services/api.service';

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

export class CalendarComponent implements OnInit {
    @ViewChild('eventModal', { static: true }) eventModal: TemplateRef<any>;

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

    modal;

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen = true;

    page = 4;
    pageSize = 6;

    constructor(
        private modalService: NgbModal,
        private apiService: ApiService,
    ) { }

    ngOnInit() {
        this.getEvents();
    }

    getEvents() {
        this.apiService.get('events').subscribe(
            resp => {
                if (resp.status === 'success') {
                    let events = [];

                    resp.events.forEach(event => {
                        events.push(this.convertEvent(event));
                    });

                    this.events = events;
                }
            }
        );
    }

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
    }

    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                const newEvent = {
                    ...event,
                    start: newStart,
                    end: newEnd
                };

                this.updateEvent(newEvent, this.findEvent(newEvent));

                return newEvent;
            }

            return iEvent;
        });
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modal = this.modalService.open(this.eventModal, { size: 'xl' });
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

    setView(view: CalendarView) {
        this.view = view;

        this.getEvents()
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    openEventsModal(content) {
        this.modal = this.modalService.open(content, { size: 'xl' });
    }

    /**************/
    /* EVENT CRUD */
    /*************/

    storeEvent(eventToStore: CalendarEvent, index) {
        this.apiService.post('event', this.convertEventDB(eventToStore)).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.events[index] = this.convertEvent(resp.event);
                }
            }
        );
    }

    updateEvent(eventToUpdate: CalendarEvent, index) {
        const event = this.convertEventDB(eventToUpdate);

        this.apiService.put('event/' + event.id, event).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.events[index] = this.convertEvent(resp.event);
                }
            }
        );
    }

    deleteEvent(eventToDelete: CalendarEvent, index) {
        const event = this.convertEventDB(eventToDelete);

        if (event.id > 0) {
            this.apiService.delete('event/' + event.id).subscribe(
                resp => {
                    if (resp.status === 'success') {
                        this.events = this.events.filter(event => event !== eventToDelete);
                    }
                }
            );
        } else {
            this.events = this.events.filter(event => event !== eventToDelete);
        }
    }

    convertEvent(event) {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        event.color = {
            "primary": event.primary_color,
            "secondary": event.secondary_color
        }
        event.draggable = true;
        event.resizable = { "afterEnd": true, "beforeStart": true };

        return event;
    }

    convertEventDB(event) {
        if (event.task_id > 0) {
        } else {
            event.task_id = null;
        }

        if (event.exam_id > 0) {
        } else {
            event.exam_id = null;
        }

        return {
            id: event.id,
            start: event.start,
            end: event.end,
            title: event.title,
            primary_color: event.color.primary,
            secondary_color: event.color.secondary,
            task_id: event.task_id,
            exam_id: event.exam_id,
        }
    }

    findEvent(sEvent) {
        this.events.filter(event => event == sEvent);
    }

    showEvent(date) {
        return new Date().getTime() <= new Date(date).getTime();
    }
}
