import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-pdf-reader',
    templateUrl: './pdf-reader.component.html',
    styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit {
    @Input() pdf;

    page;
    stringToSearch;

    loading;

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

    lastPageSave: number;

    @ViewChild(PdfViewerComponent, null) private pdfComponent: PdfViewerComponent;

    constructor(
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this.lastPageSave = this.pdf.page;
    }

    search() {
        // tslint:disable-next-line:triple-equals
        if (this.stringToSearch != '') {
            this.pdfComponent.pdfFindController.executeCommand('find', {
                caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: this.stringToSearch
            });
        }
    }

    moveToPage() {
        if (+this.page < this.pdf.pages_quantity) {
            this.pdf.page = this.page;
        }
    }

    setSize(size) {
        this.pdf.zoom = size;
    }

    savePage() {
        this.loading = true;
        this.apiService.get('pdf/last-seen-page/' + this.pdf.book_id + '/' + this.pdf.page).subscribe(
            resp => {
                this.loading = false;
                if (resp.status === 'success') {
                    this.lastPageSave = resp.book.last_seen_page;
                }
            }, (error) => {
                this.loading = false;
            }
        );
    }
}
