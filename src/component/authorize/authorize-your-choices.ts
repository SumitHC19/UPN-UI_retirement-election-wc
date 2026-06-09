import { Component, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from "@angular/core";
import { finalize } from "rxjs";
import { EditMessagesService } from "../../services/edit-messages.service";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { CompletedSuccessfullyDSService } from "../../services/completed-successfully-data-save.service";
import { ViewRhrComponentsModel } from "../shared/models/view-rhr-components.model";
import { Router } from "@angular/router";
import { DomStorageFallbackService, AlLoaderComponent, LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, AlPopOverComponent, AppUtility } from "@alight/core-utilities-lib";
import { ProgressBarPopoverDataCacheService } from "../../services/progressBarPopoverDataCache.service";

@Component({
    selector: "al-authorize-your-choices",
    templateUrl: "./authorize-your-choices.html",
    providers: [AlLoaderComponent]
})

export class AuthorizeYourChoicesComponent implements OnInit {
    data: any;
    responseData: any;
    expand = false;
    authDetailDataItemExpand = [];
    generalAuthExpand = false;
    checkresponse = false;
    showError = true;
    selectedValues: any;
    editMessageList: any[];
    rawGetResponseData: any;
    businessProcessReferenceId = 123;
    saveApiRequestBody: any;
    saveApiResponse: any;
    headers: any;
    responseStatusCode: any;
    ViewRhrComponents = new ViewRhrComponentsModel();
    routeToPageLocation: any;
    hassTBAEdit = false;
    showQuitButton = true;
    showCBLButton = true;
    public mouseEventListener;
    @ViewChild("TooltipMouseOver") child: AlPopOverComponent;
    @ViewChild("display") display: any;
    constructor(private retirementElectionRestService: RetirementElectionRestService,
        private changeDetector: ChangeDetectorRef,
        private appUtility: AppUtility,
        private editMessagesService: EditMessagesService,
        private router: Router,
        private stepsActiveIndexService: StepsActiveIndexService,
        private loading: AlLoaderComponent,
        private completedSuccessfullyDSService: CompletedSuccessfullyDSService,
        private logger: LoggingService,
        private renderer: Renderer2,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private domFBService: DomStorageFallbackService,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService
    ) {
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    ngOnInit() {
        this.dynamicComponentService.initializePageComponents();
        // this.stepsActiveIndexService.setStepIndex(7);
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(6);
        } else {
            this.stepsActiveIndexService.setStepIndex(7);
        }
        // this.retirementElectionRestService.isMultiBeneSupported ? this.stepsActiveIndexService.setStepIndex(6) : this.stepsActiveIndexService.setStepIndex(7);
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        if (isCallBackAllowed) {
            if (!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if (!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            if (this.retirementElectionRestService.isActivePBEnabled) {
                this.getProgressBarPopOverDataFromIDB();
            } else {
                this.authorizePageData();
            }
            // this.retirementElectionRestService.isActivePBEnabled? this.getProgressBarPopOverDataFromIDB() : this.authorizePageData();
            this.retirementElectionRestService.getQueryParameters();
            if (!this.completedSuccessfullyDSService.isFromReviewPage) {
                this.getReviewContent();
            }
            this.retirementElectionRestService.screenCapture(true);
        } else {
            this.checkresponse = true;
        }
    }

    authorizePageData() {
        this.retirementElectionRestService.authorizeYourChoicesService()
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    /* istanbul ignore next */
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                            let responseStatusCode = this.data.status.statusCode;
                            if (responseStatusCode === 200) {
                                this.showError = false;
                                this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices160AuthPage");
                                document.title = this.data.authorizeYourChoices.pageNameText;
                                this.responseData = this.data.status.statusCode;
                                if (this.data.authorizeYourChoices.flowButtonNavigation !== undefined && this.data.authorizeYourChoices.flowButtonNavigation.editButtonList !== undefined) {
                                    let editButtonList = this.data.authorizeYourChoices.flowButtonNavigation.editButtonList;
                                    if (editButtonList.length !== 0) {
                                        this.editMessagesService.editButtonListSubject.next(editButtonList);
                                    }
                                }
                                this.authDetailDataItemExpand.length = this.data.authorizeYourChoices.authorizationDetailData.length;
                                for (let i = 0; i < this.authDetailDataItemExpand.length; i++) {
                                    this.authDetailDataItemExpand[i] = false;
                                }
                                this.changeDetector.detectChanges();
                                this.showNotificationPopover();
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
                    this.retirementElectionRestService.screenCaptureInit("authorize-your-choices");
                }),
            )
            .subscribe(
                (data) => {
                    this.rawGetResponseData = data;
                    this.data = data["body"];
                    this.logger._debug(JSON.stringify(this.data), "Getting authorize your choices details successfully", LoggingConstants.INFO, "RetirementElection - authorize your choices - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.logger._error(JSON.stringify(this.data), "Error in authorize your choices component response", LoggingConstants.ERROR, "RetirementElection - authorize your choices - Get Service");
                }

            );
        window.scrollTo(0, 0);
    }

    getReviewContent() {
        let reviewHeaders;
        let reviewData;
        this.retirementElectionRestService.reviewYourPensionChoice(true, false, false)
            .pipe(
                finalize(() => {
                    if (reviewHeaders.hasOwnProperty("body")) {
                        this.domFBService.setItem("reviewPageData", JSON.stringify(reviewData), "sessionStorage", true);
                        this.completedSuccessfullyDSService.savePaymentElections(reviewData.paymentElections);
                        this.completedSuccessfullyDSService.saveBeneficiaryContent(reviewData.beneficiaryContent);
                        this.completedSuccessfullyDSService.saveRetirementDatesContent(reviewData.retirementDatesContent);
                        this.completedSuccessfullyDSService.saveDeferredBenefitsContent(reviewData.deferredBenefitsContent);
                        this.completedSuccessfullyDSService.setIsAllowedToBeneficiaries(reviewData.isAllowedToChooseMultipleBeneficiaries);
                    }
                }),
            )
            .subscribe(
                (data) => {
                    reviewHeaders = data;
                    reviewData = data["body"];
                    this.logger._debug(JSON.stringify(data), "Getting authorize your choices details successfully", LoggingConstants.INFO, "RetirementElection - authorize your choices - getReviewContent");
                },
                /* istanbul ignore next */
                (error) => {
                    reviewHeaders = error;
                    reviewData = error.error;
                    this.logger._debug(JSON.stringify(error), "Error in authorize your choices component response", LoggingConstants.ERROR, "RetirementElection - authorize your choices - getReviewContent");
                }
            );
    }

    authToggleAll() {
        this.retirementElectionRestService.registerAfterPrintHandler(this.collapseAll.bind(this));
        this.retirementElectionRestService.registerBeforePrintHandler(this.expandAll.bind(this));
        window.print();
    }

    expandAll() {
        this.generalAuthExpand = true;
        this.authDetailDataItemExpand.forEach((item, index) => {
            this.authDetailDataItemExpand[index] = true;
            index++;
        });
    }
    collapseAll() {
        this.generalAuthExpand = false;
        this.authDetailDataItemExpand.forEach((item, index) => {
            this.authDetailDataItemExpand[index] = false;
            index++;
        });
    }

    setgeneralAuthExpand(expand) {
        this.generalAuthExpand = !(expand);
    }

    setactive(expand, i) {
        this.authDetailDataItemExpand[i] = !(expand);
    }

    findEditMessage(editId) {
        return this.data.authorizeYourChoices.editList.find(editItem => editId === editItem.editId);
    }
    canContinue(buttonActionType: boolean) {
        /* istanbul ignore next */
        if (buttonActionType) {
            if (this.selectedValues === undefined || this.selectedValues.length === 0) {
                this.editMessageList = [];
                this.editMessageList.push(this.findEditMessage("91000396"));
                this.editMessagesService.saveEditArray(this.editMessageList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.editMessageList = [];
                this.editMessagesService.editMessageFlagSubject.next(false);
                this.retirementElectionRestService.AuthorizeButtonSubject.next(buttonActionType);
                this.loading.showIndicator("#saveServiceLoader", "");
                this.authorizeSaveService(buttonActionType);
            }
        } else {
            this.editMessageList = [];
            this.editMessagesService.editMessageFlagSubject.next(false);
            this.retirementElectionRestService.AuthorizeButtonSubject.next(buttonActionType);
            this.loading.showIndicator("#saveServiceLoader", "");
            this.authorizeSaveService(buttonActionType);
        }
    }

    authorizeSaveService(buttonActionType) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("authorizeyourchoices");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        if (!this.hassTBAEdit) {
            if (buttonActionType) {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": true,
                    "retirementStep": "Pension Election Authorization",
                    "acknowledgeAuthorization": "Yes",
                    "isAuthorized": true
                };
            } else if (!buttonActionType) {
                this.saveApiRequestBody = {
                    "shouldAdvanceStep": false,
                    "retirementStep": "Pension Election Authorization",
                    "acknowledgeAuthorization": "No"
                };
            }
            this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
        }
        this.retirementElectionRestService.authorizeYourChoicesSaveService(this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, buttonActionType, this.businessProcessReferenceId, this.hassTBAEdit)
            .pipe(
                finalize(() => {
                    if (this.saveApiResponse) {
                        this.responseStatusCode = this.saveApiResponse.statusCode;
                        this.logger._error(JSON.stringify(this.responseStatusCode), "Getting authorize your choices Page statusCode", LoggingConstants.ERROR, "RetirementElection - authorize your choices - Save Service");
                        if ((this.responseStatusCode !== 200) && (this.responseStatusCode !== 400)) {
                            this.showError = true;
                        } else {
                            this.loading.hideIndicator("#saveServiceLoader", "");
                            this.saveApiResponseAction(this.saveApiResponse, buttonActionType);
                        }
                    }
                }
                )).subscribe(
                (data: any) => {
                    this.headers = data;
                    this.saveApiResponse = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting authorize your choices details successfully", LoggingConstants.INFO, "RetirementElection - authorize your choices - Save Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.headers = error;
                    this.saveApiResponse = error.error;
                    this.logger._debug(JSON.stringify(error), "Error in authorize your choices component response", LoggingConstants.ERROR, "RetirementElection - authorize your choices - Save Service");
                });
    }

    saveApiResponseAction(saveApiResponse, buttonActionType) {
        /**
     * Check for routing page presence to store/route
     */
        if (buttonActionType) {
            this.routeToPageLocation = "authorization-complete";
        } else if (!buttonActionType) {
            this.routeToPageLocation = "saved";
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
        } /* istanbul ignore next */ else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            /**
       * Case: No TBA edits and service status 200
       */
            this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
       * Case: Server side edits and service status 400
       */
            /* istanbul ignore next */
            if (saveEditList !== undefined) {
                this.logger._debug("Getting edit message for authorize your choices component response", LoggingConstants.INFO, "RetirementElection - authorize your choices - Save Service");
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
                                this.editMessagesService.pageNameSubject.next("cancelFromAuth");
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
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                        } else {
                            this.showError = true;
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting authorize your choices details successfully", LoggingConstants.INFO, "RetirementElection - authorize your choices - cancel Service");
                }
            );
    }
    /* istanbul ignore next */
    showNotificationPopover() {
        Promise.resolve().then(() => {
            let notificationPopover = document.querySelectorAll("#authorizeYourChoices .ah-tooltip");
            if (notificationPopover !== undefined && notificationPopover !== null) {
                notificationPopover.forEach(tooltipItem => {
                    tooltipItem.classList.add("al-tooltip");
                    this.mouseEventListener = this.renderer.listen(tooltipItem, "mouseenter", (event) => {
                        this.child.showPopOver(event);
                    });
                    this.mouseEventListener = this.renderer.listen(tooltipItem, "mouseleave", (event) => {
                        this.child.hidePopOver(event);
                    });
                });
            }
        });
    }
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
                    this.authorizePageData();
                })
            )
            .subscribe((res: any) => {
                this.logger._debug("Response :" + JSON.stringify(res), "Fetched items from the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "RetirementElection - authorize your choices - getProgressBarPopOverDataFromIDB");
                popOverIDBData = res;
            },
            ((error) => {
                this.logger._error("Response :" + JSON.stringify(error), "Failed to Fetched items from the  ActiveProgressBarStore", LoggingConstants.ERROR, "RetirementElection - authorize your choices - getProgressBarPopOverDataFromIDB");
            })
            );
    }
}
