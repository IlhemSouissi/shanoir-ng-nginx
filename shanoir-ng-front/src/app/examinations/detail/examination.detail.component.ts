import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { KeycloakService } from "../../shared/keycloak/keycloak.service";
import { ExaminationService } from '../shared/examination.service';
import { Examination } from '../shared/examination.model';
import { Center } from '../../centers/shared/center.model';
import { CenterService } from '../../centers/shared/center.service';
import { Study } from '../../studies/shared/study.model';
import { StudyService } from '../../studies/shared/study.service';
import { IdNameObject } from '../shared/id-name-object.model';

import { IMyDate, IMyDateModel, IMyInputFieldChanged, IMyOptions } from 'mydatepicker';


@Component({
    selector: 'examinationDetail',
    templateUrl: 'examination.detail.component.html',
    styleUrls: ['examination.detail.component.css'],
})

export class ExaminationDetailComponent implements OnInit {

    public examinationDetailForm: FormGroup
    private examination: Examination = new Examination();
    private examinationId: number;
    public mode: "view" | "edit" | "create";
    private isNameUnique: Boolean = true;
    public canModify: Boolean = false;
    private centers: IdNameObject[];
    private studies: IdNameObject[];
    private subjects: IdNameObject[];
    private examinationExecutives: Object[];
    isDateValid: boolean = true;
    selectedDateNormal: IMyDate;

    constructor(private route: ActivatedRoute, private router: Router,
        private examinationService: ExaminationService, private fb: FormBuilder,
        private centerService: CenterService,
        private studyService: StudyService,
        private location: Location, private keycloakService: KeycloakService) {

    }

    ngOnInit(): void {
        this.initExamination();
        this.getCenters();
        this.getStudies();
        this.getExamination();
        this.buildForm();
        if (this.keycloakService.isUserAdmin() || this.keycloakService.isUserExpert()) {
            this.canModify = true;
        }
    }

    initExamination(): void {
        this.examination.study = new IdNameObject();
        this.examination.center = new IdNameObject();
    }

    getExamination(): void {
        this.route.queryParams
            .switchMap((queryParams: Params) => {
                let examinationId = queryParams['id'];
                let mode = queryParams['mode'];
                if (mode) {
                    this.mode = mode;
                }
                if (examinationId) {
                    // view or edit mode
                    this.examinationId = examinationId;
                    return this.examinationService.getExamination(examinationId);
                } else {
                    // create mode
                    return Observable.of<Examination>();
                }
            })
            .subscribe((examination: Examination) => {
                this.examination = examination;
                this.getDateToDatePicker(this.examination);
            });
    }

    getCenters(): void {
        this.centerService
            .getCentersNamesForExamination()
            .then(centers => {
                this.centers = centers;
            })
            .catch((error) => {
                // TODO: display error
                console.log("error getting center list!");
            });
    }

    getStudies(): void {
        this.studyService
            .getStudiesNames()
            .then(studies => {
                this.studies = studies;
            })
            .catch((error) => {
                // TODO: display error
                console.log("error getting study list!");
            });
    }

    buildForm(): void {
        this.examinationDetailForm = this.fb.group({
            'Id': [this.examination.id],
            'study': [this.examination.study, Validators.required],
            // 'Examination executive': [this.examination.examinationExecutive],
            'center': [this.examination.center, Validators.required],
            // 'Subject': [this.examination.subject],
            'Examination date': [this.examination.examinationDate],
            'Comment': [this.examination.comment],
            'Note': [this.examination.note],
            'Subject weight': [this.examination.subjectWeight]
        });
        this.examinationDetailForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.examinationDetailForm) { return; }
        const form = this.examinationDetailForm;
        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                for (const key in control.errors) {
                    this.formErrors[field] += key;
                }
            }
        }
    }

    onInputFieldChanged(event: IMyInputFieldChanged) {
        if (event.value !== '') {
            if (!event.valid) {
                this.isDateValid = false;
            } else {
                this.isDateValid = true;
            }
        } else {
            this.isDateValid = true;
            setTimeout(() => this.selectedDateNormal = null);
        }
    }

    private myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd/mm/yyyy',
        height: '20px',
        width: '160px'
    };

    onDateChanged(event: IMyDateModel) {
        if (event.formatted !== '') {
            this.selectedDateNormal = event.date;
        }
    }

    setDateFromDatePicker(): void {
        if (this.selectedDateNormal) {
            this.examination.examinationDate = new Date(this.selectedDateNormal.year, this.selectedDateNormal.month - 1,
                this.selectedDateNormal.day);
        } else {
            this.examination.examinationDate = null;
        }
    }

    getDateToDatePicker(examination: Examination): void {
        if (examination && examination.examinationDate && !isNaN(new Date(examination.examinationDate).getTime())) {
            let expirationDate: Date = new Date(examination.examinationDate);
            this.selectedDateNormal = {
                year: expirationDate.getFullYear(), month: expirationDate.getMonth() + 1,
                day: expirationDate.getDate()
            };;
        }
    }

    formErrors = {
        'center': '',
        'study': ''
    };

    back(): void {
        this.location.back();
    }

    edit(): void {
        this.router.navigate(['/examinationDetail'], { queryParams: { id: this.examinationId, mode: "edit" } });
    }

    create(): void {
        this.examination = this.examinationDetailForm.value;
        this.examinationService.create(this.examination)
            .subscribe((examination) => {
                this.back();
            }, (err: String) => {
                if (err.indexOf("name should be unique") != -1) {
                    this.isNameUnique = false;
                }
            });
    }

    update(): void {
        this.examination = this.examinationDetailForm.value;
        this.examinationService.update(this.examinationId, this.examination)
            .subscribe((examination) => {
                this.back();
            }, (err: String) => {
                if (err.indexOf("name should be unique") != -1) {
                    this.isNameUnique = false;
                }
            });
    }


}