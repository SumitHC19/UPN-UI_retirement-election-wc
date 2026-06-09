import { AlLoaderComponent, LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, AppUtility } from "@alight/core-utilities-lib";
import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { finalize } from "rxjs";
import { EditMessagesService } from "../../../services/edit-messages.service";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { StepsActiveIndexService } from "../../../services/steps-active-index-service";
import { ReviewPensionChoicesService } from "../../../services/review-pension-choices.service";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";
import { Title } from "@angular/platform-browser";
import { ProgressBarPopoverDataCacheService } from "../../../services/progressBarPopoverDataCache.service";

@Component({
    selector: "al-how-much-to-rollover",
    templateUrl: "./how-much-to-rollover.component.html",
    providers: [AlLoaderComponent]
})
export class HowMuchToRolloverComponent implements OnInit, OnDestroy {

    public form: UntypedFormGroup;
    paymentTable = [];
    noneText: any;
    data: any;
    response: any;
    value: any;
    tablecontent: any;
    item: any;
    paymentId: string;
    queryParameters: any;
    checkresponse = false;
    responseData: any;
    showError = true;
    allowContinue = true;
    editMessageObject: any;
    pattern: any;
    saveApiRequestBody: any;
    businessProcessId: any;
    editMessageList: any[];
    selectedOption: any;
    redirectPage: any;
    rawGetResponseData: any;
    rawSaveResponseData: any;
    electedRolloverAmount: any;
    isBackButton = false;
    @ViewChild("display", { static: false }) display: any;
    ViewRhrComponents = new ViewRhrComponentsModel();
    isDbCashoutPageLoading = false;
    hassTBAEdit = false;
    @Input() isDbCashoutFlag: boolean;
    @ViewChild("aldialogCancel") aldialogCancel;
    routeToPageLocation: any;
    showQuitButton = true;
    showCBLButton = true;
    defaultLocale = true;
    FrAmountPattern = /^([0-9\s]*)((\,)[0-9]{1,2})?$/;
    rcPageLink: any;
    iralandingLink: any;



