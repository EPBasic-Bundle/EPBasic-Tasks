import { Pipe, PipeTransform } from '@angular/core';
import { Evaluation } from '../models/model';

@Pipe({
    name: 'evaluations'
})
export class EvaluationsPipe implements PipeTransform {

    transform(evaluations: Evaluation[], evaluation_id: number): any {
        if (evaluation_id !== null) {
            return evaluations.filter(evaluation => evaluation.id === evaluation_id);
        }

        return evaluations;
    }
}
