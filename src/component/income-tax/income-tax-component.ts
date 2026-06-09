import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { finalize } from "rxjs";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { AlValidators, AlLoaderComponent, LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, DomStorageFallbackService } from "@alight/core-utilities-lib";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { EditMessagesService } from "../../services/edit-messages.service";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ReviewPensionChoicesService } from "../../services/review-pension-choices.service";
import { ViewRhrComponentsModel } from "../shared/models/view-rhr-components.model";
import { ForbiddenAmountValidator, ForbiddenAmountValidatorMin } from "../shared/french-validator";


// declare var require:any;

@Component({
    selector: "al-income-tax",
    templateUrl: "./income-tax-component.html",
    providers: [AlLoaderComponent]
})
export class IncomeTaxComponent implements OnInit {
    data: any;
    incomeTaxWthlTables: any;
    pageEditList: any;
    checkresponse = false;
    responseData: any;
    public incomeTaxWthlForm: UntypedFormGroup;
    showError = true;
    allowContinue = false;
    usethisstateBtnClick = false;
    isCanWthd = false;
    currentState: any;
    totalAmt = 0;
    fedAmt = 0;
    stAmt = 0;
    fedAmt1 = 0;
    stAmt1 = 0;
    editMessageList: any[];
    paymentId: any;
    routeToPageLocation: any = "/retirement-election/review-choices";
    headers: any;
    saveApiRequestBody: any;
    businessProcessReferenceId: any;
    incomeTaxFormValues = {};
    domSystemTickets: any;
    ViewRhrComponents = new ViewRhrComponentsModel();
    isDbCashoutOrNQPageLoading = false;
    FrAmountPattern = (/^([0-9\s]*)((\,)[0-9]{1,2})?$/);

    display: boolean;
    @Input() isDbCashoutFlag: boolean;
    @Input() isDbNQFlag: boolean;
    @ViewChild("aldialogCancel") aldialogCancel;
    hassTBAEdit = false;
    defaultLocale = true;

    constructor(private retirementElectionRestService: RetirementElectionRestService, private editMessagesService: EditMessagesService, private stepsActiveIndexService: StepsActiveIndexService, private router: Router,
        private reviewPensionChoicesService: ReviewPensionChoicesService, private loading: AlLoaderComponent,
        private logger: LoggingService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private activatedRoute: ActivatedRoute,
        private domFBService: DomStorageFallbackService) {
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    ngOnInit() {
        this.checkDefaultAmtFormat();
        // this.stepsActiveIndexService.setStepIndex(6);
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(5);
        } else {
            this.stepsActiveIndexService.setStepIndex(6);
        }
        // this.retirementElectionRestService.isMultiBeneSupported? this.stepsActiveIndexService.setStepIndex(5):this.stepsActiveIndexService.setStepIndex(6);
        this.dynamicComponentService.initializePageComponents();
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        if (isCallBackAllowed) {
            if (!this.isDbCashoutFlag && !this.isDbNQFlag) {
                this.domSystemTickets = this.domFBService.getItem("systemTickets", "sessionStorage", true);
                if (this.domSystemTickets !== undefined && this.domSystemTickets !== null) {
                    this.retirementElectionRestService.setSystemTicketsDOM(JSON.parse(this.domSystemTickets));
                }
                this.retirementElectionRestService.getQueryParameters();
            }
            this.editMessagesService.isDbCashoutFlag = this.isDbCashoutFlag;
            this.editMessagesService.isDbNQEFlag = this.isDbNQFlag;
            this.retirementElectionRestService.screenCapture(true);
            this.paymentId = this.reviewPensionChoicesService.getPaymentId();
            this.incomeTaxWithHoldingData(true);

        } else {
            this.checkresponse = true;
        }


    }
    /* istanbul ignore next */
    checkDefaultAmtFormat() {
        let locale = this.retirementElectionRestService.getLocale();
        this.defaultLocale = this.retirementElectionRestService.isDefaultLocale(locale);
    }


    showTable(tableId): boolean {
        if (tableId === "US_FEDERAL" && this.data.changeIncomeTaxWithholding.isStateOnly) {
            return false;
        }
        return true;
    }

