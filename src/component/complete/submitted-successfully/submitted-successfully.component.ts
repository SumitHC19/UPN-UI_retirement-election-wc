import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { RightSideContentService } from "../../../services/right-side-content.service";
import { ReviewPensionChoicesService } from "../../../services/review-pension-choices.service";
import { AuthorizationCommonService } from "../../../services/authorization-common.service";
import { CompletedSuccessfullyDSService } from "../../../services/completed-successfully-data-save.service";
import { StepsActiveIndexService } from "../../../services/steps-active-index-service";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";
import { finalize, interval, Subscription } from "rxjs";
import { LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, DomStorageFallbackService, IDBService, AppUtility } from "@alight/core-utilities-lib";
import { FootnoteService } from "../../../services/footnote-common.service";

@Component({
    selector: "al-submitted-successfully",
    templateUrl: "./submitted-successfully.component.html"
})

export class SubmittedSuccessfullyComponent implements OnInit, OnDestroy {
    source: any;
    stopCondition: Date;
    private subscription: Subscription;
    authgetCallData: any;
    loader = false;
    loadingPdfText: any;
    uploadingPdfText: any;
    @ViewChild("display") display: any;
    checkResponse = false;
    data: any;
    showError = true;
    additionalBeneficiaryText = false;
    printButtonText: any;
    ViewRhrComponents = new ViewRhrComponentsModel();
    accLockServiceStatus: any;
    rtrAccLockData: any;
    pageInputParam: string;
    @ViewChild("rtrAcctLock", { static: true }) rtrAcctLock;

