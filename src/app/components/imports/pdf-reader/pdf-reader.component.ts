import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
    selector: 'app-pdf-reader',
    templateUrl: './pdf-reader.component.html',
    styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit {
    @Input() pdf;

    page;
    stringToSearch;

    sizes = [
        {
            number: 0.25,
            percent: 25
        },
        {
            number: 0.5,
            percent: 50
        },
        {
            number: 0.75,
            percent: 75
        },
        {
            number: 1,
            percent: 100
        },
    ];

    @ViewChild(PdfViewerComponent, null) private pdfComponent: PdfViewerComponent;

    constructor() { }

    ngOnInit() { }

    search() {
        if (this.stringToSearch != '') {
            this.pdfComponent.pdfFindController.executeCommand('find', {
                caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: this.stringToSearch
            });
        }
    }

    moveToPage() {
        this.pdf.page = this.page;
    }

    setSize(size) {
        this.pdf.zoom = size;
    }
}
