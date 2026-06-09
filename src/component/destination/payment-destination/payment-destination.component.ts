import {  AlValidators, AlLoaderComponent, DomStorageFallbackService, LoggingService, LoggingConstants, DynamicComponentService, GoogleAnalyticsService, AppUtility  } from "@alight/core-utilities-lib";
import {  Component, OnInit, ViewChild, Input  } from "@angular/core";
import {  UntypedFormControl, UntypedFormGroup, Validators  } from "@angular/forms";
import {  Router, ActivatedRoute  } from "@angular/router";
import {  finalize  } from "rxjs";
import {  EditMessagesService  } from "../../../services/edit-messages.service";
import {  RetirementElectionRestService  } from "../../../services/retirement-election-rest.service";
import {  StepsActiveIndexService  } from "../../../services/steps-active-index-service";
import {  ReviewPensionChoicesService  } from "../../../services/review-pension-choices.service";
import {  ViewRhrComponentsModel  } from "../../shared/models/view-rhr-components.model";
import {  ProgressBarPopoverDataCacheService  } from "../../../services/progressBarPopoverDataCache.service";

@Component({
    selector: "al-receive-payment",
    templateUrl: "./payment-destination.component.html",
    providers: [AlLoaderComponent]

})
export class ReceivePaymentComponent implements OnInit {
    data: any;
    checkresponse = false;
    public form: UntypedFormGroup;
    paymentTable: any;
    queryParameters: any;
    selectedRadio = "";
    allowContinue = false;
    allowContinueAddOne = false;
    responseData: any;
    showError = true;
    editMessage: any;
    pattern: any;
    editMessageList: any[];
    saveApiRequestBody: any;
    businessProcessReferenceId: any;
    headers: any;
    addressDestinationDa: any;
    routeToPageLocation: any;
    rawGetResponseData: any;
    domSystemTickets: any;
    isBackButton = false;
    ViewRhrComponents = new ViewRhrComponentsModel();
    @ViewChild("display", {static: false}) display: any;
    @Input() isDbCashoutFlag: boolean;
    @Input() isDbNQFlag: boolean;
    @ViewChild("aldialogCancel") aldialogCancel;
    isDbCashoutPageLoading = false;
    hassTBAEdit = false;
    showQuitButton = true;
    showCBLButton = true;
    defaultLocale = true;
    numberValidEdit: any;
    FrAmountPattern = (/^([0-9\s]*)((\,)[0-9]{1,2})?$/);