    constructor(
        private stepsActiveIndexService: StepsActiveIndexService,
        private appUtility: AppUtility,
        private retirementElectionRestService: RetirementElectionRestService,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private authorizationCommonService: AuthorizationCommonService,
        private completedSuccessfullyDSService: CompletedSuccessfullyDSService,
        private rightSideContentService: RightSideContentService,
        private logger: LoggingService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private footnoteService: FootnoteService,
        private domFBService: DomStorageFallbackService,
        private idbService: IDBService
    ) {
        this.ViewRhrComponents.viewWantToAddbene = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.retirementElectionRestService.getQueryParameters();
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        this.dynamicComponentService.initializePageComponents();
        // this.stepsActiveIndexService.setStepIndex(7);
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(6);
        } else {
            this.stepsActiveIndexService.setStepIndex(7);
        }
        // this.retirementElectionRestService.isMultiBeneSupported ? this.stepsActiveIndexService.setStepIndex(6) : this.stepsActiveIndexService.setStepIndex(7);
        this.printText();
        this.additionalBeneficiaryText = this.completedSuccessfullyDSService.getIsAllowedToBeneficiaries();
        this.rightSideContentService.setAdditionalBeneficiaryText(this.additionalBeneficiaryText);
        if (isCallBackAllowed) {
            this.retirementElectionRestService.screenCapture(true);
            this.getDataFromChannel();
        } else {
            this.checkResponse = true;
        }
        this.source = interval(10000);
        this.stopCondition = new Date(Date.now() + 60000);
        this.pageInputParam = "UPNRH";
        this.getTextData();
        this.retriggerAuthMethod();
        this.dynamicComponentService.loadScript("retirement-accountlockstatus-wc", "retirement-accountlockstatus-wc");

    }
    /* istanbul ignore next */
    getTextData() {
        this.retirementElectionRestService.getConfigurationData().subscribe((data) => {
            if (data && data[0]) {
                if (data[0]["text"]["PDF_POP_UP_AUTH_REQ_LOADING_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_AUTH_REQ_LOADING_TXT"] !== null) {
                    this.loadingPdfText = data[0]["text"]["PDF_POP_UP_AUTH_REQ_LOADING_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_UPLOADING_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_UPLOADING_TXT"] !== null) {
                    this.uploadingPdfText = data[0]["text"]["PDF_POP_UP_UPLOADING_TXT"];
                }
            }
        },
        err => { });
    }

    /* istanbul ignore next */
    downloadPdf(event: any) {
        let businessProcessReferenceId = 0;
        const clickedElement = event.target;
        let mailBoxItemDetail: any;
        if (clickedElement.id === "authorizationform") {
            mailBoxItemDetail = this.data?.submittedSuccessfullyFollowUps?.authorizationFormDetails;
        } else if (clickedElement.id === "confirmationStatement") {
            mailBoxItemDetail = this.data?.submittedSuccessfullyFollowUps?.confirmationStatementDetails;
        }
        if (mailBoxItemDetail !== null && mailBoxItemDetail !== undefined) {
            let mailBoxItemId = mailBoxItemDetail?.mailBoxItemId;
            let filename = mailBoxItemDetail?.name;
            let extension = mailBoxItemDetail?.type;
            this.retirementElectionRestService.getPdfPopService(mailBoxItemId, businessProcessReferenceId)
                .pipe(
                    finalize(() => {
                        /* istanbul ignore next */
                        this.googleAnalyticsService.postGACustomEventTracking("Link", "Link Clicked", filename);
                    }),
                ).subscribe(
                    (data: any) => {
                        if (data !== undefined && data !== null) {
                            this.retirementElectionRestService.downloadBlobFile(data, filename, extension);
                        }
                    },
                    /* istanbul ignore next */
                    (error) => {
                        this.logger._error(JSON.stringify(error), "Error in getting pdf data", LoggingConstants.ERROR, "RetirementElection - authorization required - Get Service");
                    }
                );
        }
    }
    getDataFromChannel() {
        this.retirementElectionRestService.submittedSuccessfullyService()
            .pipe(
                finalize(() => {
                    this.checkResponse = true;
                    /* istanbul ignore if */
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                            let responseStatusCode = this.data.status.statusCode;
                            if (responseStatusCode === 200) {
                                if (this.data?.isUCEClientSprtPdfPop && !this.data?.isUCEClientNotSprtPdfPopDbelecKit && this.data?.submittedSuccessfullyFollowUps && this.data?.submittedSuccessfullyFollowUps !== undefined && this.data?.submittedSuccessfullyFollowUps != null && this.data?.submittedSuccessfullyFollowUps?.authorizationFormDetails === undefined && this.data?.submittedSuccessfullyFollowUps?.confirmationStatementDetails === undefined && this.data?.isPdfPopRetryNeeded) {
                                    this.loader = true;
                                }
                                this.domFBService.setItem("isDBEleclFlowComp", true, "sessionStorage", true);
                                this.showError = false;
                                this.googleAnalyticsService.postGACustomPageTracking("UPN_DbRtrmChoices170SubSucPage");
                                document.title = this.data.submittedSuccessfullyHeader.pageNameText;
                                document.getElementsByTagName("title")[0].innerHTML = this.data.submittedSuccessfullyHeader.pageNameText;
                                this.footnoteService.setFootnoteData(this.data.footnoteContent);
                                this.reviewPensionChoicesService.setPaymentReviewList(this.completedSuccessfullyDSService.getPaymentElections());
                                this.reviewPensionChoicesService.setBeneficiaryContent(this.completedSuccessfullyDSService.getBeneficiaryContent());
                                this.reviewPensionChoicesService.setDeferredBenefitsContent(this.completedSuccessfullyDSService.getDeferredBenefitsContent());
                                this.authorizationCommonService.setNextStepContent(this.data.nextStepsSection);
                                let retirementDatesContent = this.completedSuccessfullyDSService.getRetirementDatesContent();
                                if (retirementDatesContent !== undefined) {
                                    this.data.submittedSuccessfullySummary.summaryLastDay = retirementDatesContent.yourLastDayDate;
                                    this.data.submittedSuccessfullySummary.summaryBeginDate = retirementDatesContent.beginBenefitDate;
                                }
                                this.authorizationCommonService.setSummaryRequestContent(this.data.submittedSuccessfullySummary);
                            }
                        }
                    }
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.retirementElectionRestService.screenCaptureInit("authorization-required");
                })
            )
            .subscribe(
                (data) => {
                    if (data !== undefined && data !== null && data["body"] !== undefined) {
                        this.data = data["body"];
                    }
                    this.logger._debug(JSON.stringify(data), "Getting authorization required details successfully", LoggingConstants.INFO, "RetirementElection - authorization required - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in authorization required component response", LoggingConstants.ERROR, "RetirementElection - authorization required - Get Service");
                }
            );
    }

    /* istanbul ignore next */
    retriggerAuthMethod() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.source.subscribe(() => {
            if (this.loader && new Date() < this.stopCondition) {
                this.getAuthMethod();
            } else {
                this.loader = false;
                this.subscription.unsubscribe();
                this.subscription = null;
            }
        });
    }
    /* istanbul ignore next */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
    /* istanbul ignore next */
    getAuthMethod() {
        this.retirementElectionRestService.submittedSuccessfullyService().pipe(
            finalize(() => {
                if (this.authgetCallData !== null && this.authgetCallData !== undefined && this.authgetCallData?.isUCEClientSprtPdfPop && !this.authgetCallData?.isUCEClientNotSprtPdfPopDbelecKit && this.authgetCallData?.submittedSuccessfullyFollowUps && this.authgetCallData?.submittedSuccessfullyFollowUps !== undefined && this.authgetCallData?.submittedSuccessfullyFollowUps !== null && this.authgetCallData?.submittedSuccessfullyFollowUps?.authorizationFormDetails && this.authgetCallData?.submittedSuccessfullyFollowUps?.authorizationFormDetails !== undefined && this.authgetCallData?.submittedSuccessfullyFollowUps?.authorizationFormDetails != null && this.authgetCallData?.submittedSuccessfullyFollowUps?.confirmationStatementDetails && this.authgetCallData?.submittedSuccessfullyFollowUps?.confirmationStatementDetails !== undefined && this.authgetCallData?.submittedSuccessfullyFollowUps?.confirmationStatementDetails !== null && !this.authgetCallData?.isPdfPopRetryNeeded) {
                    this.loader = false;
                    this.data.submittedSuccessfullyFollowUps = this.authgetCallData.submittedSuccessfullyFollowUps;
                    this.subscription.unsubscribe();
                    this.subscription = null;
                } else if (this.authgetCallData?.isUCEClientSprtPdfPop && !this.authgetCallData?.isUCEClientNotSprtPdfPopDbelecKit && this.authgetCallData?.submittedSuccessfullyFollowUps && this.authgetCallData?.submittedSuccessfullyFollowUps !== undefined && this.authgetCallData?.submittedSuccessfullyFollowUps !== null && this.authgetCallData?.submittedSuccessfullyFollowUps?.authorizationFormDetails === undefined && this.authgetCallData?.submittedSuccessfullyFollowUps?.confirmationStatementDetails === undefined && this.authgetCallData?.isPdfPopRetryNeeded) {
                    this.loader = true;
                    this.retriggerAuthMethod();
                }
            }),
        ).subscribe(
            (authgetCallData: any) => {
                if (authgetCallData !== undefined && authgetCallData !== null && authgetCallData["body"] !== undefined) {
                    this.authgetCallData = authgetCallData["body"];
                }
                this.logger._debug(JSON.stringify(authgetCallData), "Getting authorization required details successfully", LoggingConstants.INFO, "RetirementElection - authorization required - Retrigger Get Service");
            },
            (error) => {
                this.logger._error(JSON.stringify(error), "Error in authorization required component response", LoggingConstants.ERROR, "RetirementElection - authorization required - Retrigger Get Service");
            });
    }


    authToggleAll() {
        this.reviewPensionChoicesService.expandPageSubject.next(true);
    }

    printText() {
        this.retirementElectionRestService.getCommonContent()
            .subscribe(
                (data) => {
                    this.printButtonText = data[0]["asset"]["DB_ELEC_FLOW_AG"]["DB_ELEC_PRINT_TEXT"]["assetValue"];
                }
            );
    }

    getAccountLockData(value: any) {
        this.idbService.getRecordFromObjStore("retirementLockStatusWidget", "isAcctLockServiceComp").pipe(
            finalize(() => {
                if (this.accLockServiceStatus && this.accLockServiceStatus !== null && this.accLockServiceStatus !== undefined) {
                    this.idbService.getRecordFromObjStore("retirementLockStatusWidget", "retirementLockStatus").subscribe((AcctLockData: any) => {
                        this.logger._debug("AcctLockData: " + this.rtrAccLockData, "RetirementAccountLock response retrived from indexDB", LoggingConstants.INFO, "RetirementElectionWidget - Submitted Successful Component");
                        if (AcctLockData.value.status.statusCode === 200) {
                            this.rtrAccLockData = AcctLockData.value;
                        } else {
                            this.logger._error("AcctLockData: " + this.rtrAccLockData, "RetirementAccountLock response retrived from indexDB", LoggingConstants.ERROR, "RetirementElectionWidget - Submitted Successful Component");
                        }
                    });
                }
            })
        ).subscribe(isAcctLockServiceComp => {
            this.accLockServiceStatus = isAcctLockServiceComp;
            this.logger._debug(this.accLockServiceStatus, "RetirementAccountLock service call status retrived from indexDB", LoggingConstants.INFO, "RetirementElectionWidget -Submitted Successful Component");
        });
    }
}

