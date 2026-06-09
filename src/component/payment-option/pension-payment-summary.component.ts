import { Component, ViewChild, OnInit, Input, HostListener, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { finalize, interval, Subscription } from "rxjs";
import { AlPanelSectionService } from "../../services/al-panel-section.service";
import { EditMessagesService } from "../../services/edit-messages.service";
import { IntegrationCpoPpsService } from "../../services/integration-cpo-pps.service";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { SavePpsDataService } from "../../services/save-pps-data.service";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { AlTipsAlertComponent, UISafePipe, LoggingConstants, LoggingService, DynamicComponentService, CacheStorageService, GoogleAnalyticsService, IDBService, AlLoaderComponent, AppUtility } from "@alight/core-utilities-lib";
import { ReviewPensionChoicesService } from "../../services/review-pension-choices.service";
import { RightSideContentService } from "../../services/right-side-content.service";
import { ViewRhrComponentsModel } from "../shared/models/view-rhr-components.model";
import { DeferredSuccessfullyDSService } from "../../services/deferred-successfully-data-save.service";
import { FootnoteComponent } from "../shared/footnote-common/footnote-common-component";
import { FootnoteService } from "../../services/footnote-common.service";
import { ProgressBarPopoverDataCacheService } from "../../services/progressBarPopoverDataCache.service";

// declare var require:any;

@Component({
    selector: "al-pension-payment-summary",
    templateUrl: "./pension-payment-summary.component.html",
    providers: [AlLoaderComponent]
})


export class PensionPaymentSummaryComponent implements OnInit, OnDestroy {
    data: any;
    selectedRow: Number;
    planidlist: any;
    cpoResponse: any;
    allowContinue = false;
    checkresponse = false;
    annualtotalAmt = 0;
    onetimetotalAmt = 0;
    monthlytotalAmt = 0;
    quarterlytotalAmt = 0;
    semimonthlytotalAmt = 0;
    mocked: string;
    dataFromService: any;
    dataFromServiceFlag = false;
    queryParameters: any;
    warningEditsData: any;
    responseData: any;
    showError = true;
    assetGroups: any;
    assetGroup: any;
    printButtonText: any;
    saveApiRequestBody: any;
    paymentOptionId: any;
    rawSaveResponseData: any;
    businessProcessReferenceId: any;
    isPlanElectionDeferred: any;
    deferredFlag = false;
    routeToPageLocation: any;
    r: any;
    isBackButton = false;
    ViewRhrComponents = new ViewRhrComponentsModel();
    rawGetResponseData: any;
    @ViewChild("display") display: any;
    @ViewChild(FootnoteComponent, { static: false }) childFootnote: FootnoteComponent;
    hassTBAEdit = false;
    notOnFileData: any;
    benefitItem: any;
    notOnArry: any;
    isOpFmMatrixEligible = false;
    isPaymentOptionAvailable = false;
    showQuitButton = true;
    showCBLButton = true;
    defaultLocale = true;


    @Input() isDbCashoutFlag: boolean;
    ppsgetCallData: any;
    loader = false;
    pdfNotAvailable = true;
    retriggerFlag: boolean;
    private subscription: Subscription;
    loadingText: any;
    plsWaitText: any;
    uploadText: any;
    pdfDeliverText: any;
    pdfNotAvailableText: any;
    kitInformation: any;
    source: any;
    stopCondition: Date;
    pdfSecureMailBoxText: any;
    constructor(private router: Router,
        private retirementElectionRestService: RetirementElectionRestService,
        private appUtility: AppUtility,
        private integrationCpoPpsService: IntegrationCpoPpsService,
        private alPanelSectionService: AlPanelSectionService,
        private savePpsDataService: SavePpsDataService,
        private editMessagesService: EditMessagesService,
        private stepsActiveIndexService: StepsActiveIndexService,
        private loading: AlLoaderComponent,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private location: Location,
        private logger: LoggingService,
        private rightSideContentService: RightSideContentService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private deferredSuccessfullyDSService: DeferredSuccessfullyDSService,
        private footnoteService: FootnoteService,
        private cacheService: CacheStorageService,
        private IDBService: IDBService,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService
    ) {
        this.ViewRhrComponents.viewPplLikemeComp = true;
        this.ViewRhrComponents.viewComparePoComp = true;
        this.ViewRhrComponents.viewDocAndResComp = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }
    /* istanbul ignore next */
    ngOnInit() {
        this.checkDefaultAmtFormat();
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(3);
        } else {
            this.stepsActiveIndexService.setStepIndex(4);
        }
        // this.stepsActiveIndexService.setStepIndex(4);
        this.dynamicComponentService.initializePageComponents();
        this.rightSideContentService.setParamIDs(0, 0);
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        if (isCallBackAllowed) {
            if (!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if (!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            this.isBackButton = this.reviewPensionChoicesService.getBackButton();
            this.retirementElectionRestService.getQueryParameters();
            this.dataFromService = this.savePpsDataService.getPpsData();
            if (this.retirementElectionRestService.isActivePBEnabled) {
                this.getProgressBarPopOverDataFromIDB();
            } else {
                this.pensionPaymentSummaryData();
            }
            this.source = interval(10000);
            this.stopCondition = new Date(Date.now() + 60000);
            this.retirementElectionRestService.screenCapture(true);
            this.retriggerPpsMethod();
        } else {
            this.checkresponse = true;
        }
        this.setDbOpfmMatrixStore();
        this.getRelativePlanIdData();
    }
    /* istanbul ignore next */
    getRelativePlanIdData() {
        this.retirementElectionRestService.getConfigurationData().subscribe((data) => {
            if (data && data[0]) {
                if (data[0]["expr"]["FEAT_SWITCH_UPN_DB_ELEC_HIDE_REL_VL"] !== undefined && data[0]["expr"]["FEAT_SWITCH_UPN_DB_ELEC_HIDE_REL_VL"] !== null) {
                    sessionStorage.setItem("relativeValueswitch", data[0]["expr"]["FEAT_SWITCH_UPN_DB_ELEC_HIDE_REL_VL"]);
                }

                if (data[0]["text"]["RL_VAL_PLAN_ID_LIST_TXT"] !== undefined && data[0]["text"]["RL_VAL_PLAN_ID_LIST_TXT"] !== null) {
                    sessionStorage.setItem("relativePlanIdArray", data[0]["text"]["RL_VAL_PLAN_ID_LIST_TXT"]);
                }
                if (data[0]["text"]["PDF_POP_UP_PPS_LOADING_HEADER_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_PPS_LOADING_HEADER_TXT"] !== null) {
                    this.loadingText = data[0]["text"]["PDF_POP_UP_PPS_LOADING_HEADER_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_PPS_LOADING_SUB_HEADER2_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_PPS_LOADING_SUB_HEADER2_TXT"] !== null) {
                    this.plsWaitText = data[0]["text"]["PDF_POP_UP_PPS_LOADING_SUB_HEADER2_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_PPS_LOADING_SUB_HEADER1_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_PPS_LOADING_SUB_HEADER1_TXT"] !== null) {
                    this.kitInformation = data[0]["text"]["PDF_POP_UP_PPS_LOADING_SUB_HEADER1_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_UPLOADING_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_UPLOADING_TXT"] !== null) {
                    this.uploadText = data[0]["text"]["PDF_POP_UP_UPLOADING_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_HEADER_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_HEADER_TXT"] !== null) {
                    this.pdfDeliverText = data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_HEADER_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER1_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER1_TXT"] !== null) {
                    this.pdfNotAvailableText = data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER1_TXT"];
                }
                if (data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER2_TXT"] !== undefined && data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER2_TXT"] !== null) {
                    this.pdfSecureMailBoxText = data[0]["text"]["PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER2_TXT"];
                }
            }
        },
        err => {
        });
    }
    @HostListener("window:popstate", ["$event"])
    onPopState(event) {
        /* istanbul ignore next */
        if (this.isOpFmMatrixEligible) {
            this.setNeededPPSFields();
        }
    }
    /* istanbul ignore next */
    checkDefaultAmtFormat() {
        let locale = this.retirementElectionRestService.getLocale();
        this.defaultLocale = this.retirementElectionRestService.isDefaultLocale(locale);
    }

    /* istanbul ignore next */
    setDbOpfmMatrixStore() {
        let dbObjStoreName = "dbOpfmMatrixStore";
        let dbStorage = this.IDBService.getDBName();
        if (dbStorage && dbObjStoreName && !dbStorage.objectStoreNames.contains(dbObjStoreName)) {
            this.cacheService.setItem("PPSPlanData", "", dbObjStoreName)
                .subscribe((res: any) => {
                    this.logger._debug(JSON.stringify(res), "PPS Plan data Updated for opfm matrix", LoggingConstants.INFO, "RetirementElection - PPS - setDbOpfmMatrixStore");
                });
        }
    }

    /* istanbul ignore next */
    showFootnoteSup() {
        this.childFootnote.showFootnote(event);
    }



    /* istanbul ignore next */
    pensionPaymentSummaryData() {
        this.dataFromService = this.savePpsDataService.getPpsData();
        if (this.dataFromService === undefined) {
            this.retirementElectionRestService.pensionPaymentSummaryService()
                .pipe(
                    finalize(() => {
                        this.pdfNotAvailable = false;
                        this.retriggerFlag = true;
                        this.checkresponse = true;
                        if (this.data !== null && this.data !== undefined) {
                            /* Currently status code is not returned in this service
              if(this.data.responseStatus !== undefined && this.data.responseStatus.statusCode !== undefined) {
                let responseStatusCode = this.data.responseStatus.statusCode;
                if(responseStatusCode === 200) { */
                            if (this.data.isPPORetirementSupported === true) {
                                this.ViewRhrComponents.viewPplLikemeComp = false;
                                this.ViewRhrComponents.viewComparePoComp = false;
                            }
                            if (this.data?.isUCEClientSprtPdfPop && this.data?.isUCEClientSprtPdfPopRtrmKit && this.data?.isPdfPopRetryNeeded && this.data?.retirementKitPdfContent && this.data?.retirementKitPdfContent !== undefined && this.data?.retirementKitPdfContent != null && this.data?.retirementKitPdfContent?.retirementKitPdfForms && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== null && Object.keys(this.data?.retirementKitPdfContent?.retirementKitPdfForms).length === 0) {
                                this.loader = true;
                            }
                            this.showError = false;
                            this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices090OpfmSumPage");
                            document.title = this.data.pageTitle;
                            this.rightSideContentService.setCalcRefNum(this.data.calculationReferenceNumber);
                            this.rightSideContentService.setCalcFrmSupportFlag(this.data.areCalculationFormulasSupported);
                            this.addTotals();
                            this.savePpsDataService.setPpsData(this.data);
                            this.footnoteService.setFootnoteData(this.data.footnoteContent);
                            this.alPanelSectionService.setPanelList(this.data.paymentChoicePanelList);
                            this.cpoResponse = this.integrationCpoPpsService.getData();
                            this.deferredSuccessfullyDSService.setPlanList(this.data.planList);
                            if (this.data.hasOpfmMatrixEligCd && this.data.isOpFmMatrixEligible) {
                                this.isOpFmMatrixEligible = true;
                                this.checkForPaymentOptions();
                            }
                            /* if(this.isOpFmMatrixEligible) {
                    this.cacheService.setItem('PPSPlanData', this.data.planList, 'dbOpfmMatrixStore')
                    .subscribe((res: any) => {
                    });
                  } */
                            if (this.data.flowButtonNavigation !== undefined && this.data.flowButtonNavigation.editButtonList !== undefined) {
                                let editButtonList = this.data.flowButtonNavigation.editButtonList;
                                if (editButtonList.length !== 0) {
                                    this.editMessagesService.editButtonListSubject.next(editButtonList);
                                }
                            }
                            if (this.cpoResponse !== undefined) {
                                this.updatePaymentOption();
                                this.addTotals();
                            }
                            if (this.retirementElectionRestService.isActivePBEnabled && this.data.progressBarPopovers !== undefined && this.data.progressBarPopovers !== null) {
                                this.retirementElectionRestService.getProgressBarPopoverContent(this.data.progressBarPopovers);
                            }
                        }
                        if (this.retirementElectionRestService.isActivePBEnabled) {
                            this.appUtility.notifyinitConfigSubscribers(true);
                        }
                        this.retirementElectionRestService.screenCaptureInit("pension-payment-summary");
                        /*   }
            } */
                    }),
                ).subscribe(
                    (data: any) => {
                        if (data !== undefined && data !== null && data["body"] !== undefined) {
                            this.rawGetResponseData = data;
                            this.data = data["body"];
                        }
                        this.logger._debug(JSON.stringify(data), "Getting PPS details successfully", LoggingConstants.INFO, "RetirementElection - PPS - Get Service");
                    },
                    /* istanbul ignore next */
                    (error) => {
                        if (this.retirementElectionRestService.isActivePBEnabled) {
                            this.appUtility.notifyinitConfigSubscribers(false);
                        }
                        this.logger._error(JSON.stringify(error), "Error in PPS component response", LoggingConstants.ERROR, "RetirementElection - PPS - Get Service");
                    }
                );
        } else {
            this.savePpsDataService.getPpsData()
                .pipe(
                    finalize(() => {
                        if (this.data !== null && this.data !== undefined && this.data?.isUCEClientSprtPdfPop && this.data?.isUCEClientSprtPdfPopRtrmKit && this.data?.retirementKitPdfContent && this.data?.retirementKitPdfContent !== undefined && this.data?.retirementKitPdfContent !== null && this.data?.retirementKitPdfContent?.retirementKitPdfForms && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== null && Object.keys(this.data?.retirementKitPdfContent?.retirementKitPdfForms).length === 0) {
                            this.pdfNotAvailable = false;
                            this.retriggerFlag = true;
                            this.loader = true;
                        } else if (this.data !== null && this.data !== undefined && this.data?.isUCEClientSprtPdfPop && this.data?.isUCEClientSprtPdfPopRtrmKit && this.data?.retirementKitPdfContent?.retirementKitPdfForms && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.data?.retirementKitPdfContent?.retirementKitPdfForms != null && Object.keys(this.data?.retirementKitPdfContent?.retirementKitPdfForms).length > 0) {
                            this.loader = false;
                            this.pdfNotAvailable = false;
                            this.retriggerFlag = false;
                        }
                        this.checkresponse = true;
                        if (this.data !== null && this.data !== undefined) {
                            if (this.data.isPPORetirementSupported === true) {
                                this.ViewRhrComponents.viewPplLikemeComp = false;
                                this.ViewRhrComponents.viewComparePoComp = false;
                            }
                            this.showError = false;
                            this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices090OpfmSumPage");
                            document.title = this.data.pageTitle;
                            if (this.data.hasOpfmMatrixEligCd && this.data.isOpFmMatrixEligible) {
                                this.isOpFmMatrixEligible = true;
                            }
                            /* if(this.isOpFmMatrixEligible) {
                this.cacheService.setItem('PPSPlanData', this.data.planList, 'dbOpfmMatrixStore')
                .subscribe((res: any) => {
                });
              } */
                            this.addTotals();
                            this.footnoteService.setFootnoteData(this.data.footnoteContent);
                            this.alPanelSectionService.setPanelList(this.data.paymentChoicePanelList);
                            this.cpoResponse = this.integrationCpoPpsService.getData();
                            if (this.cpoResponse !== undefined) {
                                this.updatePaymentOption();
                                this.addTotals();
                            }
                        }
                        if (this.retirementElectionRestService.isActivePBEnabled) {
                            this.appUtility.notifyinitConfigSubscribers(true);
                        }
                        this.retirementElectionRestService.screenCaptureInit("pension-payment-summary");
                    }),
                ).subscribe(
                    (data: any) => {
                        if (data !== undefined && data !== null) {
                            this.data = data;
                        }
                        this.logger._debug(JSON.stringify(data), "Getting PPS details successfully", LoggingConstants.INFO, "RetirementElection - PPS - Save Service");
                    },

                    (error) => {
                        if (this.retirementElectionRestService.isActivePBEnabled) {
                            this.appUtility.notifyinitConfigSubscribers(false);
                        }
                        this.logger._error(JSON.stringify(error), "Error in PPS component response", LoggingConstants.ERROR, "RetirementElection - PPS - Save Service");
                    }
                );
        }
        window.scrollTo(0, 0);
    }
    /* istanbul ignore next */
    isRetirementKitPdfAvailable(): boolean {
        return this.data?.isUCEClientSprtPdfPop && this.data?.isUCEClientSprtPdfPopRtrmKit && this.data?.retirementKitPdfContent && !!this.data?.retirementKitPdfContent;
    }
    /* istanbul ignore next */
    retriggerPpsMethod() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.source.subscribe(() => {
            if (this.loader && new Date() < this.stopCondition) {
                this.getPpsMethod();
            } else {
                this.subscription.unsubscribe();
                this.subscription = null;
                this.loader = false;
                this.retriggerFlag = false;
                if (this.data?.retirementKitPdfContent && this.data?.retirementKitPdfContent !== undefined && this.data?.retirementKitPdfContent !== null && this.data?.retirementKitPdfContent?.retirementKitPdfForms && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== null && Object.keys(this.data?.retirementKitPdfContent?.retirementKitPdfForms).length === 0) {
                    this.pdfNotAvailable = true;
                } else if (this.data?.retirementKitPdfContent && this.data?.retirementKitPdfContent !== undefined && this.data?.retirementKitPdfContent !== null && this.data?.retirementKitPdfContent?.retirementKitPdfForms && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.data?.retirementKitPdfContent?.retirementKitPdfForms !== null && Object.keys(this.data?.retirementKitPdfContent?.retirementKitPdfForms).length > 0) {
                    this.pdfNotAvailable = false;
                }
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
    getPpsMethod() {
        if (this.retriggerFlag) {
            this.retirementElectionRestService.pensionPaymentSummaryService().pipe(
                finalize(() => {
                    if (this.ppsgetCallData != null && this.ppsgetCallData !== undefined && this.ppsgetCallData?.isUCEClientSprtPdfPop && this.ppsgetCallData?.isUCEClientSprtPdfPopRtrmKit && this.ppsgetCallData?.isPdfPopRetryNeeded && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms !== null && Object.keys(this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms).length === 0) {
                        this.pdfNotAvailable = false;
                        this.retriggerPpsMethod();
                    } else if (!this.ppsgetCallData?.isPdfPopRetryNeeded && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms != null && Object.keys(this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms).length > 0) {
                        this.data.retirementKitPdfContent.retirementKitPdfForms = this.ppsgetCallData.retirementKitPdfContent.retirementKitPdfForms;
                        this.savePpsDataService.setPpsData(this.data);
                        this.loader = false;
                        this.pdfNotAvailable = false;
                        this.subscription.unsubscribe();
                        this.subscription = null;
                    } else if (!this.ppsgetCallData?.isPdfPopRetryNeeded && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms !== undefined && this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms !== null && Object.keys(this.ppsgetCallData?.retirementKitPdfContent?.retirementKitPdfForms).length === 0) {
                        this.loader = false;
                        this.pdfNotAvailable = true;
                        this.subscription.unsubscribe();
                        this.subscription = null;
                    }
                }),
            ).subscribe(
                (ppsgetCallData: any) => {
                    if (ppsgetCallData !== undefined && ppsgetCallData !== null && ppsgetCallData["body"] !== undefined) {
                        this.ppsgetCallData = ppsgetCallData["body"];
                    }
                    this.logger._debug(JSON.stringify(ppsgetCallData), "Getting PPS details successfully", LoggingConstants.INFO, "RetirementElection - PPS - Retrigger Get Service");
                },
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in PPS Retrigger component response", LoggingConstants.ERROR, "RetirementElection - PPS - Retrigger Get Service");
                });
        }
    }
    /* istanbul ignore next */
    downloadPDFFile(event: any, element) {
        this.businessProcessReferenceId = 0;
        this.retirementElectionRestService.getPdfPopService(element.mailBoxItemId, this.businessProcessReferenceId)
            .pipe(
                finalize(() => {
                    /* istanbul ignore next */
                    this.googleAnalyticsService.postGACustomEventTracking("Link", "Link Clicked", element.name);
                }),
            ).subscribe(
                (data: any) => {
                    if (data !== undefined && data !== null) {
                        this.retirementElectionRestService.downloadBlobFile(data, element.name, element.type);
                    }
                },
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in PDF", LoggingConstants.ERROR, "RetirementElection - PPS - ErrorPDF");
                }
            );

    }
    /* istanbul ignore next */
    setChosenGroupPlan(planListIndex, electionGroupListIndex, flagType) {
        let electionId;
        let selectedPlanList;
        let planListId;
        let chosenElectionGroupList;
        let electionGroupId;
        let deferredFlag;
        this.editMessagesService.editMessageFlagSubject.next(false);
        let chosenPlanList = this.data.planList[planListIndex];
        this.reviewPensionChoicesService.setBackButton(false);
        if (chosenPlanList && chosenPlanList.planId) {
            planListId = chosenPlanList.planId;
        }
        /* istanbul ignore next */
        if (chosenPlanList && chosenPlanList.electionGroupList) {
            chosenElectionGroupList = chosenPlanList.electionGroupList[electionGroupListIndex];
            if (chosenElectionGroupList && chosenElectionGroupList.elecGroupId) {
                electionGroupId = chosenElectionGroupList.elecGroupId;
            }
        }
        if (chosenElectionGroupList && chosenElectionGroupList.benefitList && chosenElectionGroupList.benefitList.length > 0) {
            electionId = chosenElectionGroupList.benefitList[0].elecId;
            // let electionId = chosenBenefitList.elecId;
            deferredFlag = chosenElectionGroupList.benefitList[0].isDeferred;
            selectedPlanList = chosenPlanList.electionGroupList.filter((item) => item.elecGroupId === electionGroupId);
        }
        this.integrationCpoPpsService.setChosenIds(planListId, electionGroupId, electionId, flagType, deferredFlag);
        this.integrationCpoPpsService.setChosenPlanDetails(selectedPlanList);
        this.retirementElectionRestService.onRouteDBElec("choose-category");
    }

    /* istanbul ignore next */
    setChosenPlan(planListIndex, electionGroupListIndex, benefitListIndex, flagType) {
        // this.editMessagesService.SetFlag(false);
        this.reviewPensionChoicesService.setBackButton(false);
        this.editMessagesService.editMessageFlagSubject.next(false);
        let chosenPlanList = this.data.planList[planListIndex];
        let planListId = chosenPlanList.planId;
        let chosenElectionGroupList = chosenPlanList.electionGroupList[electionGroupListIndex];
        let electionGroupId = chosenElectionGroupList.elecGroupId;
        let chosenBenefitList = chosenElectionGroupList.benefitList[benefitListIndex];
        let electionId = chosenBenefitList.elecId;
        let selectedPlanList;
        let deferredFlag = chosenBenefitList.isDeferred;
        selectedPlanList = chosenElectionGroupList.benefitList.filter((item) => item.elecId === electionId);
        this.integrationCpoPpsService.setChosenIds(planListId, electionGroupId, electionId, flagType, deferredFlag);
        this.integrationCpoPpsService.setChosenPlanDetails(selectedPlanList);
        if (this.data.calculationReferenceNumber !== undefined) {
            this.integrationCpoPpsService.setCalculationReferenceNumber(this.data.calculationReferenceNumber);
        }
        this.retirementElectionRestService.onRouteDBElec("choose-payment-option");
    }

    setMatrixPageDetails() {
        this.integrationCpoPpsService.setCalculationReferenceNumber(this.data.calculationReferenceNumber);
        this.setNeededPPSFields();
        this.retirementElectionRestService.onRouteDBElec("choose-payment-options-matrix");
    }
    setNeededPPSFields() {
        let tempPlanList = [];
        if (this.data !== null && this.data !== undefined && this.data.planList !== null && this.data.planList !== undefined) {
            for (let PlanList of this.data.planList) {
                /* istanbul ignore next */
                for (let electionGroupList of PlanList.electionGroupList) {
                    for (let benefitList of electionGroupList.benefitList) {
                        let data = {
                            "planId": PlanList.planId,
                            "elecGroupId": electionGroupList.elecGroupId,
                            "isDeferred": benefitList.isDeferred,
                            "opformGroupId": benefitList.opformGroupId,
                            "elecId": benefitList.elecId,
                            "paymentOptionId": null
                        };
                        if (benefitList.isDeferred !== true) {
                            if (benefitList.paymentOption) {
                                data.paymentOptionId = benefitList.paymentOption.paymentOptionId;
                            } else {
                                delete data.paymentOptionId;
                            }
                        } else {
                            delete data.paymentOptionId;
                        }
                        tempPlanList.push(data);
                    }
                }
            }
        }
        this.cacheService.setItem("PPSPlanData", tempPlanList, "dbOpfmMatrixStore")
            .subscribe((res: any) => {
                this.logger._debug(JSON.stringify(res), "PPS Plan data Updated for opfm matrix", LoggingConstants.INFO, "RetirementElection - PPS - setNeededPPSFields");
            });
    }
    /* istanbul ignore next */
    updatePaymentOption() {
        if (this.isOpFmMatrixEligible) {
            /* Matrix page enabled
      PPS integration needs to be implemented */
            let matrixData = this.integrationCpoPpsService.getData();
            if (matrixData !== undefined && Array.isArray(matrixData)) {
                matrixData.forEach(paymentOptionItem => {
                    this.updateMatrixOptions(paymentOptionItem);
                });
            }
            this.isPaymentOptionAvailable = true;
        } else {
            // CPO and Category pages
            let ppsDataId = this.integrationCpoPpsService.getChosenIds();
            let cpoData = this.integrationCpoPpsService.getData();
            if (ppsDataId !== undefined) {
                if (ppsDataId.UpnPpsflow) {
                    for (let i = 0; i < this.data.planList.length; i++) {
                        let planlist = this.data.planList[i];
                        if (planlist.planId === ppsDataId.planId) {
                            /* istanbul ignore next */
                            for (let j = 0; j < planlist.electionGroupList.length; j++) {
                                let electionGroupList = planlist.electionGroupList[j];
                                if (electionGroupList.elecGroupId === ppsDataId.electionGroupId) {
                                    for (let k = 0; k < electionGroupList.benefitList.length; k++) {
                                        let benefitList = electionGroupList.benefitList[k];
                                        if (benefitList.elecId === ppsDataId.ElectionId) {
                                            for (let m = 0; m < cpoData.length; m++) {
                                                if (cpoData[m].opformGroupId === benefitList.opformGroupId) {
                                                    this.data.planList[i].electionGroupList[j].benefitList[k] = cpoData[m];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.data.planList.length; i++) {
                        let planlist = this.data.planList[i];
                        if (planlist.planId === ppsDataId.planId) {
                            /* istanbul ignore next */
                            for (let j = 0; j < planlist.electionGroupList.length; j++) {
                                let electionGroupList = planlist.electionGroupList[j];
                                if (electionGroupList.elecGroupId === ppsDataId.electionGroupId) {
                                    electionGroupList.benefitList = cpoData;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.savePpsDataService.setPpsData(this.data);
    }
    /* istanbul ignore next */
    deferEachFunc(id) {
        let deferEachList = this.data.planList[id];
        for (let s = 0; s < deferEachList.electionGroupList.length; s++) {
            let deferEachGroupList = deferEachList.electionGroupList[s];
            for (let w = 0; w < deferEachGroupList.benefitList.length; w++) {
                let deferAllSetData = deferEachGroupList.benefitList[w];
                deferAllSetData.isDeferred = true;
            }
            if (deferEachGroupList.displayElecGroup && deferEachGroupList.benefitList.length === 0) {
                deferEachGroupList.benefitList = deferEachGroupList.defaultElectionGroupDeferredElection.filter((item) => item.isDeferred === true);
            }
        }
        this.addTotals();
    }
    /* istanbul ignore next */
    deferAllFunc() {
        for (let r = 0; r < this.data.planList.length; r++) {
            let deferAllList = this.data.planList[r];
            for (let s = 0; s < deferAllList.electionGroupList.length; s++) {
                let deferAllGroupList = deferAllList.electionGroupList[s];
                for (let w = 0; w < deferAllGroupList.benefitList.length; w++) {
                    let deferAllSetData = deferAllGroupList.benefitList[w];
                    deferAllSetData.isDeferred = true;
                }
                if (deferAllGroupList.displayElecGroup && deferAllGroupList.benefitList.length === 0) {
                    deferAllGroupList.benefitList = deferAllGroupList.defaultElectionGroupDeferredElection.filter((item) => item.isDeferred === true);
                }
            }
        }
        this.addTotals();
    }



    /* istanbul ignore next */
    addTotals() {
        this.annualtotalAmt = 0;
        this.onetimetotalAmt = 0;
        this.monthlytotalAmt = 0;
        this.quarterlytotalAmt = 0;
        this.semimonthlytotalAmt = 0;
        for (let t = 0; t < this.data.planList.length; t++) {
            let deferallgroup = this.data.planList[t];
            for (let s = 0; s < deferallgroup.electionGroupList.length; s++) {
                let deferallModifiedData = deferallgroup.electionGroupList[s];
                for (let w = 0; w < deferallModifiedData.benefitList.length; w++) {
                    let deferallSetData = deferallModifiedData.benefitList[w];
                    if (!deferallSetData.isDeferred) {
                        if (deferallSetData.paymentOption) {
                            let deferTotalFrequency = deferallSetData.paymentOption.labelFrequencyId;
                            let TotalAmount = deferallSetData.paymentOption.paymentOptionToYouAmt;
                            let floatedValue = this.defaultLocale ? Number(TotalAmount.replace(/[^0-9\.]+/g, "")) : parseFloat(TotalAmount.replaceAll(",", ".").replace(/[^0-9\.]+/g, ""));
                            if (!isNaN(floatedValue)) {
                                if (deferTotalFrequency === "L") {
                                    this.onetimetotalAmt += floatedValue;
                                } else if (deferTotalFrequency === "A") {
                                    this.annualtotalAmt += floatedValue;
                                } else if (deferTotalFrequency === "S") {
                                    this.semimonthlytotalAmt += floatedValue;
                                } else if (deferTotalFrequency === "M") {
                                    this.monthlytotalAmt += floatedValue;
                                } else if (deferTotalFrequency === "Q") {
                                    this.quarterlytotalAmt += floatedValue;
                                }
                            }

                            if (deferallSetData.paymentOption.autoSelectedFormsOfPaymentList) {
                                /* istanbul ignore next */
                                for (let y = 0; y < deferallSetData.paymentOption.autoSelectedFormsOfPaymentList.length; y++) {
                                    let deferallAutoSetData = deferallSetData.paymentOption.autoSelectedFormsOfPaymentList[y];
                                    let deferTotalFrequencyAuto = deferallAutoSetData.labelFrequencyId;
                                    let TotalAmountAuto = deferallAutoSetData.autoSelectedPaymentToYouAmt;
                                    let floatedValueAuto = this.defaultLocale ? Number(TotalAmountAuto.replace(/[^0-9\.]+/g, "")) : parseFloat(TotalAmountAuto.replaceAll(",", ".").replace(/[^0-9\.]+/g, ""));
                                    if (!isNaN(floatedValueAuto)) {
                                        if (deferTotalFrequencyAuto === "L") {
                                            this.onetimetotalAmt += floatedValueAuto;
                                        } else if (deferTotalFrequencyAuto === "A") {
                                            this.annualtotalAmt += floatedValueAuto;
                                        } else if (deferTotalFrequency === "S") {
                                            this.semimonthlytotalAmt += floatedValueAuto;
                                        } else if (deferTotalFrequencyAuto === "M") {
                                            this.monthlytotalAmt += floatedValueAuto;
                                        } else if (deferTotalFrequencyAuto === "Q") {
                                            this.quarterlytotalAmt += floatedValueAuto;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.savePpsDataService.setPpsData(this.data);
    }

    /* istanbul ignore next */
    redirectNext(buttonActionType) {
        this.retirementElectionRestService.removeSystemTickets();
        this.reviewPensionChoicesService.setBackButton(false);
        this.allowContinue = false;
        this.editMessagesService.editMessageFlagSubject.next(false);
        let throwException = {};
        if (buttonActionType) {
            try {
                for (let i = 0; i < this.data.planList.length; i++) {
                    let ppsPlanId = this.data.planList[i];
                    for (let j = 0; j < ppsPlanId.electionGroupList.length; j++) {
                        let ppsElcionGroup = ppsPlanId.electionGroupList[j];
                        if (ppsElcionGroup.benefitList.length === 0) {
                            this.allowContinue = true;
                            throw throwException;
                        }
                        /* istanbul ignore next */
                        for (let k = 0; k < ppsElcionGroup.benefitList.length; k++) {
                            let ppsBenefitList = ppsElcionGroup.benefitList[k];
                            let ppsPaymentOption = ppsBenefitList.paymentOption;
                            if (!ppsBenefitList.isDeferred) {
                                if (!ppsPaymentOption) {
                                    this.allowContinue = true;
                                    throw throwException;
                                }
                            }
                        }
                    }
                }
                this.cancontinue(buttonActionType);
            } catch (throwException) {
                this.cancontinue(buttonActionType);
            }
        } else {
            this.cancontinue(buttonActionType);
        }
    }


    cancontinue(buttonActionType) {
        this.editMessagesService.pageNameSubject.next("pps");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.businessProcessReferenceId = 0;
        let responseStatusCode: any;
        let saveApiResponse: any;
        let optionalFormNotSelected = false;
        let selectedOptionalForms = [];
        if (!this.hassTBAEdit) {
            let planItem = JSON.parse(JSON.stringify(this.data.planList));
            /* istanbul ignore next */
            if (!buttonActionType) {
                for (let r = 0; r < planItem.length; r++) {
                    let ppsAllFrm = planItem[r];
                    for (let s = 0; s < ppsAllFrm.electionGroupList.length; s++) {
                        let frmAllGroupList = ppsAllFrm.electionGroupList[s];
                        if (frmAllGroupList.displayElecGroup && frmAllGroupList.benefitList.length === 0) {
                            for (let w = 0; w < frmAllGroupList.defaultElectionGroupDeferredElection.length; w++) {
                                let deferAllSetData = frmAllGroupList.defaultElectionGroupDeferredElection[w];
                                deferAllSetData.isDeferred = false;
                            }
                            frmAllGroupList.benefitList = frmAllGroupList.defaultElectionGroupDeferredElection;
                        } else if (frmAllGroupList.displayElecGroup && frmAllGroupList.benefitList.length !== 0) {
                            this.notOnArry = [];
                            for (let j = 0; j < frmAllGroupList.benefitList.length; j++) {
                                this.benefitItem = frmAllGroupList.benefitList[j];
                                this.notOnArry.push(this.benefitItem);
                            }
                            for (let w = 0; w < frmAllGroupList.defaultElectionGroupDeferredElection.length; w++) {
                                this.notOnFileData = frmAllGroupList.defaultElectionGroupDeferredElection[w];
                                if (this.benefitItem.elecId !== this.notOnFileData.elecId) {
                                    this.notOnFileData.isDeferred = false;
                                    this.notOnArry.push(this.notOnFileData);
                                }
                            }
                            frmAllGroupList.benefitList = this.notOnArry;
                        }
                    }
                }
            }
            planItem.forEach(planIdItem => {
                let planId = planIdItem.planId;
                planIdItem.electionGroupList.forEach(electionGroupIdItem => {
                    let elecGroupId = electionGroupIdItem.elecGroupId;
                    electionGroupIdItem.benefitList.forEach(benefitIdItem => {
                        let elecId = benefitIdItem.elecId;
                        let opformGroupId = benefitIdItem.opformGroupId;
                        /* istanbul ignore next */
                        if (benefitIdItem.isDeferred) {
                            this.isPlanElectionDeferred = true;
                            optionalFormNotSelected = true;
                            this.paymentOptionId = 0;
                        } else if (!benefitIdItem.isDeferred && benefitIdItem.paymentOption !== undefined) {
                            this.paymentOptionId = benefitIdItem.paymentOption.paymentOptionId;
                            this.isPlanElectionDeferred = false;
                            optionalFormNotSelected = false;
                        } else {
                            this.paymentOptionId = benefitIdItem.firstOptionalFormId;
                            optionalFormNotSelected = true;
                            this.isPlanElectionDeferred = false;
                        }

                        selectedOptionalForms.push(
                            {
                                "planId": planId,
                                "electionGroupId": elecGroupId,
                                "electionId": elecId,
                                "optionalFormGroupId": opformGroupId,
                                "optionalFormId": this.paymentOptionId,
                                "optionalFormNotSelected": optionalFormNotSelected,
                                "isPlanElectionDeferred": this.isPlanElectionDeferred
                            }
                        );
                    });
                });
            });
        }
        if (!this.allowContinue) {
            this.deferredFlag = true;
            if (buttonActionType) {
                if (this.quarterlytotalAmt !== 0 || this.onetimetotalAmt !== 0 || this.annualtotalAmt !== 0 || this.monthlytotalAmt !== 0 || this.semimonthlytotalAmt !== 0) {
                    this.deferredFlag = true;
                } else {
                    this.deferredFlag = false;
                }
            }
            this.editMessagesService.editMessageFlagSubject.next(false);
            if (buttonActionType === true && this.deferredFlag === true) {
                this.saveApiRequestBody = {
                    "shouldValidate": true,
                    "shouldAdvanceStep": true,
                    "retirementStep": "Forms of Payment",
                    "hasElectedToDeferAllOptionalForms": false,
                    "selectedOptionalForms": selectedOptionalForms
                };
            } else if (buttonActionType === false && this.deferredFlag === true) {
                this.saveApiRequestBody = {
                    "shouldValidate": false,
                    "shouldAdvanceStep": false,
                    "retirementStep": "Forms of Payment",
                    "hasElectedToDeferAllOptionalForms": false,
                    "selectedOptionalForms": selectedOptionalForms
                };
            } else {
                this.saveApiRequestBody = {
                    "shouldValidate": true,
                    "shouldAdvanceStep": true,
                    "retirementStep": "Forms of Payment",
                    "hasElectedToDeferAllOptionalForms": true,
                    "selectedOptionalForms": []
                };
            }
            if (!this.hassTBAEdit) {
                this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
                this.editMessagesService.formvalSubject.next(this.deferredFlag);
            }
            this.loading.showIndicator("#saveServiceLoader", "");
            this.retirementElectionRestService.pensionPaymentSummarySaveService(this.hassTBAEdit ? this.editMessagesService.formval : this.deferredFlag, this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType, this.hassTBAEdit)
                .pipe(
                    finalize(() => {
                        if (saveApiResponse) {
                            responseStatusCode = saveApiResponse.statusCode;
                            this.loading.hideIndicator("#saveServiceLoader", "");
                            if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                                this.showError = true;
                            } else {
                                /* istanbul ignore next */
                                this.retirementElectionRestService.setSystemTickets(this.rawSaveResponseData);
                                this.editMessagesService.issTbaEditSubject.next(false);
                                this.retirementElectionRestService.getDeferParameters(this.rawSaveResponseData);
                                this.saveApiResponseAction(saveApiResponse, buttonActionType);
                            }
                        }
                    })
                )
                .subscribe(
                    (data: any) => {
                        this.rawSaveResponseData = data;
                        saveApiResponse = data.body;
                        this.logger._debug(JSON.stringify(data), "Getting PPS details successfully", LoggingConstants.INFO, "RetirementElection - PPS - Save Service");
                    },
                    (error) => {
                        /* istanbul ignore next */
                        this.rawSaveResponseData = error;
                        saveApiResponse = error;
                        this.logger._error(JSON.stringify(error), "Error in PPS component response", LoggingConstants.ERROR, "RetirementElection - PPS - Save Service");
                    });
        } else {
            /* istanbul ignore next */
            this.isBackButton = false;
            this.editMessagesService.saveEditArray(this.data.editList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        }
    }

    saveApiResponseAction(saveApiResponse, buttonActionType) {
        /**
     * Check for routing page presence to store/route
     */
        /* istanbul ignore next */
        if (saveApiResponse.routingPage !== undefined) {
            if (buttonActionType && this.hassTBAEdit ? this.editMessagesService.formval : this.deferredFlag) {
                if (saveApiResponse.routingPage === "HMTR") {
                    this.routeToPageLocation = "rollover-amount";
                } else if (saveApiResponse.routingPage === "PMTD") {
                    this.routeToPageLocation = "payment-destination";
                } else if (saveApiResponse.routingPage === "DFRS") {
                    this.routeToPageLocation = "deferred";
                } else {
                    this.routeToPageLocation = "deferred";
                }
            }
        } else {
            if (!buttonActionType) {
                this.routeToPageLocation = "saved";
            } else {
                this.routeToPageLocation = "deferred";
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
        } /* istanbul ignore next */ else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            /**
       * Case: No TBA edits and service status 200
       */
            this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
       * Case: Server side edits and service status 400
       */
            if (saveEditList !== undefined) {
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
    comeBackServices() {
        this.reviewPensionChoicesService.setBackButton(false);
        let storedOptionalForms = this.data.planList;
        this.integrationCpoPpsService.setAllOptionalForms(storedOptionalForms);
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
                                this.editMessagesService.pageNameSubject.next("cancelFromPPS");
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
                    if (response && response.statusCode) {

                        this.responseData = response.statusCode;
                        /* istanbul ignore next */
                        if (this.responseData !== 200) {
                            this.showError = true;
                        } else {
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                            this.showError = false;
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting PPS details successfully", LoggingConstants.INFO, "RetirementElection - PPS - cancel Service");
                }
            );
    }

    redirectBack() {
        this.retirementElectionRestService.onRouteDBElec("review-choices");
    }

    /* istanbul ignore next */
    updateMatrixOptions(paymentOptionItem) {
        // Simple election
        if (paymentOptionItem.electionGroupId === "0") {
            for (let i = 0; i < this.data.planList.length; i++) {
                let planlist = this.data.planList[i];
                /* istanbul ignore next */
                if (planlist.planId === paymentOptionItem.planId) {
                    for (let j = 0; j < planlist.electionGroupList.length; j++) {
                        let electionGroupList = planlist.electionGroupList[j];
                        if (electionGroupList.elecGroupId === paymentOptionItem.electionGroupId) {
                            for (let k = 0; k < electionGroupList.benefitList.length; k++) {
                                let benefitList = electionGroupList.benefitList[k];
                                if (benefitList.elecId === paymentOptionItem.elecId && benefitList.opformGroupId === paymentOptionItem.opformGroupId) {
                                    if (paymentOptionItem.isDeferred === true) {
                                        benefitList.isDeferred = true;
                                    } else {
                                        benefitList.isDeferred = false;
                                        benefitList.paymentOption = paymentOptionItem.paymentOption;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else { // non zero elec grp scenario
            for (let i = 0; i < this.data.planList.length; i++) {
                let planlist = this.data.planList[i];
                if (planlist.planId === paymentOptionItem.planId) {
                    for (let j = 0; j < planlist.electionGroupList.length; j++) {
                        let electionGroupList = planlist.electionGroupList[j];
                        if (electionGroupList.elecGroupId === paymentOptionItem.electionGroupId) {
                            electionGroupList.benefitList = paymentOptionItem.benefitList;
                        }
                    }
                }
            }
        }
    }
    /**
     * @method checkForPaymentOptions
     * checks for payment options availble
     * to determine the matrix button label
     * on Initial PPS GET
     */
    checkForPaymentOptions() {
        let isPaymentOptionAvailable = false;
        try {
            this.data.planList.forEach((planItem) => {
                planItem.electionGroupList.forEach((electionGrpItem) => {
                    if (electionGrpItem.hasOwnProperty("benefitList")) {
                        let benefitList = electionGrpItem.benefitList;
                        benefitList.forEach((benefitListItem) => {
                            if (benefitListItem.hasOwnProperty("paymentOption")) {
                                isPaymentOptionAvailable = true;
                                throw (isPaymentOptionAvailable);
                            }
                        });
                    }
                });
            });
            throw isPaymentOptionAvailable;
        } catch (isPaymentOptionAvailable) {
            this.isPaymentOptionAvailable = isPaymentOptionAvailable;
        }
    }
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
                    this.pensionPaymentSummaryData();
                })
            )
            .subscribe((res: any) => {
                this.logger._debug("Response :" + JSON.stringify(res), "Fetched items from the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "RetirementElection - PPS - getProgressBarPopOverDataFromIDB");
                popOverIDBData = res;
            },
            ((error) => {
                this.logger._error("Response :" + JSON.stringify(error), "Failed to Fetched items from the  ActiveProgressBarStore", LoggingConstants.ERROR, "RetirementElection -  PPS - getProgressBarPopOverDataFromIDB");
            })
            );
    }
}
