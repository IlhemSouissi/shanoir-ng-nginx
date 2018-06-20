import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { IMyOptions } from 'mydatepicker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'datepicker',
    template: `
        <my-date-picker 
            [options]="options" 
            [ngModel]="convertedDate"
            (ngModelChange)="onModelChange($event)">
        </my-date-picker>
    `,
    styles: ['my-date-picker { }'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => DatepickerComponent),
          multi: true,
        }]   
})

export class DatepickerComponent implements ControlValueAccessor {
    
    @Input() ngModel: Date = null;
    @Output() ngModelChange = new EventEmitter();
    private convertedDate: Object;

    private options: IMyOptions = {
        dateFormat: 'dd/mm/yyyy',
        height: '21px',
        width: '160px'
    };

    constructor() {

    }

    onModelChange(event) {
        let newDate: Date = null;
        if (event) {
            newDate = new Date(event.date.year, event.date.month - 1, event.date.day, 0, 0, 0, 0);
        }
        this.ngModelChange.emit(newDate);
    }

    writeValue(obj: any): void {
        if (!obj) {
            this.ngModel = null;
        } else {
            this.ngModel = new Date(obj);
        }
        this.convertedDate = {jsdate: this.ngModel};
    }
    
    registerOnChange(fn: any): void {
    }

    registerOnTouched(fn: any): void {
    }

}