    incomeTaxWithHoldingData(buttonActionType) {
        if (!buttonActionType) {
            this.usethisstateBtnClick = true;
        }
        this.retirementElectionRestService.incomeTaxWithHoldingServices(this.paymentId, buttonActionType, this.isDbCashoutFlag, this.isDbNQFlag)
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                            let responseStatusCode = this.data.status.statusCode;
                            if (responseStatusCode === 200) {
                                this.showError = false;
                                document.title = this.data.changeIncomeTaxWithholding.pageNameText;
                                if (this.isDbCashoutFlag || this.isDbNQFlag) {
                                    // let pageUrl = this.retirementElectionRestService.pageUrlFromCashoutRoot(window.location.href);
                                    // this.dynamicComponentService.initializePageComponents(pageUrl); // Added Code Google Analytics
                                    let dbcProgressbarData = this.data.progressBarInfo;
                                    /* istanbul ignore next */
                                    if (this.isDbCashoutFlag) {
                                        this.retirementElectionRestService.gaPageTracking(window.location.href);
                                        this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 3, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    } else {
                                        this.googleAnalyticsService.postGACustomPageTracking("dbNQRetirementIncomeTaxWthl", "DB Retirement Flow - NQ");
                                        this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 4, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    }
                                    let dbcRightRailData = this.data.tiles;
                                    this.retirementElectionRestService.setRightRailData(dbcRightRailData.iraChecklist, dbcRightRailData.questions, true, false, false);
                                } else {
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices140ChangeIncomeTaxWthdPage");
                                }
                                this.incomeTaxWthlTables = this.data.changeIncomeTaxWithholding.incomeTaxWithholdingTables;
                                this.pageEditList = this.data.changeIncomeTaxWithholding.pageEditList;
                                if (this.data.changeIncomeTaxWithholding.flowButtonNavigation !== undefined && this.data.changeIncomeTaxWithholding.flowButtonNavigation.editButtonList !== undefined) {
                                    let editButtonList = this.data.changeIncomeTaxWithholding.flowButtonNavigation.editButtonList;
                                    if (editButtonList.length !== 0) {
                                        this.editMessagesService.editButtonListSubject.next(editButtonList);
                                    }
                                }
                                let newformdata = {};
                                this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
                                    // incomeTaxWthlForm creation
                                    let incometaxwthlName = "";
                                    let SetFormField = false;
                                    incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                                        if (paymentTableItem.showRadio) {
                                            SetFormField = true;
                                            if (paymentTableItem.radioSelected) {
                                                incometaxwthlName = paymentTableItem.name;
                                            }
                                        }
                                        if (paymentTableItem.fieldType) {
                                            if (paymentTableItem.fieldType === "dropdown") {
                                                let defaultValue = paymentTableItem.dropDownValidValues.filter(item => item.isSelected === true);
                                                if (defaultValue.length > 0) {
                                                    newformdata["field" + incomeTaxWthlTable.id + paymentTableItem.name] = new UntypedFormControl(defaultValue[0].value);
                                                } else {
                                                    /* istanbul ignore next */
                                                    newformdata["field" + incomeTaxWthlTable.id + paymentTableItem.name] = new UntypedFormControl();
                                                }
                                                if (paymentTableItem.name === "state") {
                                                    this.currentState = defaultValue[0].value;
                                                }
                                            } else {
                                                if (paymentTableItem.formattedDefaultValue !== undefined && paymentTableItem.formattedDefaultValue !== undefined) {
                                                    if (paymentTableItem.fieldType === "amount" && this.defaultLocale) {
                                                        let amount = paymentTableItem.formattedDefaultValue;
                                                        let defaultValue = amount.replace(/,/g, "");
                                                        paymentTableItem.defaultValue = defaultValue;
                                                    }
                                                    if (paymentTableItem.fieldType === "number" && !this.defaultLocale) {
                                                        let number = paymentTableItem.formattedDefaultValue;
                                                        let getNumberValue = parseInt(number);
                                                        let getStringValue = getNumberValue.toString();
                                                        paymentTableItem.formattedDefaultValue = getStringValue;
                                                    }
                                                }
                                                let formattedDefaultVal = this.defaultLocale ? paymentTableItem.defaultValue : paymentTableItem.formattedDefaultValue;
                                                newformdata["field" + incomeTaxWthlTable.id + paymentTableItem.name] = new UntypedFormControl(formattedDefaultVal);

                                            }
                                        }

                                    });
                                    if (SetFormField) {
                                        newformdata[incomeTaxWthlTable.id] = new UntypedFormControl(incometaxwthlName, Validators.required);
                                    }
                                });
                                this.incomeTaxWthlForm = new UntypedFormGroup(newformdata);
                                this.updateInitialValidators();
                            }
                        }
                    }
                    // the db cashout/nq enrollment loader should show when Use this state button is clicked and state is changed
                    if ((this.isDbCashoutFlag || this.isDbNQFlag) && !buttonActionType) {
                        this.isDbCashoutOrNQPageLoading = false;
                    }
                    this.retirementElectionRestService.screenCaptureInit("income-tax");
                }),
            ).subscribe(
                (data: any) => {
                    if (data !== undefined && data !== null && data.body !== undefined) {
                        this.data = data.body;
                    }
                    this.logger._debug(JSON.stringify(data), "Getting IncomeTax details successfully", LoggingConstants.INFO, "RetirementElection - IncomeTax - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in IncomeTax component response", LoggingConstants.ERROR, "RetirementElection - IncomeTax - Get Service");
                }
            );
        window.scrollTo(0, 0);
    }

    useThisStateBtnClick(isCashoutFlag, isDbNQFlag) {
        let updatedState = this.incomeTaxWthlForm.get("fieldUS_STATEstate").value;
        if (this.currentState !== updatedState) {
            this.continueClick(this.incomeTaxWthlForm, this.incomeTaxWthlForm.valid, false, isCashoutFlag, isDbNQFlag);
        }
    }
    onSelectChange() {
        this.usethisstateBtnClick = false;
    }

    onChange(event, tablename) {
        this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
            let secondaryFieldName = incomeTaxWthlTable.id;
            /* istanbul ignore next */
            if (tablename.includes(secondaryFieldName)) {
                let nestedOptions = incomeTaxWthlTable.rowList.filter(rowItem => rowItem.isNestedOption);
                incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                    if (paymentTableItem.hasOwnProperty("fieldType")) {
                        // clear out value
                        if (paymentTableItem.fieldType !== "dropdown") {
                            this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].setValue(this.defaultLocale ? paymentTableItem.defaultValue : paymentTableItem.formattedDefaultValue);
                        }
                        this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].setValidators(null);
                        this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].updateValueAndValidity();
                        this.incomeTaxWthlForm.updateValueAndValidity();
                        if (paymentTableItem.name === event) {
                            let { fieldEditList } = paymentTableItem;
                            let validatorList = [];
                            fieldEditList.forEach(fieldItem => {
                                if (fieldItem.validatorType === "required") {
                                    validatorList.push(Validators.required);
                                } else if (fieldItem.validatorType === "validformat") {
                                    if (this.defaultLocale) {
                                        let { constraintDataList: [{ value: patternValue }] } = fieldItem;
                                        validatorList.push(Validators.pattern(patternValue));
                                    } else {
                                        let patternValue = this.FrAmountPattern;
                                        validatorList.push(Validators.pattern(patternValue));
                                    }
                                } else if (fieldItem.validatorType === "range") {
                                    let { constraintDataList } = fieldItem;

                                    let min, max;
                                    constraintDataList.map((constraintDataItem) => {
                                        if (constraintDataItem.name === "min") {
                                            min = constraintDataItem;
                                        } else if (constraintDataItem.name === "max") {
                                            max = constraintDataItem;
                                        }
                                    });
                                    if (this.defaultLocale) {
                                        validatorList.push(AlValidators.range([(min.value), (max.value)]));
                                    } else {
                                        validatorList.push(ForbiddenAmountValidator(min.value, max.value, this.FrAmountPattern));
                                    }
                                }
                            });

                            this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].setValidators(validatorList);
                            this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].updateValueAndValidity();
                            this.incomeTaxWthlForm.updateValueAndValidity();
                        }
                    }
                    /* istanbul ignore next */
                    if (event === "stWithholdChoices" || event === "fedWithholdChoices" || event === "stWithholdChoicesPercent") {
                        if (nestedOptions) {
                            nestedOptions.forEach(nestedOptionsItem => {
                                let editList = nestedOptionsItem.fieldEditList;
                                let validatorList = [];

                                editList.forEach(editItem => {
                                    if (nestedOptionsItem.fieldType === "dropdown") {
                                        if (editItem.validatorType === "required") {
                                            validatorList.push(Validators.required);
                                        }
                                    } else {
                                        if (editItem.validatorType === "required") {
                                            validatorList.push(Validators.required);
                                        } else if (editItem.validatorType === "validformat") {
                                            if (this.defaultLocale) {
                                                let { constraintDataList: [{ value: patternValue }] } = editItem;
                                                validatorList.push(Validators.pattern(patternValue));
                                            } else {
                                                let patternValue = this.FrAmountPattern;
                                                validatorList.push(Validators.pattern(patternValue));
                                            }
                                        } else if (editItem.validatorType === "range") {
                                            let { constraintDataList } = editItem;

                                            let min, max;
                                            constraintDataList.map((constraintDataItem) => {
                                                if (constraintDataItem.name === "min") {
                                                    min = constraintDataItem;
                                                } else if (constraintDataItem.name === "max") {
                                                    max = constraintDataItem;
                                                }
                                            });
                                            if (this.defaultLocale) {
                                                validatorList.push(AlValidators.range([(min.value), (max.value)]));
                                            } else {
                                                validatorList.push(ForbiddenAmountValidator(min.value, max.value, this.FrAmountPattern));
                                            }
                                        }
                                    }
                                });
                                this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + nestedOptionsItem.name].setValidators(validatorList);
                                this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + nestedOptionsItem.name].updateValueAndValidity();
                            });
                        }
                    }
                });
            }
        });
    }

    /* istanbul ignore next */
    continueClick(formval, isvalid: boolean, buttonActionType, isCashoutFlag, isDbNQFlag) {
        /* istanbul ignore next */
        if (this.allowContinue) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            Promise.resolve().then(() => {
                this.onContinueClick(formval, isvalid, buttonActionType, isCashoutFlag, isDbNQFlag);
            });
        } else {
            this.onContinueClick(formval, isvalid, buttonActionType, isCashoutFlag, isDbNQFlag);
        }
    }

    onContinueClick(formval, isvalid: boolean, buttonActionType, isCashoutFlag, isDbNQFlag) {
        this.allowContinue = false;
        let throwException = {};

        try {
            // atleast 1 in radio group validation edit
            /* istanbul ignore next */
            if (!isvalid) {
                this.editMessageList = [];
                let pageeditFederal, pageeditState;
                this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
                    let secondaryFieldName = incomeTaxWthlTable.id;
                    if (secondaryFieldName.includes("FEDERAL")) {
                        pageeditFederal = this.pageEditList.filter(pageEditItem => {
                            return pageEditItem.hasOwnProperty("constraintDataList");
                        }).filter(constraintDataList => {
                            let { constraintDataList: [{ name: editname, value: radiovalue }] } = constraintDataList;
                            return (editname === "withholdingTable" && radiovalue.includes(secondaryFieldName));
                        });
                    } else if (secondaryFieldName.includes("STATE")) {
                        pageeditState = this.pageEditList.filter(pageEditItem => {
                            return pageEditItem.hasOwnProperty("constraintDataList");
                        }).filter(constraintDataList => {
                            let { constraintDataList: [{ name: editname, value: radiovalue }] } = constraintDataList;
                            return (editname === "withholdingTable" && radiovalue.includes(secondaryFieldName));
                        });
                    }
                    if (secondaryFieldName.includes("FEDERAL") && (formval.value[secondaryFieldName] === "")) {
                        this.editMessageList.push(pageeditFederal[0]);
                        this.allowContinue = true;
                        throw throwException;
                    } else if (secondaryFieldName.includes("STATE") && (formval.value[secondaryFieldName] === "") && buttonActionType) {
                        this.editMessageList.push(pageeditState[0]);
                        this.allowContinue = true;
                        throw throwException;
                    } else {
                        this.allowContinue = true;
                        throw throwException;
                    }
                });
            }

            this.editMessageList = [];
            // valid amt validation
            let pageeditValidAmt = this.pageEditList.filter(pageEditItem => {
                return pageEditItem.hasOwnProperty("constraintDataList");
            }).filter(constraintDataList => {
                let { constraintDataList: [{ name: editname }] } = constraintDataList;
                return (editname === "federalTaxableIncome");
            });
            let { constraintDataList: [{ value: fedvalue }] } = pageeditValidAmt[0];
            /* istanbul ignore next */
            this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
                if (incomeTaxWthlTable.id.includes("CAN")) {
                    if (incomeTaxWthlTable.id.includes("FEDERAL")) {
                        let fedFmtAmt = this.defaultLocale ? this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canFedTaxCreditAmount").value : (this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canFedTaxCreditAmount").value).replace(/\s/g, "").replace(",", ".");
                        let fedFmtAmt1 = this.defaultLocale ? this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canFedWithholdAdditionalAmount").value : (this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canFedWithholdAdditionalAmount").value).replace(/\s/g, "").replace(",", ".");
                        this.fedAmt = parseFloat(fedFmtAmt);
                        this.fedAmt1 = parseFloat(fedFmtAmt1);
                    }
                    if (incomeTaxWthlTable.id.includes("STATE")) {
                        let stFmtAmt = this.defaultLocale ? this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canStTaxCreditAmount").value : (this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canStTaxCreditAmount").value).replace(/\s/g, "").replace(",", ".");
                        let stFmtAmt1 = this.defaultLocale ? this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canStWithholdAdditionalAmount").value : (this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "canStWithholdAdditionalAmount").value).replace(/\s/g, "").replace(",", ".");
                        this.stAmt = parseFloat(stFmtAmt);
                        this.stAmt1 = parseFloat(stFmtAmt1);
                    }
                    this.isCanWthd = true;
                }
                let SetFormField = false;
                let radiovalue;
                incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                    if (paymentTableItem.showRadio) {
                        SetFormField = true;
                    }
                });
                if (SetFormField) {
                    radiovalue = this.incomeTaxWthlForm.get(incomeTaxWthlTable.id).value;
                }
                /* istanbul ignore next */
                switch (radiovalue) {
                    case "fedWithholdDefault":
                        let fedWithholdDefaultAmt = incomeTaxWthlTable.rowList.find(paymentTableItem => paymentTableItem.name === "fedWithholdDefault");
                        let floatedValue = Number(fedWithholdDefaultAmt.displayValue.replace(/[^0-9\.]+/g, ""));
                        if (!isNaN(floatedValue)) {
                            this.fedAmt = floatedValue;
                        }
                        break;
                    case "fedWithholdNothing":
                        let fedWithholdNothingAmt = incomeTaxWthlTable.rowList.find(paymentTableItem => paymentTableItem.name === "fedWithholdNothing");
                        let fedWithholdNothingAmtFloat = Number(fedWithholdNothingAmt.displayValue.replace(/[^0-9\.]+/g, ""));
                        if (!isNaN(fedWithholdNothingAmtFloat)) {
                            this.fedAmt = fedWithholdNothingAmtFloat;
                        }
                        break;
                    case "fedWithholdChoices":
                        this.fedAmt = parseFloat(this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "fedAdditionalAmount").value);
                        break;
                    case "fedWithholdAmount":
                        this.fedAmt = parseFloat(this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + radiovalue).value);
                        break;
                    case "fedWithholdPercent":
                        this.fedAmt = parseFloat(this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + radiovalue).value) * fedvalue / 100;
                        break;
                    case "stWithholdNothing":
                        this.stAmt = 0;
                        break;
                    case "stWithholdAmount":
                        this.stAmt = parseFloat(this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + radiovalue).value);
                        break;
                    case "stWithholdChoices":
                        this.fedAmt = parseFloat(this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + "stAdditionalPercent").value);
                        break;
                }

            });
            this.totalAmt = this.stAmt + this.fedAmt + this.fedAmt1 + this.stAmt1;
            /* istanbul ignore next */
            if (buttonActionType && !this.isCanWthd) {
                if (this.totalAmt > fedvalue) {
                    this.editMessageList.push(pageeditValidAmt[0]);
                    this.allowContinue = true;
                }
            }
            // Choose Withold Nothing validation
            let pageeditChooseWthlNothing = this.pageEditList.find(pageEditItem => pageEditItem.editId === "editDbRtrmChcStWthlMinEqZero");

            let fedRadiovalue;
            let stRadiovalue;
            let fedRadioValuesArray = [];
            let stRadioValuesArray = [];
            let stRadiovalueAmt;
            let fedRadiovalueAmt;
            /* istanbul ignore next */
            this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
                if (incomeTaxWthlTable.id.includes("FEDERAL")) {
                    if (this.incomeTaxWthlForm.get(incomeTaxWthlTable.id)) {
                        fedRadiovalue = this.incomeTaxWthlForm.get(incomeTaxWthlTable.id).value;
                    }
                    if (fedRadiovalue) {
                        if (fedRadiovalue.includes("WithholdAmount")) {
                            fedRadiovalueAmt = this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + fedRadiovalue).value;
                        }
                    }
                    incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                        if (paymentTableItem.showRadio) {
                            fedRadioValuesArray.push(paymentTableItem.radioValue);
                        }
                    });
                }
                if (incomeTaxWthlTable.id.includes("STATE")) {
                    if (this.incomeTaxWthlForm.get(incomeTaxWthlTable.id)) {
                        stRadiovalue = this.incomeTaxWthlForm.get(incomeTaxWthlTable.id).value;
                    }
                    if (stRadiovalue) {
                        if (stRadiovalue.includes("WithholdAmount")) {
                            stRadiovalueAmt = this.incomeTaxWthlForm.get("field" + incomeTaxWthlTable.id + stRadiovalue).value;
                        }
                    }
                    incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                        if (paymentTableItem.showRadio) {
                            stRadioValuesArray.push(paymentTableItem.radioValue);
                        }
                    });
                }
            });
            /* istanbul ignore next */
            if (buttonActionType) {
                if (stRadiovalue) {
                    if (stRadiovalue.includes("WithholdAmount")) {
                        let withholdNothingExists = stRadioValuesArray.some(x => x === "NOWT");
                        if (withholdNothingExists && parseFloat(stRadiovalueAmt) === 0.00) {
                            this.editMessageList.push(pageeditChooseWthlNothing);
                            this.allowContinue = true;
                        }
                    }
                }
            }
            /* istanbul ignore next */
            if (fedRadiovalue) {
                if (fedRadiovalue.includes("WithholdAmount")) {
                    let withholdNothingExists = fedRadioValuesArray.some(x => x === "NOWT");
                    if (withholdNothingExists && parseFloat(fedRadiovalueAmt) === 0.00) {
                        this.editMessageList.push(pageeditChooseWthlNothing);
                        this.allowContinue = true;
                    }
                }
            }
            // usethisstate button validation

            let pageeditUseThisState = this.pageEditList.filter(pageEditItem => {
                return pageEditItem.hasOwnProperty("constraintDataList");
            }).filter(constraintDataList => {
                let { constraintDataList: [{ name: editname }] } = constraintDataList;
                return (editname === "currentTaxState");
            });
            /* istanbul ignore next */
            if (buttonActionType) {
                this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
                    incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                        if (paymentTableItem.hasOwnProperty("useThisStateButton")) {
                            let secondaryFieldName = "field" + incomeTaxWthlTable.id + paymentTableItem.name;
                            if (formval.value[secondaryFieldName] !== this.currentState && !this.usethisstateBtnClick) {
                                this.editMessageList.push(pageeditUseThisState[0]);
                                this.allowContinue = true;
                            }
                        }
                    });
                });
            }
            throw throwException;
        } catch (throwException) {
            this.cancontinue(buttonActionType, isCashoutFlag, isDbNQFlag);
        }
    }

    cancelClick() {
        this.retirementElectionRestService.onRouteDBElec("review-choices");
    }

    cancontinue(buttonActionType, isCashoutFlag, isDbNQFlag) {
        if (!this.allowContinue) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            this.savecancontinue(buttonActionType, isCashoutFlag, isDbNQFlag);
        } else {
            this.editMessagesService.saveEditArray(this.editMessageList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }
    }
    updateInitialValidators() {
        this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
            let nestedOptions = incomeTaxWthlTable.rowList.filter(rowItem => rowItem.isNestedOption);
            incomeTaxWthlTable.rowList.forEach(paymentTableItem => {
                /* istanbul ignore next */
                if (incomeTaxWthlTable.id.includes("CAN")) {
                    if (paymentTableItem.hasOwnProperty("fieldType")) {
                        let validatorList = [];
                        let editList = paymentTableItem.fieldEditList;
                        editList.forEach(editItem => {
                            if (editItem.validatorType === "required") {
                                validatorList.push(Validators.required);
                            } else if (editItem.validatorType === "validformat") {
                                if (this.defaultLocale) {
                                    let { constraintDataList: [{ // name: pattern,
                                        value: patternValue }] } = editItem;
                                    validatorList.push(Validators.pattern(patternValue));
                                } else {
                                    let patternValue = this.FrAmountPattern;
                                    validatorList.push(Validators.pattern(patternValue));
                                }
                            } else if (editItem.validatorType === "range") {
                                let { constraintDataList } = editItem;
                                let min, max;
                                constraintDataList.map((constraintDataItem) => {
                                    if (constraintDataItem.name === "min") {
                                        min = constraintDataItem;
                                    } else if (constraintDataItem.name === "max") {
                                        max = constraintDataItem;
                                    }
                                });
                                if (this.defaultLocale) {
                                    if (parseFloat(max.value) > parseFloat(min.value)) {
                                        validatorList.push(AlValidators.range([parseFloat(min.value), parseFloat(max.value)]));
                                    } else {
                                        validatorList.push(AlValidators.min(parseFloat(min.value)));
                                    }
                                } else {
                                    if (parseFloat(max.value) > parseFloat(min.value)) {
                                        validatorList.push(ForbiddenAmountValidator(parseFloat(min.value), parseFloat(max.value), this.FrAmountPattern));
                                    } else {
                                        validatorList.push(ForbiddenAmountValidatorMin(parseFloat(min.value), this.FrAmountPattern));
                                    }
                                }
                            }
                            this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].setValidators(validatorList);
                            this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].updateValueAndValidity();
                            this.incomeTaxWthlForm.updateValueAndValidity();
                        });
                    }
                }

                if (paymentTableItem.showRadio && paymentTableItem.radioSelected) {
                    /* istanbul ignore next */
                    if (paymentTableItem.hasOwnProperty("fieldType")) {
                        let validatorList = [];
                        let editList = paymentTableItem.fieldEditList;
                        editList.forEach(editItem => {
                            if (editItem.validatorType === "required") {
                                validatorList.push(Validators.required);
                            } else if (editItem.validatorType === "validformat") {
                                if (this.defaultLocale) {
                                    let { constraintDataList: [{ value: patternValue }] } = editItem;
                                    validatorList.push(Validators.pattern(patternValue));
                                } else {
                                    let patternValue = this.FrAmountPattern;
                                    validatorList.push(Validators.pattern(patternValue));
                                }
                            } else if (editItem.validatorType === "range") {
                                let { constraintDataList } = editItem;

                                let min, max;
                                constraintDataList.map((constraintDataItem) => {
                                    if (constraintDataItem.name === "min") {
                                        min = constraintDataItem;
                                    } else if (constraintDataItem.name === "max") {
                                        max = constraintDataItem;
                                    }
                                });
                                if (this.defaultLocale) {
                                    validatorList.push(AlValidators.range([(min.value), (max.value)]));
                                } else {
                                    validatorList.push(ForbiddenAmountValidator(min.value, max.value, this.FrAmountPattern));
                                }
                            }
                        });
                        this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].setValidators(validatorList);
                        this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + paymentTableItem.name].updateValueAndValidity();
                        this.incomeTaxWthlForm.updateValueAndValidity();
                    } else if (paymentTableItem.name === "stWithholdChoices" || paymentTableItem.name === "fedWithholdChoices" || paymentTableItem.name === "stWithholdChoicesPercent") {
                        if (nestedOptions) {
                            /* istanbul ignore next */
                            nestedOptions.forEach(nestedOptionsItem => {
                                let validatorList = [];
                                let editList = nestedOptionsItem.fieldEditList;
                                editList.forEach(editItem => {
                                    if (nestedOptionsItem.fieldType === "dropdown") {
                                        if (editItem.validatorType === "required") {
                                            validatorList.push(Validators.required);
                                        }
                                    } else {
                                        if (editItem.validatorType === "required") {
                                            validatorList.push(Validators.required);
                                        } else if (editItem.validatorType === "validformat") {
                                            if (this.defaultLocale) {
                                                let { constraintDataList: [{ value: patternValue }] } = editItem;
                                                validatorList.push(Validators.pattern(patternValue));
                                            } else {
                                                let patternValue = this.FrAmountPattern;
                                                validatorList.push(Validators.pattern(patternValue));
                                            }
                                        } else if (editItem.validatorType === "range") {
                                            let { constraintDataList } = editItem;

                                            let min, max;
                                            constraintDataList.map((constraintDataItem) => {
                                                if (constraintDataItem.name === "min") {
                                                    min = constraintDataItem;
                                                } else if (constraintDataItem.name === "max") {
                                                    max = constraintDataItem;
                                                }
                                            });
                                            if (this.defaultLocale) {
                                                validatorList.push(AlValidators.range([(min.value), (max.value)]));
                                            } else {
                                                validatorList.push(ForbiddenAmountValidator(min.value, max.value, this.FrAmountPattern));
                                            }
                                        }
                                    }
                                });
                                this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + nestedOptionsItem.name].setValidators(validatorList);
                                this.incomeTaxWthlForm.controls["field" + incomeTaxWthlTable.id + nestedOptionsItem.name].updateValueAndValidity();
                                this.incomeTaxWthlForm.updateValueAndValidity();
                            });
                        }
                    }
                }
            });
        });
    }
    /* istanbul ignore next */
    createFederalValues() {
        let federalWithholdingChoice;
        let federalWithholdingChoiceRadioValue;

        this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
            if (incomeTaxWthlTable.id.includes("US_FEDERAL")) {
                if (this.incomeTaxWthlForm.get("US_FEDERAL")) {
                    federalWithholdingChoiceRadioValue = this.incomeTaxWthlForm.get("US_FEDERAL").value;
                }
                federalWithholdingChoice = incomeTaxWthlTable.rowList.filter(rowItem => {
                    return rowItem.hasOwnProperty("showRadio");
                }).find(radioValue => {
                    return (radioValue.name === federalWithholdingChoiceRadioValue);
                });
            } else if (incomeTaxWthlTable.id.includes("PR_FEDERAL")) {
                if (this.incomeTaxWthlForm.get("PR_FEDERAL")) {
                    federalWithholdingChoiceRadioValue = this.incomeTaxWthlForm.get("PR_FEDERAL").value;
                }
                federalWithholdingChoice = incomeTaxWthlTable.rowList.filter(rowItem => {
                    return rowItem.hasOwnProperty("showRadio");
                }).find(radioValue => {
                    return (radioValue.name === federalWithholdingChoiceRadioValue);
                });
            } else if (incomeTaxWthlTable.id.includes("CAN_FEDERAL")) {
                if (this.incomeTaxWthlForm.get("fieldCAN_FEDERALcanFedTaxCreditAmount")) {
                    this.incomeTaxFormValues["canadianFederalMonthlyAmount"] = this.defaultLocale ? this.incomeTaxWthlForm.get("fieldCAN_FEDERALcanFedTaxCreditAmount").value : (this.incomeTaxWthlForm.get("fieldCAN_FEDERALcanFedTaxCreditAmount").value).replace(/\s/g, "").replace(",", ".");
                }
                if (this.incomeTaxWthlForm.get("fieldCAN_FEDERALcanFedTaxCreditAmount")) {
                    this.incomeTaxFormValues["federalAdditionalWithholdingAmount"] = this.defaultLocale ? this.incomeTaxWthlForm.get("fieldCAN_FEDERALcanFedWithholdAdditionalAmount").value : (this.incomeTaxWthlForm.get("fieldCAN_FEDERALcanFedWithholdAdditionalAmount").value).replace(/\s/g, "").replace(",", ".");
                }
            }
        });

        this.incomeTaxFormValues["paymentId"] = parseInt(this.data.changeIncomeTaxWithholding.paymentId, 10);
        /* istanbul ignore next */
        if (federalWithholdingChoiceRadioValue) {
            if (federalWithholdingChoice.radioValue === "NOWT" || federalWithholdingChoice.radioValue === "DFLT" || federalWithholdingChoice.radioValue === "MIN") {
                this.incomeTaxFormValues["federalWithholdingChoice"] = federalWithholdingChoice.radioValue;
            } else if (federalWithholdingChoice.radioValue === "RPLC") {
                this.incomeTaxFormValues["federalWithholdingChoice"] = federalWithholdingChoice.radioValue;
                this.incomeTaxFormValues["federalReplaceWithholdingAmount"] = this.incomeTaxWthlForm.get("fieldUS_FEDERALfedWithholdAmount").value;
            } else if (federalWithholdingChoice.radioValue === "RPPT") {
                this.incomeTaxFormValues["federalWithholdingChoice"] = federalWithholdingChoice.radioValue;
                this.incomeTaxFormValues["federalWithholdingPercent"] = this.incomeTaxWthlForm.get("fieldUS_FEDERALfedWithholdPercent").value;
            } else if (federalWithholdingChoice.radioValue === "CHCA") {
                this.incomeTaxFormValues["federalWithholdingChoice"] = federalWithholdingChoice.radioValue;
                this.incomeTaxFormValues["federalTaxFilingStatus"] = this.incomeTaxWthlForm.get("fieldUS_FEDERALfedMaritalStatus").value;
                this.incomeTaxFormValues["federalNumberOfExemptions"] = this.incomeTaxWthlForm.get("fieldUS_FEDERALfedAllowances").value;
                this.incomeTaxFormValues["federalAdditionalWithholdingAmount"] = this.incomeTaxWthlForm.get("fieldUS_FEDERALfedAdditionalAmount").value;
            }
        }
    }


    createStateValues(buttonActionType) {
        let stateWithholdingChoice;
        let stateWithholdingChoiceRadioValue;
        this.incomeTaxWthlTables.forEach(incomeTaxWthlTable => {
            if (incomeTaxWthlTable.id.includes("US_STATE")) {
                if (this.incomeTaxWthlForm.get("US_STATE")) {
                    stateWithholdingChoiceRadioValue = this.incomeTaxWthlForm.get("US_STATE").value;
                }
                stateWithholdingChoice = incomeTaxWthlTable.rowList.filter(rowItem => {
                    return rowItem.hasOwnProperty("showRadio");
                }).find(radioValue => {
                    return (radioValue.name === stateWithholdingChoiceRadioValue);
                });
            }else if (incomeTaxWthlTable.id.includes("PR_STATE")) {
                if (this.incomeTaxWthlForm.get("PR_STATE")) {
                    stateWithholdingChoiceRadioValue = this.incomeTaxWthlForm.get("PR_STATE").value;
                }
                stateWithholdingChoice = incomeTaxWthlTable.rowList.filter(rowItem => {
                    return rowItem.hasOwnProperty("showRadio");
                }).find(radioValue => {
                    return (radioValue.name === stateWithholdingChoiceRadioValue);
                });
            } else if (incomeTaxWthlTable.id.includes("CAN_STATE")) {
                if (this.incomeTaxWthlForm.get("fieldCAN_STATEcanStTaxCreditAmount")) {
                    this.incomeTaxFormValues["provincialMonthlyAmount"] = this.defaultLocale ? this.incomeTaxWthlForm.get("fieldCAN_STATEcanStTaxCreditAmount").value : (this.incomeTaxWthlForm.get("fieldCAN_STATEcanStTaxCreditAmount").value).replace(/\s/g, "").replace(",", ".");
                }
                if (this.incomeTaxWthlForm.get("fieldCAN_STATEcanStWithholdAdditionalAmount")) {
                    this.incomeTaxFormValues["stateAdditionalWithholdingAmount"] = this.defaultLocale ? this.incomeTaxWthlForm.get("fieldCAN_STATEcanStWithholdAdditionalAmount").value : (this.incomeTaxWthlForm.get("fieldCAN_STATEcanStWithholdAdditionalAmount").value).replace(/\s/g, "").replace(",", ".");
                }
            }
        });
        if (this.incomeTaxWthlForm.get("fieldUS_STATEstate")) {
            this.incomeTaxFormValues["taxingState"] = this.incomeTaxWthlForm.get("fieldUS_STATEstate").value;
        }
        /* istanbul ignore next */
        if (!buttonActionType) {
            this.incomeTaxFormValues["stateWithholdingChoice"] = "RFRS";
        } else {
            if (stateWithholdingChoiceRadioValue) {
                if (stateWithholdingChoice.radioValue === "NOWT" || stateWithholdingChoice.radioValue === "DFLT" || stateWithholdingChoice.radioValue === "MIN") {
                    this.incomeTaxFormValues["stateWithholdingChoice"] = stateWithholdingChoice.radioValue;
                } else if (stateWithholdingChoice.radioValue === "RPLC") {
                    this.incomeTaxFormValues["stateWithholdingChoice"] = stateWithholdingChoice.radioValue;
                    this.incomeTaxFormValues["stateReplaceWithholdingAmount"] = this.defaultLocale ? this.incomeTaxWthlForm.get("fieldUS_STATEstWithholdAmount").value : (this.incomeTaxWthlForm.get("fieldUS_STATEstWithholdAmount").value).replace(/\s/g, "").replace(",", ".");
                } else if (stateWithholdingChoice.radioValue === "CHCA") {
                    this.incomeTaxFormValues["stateWithholdingChoice"] = stateWithholdingChoice.radioValue;
                    this.incomeTaxFormValues["stateTaxFilingStatus"] = this.incomeTaxWthlForm.get("fieldUS_STATEstMaritalStatus").value;
                    this.incomeTaxFormValues["stateNumberOfExemptions"] = this.incomeTaxWthlForm.get("fieldUS_STATEstAllowances").value;
                    if (this.incomeTaxWthlForm.get("fieldUS_STATEstAdditionalAmount")) {
                        this.incomeTaxFormValues["stateAdditionalWithholdingAmount"] = this.defaultLocale ? this.incomeTaxWthlForm.get("fieldUS_STATEstAdditionalAmount").value : (this.incomeTaxWthlForm.get("fieldUS_STATEstAdditionalAmount").value).replace(/\s/g, "").replace(",", ".");
                    }
                    if (this.incomeTaxWthlForm.get("fieldUS_STATEstAdditionalPercent")) {
                        this.incomeTaxFormValues["stateAdditionalWithholdingPercent"] = this.incomeTaxWthlForm.get("fieldUS_STATEstAdditionalPercent").value;
                    }
                } else if (stateWithholdingChoice.radioValue === "CHCP") {
                    this.incomeTaxFormValues["stateWithholdingChoice"] = stateWithholdingChoice.radioValue;
                    this.incomeTaxFormValues["arizonaWithholdingRate"] = this.incomeTaxWthlForm.get("fieldUS_STATEstPercentOfTaxBenefit").value;
                    this.incomeTaxFormValues["stateAdditionalWithholdingAmount"] = this.incomeTaxWthlForm.get("fieldUS_STATEstAdditionalAmount2").value;
                } else if (stateWithholdingChoice.radioValue = "UseState") {
                    this.incomeTaxFormValues["stateWithholdingChoice"] = "RFRS";
                }
            }
        }
    }


    continueEdit(parameters) {
        let buttonActionType = parameters.buttonActionType;
        let isCashoutFlag = parameters.isCashoutFlag;
        let isDbNQFlag = parameters.isDbNQFlag;
        this.savecancontinue(buttonActionType, isCashoutFlag, isDbNQFlag);
    }
    /* istanbul ignore next */
    savecancontinue(buttonActionType, isCashoutFlag, isDbNQFlag) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("incometax");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        this.businessProcessReferenceId = 0;
        let responseStatusCode: any;
        let saveApiResponse: any;
        if (!this.hassTBAEdit) {
            this.createFederalValues();
            this.createStateValues(buttonActionType);
            let deliveryAndWithholdingElectionRevisionsArr = [];
            deliveryAndWithholdingElectionRevisionsArr.push({ ...this.incomeTaxFormValues });
            if (buttonActionType) {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": true,
                    "retirementStep": "Change Your Withholding",
                    "isAuthorized": false,
                    "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsArr
                };
            } else {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": true,
                    "retirementStep": "Use State Withholding",
                    "isAuthorized": false,
                    "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsArr
                };
            }
            this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
        }
        if (!this.allowContinue) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            if (isCashoutFlag || isDbNQFlag) {
                this.isDbCashoutOrNQPageLoading = true;
            } else {
                this.loading.showIndicator("#saveServiceLoader", "");
            }
            this.retirementElectionRestService.incomeTaxWithHoldingSaveServices(this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType, isCashoutFlag, isDbNQFlag, this.hassTBAEdit)
                .pipe(
                    finalize(() => {
                        if (saveApiResponse) {
                            responseStatusCode = saveApiResponse.statusCode;
                            if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                                this.showError = true;
                            } else {
                                if (!isCashoutFlag && !isDbNQFlag) {
                                    this.retirementElectionRestService.setSystemTickets(this.headers);
                                    this.loading.hideIndicator("#saveServiceLoader", "");
                                    /**
                * The following is to continue routing after the warning or informational edits
               */
                                    /* istanbul ignore next */
                                    if (buttonActionType) {
                                        this.routeToPageLocation = "/retirement-election/review-choices";
                                    } else if (!buttonActionType) {
                                        this.incomeTaxWithHoldingData(false);
                                    }
                                } else {
                                    if (!buttonActionType) {
                                        this.incomeTaxWithHoldingData(false);
                                    } else {
                                        this.editMessagesService.hasEditFlagSubject.next(saveApiResponse.hasEdit);
                                        this.isDbCashoutOrNQPageLoading = false;
                                    }
                                }
                                this.saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isDbNQFlag);
                            }
                        }
                    })
                ).subscribe(
                    (data: any) => {
                        this.headers = data;
                        saveApiResponse = data.body;
                        this.logger._debug(JSON.stringify(data), "Getting IncomeTax details successfully", LoggingConstants.INFO, "RetirementElection - IncomeTax - Save Service");
                    },
                    (error) => {
                        this.headers = error;
                        saveApiResponse = error.error;
                        this.logger._error(JSON.stringify(error), "Error in IncomeTax component response", LoggingConstants.ERROR, "RetirementElection - IncomeTax - Save Service");
                    });
        } else {
            this.editMessagesService.saveEditArray(this.editMessageList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }
    }

    saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isDbNQFlag) {
        /**
     * Check for routing page to store/route
     */
        if (!isCashoutFlag && !isDbNQFlag) {
            if (buttonActionType) {
                this.routeToPageLocation = "review-choices";
            } else if (!buttonActionType) {
                this.routeToPageLocation = "income-tax";
            }
        }
        /**
    * Check for TBA Edits/ Server side edits
    */
        let saveEditList = this.retirementElectionRestService.extractEditMessages(this.headers);
        if (saveEditList !== undefined) {
            this.editMessagesService.redirectToUrlSubject.next(this.routeToPageLocation);
            this.editMessagesService.saveEditArray(saveEditList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        } else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            /**
        * Case: No TBA edits and service status 200
        */
            /* istanbul ignore next */
            if (isCashoutFlag) {
                if (buttonActionType) {
                    this.retirementElectionRestService.renderNextPage("../dbCashoutReview", this.activatedRoute);
                } else if (!buttonActionType) {
                    this.retirementElectionRestService.renderNextPage("../dbCashoutIncomeTaxWthl", this.activatedRoute);
                }
            } else if (isDbNQFlag) {
                if (buttonActionType) {
                    this.retirementElectionRestService.renderNextPage("../dbNQEnrollmentReview", this.activatedRoute);
                } else if (!buttonActionType) {
                    this.retirementElectionRestService.renderNextPage("../dbNQEnrollmentIncomeTaxWthl", this.activatedRoute);
                }
            } else {
                this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
            }
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
        * Case: Server side edits and service status 400
        */
            /* istanbul ignore next */
            if (saveEditList !== undefined) {
                this.logger._debug("Getting edit message for IncomeTax component response", LoggingConstants.INFO, "RetirementElection - IncommeTax - Save Service");
                this.editMessagesService.saveEditArray(saveEditList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.showError = true;
            }
        }
    }
    // DB CASHOUT/NQ ENROLLMENT COMPONENT CUSTOM METHOD START
    /* istanbul ignore next */
    redirectToReviewPage(event) {
        if (this.isDbCashoutFlag) {
            this.retirementElectionRestService.renderNextPage("../dbCashoutReview", this.activatedRoute);
        } else {
            this.retirementElectionRestService.renderNextPage("../dbNQEnrollmentReview", this.activatedRoute);
        }
    }
    // DB CASHOUT/NQ ENROLLMENT COMPONENT CUSTOM METHOD END
}
