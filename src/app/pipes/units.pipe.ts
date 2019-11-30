import { Pipe, PipeTransform } from '@angular/core';
import { Unity } from '../models/model';

@Pipe({
    name: 'units'
})
export class UnitsPipe implements PipeTransform {

    transform(units: Unity[], evaluation_id: number): any {
        if (evaluation_id !== null) {
            return units.filter(unity => unity.evaluation_id === evaluation_id);
        }

        return units;
    }
}