    constructor(
        private router: Router,
        private appUtility: AppUtility,
        private retirementElectionRestService: RetirementElectionRestService,
        private editMessagesService: EditMessagesService,
        private stepsActiveIndexService: StepsActiveIndexService,
        private loading: AlLoaderComponent,
        private domFBService: DomStorageFallbackService,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private logger: LoggingService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private activatedRoute: ActivatedRoute,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService
    ) {
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    ngOnInit() {
        if(sessionStorage.getItem("gsToDBPageCd")){
            sessionStorage.removeItem("gsToDBPageCd");
        }
        this.checkDefaultAmtFormat();
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        this.retirementElectionRestService.isCurrentStepRolloverDest = false;
        if (!this.isDbCashoutFlag) {
            if(!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if(!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            /* eslint-disable no-unused-expressions */
            this.retirementElectionRestService.isMultiBeneSupported ?   this.stepsActiveIndexService.setStepIndex(4) :   this.stepsActiveIndexService.setStepIndex(5);
            // this.stepsActiveIndexService.setStepIndex(5);
            this.dynamicComponentService.initializePageComponents();
            if(isCallBackAllowed) {
                this.isBackButton = this.reviewPensionChoicesService.getBackButton();
                this.getPatterns();
                this.retirementElectionRestService.getQueryParameters();
            }
        }
        this.editMessagesService.isDbCashoutFlag = this.isDbCashoutFlag;
        if(isCallBackAllowed) {
            this.retirementElectionRestService.screenCapture(true);
            this.retirementElectionRestService.isActivePBEnabled ? this.getProgressBarPopOverDataFromIDB() : this.rolloverPaymentData();
        } else {
        /* istanbul ignore next */
            this.checkresponse = true;
        }
    }
    /* istanbul ignore next */
    checkDefaultAmtFormat() {
        let  locale = this.retirementElectionRestService.getLocale();
        this.defaultLocale = this.retirementElectionRestService.isDefaultLocale(locale);
    }

    /* istanbul ignore next */
    rolloverPaymentData() {
        // this.retirementElectionRestService.receivePaymentService1()
        this.retirementElectionRestService.receivePaymentService(this.isDbCashoutFlag, this.isDbNQFlag)
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    if(this.data !== null && this.data !== undefined) {
                        if(this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                            let responseStatusCode = this.data.status.statusCode;
                            if(responseStatusCode === 200) {
                                this.showError = false;
                                document.title = this.data.paymentDestination.pageNameText;
                                if (!this.isDbCashoutFlag && !this.isDbNQFlag){
                                    this.retirementElectionRestService.setSystemTickets(this.rawGetResponseData);
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices130ChooWhereRcvPmtPage");
                                }
                                if (this.isDbCashoutFlag || this.isDbNQFlag) {
                                    // let pageUrl = this.retirementElectionRestService.pageUrlFromCashoutRoot(window.location.href);
                                    // this.dynamicComponentService.initializePageComponents(pageUrl); // Added Code Google Analytics
                                    let dbcProgressbarData = this.data.progressBarInfo;
                                    let dbcRightRailData = this.data.tiles;
                                    if (this.isDbCashoutFlag) {
                                        this.retirementElectionRestService.gaPageTracking(window.location.href);
                                        this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 2, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    } else {
                                        this.googleAnalyticsService.postGACustomPageTracking("dbNQRetirementWhrToRcvPayment", "DB Retirement Flow - NQ");
                                        this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 3, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    }
                                    this.retirementElectionRestService.setRightRailData(dbcRightRailData.iraChecklist, dbcRightRailData.questions, true, false, false);
                                }
                                this.paymentTable = this.data.paymentDestination.paymentTable;
                                if (this.data.paymentDestination.flowButtonNavigation !== undefined && this.data.paymentDestination.flowButtonNavigation.editButtonList !== undefined) {
                                    let editButtonList = this.data.paymentDestination.flowButtonNavigation.editButtonList;
                                    if (editButtonList.length !== 0) {
                                        this.editMessagesService.editButtonListSubject.next(editButtonList);
                                    }
                                }
                                let newformdata = {};
                                this.paymentTable.forEach(paymentTableItem => {
                                    if (paymentTableItem.splitPayment) {
                                        let primaryAddrId = "";
                                        paymentTableItem.primaryPaymentDetails.addressDestinationDetailData.forEach(addressItem => {
                                            if(addressItem.addressDetail.addressSelected)  {
                                                primaryAddrId = addressItem.addressDetail.addressIdText;
                                            }
                                        });
                                        let secondaryAddrId = "";
                                        paymentTableItem.secondaryPaymentDetails.addressDestinationDetailData.forEach(addressItem => {
                                            if(addressItem.addressDetail.addressSelected)  {
                                                secondaryAddrId = addressItem.addressDetail.addressIdText;
                                            }
                                        });
                                        newformdata[paymentTableItem.primaryPaymentDetails.primaryDeliveryTypeId] = new UntypedFormControl(primaryAddrId, Validators.required);

                                        let amtValidator = this.defaultLocale ? AlValidators.number : Validators.pattern(this.FrAmountPattern);
                                        newformdata["amount_" + paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId] = new UntypedFormControl((paymentTableItem.secondaryPaymentDetails.secondaryDeliveryPaymentAmount), amtValidator);
                                        newformdata[paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId] = new UntypedFormControl(secondaryAddrId);
                                    } else {
                                        let primaryAddrId = "";
                                        paymentTableItem.primaryPaymentDetails.addressDestinationDetailData.forEach(addressItem => {
                                            if(addressItem.addressDetail.addressSelected)  {
                                                primaryAddrId = addressItem.addressDetail.addressIdText;
                                            }
                                        });
                                        newformdata[paymentTableItem.primaryPaymentDetails.primaryDeliveryTypeId] = new UntypedFormControl(primaryAddrId, Validators.required);
                                    }
                                });
                                this.form = new UntypedFormGroup(newformdata);
                                this.secondaryDestinationValidator();
                                if (this.retirementElectionRestService.isActivePBEnabled && this.data.progressBarPopovers !== undefined && this.data.progressBarPopovers !== null) {
                                    this.retirementElectionRestService.getProgressBarPopoverContent(this.data.progressBarPopovers);
                                }
                            }
                            if (this.retirementElectionRestService.isActivePBEnabled === true) {
                                let triggerSub = responseStatusCode === 200 ? true : false;
                                this.appUtility.notifyinitConfigSubscribers(triggerSub);
                            }
                            this.numberValidEdit  = this.findEditId("0");
                        }
                    }
                    this.retirementElectionRestService.screenCaptureInit("payment-destination");
                }),
            )
            .subscribe(
                (data) => {
                    if(data !== undefined && data !== null && data["body"] !== undefined) {

                        this.rawGetResponseData = data;
                        this.data = data["body"];
                    }
                    this.logger._debug(JSON.stringify(data), "Getting payment destination details successfully", LoggingConstants.INFO, "RetirementElection - payment destination - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.logger._error(JSON.stringify(error), "Error in payment destination component response", LoggingConstants.ERROR, "RetirementElection - payment destination - Get Service");
                }

            );
        window.scrollTo(0, 0);
    }

    secondaryDestinationValidator() {
        this.paymentTable.forEach(paymentTableItem => {
            if (paymentTableItem.splitPayment) {
                if (parseFloat(this.form.get("amount_" + paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId).value) !== 0) {
                    this.form.controls[paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId].setValidators([Validators.required]);
                } else {
                    this.form.controls[paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId].setValidators(null);
                }
            }
        });
    }

    onChange() {
        this.paymentTable.forEach(paymentTableItem => {
            if (paymentTableItem.splitPayment) {
                let secAmtFieldName = "amount_" + paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId;
                let secondaryFieldName = paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId;
                if (parseFloat(this.form.get(secAmtFieldName).value) !== 0) {
                    this.form.controls[secondaryFieldName].setValidators([Validators.required]);
                    this.form.controls[secondaryFieldName].updateValueAndValidity();
                    this.form.updateValueAndValidity();
                } else {
                    this.allowContinue = false;
                    this.form.controls[secondaryFieldName].setValidators(null);
                    this.form.controls[secondaryFieldName].updateValueAndValidity();
                    this.form.updateValueAndValidity();
                }
            }
        });
    }

    findEditId(editId) {
        return this.data.paymentDestination.editList.find(editItem => editId === editItem.editId);
    }
    /* istanbul ignore next */
    continueClick(formval, isvalid: boolean, buttonActionType, isCashoutFlag, isDbNQFlag) {
        this.reviewPensionChoicesService.setBackButton(false);
        if(this.allowContinue || this.allowContinueAddOne) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            Promise.resolve().then( () => {
                this.onContinueClick(formval, isvalid, buttonActionType, isCashoutFlag, isDbNQFlag);
            });
        } else {
            this.onContinueClick(formval, isvalid, buttonActionType, isCashoutFlag, isDbNQFlag);
        }
    }

