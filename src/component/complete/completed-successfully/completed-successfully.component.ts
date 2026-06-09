import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { ReviewPensionChoicesService } from "../../../services/review-pension-choices.service";
import { AuthorizationCommonService } from "../../../services/authorization-common.service";
import { StepsActiveIndexService } from "../../../services/steps-active-index-service";
import { CompletedSuccessfullyDSService } from "../../../services/completed-successfully-data-save.service";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";
import { finalize } from "rxjs";
import { LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, DomStorageFallbackService, IDBService, AppUtility } from "@alight/core-utilities-lib";
import { RightSideContentService } from "../../../services/right-side-content.service";
import { FootnoteService } from "../../../services/footnote-common.service";

@Component({
    selector: "al-completed-successfully",
    templateUrl: "./completed-successfully.component.html"
})
export class CompletedSuccessfullyComponent implements OnInit {
    @Input() isDbCashoutFlag: boolean;
    @Input() isDbNQFlag: boolean;
    @ViewChild("display") display: any;
    data: any;
    checkResponse = false;
    showError = true;
    additionalBeneficiaryText = false;
    printButtonText: any;
    retirementDatesContent: any;
    ViewRhrComponents = new ViewRhrComponentsModel();

    accLockServiceStatus: any;
    rtrAccLockData: any;
    pageInputParam: string;
    @ViewChild("rtrAcctLock", { static: true }) rtrAcctLock;

