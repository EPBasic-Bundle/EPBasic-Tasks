import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ApiService } from '../../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-pdf-reader',
    templateUrl: './pdf-reader.component.html',
    styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit {
    @Input() pdf;
    @Input() units;

    page;
    stringToSearch;
    markedPages;
    lastPageSave: number;
    menuSide = 1;
    savedPages = [];
    sPage: number;
    sUnityIdx: number = 0;
    note: string;
    cUnityIdx: number;
    loadingPages: boolean = false;
    sSavedPageIdx: number;
    activatedEdit: boolean = false;

    addPageModal;
    noteModal;

    @ViewChild(PdfViewerComponent, null) private pdfComponent: PdfViewerComponent;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        public toastService: ToastService
    ) { }

    ngOnInit() {
        this.lastPageSave = this.pdf.page;
    }

    /***********/
    /* OPTIONS */
    /***********/

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

    changeMenuSide(side) {
        this.menuSide = side;
    }

    /***********************/
    /* DIRECT ACCESS PAGES */
    /***********************/

    markPagesFrontend() {
        if (!this.markedPages || !this.markedPages[0]) {
            this.markedPages = [this.pdf.page];
        } else {
            if (this.markedPages.findIndex(page => page === this.pdf.page) < 0) {
                this.markedPages.unshift(this.pdf.page);
            }
        }
    }

    /************/
    /* LASTPAGE */
    /************/

    saveLastPage() {
        this.apiService.get('pdf/last-seen-page/' + this.pdf.book_id + '/' + this.pdf.page).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.lastPageSave = resp.book.last_seen_page;
                }
            }
        );
    }

    /***************/
    /* SAVED PAGES */
    /***************/

    getSavedPages(unity_index) {
        this.apiService.get('pdf/saved-pages/' + this.units[unity_index].id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[unity_index].savedPages = resp.savedPages;
                }
            }
        );
    }

    selectUnity(unity_index) {
        this.sUnityIdx = unity_index;
    }

    storePage() {
        this.apiService.get('pdf/saved-pages/' + this.units[this.sUnityIdx].id).subscribe(
            resp => {
                if (resp.status === 'success') {
                    let savedPageIndex = resp.savedPages.findIndex(savedPage => savedPage.page == this.sPage);

                    if (savedPageIndex < 0) {
                        const savedPage = {
                            id: 0,
                            unity_id: this.units[this.sUnityIdx].id,
                            page: this.sPage,
                            note: this.note
                        }

                        this.note = '';

                        if (!this.units[this.sUnityIdx].savedPages) {
                            this.units[this.sUnityIdx].savedPages = [];
                        }

                        this.apiService.post('pdf/savedPage', savedPage).subscribe(
                            resp => {
                                if (resp.status === 'success') {
                                    this.units[this.sUnityIdx].savedPages.push(resp.savedPage);
                                    
                                    this.showToast('Página guardada correctamente', 'success');
                                }
                            }
                        );
                    } else {
                        this.showToast('La página ya está guardada', 'danger');
                        this.note = '';
                    }
                } () => {
                    this.showToast('La página no se ha guardado correctamente', 'danger');
                    this.note = '';
                }
            }
        );

        this.closeAddPageModal();
    }

    updatePage() {
        const savedPage = this.units[this.sUnityIdx].savedPages[this.sSavedPageIdx];

        this.apiService.put('pdf/savedPage/' + savedPage.id, savedPage).subscribe(
            resp => {
                if (resp.status === 'success') {
                    this.units[this.sUnityIdx].savedPages[this.sSavedPageIdx] = resp.savedPage;

                    this.showToast('Página actualizada correctamente', 'success');
                }
            }
        );

        this.enableEdit(0);
    }

    isActivatedEdit() {
        if (this.activatedEdit == true) {
            return true;
        } else {
            return false;
        }
    }

    enableEdit(action) {
        if (action === 1) {
            this.activatedEdit = true;
        } else {
            this.activatedEdit = false;
        }
    }

    /**********/
    /* MODALS */
    /**********/

    openAddPageModal(content, page) {
        this.sPage = page;

        this.addPageModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    closeAddPageModal() {
        this.addPageModal.close();
    }

    openNoteModal(content, unity_index, savedPage_index) {
        this.sUnityIdx = unity_index;
        this.sSavedPageIdx = savedPage_index;

        this.enableEdit(0);

        this.noteModal = this.modalService.open(content, { size: 'sm', centered: true });
    }

    closeNoteModal() {
        this.noteModal.close();
    }

    /***********/
    /* COLAPSE */
    /***********/

    collapse(unity_index) {
        if (this.cUnityIdx != null) {
            this.units[this.cUnityIdx].savedPages = null;
        }

        if (this.cUnityIdx === unity_index) {
            this.cUnityIdx = null;
        } else {
            this.cUnityIdx = unity_index;

            this.getSavedPages(unity_index);
        }
    }

    isCollapsed(unity_index) {
        if (this.cUnityIdx === unity_index) {
            return false;
        } else {
            return true;
        }
    }

    /**********/
    /* OTROS */
    /**********/

    showToast(text, type) {
        switch (type) {
            case 'success': {
                this.toastService.show(text, { classname: 'bg-dark text-light', delay: 5000 });
                break;
            }
            case 'danger': {
                this.toastService.show(text, { classname: 'bg-danger text-light', delay: 5000 });
                break;
            }
        }
    }
}