    /**
   * Standard constructor code to do
   * the dependency injection.
   */
    constructor(private retirementElectionRestService: RetirementElectionRestService, private router: Router, private formBuilder: UntypedFormBuilder,
        private editMessagesService: EditMessagesService, private loading: AlLoaderComponent, private appUtility: AppUtility,
        private stepsActiveIndexService: StepsActiveIndexService,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private logger: LoggingService, private titleService: Title,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private activatedRoute: ActivatedRoute,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService) {
        this.form = this.formBuilder.group({});
        this.ViewRhrComponents.viewConsiderIraComp = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    /**
   * Standard code to subscribe for servce data
   * which in turn give call to mircroservice.
   */

    ngOnInit() {
        if(sessionStorage.getItem("gsToDBPageCd")){
            sessionStorage.removeItem("gsToDBPageCd");
        }
        if(this.ViewRhrComponents.viewConsiderIraComp && !this.isDbCashoutFlag){
            sessionStorage.setItem("isRetiFlowForGsSessionStorage", "true");
        }
        // DB Cashout flag - dbCashOutFlag
        this.checkDefaultAmtFormat();
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        if (!this.isDbCashoutFlag) {
            if (this.retirementElectionRestService.isMultiBeneSupported) {
                this.stepsActiveIndexService.setStepIndex(3);
            } else {
                this.stepsActiveIndexService.setStepIndex(4);
            }
            // this.stepsActiveIndexService.setStepIndex(4);
            this.dynamicComponentService.initializePageComponents();
            if (isCallBackAllowed) {
                if (!this.retirementElectionRestService.showQuitButton) {
                    this.showQuitButton = false;
                }
                if (!this.retirementElectionRestService.showCBLButton) {
                    this.showCBLButton = false;
                }
                this.retirementElectionRestService.getQueryParameters();
                this.isBackButton = this.reviewPensionChoicesService.getBackButton();
                this.getPatterns();
            }
        }
        this.editMessagesService.isDbCashoutFlagSubject.next(this.isDbCashoutFlag);
        this.editMessagesService.isDbCashoutFlag = this.isDbCashoutFlag;
        if (isCallBackAllowed) {
            this.retirementElectionRestService.screenCapture(true);
            if (this.retirementElectionRestService.isActivePBEnabled) {
                this.getProgressBarPopOverDataFromIDB();
            } else {
                this.getHowMuchToRolloverData();
            }
        } else {
            this.checkresponse = true;
        }
        /* istanbul ignore next */
        window.addEventListener("DB_To_IRA_Landing_event", (event: any) => {
            this.handleRCMessages(event.detail);
        });
    }
    /* istanbul ignore next */
    checkDefaultAmtFormat() {
        let locale = this.retirementElectionRestService.getLocale();
        this.defaultLocale = this.retirementElectionRestService.isDefaultLocale(locale);
    }


    /* istanbul ignore next */
    getHowMuchToRolloverData() {
        // this.retirementElectionRestService.howMuchRollOverdataService1()
        this.retirementElectionRestService.howMuchRollOverdataService(this.isDbCashoutFlag)
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.responseStatus !== undefined && this.data.responseStatus.statusCode !== undefined) {
                            let responseStatusCode = this.data.responseStatus.statusCode;
                            if (responseStatusCode === 200) {
                                this.showError = false;
                                document.title = this.data.chooseHowMuchToRollOver.pageNameText;
                                if (!this.isDbCashoutFlag) {
                                    this.retirementElectionRestService.setSystemTickets(this.rawGetResponseData);
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices110ChooHowMuchRlvrPage");
                                }
                                this.paymentTable = this.data.chooseHowMuchToRollOver.paymentTable;
                                this.noneText = this.data.chooseHowMuchToRollOver.paymentTable[0].noneRadioButtonText;
                                this.rcPageLink = this.data?.chooseHowMuchToRollOver?.rcPageLink;
                                this.iralandingLink = this.data?.chooseHowMuchToRollOver?.iralandingLink;
                                // Cashout -- related data.
                                /* istanbul ignore next */
                                if (this.isDbCashoutFlag) {
                                    // let pageUrl = this.retirementElectionRestService.pageUrlFromCashoutRoot(window.location.href);
                                    // this.dynamicComponentService.initializePageComponents(pageUrl); // Added Code Google Analytics
                                    this.retirementElectionRestService.gaPageTracking(window.location.href);
                                    this.pattern = new RegExp(this.data.amountValidationPattern);
                                    let dbcnqProgressbarData = this.data.progressBarInfo;
                                    let dbcnqRightRailData = this.data.tiles;
                                    this.retirementElectionRestService.setProgressbarData(dbcnqProgressbarData.pageTitle, 2, dbcnqProgressbarData.ofLabel, dbcnqProgressbarData.stepDetail);
                                    this.retirementElectionRestService.setRightRailData(dbcnqRightRailData.iraChecklist, dbcnqRightRailData.questions, true, true, false);
                                }
                                this.paymentTable.forEach(paymentTableItem => {
                                    this.form.addControl("label_" + paymentTableItem.paymentId, this.formBuilder.control(this.noneText, Validators.required));
                                    this.form.addControl("electedrolloveramount_" + paymentTableItem.paymentId, this.formBuilder.control({ value: "0.00" }));
                                });
                                if (this.data.chooseHowMuchToRollOver.flowButtonNavigation !== undefined && this.data.chooseHowMuchToRollOver.flowButtonNavigation.editButtonList !== undefined) {
                                    let editButtonList = this.data.chooseHowMuchToRollOver.flowButtonNavigation.editButtonList;
                                    if (editButtonList.length !== 0) {
                                        this.editMessagesService.editButtonListSubject.next(editButtonList);
                                    }
                                }
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
                    this.retirementElectionRestService.screenCaptureInit("rollover-amount");
                }),
            )
            .subscribe(
                (data) => {
                    if (data !== undefined && data !== null && data["body"] !== undefined) {
                        this.rawGetResponseData = data;
                        this.data = data["body"];
                    }
                    this.logger._debug(JSON.stringify(data), "Getting HowMuchtoRollover details successfully", LoggingConstants.INFO, "RetirementElection - HowMuchtoRollover - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.logger._error(JSON.stringify(error), "Error in HowMuchtoRollover component response", LoggingConstants.ERROR, "RetirementElection - HowMuchtoRollover - Get Service");
                }

            );
        window.scrollTo(0, 0);
    }

