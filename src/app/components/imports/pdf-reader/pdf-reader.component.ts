import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-pdf-reader',
    templateUrl: './pdf-reader.component.html',
    styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit {
    @Input() pdf;

    constructor() { }

    ngOnInit() {}
}
