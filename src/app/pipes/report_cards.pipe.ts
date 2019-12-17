import { Pipe, PipeTransform } from '@angular/core';
import { ReportCard } from '../models/model';

@Pipe({
    name: 'report_cards'
})
export class ReportCardsPipe implements PipeTransform {

    transform(report_cards: ReportCard[], filter): any {
        if (filter[0] !== null && filter[1] !== null) {
            report_cards = report_cards.filter(
                report_card => report_card.evaluation_id === filter[0] && report_card.type === filter[1]
            );

            if (!report_cards[0]) {
                return [this.generateReportCard(filter[0], filter[1], filter[2])];
            }
        } else {
            return;
        }

        return report_cards;
    }

    generateReportCard(evaluation_id, type, subjects) {
        let report_card = {
            id: 0,
            year_id: null,
            evaluation_id: evaluation_id,
            type,
            marks: []
        }

        let number = 0;

        for (let i of Array(subjects.length)) {
            report_card.marks.push({
                id: null,
                subject_id: subjects[number].id,
                report_card_id: null,
                mark_wd: '0.0',
                mark: 0
            });

            number = ++number;
        }

        return report_card;
    }
}