    onContinueClick(formval, isvalid: boolean, buttonActionType, isCashoutFlag, isDbNQFlag) {
        this.editMessagesService.editMessageFlagSubject.next(false);
        let throwException = {};
        try {
            if (!isvalid) {
                this.editMessageList = [];
                this.editMessageList.push(this.findEditId("91000169"));
                this.allowContinue = true;
                throw throwException;
            } else {
                this.allowContinue = false;
            }
            this.paymentTable.forEach(paymentTableItem => {
                let primaryFieldName = paymentTableItem.primaryPaymentDetails.primaryDeliveryTypeId;
                paymentTableItem.primaryPaymentDetails.addressDestinationDetailData.forEach(addressItem => {
                    if (formval.value[primaryFieldName] === addressItem.addressDetail.addressIdText) {
                        /* istanbul ignore next */
                        if (!addressItem.addressDetail.addrOnFile) {
                            this.editMessageList = [];
                            this.editMessageList.push(this.findEditId("18000605"));
                            this.allowContinueAddOne = true;
                            throw throwException;
                        } else {
                            this.allowContinueAddOne = false;
                        }
                    }
                });
                if (paymentTableItem.splitPayment) {
                    let secondaryFieldName = paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId;
                    let amountFieldName = "amount_" + paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId;
                    let primaryAddressId = this.form.get(paymentTableItem.primaryPaymentDetails.primaryDeliveryTypeId).value;
                    paymentTableItem.secondaryPaymentDetails.addressDestinationDetailData.forEach(addressItem => {
                        if (formval.value[secondaryFieldName] === addressItem.addressDetail.addressIdText) {
                            /* istanbul ignore next */
                            if (!addressItem.addressDetail.addrOnFile) {
                                this.editMessageList = [];
                                this.editMessageList.push(this.findEditId("18000605"));
                                this.allowContinueAddOne = true;
                                throw throwException;
                            } else if ((this.defaultLocale && this.pattern.test(this.form.get(amountFieldName).value) === false) || (!this.defaultLocale && this.FrAmountPattern.test(this.form.get(amountFieldName).value) === false) ) {
                                this.editMessageList = [];
                                this.editMessageList.push(this.findEditId("edit94000100"));
                                this.allowContinueAddOne = true;
                                throw throwException;
                            } else if(primaryAddressId === formval.value[secondaryFieldName]) {
                                this.editMessageList = [];
                                this.editMessageList.push(this.findEditId("21257"));
                                this.allowContinueAddOne = true;
                                throw throwException;
                            } else {
                                this.allowContinueAddOne = false;
                            }
                        }
                    });
                }
            });
            this.editMessageList = [];
            throw throwException;
        } catch (throwException) {
            this.cancontinue(buttonActionType, isCashoutFlag, isDbNQFlag);
        }
    }

