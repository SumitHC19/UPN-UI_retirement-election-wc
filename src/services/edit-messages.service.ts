import {  Injectable  } from "@angular/core";
import {  Subject  } from "rxjs";

@Injectable()
export class EditMessagesService {

    editMessageArray: any[] = [];
    editMessageFlag = false;
    editMessageFlagSubject: Subject<boolean> = new Subject<boolean>();
    redirectToUrl: String;
    redirectToUrlSubject: Subject<String> = new Subject<String>();
    editButtonList: any[] = [];
    editButtonListSubject: Subject<[]> = new Subject();
    issTbaEditSubject: Subject<boolean> = new Subject<boolean>();
    issTbaEdit = false;
    pageName: String;
    pageNameSubject: Subject<String> = new Subject<String>();
    buttonActionTypeSubject: Subject<boolean> = new Subject<boolean>();
    buttonActionType: boolean;
    isDbCashoutFlagSubject: Subject<boolean> = new Subject<boolean>();
    isDbCashoutFlag: boolean;
    isDbNQEFlagSubject: Subject<boolean> = new Subject<boolean>();
    isDbNQEFlag: boolean;
    hasEditFlagSubject: Subject<boolean> = new Subject<boolean>();
    hasEdit: boolean;
    saveApiRequestBodySubject: Subject<any> = new Subject<any>();
    saveApiRequestBody: any;
    formvalSubject: Subject<any> = new Subject<any>();
    formval: any;
    paymentTableSubject: Subject<any> = new Subject<any>();
    paymentTable: any;

    constructor() {
        this.editMessageFlagSubject.subscribe((value) => {
            this.editMessageFlag = value;
        });
        this.redirectToUrlSubject.subscribe((value) => {
            this.redirectToUrl = value;
        });
        this.editButtonListSubject.subscribe((value) => {
            this.editButtonList = value;
        });
        this.issTbaEditSubject.subscribe((value) => {
            this.issTbaEdit = value;
        });
        this.buttonActionTypeSubject.subscribe((value) => {
            this.buttonActionType = value;
        });
        this.pageNameSubject.subscribe((value) => {
            this.pageName = value;
        });
        this.isDbCashoutFlagSubject.subscribe((value) => {
            this.isDbCashoutFlag = value;
        });
        this.isDbNQEFlagSubject.subscribe((value) => {
            this.isDbNQEFlag = value;
        });
        this.hasEditFlagSubject.subscribe((value) => {
            this.hasEdit = value;
        });
        this.saveApiRequestBodySubject.subscribe((value) => {
            this.saveApiRequestBody = value;
        });
        this.formvalSubject.subscribe((value) => {
            this.formval = value;
        });
        this.paymentTableSubject.subscribe((value) => {
            this.paymentTable = value;
        });
    }
    saveEditArray(val: any[]) {
        if (val !== undefined) {
            this.editMessageArray = val.map((x: any) => Object.assign({}, x));
            for (let i = 0; i < this.editMessageArray.length; i++) {
                /**
                 * The below condition is to hide only non readable edit ids
                */
                if  (isNaN(Number(this.editMessageArray[i].editId)) || ((String(this.editMessageArray[i].editProcessLevel).toUpperCase()) === "CLIENT")) {
                    this.editMessageArray[i].editId = "";
                }
                if (this.editMessageArray[i]["editDiagnostics"] === undefined) {
                    this.editMessageArray[i]["editDiagnostics"] = "";
                }
                /**
                 * To consider all the validation UI edits as critical
                 */
                if (this.editMessageArray[i]["editSeverity"] === undefined) {
                    this.editMessageArray[i]["editSeverity"] = "Critical";
                }
            }
        }
    }

    getEditButtonList(data) {
        let editButtonList = "[{\"action\": \"" + data.continueBtnText + "\", \"label\": \"" + data.continueBtnLabel + "\"}, {\"action\": \"" +  data.returnBtnText +
        "\", \"label\": \"" + data.returnBtnLabel + "\"}]";
        return JSON.parse(editButtonList);
    }
}