    getPatterns() {
        this.retirementElectionRestService.getCommonContent().subscribe(
            (data) => {
                this.pattern = new RegExp(data[0]["text"]["currAsDecCnstrt"]);
                this.logger._debug(JSON.stringify(data), "Getting HowMuchtoRollover details successfully", LoggingConstants.INFO, "RetirementElection - HowMuchtoRollover - GetPattern Service");
            }
        );
    }
    /* istanbul ignore next */
    findEditMessage(editId) {
        return this.data.chooseHowMuchToRollOver.editList.find(editItem => editId === editItem.editId);
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
                                this.editMessagesService.pageNameSubject.next("cancelFromHMTR");
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
        let businessProcessId = 123;
        this.reviewPensionChoicesService.setBackButton(false);
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    if (response && response.statusCode) {
                        this.responseData = response.statusCode;
                        /* istanbul ignore next */
                        if (this.responseData !== 200) {
                            this.showError = true;
                        } else {
                            this.showError = false;
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting HowMuchtoRollover details successfully", LoggingConstants.INFO, "RetirementElection - HowMuchtoRollover - cancel Service");
                }
            );
    }

    /* istanbul ignore next */
    continueEdit(parameters) {
        let buttonActionType = parameters.buttonActionType;
        let isDbCashoutFlag = parameters.isDbCashoutFlag;
        this.canContinue(buttonActionType, isDbCashoutFlag);
    }
    /* istanbul ignore next */
    canContinue(buttonActionType, isDbCashoutFlag) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("hmtr");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        this.editMessagesService.isDbCashoutFlagSubject.next(isDbCashoutFlag);
        this.businessProcessId = 0;
        let responseStatusCode: any;
        let saveApiResponse: any;
        let deliveryAndWithholdingElectionRevisionsquestArr = [];
        let rolloverAmount = 0;
        let throwException = {};
        this.reviewPensionChoicesService.setBackButton(false);
        try {
            this.paymentTable.forEach(paymentItem => {
                let fieldName = "label_" + paymentItem.paymentId;
                let paymentId = paymentItem.paymentId;
                let fieldValue = this.form.get(fieldName).value;
                /* istanbul ignore next */
                if (fieldValue !== paymentItem.allAmountRadioButtonText && fieldValue !== paymentItem.specificAmountRadioButtonText && fieldValue !== paymentItem.noneRadioButtonText) {
                    this.editMessageList = [];
                    this.editMessageList.push(this.findEditMessage("91000160"));
                    this.editMessagesService.saveEditArray(this.editMessageList);
                    this.allowContinue = false;
                    throw throwException;
                } else if (fieldValue === paymentItem.allAmountRadioButtonText) {
                    rolloverAmount = paymentItem.unformatTotalRollOverAvailableAmount;
                    this.selectedOption = "ALLAMT";
                } else if (fieldValue === paymentItem.noneRadioButtonText) {
                    rolloverAmount = this.data.chooseHowMuchToRollOver.defaultAmt;
                    this.selectedOption = "NONE";
                }

                if (fieldValue === paymentItem.specificAmountRadioButtonText) {
                    this.electedRolloverAmount = String(paymentItem.unformatElectedRolloverAmount);
                    rolloverAmount = this.defaultLocale ? parseFloat(this.electedRolloverAmount.replace(/,/g, "")) : parseFloat(this.electedRolloverAmount.replace(/\s/g, "").replace(/,/g, "."));
                    let finalPattern = this.defaultLocale ? this.pattern.test(this.electedRolloverAmount) === false : this.FrAmountPattern.test(this.electedRolloverAmount) === false;
                    this.selectedOption = "SPFAMT";
                    /* istanbul ignore next */
                    if (rolloverAmount === 0.00) {
                        this.editMessageList = [];
                        this.editMessageList.push(this.findEditMessage("91500021"));
                        this.editMessagesService.saveEditArray(this.editMessageList);
                        this.allowContinue = false;
                        throw throwException;
                    } else if (finalPattern) {
                        this.editMessageList = [];
                        this.editMessageList.push(this.findEditMessage("96500100"));
                        this.editMessagesService.saveEditArray(this.editMessageList);
                        this.allowContinue = false;
                        throw throwException;
                    } else if (!isDbCashoutFlag && (rolloverAmount > paymentItem.unformatTotalRollOverAvailableAmount)) {
                        this.editMessageList = [];
                        this.editMessageList.push(this.findEditMessage("93500103"));
                        this.editMessagesService.saveEditArray(this.editMessageList);
                        this.allowContinue = false;
                        throw throwException;
                    } else if (isDbCashoutFlag && (rolloverAmount >= paymentItem.unformatTotalRollOverAvailableAmount)) {
                        this.editMessageList = [];
                        this.editMessageList.push(this.findEditMessage("93500103"));
                        this.editMessagesService.saveEditArray(this.editMessageList);
                        this.allowContinue = false;
                        throw throwException;
                    }
                } else {
                    this.allowContinue = true;
                }
                deliveryAndWithholdingElectionRevisionsquestArr.push({
                    "paymentId": paymentId,
                    "rolloverAmount": rolloverAmount,
                    "selectedOption": this.selectedOption
                }
                );
            });
            throw throwException;
        } catch (throwException) {
            if (this.allowContinue === false) {
                this.isBackButton = false;
                this.reviewPensionChoicesService.setBackButton(false);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.editMessageList = [];
                this.editMessagesService.editMessageFlagSubject.next(false);
                if (buttonActionType) {
                    this.saveApiRequestBody = {
                        "shouldValidate": true,
                        "shouldAdvanceStep": true,
                        "retirementStep": "Choose Rollover Amount",
                        "isAuthorized": false,
                        "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsquestArr
                    };
                } else {
                    this.saveApiRequestBody = {
                        "shouldValidate": false,
                        "shouldAdvanceStep": false,
                        "retirementStep": "Choose Rollover Amount",
                        "isAuthorized": false,
                        "deliveryAndWithholdingElectionRevisions": deliveryAndWithholdingElectionRevisionsquestArr
                    };
                }
                this.redirectPage = this.saveApiRequestBody.deliveryAndWithholdingElectionRevisions
                    .some((item) => {
                        return item.rolloverAmount > 0;
                    });
                if (isDbCashoutFlag) {
                    this.isDbCashoutPageLoading = true;
                } else {
                    this.loading.showIndicator("#saveServiceLoader", "");
                }
                if (!this.hassTBAEdit) {
                    this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
                }
                /* istanbul ignore next */
                if (this.hassTBAEdit) {
                    let saveApiRequestBody = this.editMessagesService.saveApiRequestBody;
                    this.redirectPage = saveApiRequestBody.deliveryAndWithholdingElectionRevisions
                        .some((item) => {
                            return item.rolloverAmount > 0;
                        });
                }
                this.retirementElectionRestService.howMuchRollOverSaveService(this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessId, buttonActionType, isDbCashoutFlag, this.hassTBAEdit)
                    .pipe(
                        finalize(() => {
                            /* istanbul ignore next */
                            if (saveApiResponse) {
                                responseStatusCode = saveApiResponse.statusCode;
                                if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                                    this.showError = true;
                                } else {
                                    /*
              This below condition only for cashout specific loader.
              Getting an error in Show and Hide loader for current code.
              Once it's resolved will remove this condition.
              */
                                    if (isDbCashoutFlag) {
                                        this.editMessagesService.hasEditFlagSubject.next(saveApiResponse.hasEdit);
                                        this.isDbCashoutPageLoading = false;
                                        // this.loading.hideIndicator('#saveServiceLoader', '');
                                        this.saveApiResponseAction(saveApiResponse, buttonActionType, isDbCashoutFlag);
                                    } else {
                                        this.retirementElectionRestService.setSystemTickets(this.rawSaveResponseData);
                                        this.loading.hideIndicator("#saveServiceLoader", "");
                                        this.saveApiResponseAction(saveApiResponse, buttonActionType, isDbCashoutFlag);
                                    }
                                }
                            }
                        })
                    )
                    .subscribe(
                        (data) => {
                            this.rawSaveResponseData = data;
                            saveApiResponse = data.body;
                            this.logger._debug(JSON.stringify(data), "Getting HowMuchtoRollover details successfully", LoggingConstants.INFO, "RetirementElection - HowMuchtoRollover - Save Service");
                        },/* istanbul ignore next */
                        (error) => {
                            this.rawSaveResponseData = error;
                            saveApiResponse = error.error;
                            this.logger._error(JSON.stringify(error), "Error in HowMuchtoRollover component response", LoggingConstants.ERROR, "RetirementElection - HowMuchtoRollover - Save Service");
                        });
            }
        }
    }

    /* istanbul ignore next */
    onChange() {
        this.paymentTable.forEach(paymentTableItem => {
            let fieldName = "electedrolloveramount_" + paymentTableItem.paymentId;
            if (paymentTableItem.selectedRadioButton === paymentTableItem.specificAmountRadioButtonText) {
                this.form.get(fieldName).enable();
            } else {
                this.form.get(fieldName).disable();
            }
        });
    }

    /* istanbul ignore next */
    continueClick(buttonActionType, isDbCashoutFlag) {
        if (this.allowContinue === false) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            this.allowContinue = true;
            Promise.resolve().then(() => {
                this.canContinue(buttonActionType, isDbCashoutFlag);
            });
        } else {
            this.canContinue(buttonActionType, isDbCashoutFlag);
        }
    }


    /* istanbul ignore next */
    saveApiResponseAction(saveApiResponse, buttonActionType, isDbCashoutFlag) {
        /**
    * Check for redirecting page to store/route
    */
        if (buttonActionType) {
            if (this.redirectPage) {
                if (isDbCashoutFlag) {
                    this.retirementElectionRestService.renderNextPage("../dbCashoutWhrToRcvRolloverPayment", this.activatedRoute);
                } else {
                    this.routeToPageLocation = "rollover-destination";
                }
            } else {
                if (isDbCashoutFlag) {
                    this.retirementElectionRestService.renderNextPage("../dbCashoutWhrToRcvPayment", this.activatedRoute);
                } else {
                    this.routeToPageLocation = "payment-destination";
                }
            }
        } else if (!buttonActionType) {
            this.routeToPageLocation = "saved";
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
        } else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false) && !isDbCashoutFlag) {
            /**
       * Case: No TBA edits and service status 200
       */
            this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
       * Case: Server side edits and service status 400
       */
            if (saveEditList !== undefined) {
                this.logger._debug("Getting edit message for HowMuchToRollOver component response", LoggingConstants.INFO, "RetirementElection - HowMuchToRollOver - Save Service");
                this.isBackButton = false;
                this.editMessagesService.saveEditArray(saveEditList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.showError = true;
            }
        }
    }

    setUpAccount() {
        let spanElement = document.querySelector("#setUpAccount a") as HTMLElement;
        if (spanElement !== null) {
            spanElement.click();
        }
    }

    redirectBack() {
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
                    this.getHowMuchToRolloverData();
                })
            )
            .subscribe((res: any) => {
                this.logger._debug("Response :" + JSON.stringify(res), "Fetched items from the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "RetirementElection - HowMuchToRollOver - getProgressBarPopOverDataFromIDB");
                popOverIDBData = res;
            },
            (
            /* istanbul ignore next */
                (error) => {
                    this.logger._error("Response :" + JSON.stringify(error), "Failed to Fetched items from the  ActiveProgressBarStore", LoggingConstants.ERROR, "RetirementElection -  HowMuchToRollOver - getProgressBarPopOverDataFromIDB");
                })
            );
    }

    /* istanbul ignore next */
    handleRCMessages(event) {
        if (event?.origin === this.rcPageLink?.trim() && (typeof event?.data === "string") && event?.data === "redirectToIRALanding") {
            if (this.iralandingLink) {
                this.clickOnLink(this.iralandingLink);
            }
        }
    }
    clickOnLink(link: string) {
        if(this.isDbCashoutFlag){
            sessionStorage.setItem("gsToDBPageCd", "DB_CASHOUT_CHANGE_YR_DSTRB_CHC_LNK");
        } else if (!this.isDbCashoutFlag && this.ViewRhrComponents.viewConsiderIraComp){
            sessionStorage.setItem("gsToDBPageCd", "RH_PENSION_CONTINUE_CHOICE_LINK");
        }
        const tempElement: any = document.createElement("div");
        tempElement.innerHTML = link.trim();
        const anchorElement = tempElement.firstChild as HTMLElement;
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
    }

    /* istanbul ignore next */
    ngOnDestroy() {
        window.removeEventListener("DB_To_IRA_Landing_event", () => {});
    }

}
