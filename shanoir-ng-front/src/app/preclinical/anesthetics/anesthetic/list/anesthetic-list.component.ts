import {Component, ViewChild, ViewContainerRef} from '@angular/core'
import { Router } from '@angular/router'; 

import { ConfirmDialogService } from "../../../../shared/components/confirm-dialog/confirm-dialog.service";
import { KeycloakService } from "../../../../shared/keycloak/keycloak.service";

import { Anesthetic } from '../shared/anesthetic.model';
import { AnestheticService } from '../shared/anesthetic.service';
import { AnestheticType } from "../../../shared/enum/anestheticType";
import { ImagesUrlUtil } from '../../../../shared/utils/images-url.util';
import { ExaminationAnestheticService } from '../../examination_anesthetic/shared/examinationAnesthetic.service';
import { FilterablePageable, Page } from '../../../../shared/components/table/pageable.model';
import { BrowserPaging } from '../../../../shared/components/table/browser-paging.model';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'anesthetic-list',
  templateUrl:'anesthetic-list.component.html',
  styleUrls: ['anesthetic-list.component.css'], 
  providers: [AnestheticService]
})
export class AnestheticsListComponent {
  public anesthetics: Anesthetic[];
  private anestheticsPromise: Promise<void> = this.getAnesthetics();
  private browserPaging: BrowserPaging<Anesthetic>;
  public rowClickAction: Object;
  public columnDefs: any[];
  public customActionDefs: any[];
  @ViewChild('anestheticsTable') table: TableComponent;
    
    constructor(
        public anestheticsService: AnestheticService,
        public router: Router,
        private keycloakService: KeycloakService,
        public confirmDialogService: ConfirmDialogService,
        public examinationAnestheticService: ExaminationAnestheticService,
        private viewContainerRef: ViewContainerRef) {
            this.createColumnDefs();
     }
    
    
    getPage(pageable: FilterablePageable): Promise<Page<Anesthetic>> {
        return new Promise((resolve) => {
            this.anestheticsPromise.then(() => {
                resolve(this.browserPaging.getPage(pageable));
            });
        });
    }
    
    
    getAnesthetics(): Promise<void> {
    	this.anesthetics = [];
        return this.anestheticsService.getAnesthetics().then(anesthetics => {
            this.anesthetics = anesthetics;
            this.browserPaging = new BrowserPaging(this.anesthetics, this.columnDefs);
        })
    }
    
    
    delete(anesthetic:Anesthetic): void {      
      this.anestheticsService.delete(anesthetic.id).then((res) => this.getAnesthetics());
    }
    
    /*editAnesthetic = (anesthetic:Anesthetic) => {
        this.router.navigate(['/preclinical-anesthetics-edit/', anesthetic.id]);
    }*/
    
    // Grid columns definition
    private createColumnDefs() {
        function castToString(id: number) {
            return String(id);
        };
        function checkNullValue(value: any) {
            if(value){
                return value;
            }
            return '';
        };
        function checkNullValueReference(reference: any) {
            if(reference){
                return reference.value;
            }
            return '';
        };
        this.columnDefs = [
            /*{headerName: "ID", field: "id", type: "id", cellRenderer: function (params: any) {
                return castToString(params.data.id);
            }},*/
            {headerName: "Name", field: "name", type: "string", cellRenderer: function (params: any) {
                return checkNullValue(params.data.name);
            }},
            {headerName: "Type", field: "anestheticType", type: "Enum", cellRenderer: function (params: any) {
                return AnestheticType[params.data.anestheticType];
            }},
            {headerName: "Comment", field: "comment", type: "string", cellRenderer: function (params: any) {
                return checkNullValue(params.data.comment);
            }}
        ];        
        if (this.keycloakService.isUserAdmin() || this.keycloakService.isUserExpert()) {
            this.columnDefs.push({headerName: "", type: "button", img: ImagesUrlUtil.GARBAGE_ICON_PATH, action: this.checkExaminationsForAnesthetics},
            {headerName: "", type: "button", img: ImagesUrlUtil.EDIT_ICON_PATH, target : "/preclinical-anesthetic", getParams: function(item: any): Object {
                return {id: item.id, mode: "edit"};
            }});
        }
        if (!this.keycloakService.isUserGuest()) {
            this.columnDefs.push({headerName: "", type: "button", img: ImagesUrlUtil.VIEW_ICON_PATH, target : "/preclinical-anesthetic", getParams: function(item: any): Object {
                return {id: item.id, mode: "view"};
            }});
        }
        this.customActionDefs = [];
        if (this.keycloakService.isUserAdmin() || this.keycloakService.isUserExpert()) {
        this.customActionDefs.push({title: "new anesthetic", img: ImagesUrlUtil.ADD_ICON_PATH, target: "/preclinical-anesthetic", getParams: function(item: any): Object {
                return {mode: "create"};
        }});
        this.customActionDefs.push({title: "delete selected", img: ImagesUrlUtil.GARBAGE_ICON_PATH, action: this.deleteAll });
        }
        if (!this.keycloakService.isUserGuest()) {
            this.rowClickAction = {target : "/preclinical-anesthetic", getParams: function(item: any): Object {
                    return {id: item.id, mode: "view"};
            }};
        }
    }
    
    openDeleteAnestheticConfirmDialog = (item: Anesthetic) => {
         this.confirmDialogService
                .confirm('Delete anesthetic', 'Are you sure you want to delete anesthetic ' + item.id + '?', 
                    this.viewContainerRef)
                .subscribe(res => {
                    if (res) {
                        this.delete(item);
                    }
                });
    }
    
    
    deleteAll = () => {
        let ids: number[] = [];
        for (let anesthetic of this.anesthetics) {
            if (anesthetic["isSelectedInTable"]) ids.push(anesthetic.id);
        }
        if (ids.length > 0) {
            console.log("TODO : delete those ids : " + ids);
        }
    }
    
    
 	checkExaminationsForAnesthetics= (item: Anesthetic) => {
 		 this.examinationAnestheticService.getAllExaminationForAnesthetic(item.id).then(examinationAnesthetics => {
    		if (examinationAnesthetics){
    			let hasExams: boolean  = false;
    			hasExams = examinationAnesthetics.length > 0;
    			if (hasExams){
    				this.confirmDialogService
                		.confirm('Delete anesthetic', 'This anesthetic is linked to preclinical examinations, it can not be deleted', 
                    		this.viewContainerRef)
    			}else{
    				this.openDeleteAnestheticConfirmDialog(item);
    			}
    		}else{
    			this.openDeleteAnestheticConfirmDialog(item);
    		}
    	}).catch((error) => {
    		console.log(error);
    		this.openDeleteAnestheticConfirmDialog(item);
    	});    
 	}
 	
 	private onRowClick(item: Anesthetic) {
        if (!this.keycloakService.isUserGuest()) {
             this.router.navigate(['/preclinical-anesthetic'], { queryParams: { id: item.id, mode: "view" } });
        }
    }

}