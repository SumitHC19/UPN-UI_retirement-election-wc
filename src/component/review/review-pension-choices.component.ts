import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { finalize } from "rxjs";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { ReviewPensionChoicesService } from "../../services/review-pension-choices.service";
import { CompletedSuccessfullyDSService } from "../../services/completed-successfully-data-save.service";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { ViewRhrComponentsModel } from "../shared/models/view-rhr-components.model";
import { Router, ActivatedRoute } from "@angular/router";
import { EditMessagesService } from "../../services/edit-messages.service";
import { AlLoaderComponent, LoggingConstants, LoggingService, DomStorageFallbackService, DynamicComponentService, GoogleAnalyticsService, AppUtility } from "@alight/core-utilities-lib";
import { FootnoteService } from "../../services/footnote-common.service";
import { FootnoteComponent } from "../shared/footnote-common/footnote-common-component";
import { ProgressBarPopoverDataCacheService } from "../../services/progressBarPopoverDataCache.service";

// declare var require:any;

@Component({
    selector: "al-pension-choices",
    templateUrl: "./review-pension-choices.component.html",
    providers: [AlLoaderComponent]
})
export class ReviewPensionChoicesComponent implements OnInit {
    data: any;
    printButtonText: any;
    saveApiRequestBody: any;
    checkresponse = false;
    paymentType: any;
    deliveryId: any;
    addressId: any;
    paymentId: any;
    rolloverDeliveryId: any;
    rolloverAddressId: any;
    primaryDeliveryId: any = 0;
    primaryAddressId: any = 0;
    secondaryDeliveryId: any;
    secondaryAddressId: any;
    secondaryAmount: any;
    taxingState: any = "";
    stateAdditionalWithholdingAmount: any = 0;
    arizonaWithholdingRate: any = "";
    provincialMonthlyAmount: any = 0;
    detailValue: any;
    unformatDetailValue: any;
    withHoldingType: any;
    paymentAmount: any;
    businessProcessReferenceId: any = 0;
    rawSaveResponseData: any;
    routeToSUA = false;
    showError = true;
    routeToPageLocation: any;
    responseData: any;
    rawGetResponseData: any;
    domSystemTickets: any;
    isSUAResultMode = false;
    disableSubmit = false;
    editMessageList: any[];
    allowContinue = false;
    ViewRhrComponents = new ViewRhrComponentsModel();
    skipSUA = false;
    @ViewChild("display", { static: true }) display: any;
    cancelOnContinue = false;
    isDbCashoutPageLoading = false;
    @ViewChild("footnoteDbElec") footnoteDbElec: any;
    hassTBAEdit = false;
    reviewSuaEditList: any;
    @Input() isDbCashoutFlag: boolean;
    @Input() isDbNQFlag: boolean;
    @ViewChild("aldialogCancel") aldialogCancel;
    @ViewChild(FootnoteComponent, { static: false }) childFootnote: FootnoteComponent;
    isECSUser: boolean;
    isReviewSubmitted = false;
    isRoutedToSUA = false;
    showQuitButton = true;
    showCBLButton = true;
    showLDWDate = false;
    isPPOSupported = false;
    constructor(private retirementElectionRestService: RetirementElectionRestService,
        private appUtility: AppUtility,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private completedSuccessfullyDSService: CompletedSuccessfullyDSService,
        private stepsActiveIndexService: StepsActiveIndexService,
        private router: Router,
        private loading: AlLoaderComponent,
        private domFBService: DomStorageFallbackService,
        private activatedRoute: ActivatedRoute,
        private editMessagesService: EditMessagesService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private logger: LoggingService,
        private footnoteService: FootnoteService,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService
    ) {
        this.ViewRhrComponents.viewOtherResComp = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }
    /* istanbul ignore next */
    ngOnInit() {
        this.dynamicComponentService.initializePageComponents();
        this.setConfigurationData();
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(5);
        } else {
            this.stepsActiveIndexService.setStepIndex(6);
        }
        // this.stepsActiveIndexService.setStepIndex(6);
        this.editMessagesService.isDbCashoutFlag = this.isDbCashoutFlag;
        this.editMessagesService.isDbNQEFlagSubject.next(this.isDbNQFlag);
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        let SuaCompleted = this.domFBService.getItem("isSuaCompFrUser", "sessionStorage", true);
        let CheckifReviewSubmitted = this.domFBService.getItem("isReviewSubmitted");
        if (CheckifReviewSubmitted !== null && CheckifReviewSubmitted !== undefined && CheckifReviewSubmitted === "true") {
            this.isReviewSubmitted = true;
            this.domFBService.removeItem("isReviewSubmitted");
        }
        if (SuaCompleted !== null && SuaCompleted !== undefined && SuaCompleted === "true") {
            this.skipSUA = true;
        }
        if (isCallBackAllowed) {
            if (!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if (!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            this.getRouteToSUAQueryParam();
            // this.activatedRoute.queryParams.subscribe(params => {
            //     let result = params["routeToSUA"];
            //     if (result === "true") {
            //         this.routeToSUA = true;
            //     } else {
            //         this.routeToSUA = false;
            //     }
            // });
            if (this.routeToSUA) {
                this.reviewSuaSaveService(true);
            } else {
                if (!this.isDbCashoutFlag && !this.isDbNQFlag) {
                    this.retirementElectionRestService.getQueryParameters();
                }
                this.retirementElectionRestService.screenCapture(true);
                if (this.retirementElectionRestService.isActivePBEnabled) {
                    this.getProgressBarPopOverDataFromIDB();
                } else {
                    this.reviewYourPensionChoiceData(false, false);
                }
            }
        } else {
            this.checkresponse = true;
        }
    }
    /* istanbul ignore next */
    getRouteToSUAQueryParam() {
        let name = "routeToSUA";
        let url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        let routeSUAParam = decodeURIComponent(results[2].replace(/\+/g, " "));
        if (routeSUAParam === "true") {
            this.routeToSUA = true;
        } else {
            this.routeToSUA = false;
        }
        return this.routeToSUA;
    }
    /* istanbul ignore next */
    setConfigurationData() {
        this.retirementElectionRestService.getConfigurationData().subscribe((data) => {
            if (data && data[0]) {
                if (data[0]["expr"]["SHOW_LDW_YOUR_DATES_TABLE"] !== undefined) {
                    this.showLDWDate = data[0]["expr"]["SHOW_LDW_YOUR_DATES_TABLE"];
                }
            }
        },
        err => {
            this.logger._error(JSON.stringify(err), "get failed", LoggingConstants.ERROR, "Retirementelection Widget - config");
        });
    }
    reviewSuaSaveService(actionType: boolean) {
        this.editMessagesService.editMessageFlagSubject.next(false);
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("reviewSua");
        let saveApiResponse: any;
        let responseStatusCode: any;
        let buttonActionType = actionType;
        /* istanbul ignore next */
        if (this.hassTBAEdit || this.skipSUA) {
            this.isSUAResultMode = null;
            this.loading.showIndicator("#saveServiceLoader", "");
        } else {
            this.isSUAResultMode = true;
        }
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        // Make reviewPensionChoicesSaveServices call and process apiResponse accordingly
        if (this.isDbCashoutFlag || this.isDbNQFlag) {
            this.saveApiRequestBody = {
                "shouldAdvanceStep": true,
                "retirementStep": "Review Your Choice"
            };
        } else {
            this.saveApiRequestBody = {
                "shouldAdvanceStep": true,
                "retirementStep": "Pension Election Authorization",
                "acknowledgeAuthorization": "Yes"
            };
        }

        if (!this.hassTBAEdit) {
            this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
        }
        this.retirementElectionRestService.reviewPensionChoicesSaveServices(this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType, this.isSUAResultMode, this.isDbCashoutFlag, this.isDbNQFlag, this.hassTBAEdit)
            .pipe(
                finalize(() => {
                    /* istanbul ignore next */
                    if (saveApiResponse) {
                        if (this.hassTBAEdit || this.skipSUA) {
                            this.loading.hideIndicator("#saveServiceLoader", "");
                        }
                        responseStatusCode = saveApiResponse.statusCode;
                        if ((responseStatusCode !== 200)) {
                            this.showError = true;
                        } else {
                            this.retirementElectionRestService.getQueryParameters();
                            this.stepsActiveIndexService.setStepIndex(6);
                            this.reviewSuaEditList = this.retirementElectionRestService.extractEditMessages(this.rawSaveResponseData);
                            if (this.reviewSuaEditList === undefined) {
                                if (saveApiResponse.suaChannelResponse) {
                                    if (saveApiResponse.suaChannelResponse.suaStatus === "success") {
                                        this.skipSUA = true;
                                        this.domFBService.setItem("isSuaCompFrUser", true, "sessionStorage", true); // SUA completion indication
                                        if (saveApiResponse.routingPage !== undefined) {
                                            let reviewPagedata = this.domFBService.getItem("reviewPageData");
                                            if (reviewPagedata !== undefined && reviewPagedata !== null) {
                                                this.data = JSON.parse(reviewPagedata);
                                                this.setDataforAuthPages();
                                            }
                                            this.saveApiResponseAction(saveApiResponse, buttonActionType, this.isDbCashoutFlag, this.isDbNQFlag);
                                        } else {
                                            this.reviewYourPensionChoiceData(false, false);
                                        }
                                    } else if (saveApiResponse.suaChannelResponse.userActionMsgOnError) {
                                        this.skipSUA = false;
                                        /*  --- Commented out for DSWP-5396 will be implemented if required in future ---
                          let edit = {
                            "editId": saveApiResponse.suaChannelResponse.userActionMsgOnError,
                            "editMessage": saveApiResponse.suaChannelResponse.userActionMsgOnError
                          };
                          this.editMessageList = [];
                          this.editMessageList.push(edit);
                          this.allowContinue = true;
                          this.disableSubmit = true;
                          this.reviewYourPensionChoiceData(true, false);// true - SUA error indication */
                                        this.reviewYourPensionChoiceData(false, false);
                                    } else {
                                        this.reviewYourPensionChoiceData(false, false);
                                    }
                                } else {
                                    this.saveApiResponseAction(saveApiResponse, buttonActionType, this.isDbCashoutFlag, this.isDbNQFlag);
                                }
                            } else {
                                this.skipSUA = true;
                                this.domFBService.setItem("isSuaCompFrUser", true, "sessionStorage", true); // SUA completion indication
                                this.reviewYourPensionChoiceData(false, true); // true- SUA edit indication
                            }
                        }
                    }
                })
            )
            .subscribe(
                (data: any) => {
                    this.rawSaveResponseData = data;
                    saveApiResponse = data["body"];
                    this.logger._debug(JSON.stringify(data), "Getting ReviewChoices details successfully", LoggingConstants.INFO, "RetirementElection - ReviewChoices - Save Service");
                },/* istanbul ignore next */
                (error) => {
                    this.rawSaveResponseData = error;
                    saveApiResponse = error.error;
                    this.logger._error(JSON.stringify(error), "Error in ReviewChoices component response", LoggingConstants.ERROR, "RetirementElection - ReviewChoices - Save Service");
                });
    }
    /* istanbul ignore next */
    showFootnoteSup() {
        this.childFootnote.showFootnote(event);
    }
    /* istanbul ignore next */
    reviewYourPensionChoiceData(isSUAError: boolean, isSUAEdit: boolean) {
        if (!this.routeToSUA) {
            let isRoutedToSUA = this.domFBService.getItem("isRoutedToSUA", "sessionStorage", true);
            if (isRoutedToSUA !== undefined && isRoutedToSUA !== null && isRoutedToSUA === "true") {
                this.isReviewSubmitted = true;
                this.domFBService.removeItem("isRoutedToSUA");
            }
        }
        this.retirementElectionRestService.reviewYourPensionChoice(this.isReviewSubmitted, this.isDbCashoutFlag, this.isDbNQFlag)
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.responseStatus !== undefined && this.data.responseStatus.statusCode !== undefined) {
                            let responseStatusCode = this.data.responseStatus.statusCode;
                            if (responseStatusCode === 200) {
                                this.showError = false;
                                document.title = this.data.pageTitle;
                                if (this.data.isPPORetirementSupported !== undefined) {
                                    this.isPPOSupported = this.data.isPPORetirementSupported;
                                }
                                this.domFBService.setItem("reviewPageData", JSON.stringify(this.data), "sessionStorage", true);
                                if (!this.isDbCashoutFlag && !this.isDbNQFlag) {
                                    this.retirementElectionRestService.setSystemTickets(this.rawGetResponseData);
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices150ReviewChoicesPage");
                                    this.domFBService.setItem("incomeTaxSystemTickets", JSON.stringify(this.retirementElectionRestService.systemTickets), "sessionStorage", true);
                                }
                                if (this.isDbCashoutFlag || this.isDbNQFlag) {
                                    // let pageUrl = this.retirementElectionRestService.pageUrlFromCashoutRoot(window.location.href);
                                    // this.dynamicComponentService.initializePageComponents(pageUrl); // Added Code Google Analytics
                                    let dbcProgressbarData = this.data.progressBarInfo;
                                    let dbcRightRailData = this.data.tiles;
                                    let dbcDocAndRsrcData = this.data.tiles.documentsAndResources;
                                    if (this.isDbCashoutFlag) {
                                        this.retirementElectionRestService.gaPageTracking(window.location.href);
                                        this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 3, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    } else {
                                        this.googleAnalyticsService.postGACustomPageTracking("dbNQRetirementReview", "DB Retirement Flow - NQ");
                                        this.retirementElectionRestService.setProgressbarData(dbcProgressbarData.pageTitle, 4, dbcProgressbarData.ofLabel, dbcProgressbarData.stepDetail);
                                    }
                                    this.retirementElectionRestService.setRightRailData(dbcRightRailData.iraChecklist, dbcRightRailData.questions, true, false, true);
                                    this.retirementElectionRestService.setDocumentAndResourcesData(dbcDocAndRsrcData.linkList, dbcDocAndRsrcData.title, true);
                                    this.isECSUser = this.data.isECS;
                                }
                                this.footnoteService.setFootnoteData(this.data.footnoteContent);
                                document.title = this.data.pageTitle;
                                if (this.data.flowButtonNavigation !== undefined && this.data.flowButtonNavigation.editButtonList !== undefined) {
                                    let editButtonList = this.data.flowButtonNavigation.editButtonList;
                                    if (editButtonList.length !== 0) {
                                        this.editMessagesService.editButtonListSubject.next(editButtonList);
                                    }
                                }
                                this.reviewPensionChoicesService.setChangeModalContent(this.data.changeDateBeneModalContent);
                                this.reviewPensionChoicesService.setBeneficiaryContent(this.data.beneficiaryContent);
                                if (this.data.hasOwnProperty("nqBenefit") && this.data.nqBenefit && this.data.nqBenefit !== null) {
                                    this.reviewPensionChoicesService.setNonQualifiedBenefitContent(this.data.nqBenefit);
                                }
                                this.reviewPensionChoicesService.setDeferredBenefitsContent(this.data.deferredBenefitsContent);
                                this.reviewPensionChoicesService.setChangeButtonText(this.data.changeButtonLabel);
                                this.reviewPensionChoicesService.setPaymentReviewList(this.data.paymentElections);
                                this.reviewPensionChoicesService.setDisclaimer(this.data.disclaimer);
                                this.reviewPensionChoicesService.setPara1(this.data.taxWthdPara);
                                this.reviewPensionChoicesService.setPara2(this.data.taxWthdDestPara);
                                this.setDataforAuthPages();
                                if (this.retirementElectionRestService.isActivePBEnabled && this.data.progressBarPopovers !== undefined && this.data.progressBarPopovers !== null) {
                                    this.retirementElectionRestService.getProgressBarPopoverContent(this.data.progressBarPopovers);
                                }
                                if (isSUAError) {
                                    Promise.resolve().then(() => {
                                        this.cancontinue();
                                    });
                                } else if (isSUAEdit) {
                                    Promise.resolve().then(() => {
                                        if (this.reviewSuaEditList !== undefined) {
                                            this.editMessagesService.saveEditArray(this.reviewSuaEditList);
                                            this.editMessagesService.editMessageFlagSubject.next(true);
                                            window.scrollTo(0, 0);
                                            this.reviewSuaEditList = undefined;
                                        }
                                    });
                                }
                            }
                            if (this.retirementElectionRestService.isActivePBEnabled === true) {
                                let triggerSub = responseStatusCode === 200 ? true : false;
                                this.appUtility.notifyinitConfigSubscribers(triggerSub);
                            }
                        }
                    }
                    this.retirementElectionRestService.screenCaptureInit("review-choices");
                }),
            )
            .subscribe(
                (data) => {
                    if (data !== undefined && data !== null && data["body"] !== undefined) {
                        this.rawGetResponseData = data;
                        this.data = data["body"];
                    }
                    this.logger._debug(JSON.stringify(data), "Getting ReviewChoices details successfully", LoggingConstants.INFO, "RetirementElection - ReviewChoices - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.logger._error(JSON.stringify(error), "Error in ReviewChoices component response", LoggingConstants.ERROR, "RetirementElection - ReviewChoices - Get Service");
                }
            );
        window.scrollTo(0, 0);
    }

    continueEdit(parameters) {
        let buttonActionType = parameters.buttonActionType;
        let isCashoutFlag = parameters.isCashoutFlag;
        let isNQFlag = parameters.isNQFlag;
        this.continueClick(buttonActionType, isCashoutFlag, isNQFlag);
    }

    /* istanbul ignore next */
    continueClick(buttonActionType, isCashoutFlag, isNQFlag) {
        if ((isCashoutFlag || isNQFlag) && this.isECSUser) {
            this.retirementElectionRestService.redirectToErrorPage();
        }
        if (this.allowContinue) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            Promise.resolve().then(() => {
                if (this.skipSUA && buttonActionType) {
                    this.reviewSuaSaveService(buttonActionType);
                } else {
                    this.onClickContinue(buttonActionType, isCashoutFlag, isNQFlag);
                }
            });
        } else {
            if (this.skipSUA && buttonActionType) {
                this.reviewSuaSaveService(buttonActionType);
            } else {
                this.onClickContinue(buttonActionType, isCashoutFlag, isNQFlag);
            }
        }
    }
    onClickContinue(buttonActionType, isCashoutFlag, isNQFlag) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.editMessageFlagSubject.next(false);
        this.editMessagesService.pageNameSubject.next("review");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        this.isSUAResultMode = false;
        let responseStatusCode: any;
        let saveApiResponse: any;
        let deliveryAndWithholdingElectionRevisions = [];
        /* istanbul ignore next */
        if (buttonActionType) {
            if (!isCashoutFlag && !isNQFlag) {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": true,
                    "retirementStep": "Pension Election Authorization",
                    "acknowledgeAuthorization": "Yes"
                };
            } else {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": true,
                    "retirementStep": "Review Your Choice"
                };
            }
        } else {
            if (!this.hassTBAEdit) {
                if (this.data.paymentElections) {
                    let paymentItem = this.data.paymentElections;
                    paymentItem.forEach(paymentIdItem => {
                        this.rolloverDeliveryId = 0; this.rolloverAddressId = 0;
                        this.paymentId = parseInt(paymentIdItem.paymentId);
                        this.secondaryDeliveryId = 0; this.secondaryAddressId = 0;
                        this.secondaryAmount = 0; this.taxingState = ""; this.stateAdditionalWithholdingAmount = 0;
                        this.arizonaWithholdingRate = ""; this.provincialMonthlyAmount = 0;
                        if (paymentIdItem.paymentDestinationsContent) {
                            if (paymentIdItem.paymentDestinationsContent.paymentDestinations) {
                                paymentIdItem.paymentDestinationsContent.paymentDestinations.forEach(paymentDestinationsIdItem => {
                                    if (paymentDestinationsIdItem.paymentType) {
                                        this.paymentType = paymentDestinationsIdItem.paymentType;
                                        if (paymentDestinationsIdItem.deliveryId) {

                                            this.deliveryId = parseInt(paymentDestinationsIdItem.deliveryId);
                                        }
                                        if (paymentDestinationsIdItem.addressId) {
                                            this.addressId = parseInt(paymentDestinationsIdItem.addressId);
                                        }
                                        if (paymentDestinationsIdItem.unformatPaymentAmount) {
                                            this.paymentAmount = parseFloat(paymentDestinationsIdItem.unformatPaymentAmount);
                                        }
                                    } else {
                                        this.paymentType = "";
                                    }
                                    if (this.paymentType === "R") {
                                        this.rolloverDeliveryId = this.deliveryId;
                                        this.rolloverAddressId = this.addressId;
                                    }
                                    if (this.paymentType === "P") {
                                        this.primaryDeliveryId = this.deliveryId;
                                        this.primaryAddressId = this.addressId;
                                    }
                                    if (this.paymentType === "S") {
                                        this.secondaryDeliveryId = this.deliveryId;
                                        this.secondaryAddressId = this.addressId;
                                        this.secondaryAmount = this.paymentAmount;
                                    }
                                });
                            }
                        }
                        if (paymentIdItem.withholdingContent) {
                            if (paymentIdItem.withholdingContent.stateWithholdingDetailList) {
                                paymentIdItem.withholdingContent.stateWithholdingDetailList.forEach(stateWithholdingIdItem => {
                                    if (stateWithholdingIdItem.withHoldingType) {
                                        this.withHoldingType = stateWithholdingIdItem.withHoldingType;
                                        if (stateWithholdingIdItem.detailValue) {
                                            this.detailValue = stateWithholdingIdItem.detailValue;
                                        }
                                        if (stateWithholdingIdItem.unformatDetailValue) {
                                            this.unformatDetailValue = parseFloat(stateWithholdingIdItem.unformatDetailValue);
                                        }
                                    } else {
                                        this.withHoldingType = "";
                                    }
                                    if (this.withHoldingType === "TXST") {
                                        this.taxingState = this.detailValue;
                                    }
                                    if (this.withHoldingType === "SAWA") {
                                        this.stateAdditionalWithholdingAmount = this.unformatDetailValue;
                                    }
                                    if (this.withHoldingType === "AZWR") {
                                        this.arizonaWithholdingRate = this.detailValue;
                                    }
                                    if (this.withHoldingType === "PVMA") {
                                        this.provincialMonthlyAmount = this.unformatDetailValue;
                                    }
                                });
                            }
                        }
                        let paymentItems = {
                            "paymentId": this.paymentId,
                            "primaryDeliveryId": this.primaryDeliveryId,
                            "primaryAddressId": this.primaryAddressId,
                            "taxingState": this.taxingState,
                            "stateAdditionalWithholdingAmount": this.stateAdditionalWithholdingAmount,
                            "arizonaWithholdingRate": this.arizonaWithholdingRate,
                            "provincialMonthlyAmount": this.provincialMonthlyAmount
                        };

                        if (this.rolloverAddressId !== 0) {
                            paymentItems["rolloverDeliveryId"] = this.rolloverDeliveryId;
                        }
                        if (this.rolloverAddressId !== 0) {
                            paymentItems["rolloverAddressId"] = this.rolloverAddressId;
                        }
                        if (this.secondaryDeliveryId !== 0) {
                            paymentItems["secondaryDeliveryId"] = this.secondaryDeliveryId;
                        }
                        if (this.secondaryAddressId !== 0) {
                            paymentItems["secondaryAddressId"] = this.secondaryAddressId;
                        }
                        if (this.secondaryAmount !== 0) {
                            paymentItems["secondaryAmount"] = this.secondaryAmount;
                        }
                        deliveryAndWithholdingElectionRevisions.push(paymentItems);
                    });
                }
                if (!isCashoutFlag && !isNQFlag) {
                    this.saveApiRequestBody = {
                        "shouldAdvanceStep": false,
                        "retirementStep": "Review Your Choice",
                        "isAuthorized": false,
                        "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisions
                    };
                }
            }
        }
        if (!isCashoutFlag && !isNQFlag) {
            this.loading.showIndicator("#saveServiceLoader", "");
        } else {
            this.isDbCashoutPageLoading = true;
        }
        if (!this.hassTBAEdit) {
            this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
        }
        this.retirementElectionRestService.reviewPensionChoicesSaveServices(this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType, this.isSUAResultMode, isCashoutFlag, isNQFlag, this.hassTBAEdit)
            .pipe(
                finalize(() => {
                    let throwException = {};
                    try {
                        /* istanbul ignore next */
                        if (saveApiResponse) {
                            responseStatusCode = saveApiResponse.statusCode;
                            if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                                this.showError = true;
                            } else {
                                this.editMessagesService.issTbaEditSubject.next(false);
                                if (saveApiResponse.suaChannelResponse) {
                                    if (saveApiResponse.suaChannelResponse.userActionMsgOnError) {
                                        let edit = {
                                            "editId": saveApiResponse.suaChannelResponse.userActionMsgOnError,
                                            "editMessage": saveApiResponse.suaChannelResponse.userActionMsgOnError
                                        };
                                        this.editMessageList = [];
                                        this.editMessageList.push(edit);
                                        this.allowContinue = true;
                                        this.disableSubmit = true;
                                        if (!isCashoutFlag && !isNQFlag) {
                                            this.loading.hideIndicator("#saveServiceLoader", "");
                                        } else {
                                            this.editMessagesService.hasEditFlagSubject.next(saveApiResponse.hasEdit);
                                            this.isDbCashoutPageLoading = false;
                                        }
                                        throw throwException;
                                    }
                                } else {
                                    if (!isCashoutFlag && !isNQFlag) {
                                        this.retirementElectionRestService.setSystemTickets(this.rawSaveResponseData);
                                    }
                                }
                                if (!isCashoutFlag && !isNQFlag) {
                                    this.loading.hideIndicator("#saveServiceLoader", "");
                                } else {
                                    this.editMessagesService.hasEditFlagSubject.next(saveApiResponse.hasEdit);
                                    this.isDbCashoutPageLoading = false;
                                }
                                /** * The following is to continue routing after the warning or informational edits
                 */
                                if (saveApiResponse.routingPage !== undefined) {
                                    this.retirementElectionRestService.AuthorizePageSubject.next(saveApiResponse.routingPage);
                                    if (buttonActionType) {
                                        if (saveApiResponse.routingPage === "AUTH") {
                                            this.routeToPageLocation = "/retirement-election/authorize-your-choices";
                                        } else if (saveApiResponse.routingPage === "SUBS") {
                                            this.routeToPageLocation = "/retirement-election/authorization-required";
                                        } else if (saveApiResponse.routingPage === "SUA") {
                                            // this.domFBService.setItem('routeToSUA', true, 'sessionStorage', true);
                                        }
                                    } else if (!buttonActionType) {
                                        this.routeToPageLocation = "/retirement-election/saved";
                                    }
                                }
                                this.saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isNQFlag);
                            }
                        }
                    } catch (throwException) {
                        this.cancontinue();
                    }
                })
            )
            .subscribe(
                (data: any) => {
                    this.rawSaveResponseData = data;
                    saveApiResponse = data["body"];
                    this.logger._debug(JSON.stringify(data), "Getting ReviewChoices details successfully", LoggingConstants.INFO, "RetirementElection - ReviewChoices - Save Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.rawSaveResponseData = error;
                    saveApiResponse = error.error;
                });
    }
    /* istanbul ignore next */
    saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isNQFlag) {
        /**
     * Check for routing page presence to store/route
     */
        if (!isCashoutFlag && !isNQFlag) {
            if (saveApiResponse) {
                if (saveApiResponse.routingPage !== undefined) {
                    if (buttonActionType) {
                        if (saveApiResponse.routingPage === "AUTH") {
                            this.routeToPageLocation = "authorize-your-choices";
                        } else if (saveApiResponse.routingPage === "SUBS") {
                            this.routeToPageLocation = "authorization-required";
                        } else if (saveApiResponse.routingPage === "SUA") {
                            this.routeToPageLocation = saveApiResponse.suaChannelResponse.redirectToSUALink;
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
        /* istanbul ignore next */
        let saveEditList = this.retirementElectionRestService.extractEditMessages(this.rawSaveResponseData);
        if (saveEditList !== undefined) {
            this.editMessagesService.redirectToUrlSubject.next(this.routeToPageLocation);
            this.editMessagesService.saveEditArray(saveEditList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }/* istanbul ignore next */else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            /**
       * Case: No TBA edits and service status 200
       */


            /* istanbul ignore next */
            this.retirementElectionRestService.AuthorizePageSubject.next(saveApiResponse.routingPage);
            if (buttonActionType) {
                if (!this.hassTBAEdit) {
                    if (!this.routeToSUA) {
                        if (!isCashoutFlag && !isNQFlag) {
                            if (this.data !== undefined && this.data !== null) {
                                this.setDataforAuthPages();
                            }
                        }
                    }
                }
                /* istanbul ignore next */
                if (!isCashoutFlag && !isNQFlag) {
                    this.domFBService.setItem("isReviewSubmitted", true, "sessionStorage", true);
                    if (saveApiResponse.routingPage === "AUTH") {
                        this.retirementElectionRestService.removeSystemTickets();
                        this.completedSuccessfullyDSService.isFromReviewPage = true;
                        this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
                    } else if (saveApiResponse.routingPage === "SUBS") {
                        this.retirementElectionRestService.removeSystemTickets();
                        this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
                    } else if (saveApiResponse.routingPage === "SUA") {
                        let SUAPageLink = saveApiResponse.suaChannelResponse.redirectToSUALink;
                        this.renderToSUA(SUAPageLink);
                    }
                } else {
                    if (saveApiResponse.routingPage === "SUBS") {
                        this.completedSuccessfullyDSService.isFromReviewPage = true;
                        if (isCashoutFlag) {
                            this.retirementElectionRestService.renderNextPage("../dbCashoutComplete", this.activatedRoute);
                        } else {
                            this.retirementElectionRestService.renderNextPage("../dbNQEnrollmentComplete", this.activatedRoute);
                        }

                    } else if (saveApiResponse.routingPage === "SUA") {
                        let SUAPageLink = saveApiResponse.suaChannelResponse.redirectToSUALink;
                        this.renderToSUA(SUAPageLink);
                    }
                }
                /* istanbul ignore next */
                if (!this.routeToSUA) {
                    if (saveApiResponse.suaChannelResponse !== undefined) {
                        if (saveApiResponse.suaChannelResponse.userActionMsgOnError) {
                            let edit = {
                                "editId": saveApiResponse.suaChannelResponse.userActionMsgOnError,
                                "editMessage": saveApiResponse.suaChannelResponse.userActionMsgOnError
                            };
                            this.editMessageList = [];
                            this.editMessageList.push(edit);
                            this.allowContinue = true;
                            this.disableSubmit = true;
                            if (!isCashoutFlag && !isNQFlag) {
                                this.loading.hideIndicator("#saveServiceLoader", "");
                            } else {
                                this.isDbCashoutPageLoading = false;
                            }
                            this.editMessagesService.saveEditArray(this.editMessageList);
                            this.editMessagesService.editMessageFlagSubject.next(true);
                            window.scrollTo(0, 0);
                        }
                    }
                }
            } else if (!buttonActionType) {
                this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
            }
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
       * Case: Server side edits and service status 400
       */
            /* istanbul ignore next */
            if (saveEditList !== undefined) {
                this.logger._debug("Getting edit message for Reviewchoices component response", LoggingConstants.INFO, "RetirementElection - Reviewchoices - Save Service");
                this.editMessagesService.saveEditArray(saveEditList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.showError = true;
            }
        }

    }
    /* istanbul ignore next */
    renderToSUA(externalLink: string) {
        this.domFBService.setItem("isRoutedToSUA", true, "sessionStorage", true);
        // location.href = externalLink;
        this.retirementElectionRestService.tagOnClick(externalLink);
        return false;
    }
    /* istanbul ignore next */
    cancontinue() {
        if (!this.allowContinue) {
            this.editMessagesService.editMessageFlagSubject.next(false);
        } else {
            this.editMessagesService.saveEditArray(this.editMessageList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
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
                                this.editMessagesService.pageNameSubject.next("cancelFromRPC");
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
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    if (response && response.statusCode) {
                        this.responseData = response.statusCode;
                        if (this.responseData === 200) {
                            if (this.cancelOnContinue) {
                                this.routeToCMIRET();
                            } else {
                                this.retirementElectionRestService.onRouteDBElec("cancelled");
                            }
                            this.showError = false;
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    if (data !== undefined && data !== null && data["body"] !== undefined) {
                        response = data.body;
                        this.logger._debug(JSON.stringify(data), "Getting ReviewChoices details successfully", LoggingConstants.INFO, "RetirementElection - ReviewChoices - cancel Service");
                    }
                }
            );
    }

    /* istanbul ignore next */
    callCancelAndReroute() {
        this.checkPreActivityEdit();
        this.cancelOnContinue = true;
    }

    /* istanbul ignore next */
    routeToCMIRET() {
        let id = "datesCmiretRouteLink";
        let spanElement = document.querySelector(`span[id=${id}]`) as HTMLElement;
        if (spanElement !== null) {
            let anchorElement = spanElement.firstElementChild as HTMLElement;
            if (anchorElement !== null) {
                anchorElement.click();
            }
        }
    }

    //  DB CASHOUT COMPONENT CUSTOM METHOD START
    /* istanbul ignore next */
    redirectToCancelledPage(event) {
        this.aldialogCancel.hideDialog(event);
        if (this.isDbCashoutFlag) {
            this.retirementElectionRestService.redirectToCancelPage();
        }
        if (this.isDbNQFlag) {
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
    /* istanbul ignore next */
    getProgressBarPopOverDataFromIDB() {
        let popOverIDBData;
        this.PBPopoverDataCacheService.getProgressBarPopoverDataInCache()
            .pipe(
                finalize(() => {
                    if (popOverIDBData !== undefined) {
                        this.PBPopoverDataCacheService.popOverIDBData = popOverIDBData;
                    }
                    this.reviewYourPensionChoiceData(false, false);
                })
            )
            .subscribe((res: any) => {
                this.logger._debug("Response :" + JSON.stringify(res), "Fetched items from the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "RetirementElection - ReviewChoices - getProgressBarPopOverDataFromIDB");
                popOverIDBData = res;
            },
            ((error) => {
                this.logger._error("Response :" + JSON.stringify(error), "Failed to Fetched items from the  ActiveProgressBarStore", LoggingConstants.ERROR, "RetirementElection -  ReviewChoices - getProgressBarPopOverDataFromIDB");
            })
            );
    }

    /**
   * @method setDataforAuthPages
   * Sets the review data needed for submitted pages in angular service
   */
    setDataforAuthPages() {
        if (this.data.isAllowedToChooseMultipleBeneficiaries !== undefined) {
            this.completedSuccessfullyDSService.setIsAllowedToBeneficiaries(this.data.isAllowedToChooseMultipleBeneficiaries);
        }
        if (this.data.paymentElections !== undefined) {
            this.completedSuccessfullyDSService.savePaymentElections(this.data.paymentElections);
        }
        if (this.data.beneficiaryContent !== undefined) {
            this.completedSuccessfullyDSService.saveBeneficiaryContent(this.data.beneficiaryContent);
        }
        if (this.data.retirementDatesContent !== undefined) {
            this.completedSuccessfullyDSService.saveRetirementDatesContent(this.data.retirementDatesContent);
        }
        if (this.data.deferredBenefitsContent !== undefined) {
            this.completedSuccessfullyDSService.saveDeferredBenefitsContent(this.data.deferredBenefitsContent);
        }
    }
}