    continueEdit(parameters) {
        let buttonActionType = parameters.buttonActionType;
        let isDbCashoutFlag = parameters.isCashoutFlag;
        let isDbNQFlag = parameters.isDbNQFlag;
        this.cancontinue(buttonActionType, isDbCashoutFlag, isDbNQFlag);
    }

    cancontinue(buttonActionType, isCashoutFlag, isDbNQFlag) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("paymentdestination");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        this.businessProcessReferenceId = 0;
        let responseStatusCode: any;
        let saveApiResponse: any;
        if(!this.hassTBAEdit){
            let deliveryAndWithholdingElectionRevisionsquestArr = [];
            this.paymentTable.forEach(paymentTableItem => {
                let paymentId = parseInt(paymentTableItem.paymentId, 10);
                let primaryDeliveryId = parseInt(paymentTableItem.primaryPaymentDetails.primaryDeliveryId, 10);
                let primaryAddressId = parseInt(this.form.get(paymentTableItem.primaryPaymentDetails.primaryDeliveryTypeId).value, 10);
                let secondaryDeliveryId = 0;
                let secondaryAddressId = 0;
                let secondaryAmount = 0;
                if (paymentTableItem.splitPayment) {
                    let secondaryAmountValue = this.defaultLocale ? parseFloat(this.form.get("amount_" + paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId).value) : parseFloat((this.form.get("amount_" + paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId).value).replace(/\s/g, "").replace(",", "."));
                    if (secondaryAmountValue > 0) {
                        secondaryDeliveryId = parseInt(paymentTableItem.secondaryPaymentDetails.secondaryDeliveryId, 10),
                        secondaryAddressId = this.form.get(paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId).value === null  ? 0 : parseInt(this.form.get(paymentTableItem.secondaryPaymentDetails.secondaryDeliveryTypeId).value, 10),
                        secondaryAmount = secondaryAmountValue;
                    }
                }
                deliveryAndWithholdingElectionRevisionsquestArr.push({
                    "paymentId": paymentId,
                    "primaryDeliveryId": primaryDeliveryId,
                    "primaryAddressId": primaryAddressId,
                    "secondaryDeliveryId": secondaryDeliveryId,
                    "secondaryAddressId": secondaryAddressId,
                    "secondaryAmount": secondaryAmount
                });
            });

            if (buttonActionType) {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": true,
                    "retirementStep": "Choose Non-Rollover Delivery",
                    "isAuthorized": false,
                    "shouldValidate": true,
                    "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsquestArr
                };

            } else {
                this.saveApiRequestBody =  {
                    "shouldAdvanceStep": false,
                    "retirementStep": "Choose Non-Rollover Delivery",
                    "isAuthorized": false,
                    "shouldValidate": false,
                    "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsquestArr
                };
            }
            this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
        }
        /* istanbul ignore next */
        if (!this.allowContinue && !this.allowContinueAddOne) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            if (isCashoutFlag || isDbNQFlag) {
                this.isDbCashoutPageLoading = true;
            } else {
                this.loading.showIndicator("#saveServiceLoader", "");
            }
            this.retirementElectionRestService.paymentDestinationSaveServices(this.hassTBAEdit? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType,  isCashoutFlag, this.hassTBAEdit, isDbNQFlag)
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
                                        this.routeToPageLocation = "/retirement-election/saved";
                                    }
                                }else {
                                    this.editMessagesService.hasEditFlagSubject.next(saveApiResponse.hasEdit);
                                    this.isDbCashoutPageLoading = false;
                                }
                                this.saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isDbNQFlag);
                            }
                        }
                    })
                ).subscribe(
                    (data: any) => {
                        this.headers = data;
                        saveApiResponse = data.body;
                        this.logger._debug(JSON.stringify(data), "Getting payment destination details successfully", LoggingConstants.INFO, "RetirementElection - payment destination - save Service");
                    },
                    (error) => {
                        this.headers = error;
                        saveApiResponse = error.error;
                        this.logger._error(JSON.stringify(error), "Error in payment destination component response", LoggingConstants.ERROR, "RetirementElection - payment destination - save Service");
                    });
        } else {
            this.isBackButton = false;
            this.editMessagesService.saveEditArray(this.editMessageList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }
    }


    saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isDbNQFlag) {
        /**
      * Check for routing page to store/route
      */
        if (!isCashoutFlag) {
            if (buttonActionType) {
                this.routeToPageLocation = "review-choices";
            } else if (!buttonActionType) {
                this.routeToPageLocation = "saved";
            }
        }
        /**
       * Check for TBA Edits/ Server side edits
       */
        let saveEditList = this.retirementElectionRestService.extractEditMessages(this.headers);
        if (saveEditList !== undefined) {
            this.isBackButton = false;
            this.editMessagesService.redirectToUrlSubject.next(this.routeToPageLocation);
            this.editMessagesService.saveEditArray(saveEditList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }  /* istanbul ignore next */ else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            /**
         * Case: No TBA edits and service status 200
         */
            /* istanbul ignore next */
            if (isCashoutFlag) {
                this.retirementElectionRestService.renderNextPage("../dbCashoutReview", this.activatedRoute);
            }else if(isDbNQFlag){
                this.retirementElectionRestService.renderNextPage("../dbNQEnrollmentReview", this.activatedRoute);
            } else {
                this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
            }
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
         * Case: Server side edits and service status 400
         */
            /* istanbul ignore next */
            if (saveEditList !== undefined) {
                this.logger._debug("Getting edit message for payment destsination component response", LoggingConstants.INFO, "RetirementElection - payment destination - Save Service");
                this.isBackButton = false;
                this.editMessagesService.saveEditArray(saveEditList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.showError = true;
            }
        }
    }

    checkPreActivityEdit() {
        let headers: any;
        let response: any;
        this.retirementElectionRestService.checkPreActivityEdit()
            .pipe(
                finalize(() => {
                    /* istanbul ignore next */
                    if (response.hasOwnProperty("statusCode") && response.statusCode && response.statusCode !== null &&
            response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.hasOwnProperty("preActivityEdit") && response.preActivityEdit && response.preActivityEdit !== null
              && response.preActivityEdit !== undefined && response.preActivityEdit.hasEdit) {
                            let saveEditList = this.retirementElectionRestService.extractEditMessages(headers);
                            let editButtonList = this.editMessagesService.getEditButtonList(response);
                            if (editButtonList.length !== 0) {
                                this.editMessagesService.editButtonListSubject.next(editButtonList);
                            }
                            if (saveEditList !== undefined) {
                                this.editMessagesService.pageNameSubject.next("cancelFromPaymentDestination");
                                this.editMessagesService.saveEditArray(saveEditList);
                                this.editMessagesService.editMessageFlagSubject.next(true);
                                window.scrollTo(0, 0);
                            }
                        } else {
                            this.onCancel();
                        }
                    }
                }))
            .subscribe(
                (data) => {
                    if (data && data !== null && data !== undefined) {
                        headers = data;
                        if (data.hasOwnProperty("_body")) {
                            response = data["_body"];
                            /* istanbul ignore next */
                            if (response && response !== null && response !== undefined &&
                  response.hasOwnProperty("data") && response.data && response.data !== null && response.data !== undefined) {
                                response = response.data;
                                this.logger._debug(JSON.stringify(data), "Getting Retirement Election details successfully", LoggingConstants.INFO, "RetirementElection - checkPreActivityEdit for cancel Service");
                            }
                        }
                    }
                }
            );
    }

    onCancel() {
        let response;
        let requestBody = {};
        let businessProcessId = 0;
        this.reviewPensionChoicesService.setBackButton(false);
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    this.responseData =  response.statusCode;
                    /* istanbul ignore next */
                    if (this.responseData !== 200) {
                        this.showError = true;
                    } else {
                        this.showError = false;
                        this.retirementElectionRestService.onRouteDBElec("cancelled");
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting payment destination details successfully", LoggingConstants.INFO, "RetirementElection - payment destination - cancel Service");
                }
            );
    }

    getPatterns() {
        this.retirementElectionRestService.getCommonContent().subscribe(
            (data) => {
                this.pattern = new RegExp(data[0]["text"]["currAsDecCnstrt"]);
                this.logger._debug(JSON.stringify(data), "Getting payment destination details successfully", LoggingConstants.INFO, "RetirementElection - payment destination - Getpattern Service");
            }
        );
    }

    redirectBack(){
        this.retirementElectionRestService.onRouteDBElec("review-choices");
    }


    // DB CASHOUT COMPONENT CUSTOM METHOD START
    /* istanbul ignore next */
    redirectToCancelledPage(event) {
        this.aldialogCancel.hideDialog(event);
        if(this.isDbCashoutFlag){
            this.retirementElectionRestService.redirectToCancelPage();
        }
        if(this.isDbNQFlag) {
            this.retirementElectionRestService.redirectToDBNQCancelPage();
        }
    }
    // DB CASHOUT COMPONENT CUSTOM METHOD END
    /**
   * @method getProgressBarPopOverDataFromIDB
   * Fetches the data from IDB
   * Stores the data in local
   * Calls the get service once done
  */
    getProgressBarPopOverDataFromIDB() {
        let popOverIDBData;
        this.PBPopoverDataCacheService.getProgressBarPopoverDataInCache()
            .pipe(
                finalize(() => {
                    if(popOverIDBData !== undefined) {
                        this.PBPopoverDataCacheService.popOverIDBData = popOverIDBData;
                    }
                    this.rolloverPaymentData();
                })
            )
            .subscribe((res: any) => {
                this.logger._debug("Response :" + JSON.stringify(res), "Fetched items from the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "RetirementElection - payment destination - getProgressBarPopOverDataFromIDB");
                popOverIDBData = res;
            },
            ((error) => {
                this.logger._error("Response :" + JSON.stringify(error), "Failed to Fetched items from the  ActiveProgressBarStore", LoggingConstants.ERROR, "RetirementElection - payment destination - getProgressBarPopOverDataFromIDB");
            }));
    }
}
