import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PdfViewerComponent, PDFProgressData, PDFDocumentProxy } from 'ng2-pdf-viewer';
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
    markedPages;

    lastPageSave: number;

    menuSide = 1;

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
        const page = +this.page;

        if (page < (this.pdf.pages_quantity / 10)) {
            this.pdf.page = (page + 1);
        }
    }

    changePage(page) {
        this.pdf.page = page;
    }

    setSize(size) {
        this.pdf.zoom = size;
    }

    savePage() {
        this.apiService.get('pdf/last-seen-page/' + this.pdf.book_id + '/' + this.pdf.page).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.lastPageSave = resp.book.last_seen_page;
                }
            }
        );
    }

    markPagesFrontend() {
        if (!this.markedPages || !this.markedPages[0]) {
            this.markedPages = [this.pdf.page];
        } else {
            if (this.markedPages.findIndex(page => page === this.pdf.page) < 0) {
                this.markedPages.unshift(this.pdf.page);
            }
        }
    }

    changeMenuSide(side) {
        this.menuSide = side;
    }
}