    constructor(
        private retirementElectionRestService: RetirementElectionRestService,
        private appUtility: AppUtility,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private stepsActiveIndexService: StepsActiveIndexService,
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
        if (!this.isDbCashoutFlag && !this.isDbNQFlag) {
            this.pageInputParam = "UPNRH";
            this.dynamicComponentService.loadScript("retirement-accountlockstatus-wc", "retirement-accountlockstatus-wc");
            let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
            this.dynamicComponentService.initializePageComponents();
            this.retirementElectionRestService.getQueryParameters();
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
                this.getCompletedSuccessfullyData(this.isDbCashoutFlag, this.isDbNQFlag);
            } else {
                this.checkResponse = true;
            }
        } else {
            this.retirementElectionRestService.screenCapture(true);
            this.getCompletedSuccessfullyData(this.isDbCashoutFlag, this.isDbNQFlag);
        }
    }
    getAccountLockData(value: any) {
        this.idbService.getRecordFromObjStore("retirementLockStatusWidget", "isAcctLockServiceComp").pipe(
            finalize(() => {
                if (this.accLockServiceStatus && this.accLockServiceStatus !== null && this.accLockServiceStatus !== undefined) {
                    this.idbService.getRecordFromObjStore("retirementLockStatusWidget", "retirementLockStatus").subscribe((AcctLockData: any) => {
                        this.logger._debug("AcctLockData: " + this.rtrAccLockData, "RetirementAccountLock response retrived from indexDB", LoggingConstants.INFO, "RetirementElectionWidget - Completed Successful  Component");
                        if (AcctLockData.value.status.statusCode === 200) {
                            this.rtrAccLockData = AcctLockData.value;
                        } else {
                            this.logger._error("AcctLockData: " + this.rtrAccLockData, "RetirementAccountLock response retrived from indexDB", LoggingConstants.ERROR, "RetirementElectionWidget - Completed Successful  Component");
                        }
                    });
                }
            })
        ).subscribe(isAcctLockServiceComp => {
            this.accLockServiceStatus = isAcctLockServiceComp;
            this.logger._debug(this.accLockServiceStatus, "RetirementAccountLock service call status retrived from indexDB", LoggingConstants.INFO, "RetirementElectionWidget - Completed Successful Component");
        });
    }
    /* istanbul ignore next */
    getCompletedSuccessfullyData(isCashoutFlag: boolean, isDbNQFlag: boolean) {
        this.retirementElectionRestService.completedSuccessfullyService(isCashoutFlag, isDbNQFlag)
            .pipe(
                finalize(() => {
                    this.checkResponse = true;
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                            let responseStatusCode = this.data.status.statusCode;
                            if (responseStatusCode === 200) {
                                this.domFBService.setItem("isDBEleclFlowComp", true, "sessionStorage", true);
                                this.showError = false;
                                document.title = this.data.submittedSuccessfullyHeader.pageNameText;
                                document.getElementsByTagName("title")[0].innerHTML = this.data.submittedSuccessfullyHeader.pageNameText;
                                if (this.isDbCashoutFlag || this.isDbNQFlag) {
                                    let savedData = this.domFBService.getItem("reviewPageData", "sessionStorage", true);
                                    if (savedData !== undefined && savedData !== null) {
                                        savedData = JSON.parse(savedData);
                                        this.completedSuccessfullyDSService.savePaymentElections(savedData.paymentElections);
                                        this.reviewPensionChoicesService.setPaymentReviewList(this.completedSuccessfullyDSService.getPaymentElections());
                                        if (this.isDbNQFlag) {
                                            this.googleAnalyticsService.postGACustomPageTracking("dbNQRetirementComplete", "DB Retirement Flow - NQ");
                                            this.authorizationCommonService.setNextStepContent(this.data.nextStepsSection);
                                        } else {
                                            this.retirementElectionRestService.gaPageTracking(window.location.href);
                                        }
                                    }
                                } else {
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices180CpltPage");
                                    this.footnoteService.setFootnoteData(this.data.footnoteContent);
                                    this.reviewPensionChoicesService.setPaymentReviewList(this.completedSuccessfullyDSService.getPaymentElections());
                                    this.reviewPensionChoicesService.setBeneficiaryContent(this.completedSuccessfullyDSService.getBeneficiaryContent());
                                    this.reviewPensionChoicesService.setDeferredBenefitsContent(this.completedSuccessfullyDSService.getDeferredBenefitsContent());
                                    this.authorizationCommonService.setNextStepContent(this.data.nextStepsSection);
                                }

                                if (this.completedSuccessfullyDSService.getRetirementDatesContent() !== undefined) {
                                    this.retirementDatesContent = this.completedSuccessfullyDSService.getRetirementDatesContent();
                                    this.data.submittedSuccessfullySummary.summaryLastDay = this.retirementDatesContent.yourLastDayDate;
                                    this.data.submittedSuccessfullySummary.summaryBeginDate = this.retirementDatesContent.beginBenefitDate;
                                }
                                if (this.isDbCashoutFlag || this.isDbNQFlag) {
                                    let dbcnqProgressbarData = this.data.progressBarInfo;
                                    let dbcnqRightRailData = this.data.tiles;
                                    if (this.isDbCashoutFlag) {
                                        this.retirementElectionRestService.setProgressbarData(dbcnqProgressbarData.pageTitle, 4, dbcnqProgressbarData.ofLabel, dbcnqProgressbarData.stepDetail);
                                    } else {
                                        this.retirementElectionRestService.setProgressbarData(dbcnqProgressbarData.pageTitle, 5, dbcnqProgressbarData.ofLabel, dbcnqProgressbarData.stepDetail);
                                    }
                                    this.retirementElectionRestService.setRightRailData(dbcnqRightRailData.iraChecklist, dbcnqRightRailData.questions, true, false, false);
                                    sessionStorage.removeItem("isCashoutChngDstrPmtReq");
                                }
                                this.authorizationCommonService.setSummaryRequestContent(this.data.submittedSuccessfullySummary);
                            }
                        }
                    }
                    if (this.retirementElectionRestService.isActivePBEnabled) {
                        this.appUtility.notifyinitConfigSubscribers(false);
                    }
                    this.retirementElectionRestService.screenCaptureInit("authorization-complete");
                })
            )
            .subscribe(
                (data) => {
                    if (data !== undefined && data !== null && data["body"] !== undefined) {
                        this.data = data["body"];
                    }
                    this.logger._debug(JSON.stringify(data), "Getting authorization complete details successfully", LoggingConstants.INFO, "RetirementElection - authorization complete - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in authorization complete component response", LoggingConstants.ERROR, "RetirementElection - authorization complete - Get Service");
                });
    }
    /* istanbul ignore next */
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
}
