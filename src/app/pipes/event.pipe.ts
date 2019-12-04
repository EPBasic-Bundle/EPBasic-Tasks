import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'events'
})
export class EventsPipe implements PipeTransform {

    transform(events, type): any {
        switch (type) {
            case 1:
                return events.filter(event => event.task_id > 0);
            case 2:
                return events.filter(event => event.exam_id > 0);
            case 3:
                return events.filter(event => event.project_id > 0);
            case 4:
                return events.filter(event => event.exam_id && event.task_id === null && event.proyect_id === null);
            default:
                return events;
        }
    }
}
