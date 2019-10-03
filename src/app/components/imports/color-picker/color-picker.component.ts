import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
    @Input() heading: string;
    @Input() color: string;
    @Output() event: EventEmitter<string> = new EventEmitter<string>();

    modal;

    defaultColors: string[] = [ '#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00',
    '#80ff00', '#40ff00', '#00ff00', '#00ff40', '#00ff80', '#00ffbf', '#00ffff', '#00bfff', '#0080ff',
    '#0040ff', '#0000ff', '#4000ff', '#8000ff', '#bf00ff', '#ff00ff', '#ff00bf', '#ff0040', '#ff0000'];

    constructor(
        private modalService: NgbModal
    ) {}

    changeColor(color: string): void {
        this.color = color;
        this.event.emit(this.color);

        this.modal.close();
    }

    openModal(content, size) {
        this.modal = this.modalService.open(content, { size, centered: true });
    }
}
