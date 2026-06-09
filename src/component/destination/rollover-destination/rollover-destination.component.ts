import { AlLoaderComponent, DomStorageFallbackService, LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, AppUtility } from "@alight/core-utilities-lib";
import { Component, OnInit, ViewChild, Input, AfterViewInit } from "@angular/core";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { StepsActiveIndexService } from "../../../services/steps-active-index-service";
import { EditMessagesService } from "../../../services/edit-messages.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { ReviewPensionChoicesService } from "../../../services/review-pension-choices.service";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";
import { ProgressBarPopoverDataCacheService } from "../../../services/progressBarPopoverDataCache.service";

// declare var require:any;

@Component({
    selector: "al-receive-rollover",
    templateUrl: "./rollover-destination.component.html",
    providers: [AlLoaderComponent]
})

export class ReceiveRolloverComponent implements OnInit, AfterViewInit {
    queryParameters: any;
    data: any;
    response: any;
    paymentId: any;
    mockPaymentElectionScenario: any;
    udpMockScenario: any;
    checkresponse = false;
    public form: UntypedFormGroup;
    paymentTable: any;
    queryParame: any;
    selectedAddress: any;
    allowContinue = false;
    public newForm: UntypedFormGroup;
    allowContinueAddOne = false;
    selectedRadio: any = [];
    responseData: any;
    showError = true;
    saveApiRequestBody: any;
    businessProcessId: any;
    newarr = {};
    editMessageList: any[];
    rawSaveResponseData: any;
    rawGetResponseData: any;
    rolloverDeliveryId: any;
    routeToPageLocation: any;
    addressDestinationDa: any;
    domSystemTickets: any;
    isBackButton = false;
    ViewRhrComponents = new ViewRhrComponentsModel();
    @ViewChild("display", { static: false }) display: any;
    @Input() isDbCashoutFlag: boolean;
    @ViewChild("aldialogCancel") aldialogCancel;
    isDbCashoutPageLoading = false;
    hassTBAEdit = false;
    showQuitButton = true;
    showCBLButton = true;
    constructor(
        private router: Router,
        private appUtility: AppUtility,
        private retirementElectionRestService: RetirementElectionRestService,
        private formBuilder: UntypedFormBuilder,
        private editMessagesService: EditMessagesService,
        private loading: AlLoaderComponent,
        private stepsActiveIndexService: StepsActiveIndexService,
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
    /* istanbul ignore next */
    ngOnInit() {
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        this.retirementElectionRestService.isCurrentStepRolloverDest = true;
        if (!this.isDbCashoutFlag) {
            if (!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if (!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            if (this.retirementElectionRestService.isMultiBeneSupported) {
                this.stepsActiveIndexService.setStepIndex(4);
            } else {
                this.stepsActiveIndexService.setStepIndex(5);
            }
            // this.retirementElectionRestService.isMultiBeneSupported ? this.stepsActiveIndexService.setStepIndex(4) : this.stepsActiveIndexService.setStepIndex(5);
            // this.stepsActiveIndexService.setStepIndex(5);
            this.dynamicComponentService.initializePageComponents();
            if (isCallBackAllowed) {
                this.domSystemTickets = this.domFBService.getItem("systemTickets", "sessionStorage", true);
                if (this.domSystemTickets !== undefined && this.domSystemTickets !== null) {
                    this.retirementElectionRestService.setSystemTicketsDOM(JSON.parse(this.domSystemTickets));
                }
                this.isBackButton = this.reviewPensionChoicesService.getBackButton();
                this.retirementElectionRestService.getQueryParameters();
            }
        }
        this.editMessagesService.isDbCashoutFlag = this.isDbCashoutFlag;
        if (isCallBackAllowed) {
            this.retirementElectionRestService.screenCapture(true);
            /* istanbul ignore next */
            if (this.retirementElectionRestService.isActivePBEnabled) {
                this.getProgressBarPopOverDataFromIDB();
            } else {
                this.rolloverDestinationData();
            }
            // this.retirementElectionRestService.isActivePBEnabled ? this.getProgressBarPopOverDataFromIDB() : this.rolloverDestinationData();
        } else {
            this.checkresponse = true;
        }
    }
    /* istanbul ignore next */
    ngAfterViewInit() {
        sessionStorage.removeItem("dbCashoutRefreshDetails");
    }
    /* istanbul ignore next */
    onContinue(formval, isvalid: boolean, buttonActionType, isDbCashoutFlag) {
        this.reviewPensionChoicesService.setBackButton(false);
        if (this.allowContinue || this.allowContinueAddOne) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            Promise.resolve().then(() => {
                this.onContinueClick(formval, isvalid, buttonActionType, isDbCashoutFlag);
            });
        } else {
            this.onContinueClick(formval, isvalid, buttonActionType, isDbCashoutFlag);
        }
    }

    onContinueClick(formval, isvalid: boolean, buttonActionType, isDbCashoutFlag) {
        /*  this.allowContinue = false;
     this.allowContinueAddOne = false;
    this.newForm.controls[this.paymentTable.paymentId].errors.required == true */
        let throwException = {};
        try {
            if (buttonActionType) {
                if (!isvalid) {
                    this.allowContinue = true;
                    throw throwException;
                } else {
                    this.allowContinue = false;
                }

                this.paymentTable.forEach(paymentTableItem => {
                    paymentTableItem.addressDestinationDetailData.forEach(addressItem => {
                        let fieldName = paymentTableItem.paymentId;
                        // let value = formval.value[fieldName];
                        /* istanbul ignore next */
                        if (formval.value[fieldName] === addressItem.addressDetail.addressIdText) {
                            if (!addressItem.addressDetail.addrOnFile) {
                                this.allowContinueAddOne = true;
                                throw throwException;
                            } else {
                                this.allowContinueAddOne = false;
                            }
                        }
                    });
                });
            }
            this.cancontinue(formval, buttonActionType, isDbCashoutFlag, this.paymentTable);
        } catch (throwException) {
            this.cancontinue(formval, buttonActionType, isDbCashoutFlag, this.paymentTable);
        }
    }

    continueEdit(parameters) {
        let formval = parameters.formval;
        let buttonActionType = parameters.buttonActionType;
        let isDbCashoutFlag = parameters.isDbCashoutFlag;
        let paymentTable = parameters.paymentTable;
        this.cancontinue(formval, buttonActionType, isDbCashoutFlag, paymentTable);
    }


    cancontinue(formval, buttonActionType, isDbCashoutFlag, paymentTable) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("rolloverdestination");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        this.editMessagesService.isDbCashoutFlagSubject.next(isDbCashoutFlag);
        this.editMessagesService.formvalSubject.next(formval);
        this.businessProcessId = 0;
        let responseStatusCode: any;
        let saveApiResponse: any;
        let deliveryAndWithholdingElectionRevisionsquestArr = [];
        if (buttonActionType) {
            let chckBoxValSet = formval.value;
            for (let key in chckBoxValSet) {
                if (chckBoxValSet.hasOwnProperty(key)) {
                    paymentTable.forEach(paymentTableItem => {
                        if (String(key) === String(paymentTableItem.paymentId)) {
                            /* istanbul ignore next */
                            this.rolloverDeliveryId = paymentTableItem.directDeliverPaymentDetailData.rolloverDeliveryId;
                            deliveryAndWithholdingElectionRevisionsquestArr.push({
                                "paymentId": key,
                                "rolloverDeliveryId": this.rolloverDeliveryId,
                                "rolloverAddressId": chckBoxValSet[key]
                            });
                        }
                    });
                }
            }
        }
        if (!this.allowContinue && !this.allowContinueAddOne) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            if (buttonActionType) {
                this.saveApiRequestBody = {
                    "shouldValidate": true,
                    "shouldAdvanceStep": true,
                    "retirementStep": "Choose Rollover Delivery",
                    "isAuthorized": false,
                    "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsquestArr
                };
            } else {
                this.saveApiRequestBody = {
                    "shouldValidate": false,
                    "shouldAdvanceStep": false,
                    "retirementStep": "Choose Rollover Delivery",
                    "isAuthorized": false,
                    "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsquestArr
                };
            }
            if (!isDbCashoutFlag) {
                this.loading.showIndicator("#saveServiceLoader", "");
            } else {
                this.isDbCashoutPageLoading = true;
            }
            if (!this.hassTBAEdit) {
                this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
            }
            /* istanbul ignore next */
            this.retirementElectionRestService.rolloverDestinationSaveServices(this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessId, buttonActionType, isDbCashoutFlag, this.hassTBAEdit)
                .pipe(
                    finalize(() => {
                        if (saveApiResponse) {
                            responseStatusCode = saveApiResponse.statusCode;
                        }
                        if (!isDbCashoutFlag) {
                            this.loading.hideIndicator("#saveServiceLoader", "");
                        } else {
                            this.editMessagesService.hasEditFlagSubject.next(saveApiResponse.hasEdit);
                            this.isDbCashoutPageLoading = false;
                        }
                        if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                            this.showError = true;
                        } else {
                            if (!isDbCashoutFlag) {
                                this.retirementElectionRestService.setSystemTickets(this.rawSaveResponseData);
                            }
                            /**
                  * The following is to continue routing after the warning or informational edits
                */
                            if (!isDbCashoutFlag) {
                                if (saveApiResponse.routingPage !== undefined) {
                                    if (buttonActionType) {
                                        if (saveApiResponse.routingPage === "PMTD") {
                                            this.routeToPageLocation = "/retirement-election/payment-destination";
                                        } else if (saveApiResponse.routingPage === "RVWC") {
                                            this.routeToPageLocation = "/retirement-election/review-choices";
                                        }
                                    } else if (!buttonActionType) {
                                        this.routeToPageLocation = "/retirement-election/saved";
                                    }
                                }
                            }
                            this.saveApiResponseAction(saveApiResponse, buttonActionType, isDbCashoutFlag);
                        }

                    })
                )
                .subscribe(
                    (data) => {
                        this.rawSaveResponseData = data;
                        saveApiResponse = data.body;
                        this.logger._debug(JSON.stringify(data), "Getting rollover destination details successfully", LoggingConstants.INFO, "RetirementElection - rollover destination - save Service");
                    },
                    (error) => {
                        this.rawSaveResponseData = error;
                        saveApiResponse = error.error;
                        this.logger._error(JSON.stringify(error), "Error in rollover destination component response", LoggingConstants.ERROR, "RetirementElection - rollover destination - save Service");
                    });
        } else {
            /* istanbul ignore next */
            if (this.allowContinue) {
                this.editMessageList = [];
                this.editMessageList.push(this.findEditMessage("91000169"));
            } else if (this.allowContinueAddOne) {
                this.editMessageList = [];
                this.editMessageList.push(this.findEditMessage("18000605"));
            }
            /* istanbul ignore next */
            this.isBackButton = false;
            this.editMessagesService.saveEditArray(this.editMessageList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }
    }
    findEditMessage(editId) {
        return this.data.editList.find(editItem => editId === editItem.editId);
    }


