import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
    selector: 'app-mark-charts',
    templateUrl: './mark-charts.component.html',
    styleUrls: ['./mark-charts.component.scss']
})
export class MarkChartsComponent implements OnInit {
    lineChartData: ChartDataSets[] = [
        { data: [5.0, 6.0, 8.0], label: 'Notas' },
    ];
    lineChartLabels: Label[] = ['1. Evaluación', '2. Evaluación', '3. Evaluación'];
    lineChartOptions: (ChartOptions) = {
        responsive: true,
    };
    lineChartColors: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)',
        },
    ];
    lineChartLegend = true;
    lineChartType = 'line';
    lineChartPlugins = [];


    barChartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        }
    };
    barChartLabels: Label[] = ['1. Evaluación', '2. Evaluación', '3. Evaluación'];
    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartPlugins = [];

    barChartData: ChartDataSets[] = [
        { data: [10, 10, 8], label: 'Nota' },
        { data: [10, 8, 7], label: 'Tareas' },
        { data: [10, 7, 9], label: 'Examenes' },
        { data: [10, 9, 6], label: 'Proyectos' },
        { data: [10, 9, 9], label: 'Comportamiento' }
    ];

    constructor() { }

    ngOnInit() { }
}