    saveApiResponseAction(saveApiResponse, buttonActionType, isDbCashoutFlag) {
        /**
     * Check for routing page presence to store/route
    */
        if (!isDbCashoutFlag) {
            if (saveApiResponse) {
                if (saveApiResponse.routingPage !== undefined) {
                    /* istanbul ignore next */
                    if (buttonActionType) {
                        if (saveApiResponse.routingPage === "PMTD") {
                            this.routeToPageLocation = "payment-destination";
                        } else if (saveApiResponse.routingPage === "RVWC") {
                            this.routeToPageLocation = "review-choices";
                        }
                    }
                } else {
                    if (!buttonActionType) {
                        this.routeToPageLocation = "saved";
                    }
                }
            }
        }
        /**
     * Check for TBA Edits/ Server side edits
     */
        let saveEditList = this.retirementElectionRestService.extractEditMessages(this.rawSaveResponseData);
        if (saveEditList !== undefined) {
            this.isBackButton = false;
            this.editMessagesService.redirectToUrlSubject.next(this.routeToPageLocation);
            this.editMessagesService.saveEditArray(saveEditList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        } else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            /**
       * Case: No TBA edits and service status 200
       */
            /* istanbul ignore next */
            if (isDbCashoutFlag) {
                if (buttonActionType) {
                    if (saveApiResponse.routingPage === "PMTD") {
                        this.retirementElectionRestService.renderNextPage("../dbCashoutWhrToRcvPayment", this.activatedRoute);
                    } else if (saveApiResponse.routingPage === "RVWC") {
                        this.retirementElectionRestService.renderNextPage("../dbCashoutReview", this.activatedRoute);
                    }
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
                this.logger._debug("Getting edit message for Rollover destination component response", LoggingConstants.INFO, "RetirementElection - Rollover Destination - Save Service");
                this.isBackButton = false;
                this.editMessagesService.saveEditArray(saveEditList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.showError = true;
            }
        }
    }
    /* istanbul ignore next */
    rolloverDestinationData() {
        // this.retirementElectionRestService.rolloverDestinationServices()
        this.retirementElectionRestService.rolloverDestinationServices(this.isDbCashoutFlag)
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                            let responseStatusCode = this.data.status.statusCode;
                            if (responseStatusCode === 200) {
                                this.showError = false;
                                document.title = this.data.rollOverDestination.pageNameText;
                                /* istanbul ignore next */
                                if (this.isDbCashoutFlag) {
                                    // let pageUrl = this.retirementElectionRestService.pageUrlFromCashoutRoot(window.location.href);
                                    // this.dynamicComponentService.initializePageComponents(pageUrl); // Added Code Google Analytics
                                    this.retirementElectionRestService.gaPageTracking(window.location.href);
                                    let dbcProgressbarData = this.data.progressBarInfo;
                                    let dbcRightRailData = this.data.tiles;
                                    this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 2, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    this.retirementElectionRestService.setRightRailData(dbcRightRailData.iraChecklist, dbcRightRailData.questions, true, false, false);
                                } else {
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices120ChooWhereRcvRlvrPage");
                                    this.retirementElectionRestService.setSystemTickets(this.rawGetResponseData);
                                }
                                this.paymentTable = this.data.rollOverDestination.paymentTable;
                                this.editMessagesService.paymentTableSubject.next(this.data.rollOverDestination.paymentTable);
                                if (this.data.rollOverDestination.flowButtonNavigation !== undefined && this.data.rollOverDestination.flowButtonNavigation.editButtonList !== undefined) {
                                    let editButtonList = this.data.rollOverDestination.flowButtonNavigation.editButtonList;
                                    if (editButtonList.length !== 0) {
                                        this.editMessagesService.editButtonListSubject.next(editButtonList);
                                    }
                                }
                                let newformdata = {};
                                this.paymentTable.forEach(paymentTableItem => {
                                    let addrId = "";
                                    paymentTableItem.addressDestinationDetailData.forEach(addressItem => {
                                        if (addressItem.addressDetail.addressSelected) {
                                            addrId = addressItem.addressDetail.addressIdText;
                                        }
                                    });
                                    newformdata[paymentTableItem.paymentId] = [addrId, Validators.required];
                                });
                                this.newForm = this.formBuilder.group(newformdata);
                                if (this.retirementElectionRestService.isActivePBEnabled && this.data.progressBarPopovers !== undefined && this.data.progressBarPopovers !== null) {
                                    this.retirementElectionRestService.getProgressBarPopoverContent(this.data.progressBarPopovers);
                                }
                            }
                            if (this.retirementElectionRestService.isActivePBEnabled === true) {
                                let triggerSub = responseStatusCode === 200 ? true : false;
                                this.appUtility.notifyinitConfigSubscribers(triggerSub);
                            }
                        }
                    }
                    this.retirementElectionRestService.screenCaptureInit("rollover-destination");
                }),
            )
            .subscribe(
                (data) => {
                    if (data !== undefined && data !== null && data["body"] !== undefined) {
                        this.rawGetResponseData = data;
                        this.data = data["body"];
                    }
                    this.logger._debug(JSON.stringify(data), "Getting rollover destination details successfully", LoggingConstants.INFO, "RetirementElection - rollover destination - get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.logger._error(JSON.stringify(error), "Error in rollover destination component response", LoggingConstants.ERROR, "RetirementElection - rollover destination - Get Service");
                }

            );
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
                                this.editMessagesService.pageNameSubject.next("cancelFromRolloverDestination");
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
    /* istanbul ignore next */
    onCancel() {
        let response;
        let requestBody = {};
        let businessProcessId = 0;
        this.reviewPensionChoicesService.setBackButton(false);
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    this.responseData = response.statusCode;
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
                    this.logger._debug(JSON.stringify(data), "Getting rollover destination details successfully", LoggingConstants.INFO, "RetirementElection - rollover destination - cancel Service");
                }
            );
    }

    updateAddress(paymentId, i, j) {
        /* istanbul ignore if */
        if (this.isDbCashoutFlag) {
            // sessionStorage.setItem("dbCashoutRefreshAddress", "RefreshAddress");
            this.domFBService.setItem("dbCashoutRefreshDetails", "REFR_ADDR", "sessionStorage", true);
        }
        this.reviewPensionChoicesService.setBackButton(false);
        this.domFBService.setItem("systemTickets", JSON.stringify(this.retirementElectionRestService.systemTickets), "sessionStorage", true);
        let id = "AFenabled_" + paymentId + "_" + i + "_" + j;
        let spanElement = document.querySelector(`span[id=${id}]`) as HTMLElement;
        if (spanElement !== null) {
            let anchorElement = spanElement.firstElementChild as HTMLElement;
            if (anchorElement !== null) {
                anchorElement.click();
            }
        }
    }

    redirectBack() {
        // this.location.back();
        this.retirementElectionRestService.onRouteDBElec("review-choices");
    }

    // DB CASHOUT COMPONENT CUSTOM METHOD START
    /* istanbul ignore next */
    redirectToCancelledPage(event) {
        this.aldialogCancel.hideDialog(event);
        this.retirementElectionRestService.redirectToCancelPage();
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
                    if (popOverIDBData !== undefined) {
                        this.PBPopoverDataCacheService.popOverIDBData = popOverIDBData;
                    }
                    /* istanbul ignore next */
                    this.rolloverDestinationData();
                })
            )
            .subscribe((res: any) => {
                this.logger._debug("Response :" + JSON.stringify(res), "Fetched items from the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "RetirementElection -  rollover destination - getProgressBarPopOverDataFromIDB");
                popOverIDBData = res;
            },
            (
            /* istanbul ignore next */
                (error) => {
                    this.logger._error("Response :" + JSON.stringify(error), "Failed to Fetched items from the  ActiveProgressBarStore", LoggingConstants.ERROR, "RetirementElection -  rollover destination - getProgressBarPopOverDataFromIDB");
                })
            );
    }
}
