import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, ViewChildren, ViewContainerRef, QueryList, AfterContentInit } from "@angular/core";
import { LoggingService, LoggingConstants, DynamicComponentService } from "@alight/core-utilities-lib";
import { Router, Event, NavigationEnd, ActivatedRoute } from "@angular/router";
import { RetirementElectionRestService } from "../services/retirement-election-rest.service";
import { ProgressBarPopoverDataCacheService } from "../services/progressBarPopoverDataCache.service";
import { finalize } from "rxjs";
import { DeferredSuccessfullyDSService } from "src/services/deferred-successfully-data-save.service";

@Component({
    selector: "al-retirement-election-wc",
    templateUrl: "./retirement-election.component.html",
    styleUrls: ["./retirement-election.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class RetirementElectionComponent implements OnInit, AfterContentInit {
    title = "Retirement Election";
    data: any;
    response: any;
    pageTitle: any;
    printButtonText: any;
    progressBarDisplay = true;
    showEditFlag: Boolean;
    retirementStepQs: String;
    showPopOver = false;
    readyToLoadProgressBar = false;
    errorModalContent = { "errorMessage": "", "buttonLabel": "Ok" };
    changeModalContent: any;
    preactivityEditData: any;
    routeLink: any;
    isCancelServiceFail = false;
    @ViewChild("editModal") editModal;
    @ViewChild("errorModal") errorModal;
    @ViewChild("display") display: any;
    /**
   * Standard constructor code to do
   * the dependency injection.
   */
    constructor(
        private retirementElectionRestService: RetirementElectionRestService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private logger: LoggingService,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService,
        private dynamicComponentService: DynamicComponentService,
        private deferredSuccessfullyDSService: DeferredSuccessfullyDSService
    ) {
        this.router.events.subscribe((event: Event) => {
            console.log(event);
            /* istanbul ignore next */
            if (event instanceof NavigationEnd) {
                if ((event.url === "/web/" + this.retirementElectionRestService.orgName + "/retirement-election/cancelled") ||
                    ((event.url).includes("/web/" + this.retirementElectionRestService.orgName + "/retirement-election/saved")) ||
                    ((event.url).includes("/web/" + this.retirementElectionRestService.orgName + "/retirement-election/deferred"))
                ) {
                    this.progressBarDisplay = false;
                } else {
                    this.progressBarDisplay = true;
                }
            }
        });
        let queryParams: any;
        this.activatedRoute.queryParams.subscribe(
            path => {
                queryParams = path;
                if (queryParams.hasOwnProperty("cbPageId")) {
                    let queryString: String = queryParams.cbPageId;
                    let deferConfirmNumber: String = queryParams.deferConfirmNumber;
                    queryString = queryString.toLowerCase();
                    let queryParamsVar: any;
                    let navigateToUrl = "";

                    /* istanbul ignore next */
                    switch (queryString) {
                        case "rnntcrts":
                        case "rnnorcb":
                            navigateToUrl = "";
                            break;
                        case "rnopfms":
                        case "rnopfmcb":
                        case "rndefer":
                            navigateToUrl = "pension-payment-summary";
                            break;
                        case "rnchoorv":
                        case "rnchoocb":
                            this.retirementStepQs = "RolloverDeliveryReturn";
                            navigateToUrl = "rollover-amount";
                            queryParamsVar = { retirementStep: this.retirementStepQs };
                            break;
                        case "rnrecvrv":
                        case "rnrecvcb":
                        case "rnrlvrct":
                            this.retirementStepQs = "RolloverDeliveryReturn";
                            navigateToUrl = "rollover-destination";
                            queryParamsVar = { retirementStep: this.retirementStepQs };
                            break;
                        case "rnrecvnr":
                            this.retirementStepQs = "ReviewReturn";
                            navigateToUrl = "payment-destination";
                            queryParamsVar = { retirementStep: this.retirementStepQs };
                            break;
                        case "rnreview":
                            this.retirementStepQs = "ReviewReturn";
                            queryParamsVar = { retirementStep: this.retirementStepQs };
                            navigateToUrl = "review-choices";
                            break;
                        case "rnauth":
                        case "rnauthcb":
                            navigateToUrl = "authorize-your-choices";
                            break;
                        case "rolloverdestrefreshaddr":
                            this.retirementStepQs = "RefreshAddress";
                            navigateToUrl = "rollover-destination";
                            queryParamsVar = { retirementStep: this.retirementStepQs };
                            break;
                        case "paymentdestrefreshaddr":
                            this.retirementStepQs = "ReviewReturn";
                            navigateToUrl = "payment-destination";
                            queryParamsVar = { retirementStep: this.retirementStepQs };
                            break;
                        case "suareview":
                            this.retirementStepQs = "ReviewReturn";
                            navigateToUrl = "review-choices";
                            queryParamsVar = { retirementStep: this.retirementStepQs, routeToSUA: true };
                            break;
                        case "cnclhub":
                            navigateToUrl = "cancelled";
                            break;
                        case "deferhub":
                            navigateToUrl = "deferred";
                            if(deferConfirmNumber){
                                 this.deferredSuccessfullyDSService.setConfNumber(deferConfirmNumber)
                            }
                            break;
                    }
                    this.retirementElectionRestService.onRouteDBElec(navigateToUrl, queryParamsVar);
                }
            }
        );
    }
    ngAfterContentInit(): void {
        this.dynamicComponentService.loadMFScript("Footer", "footer-wc");
        this.dynamicComponentService.loadMFScript("Header", "header-wc");
        this.dynamicComponentService.loadMFScript("db-opfm-matrix-wc", "db-opfm-matrix-wc");
    }

    /**
   * Standard code to subscribe for servce data
   * which in turn give call to mircroservice.
   */

    ngOnInit() {
        this.getCommonContentFuncton();
    }
    getCommonContentFuncton() {
        this.retirementElectionRestService.getCommonContent()
            .pipe(
                finalize(() => {
                    this.readyToLoadProgressBar = true;
                }),
            ).subscribe(
                (data) => {
                    if (data !== null && data !== undefined) {
                        /* istanbul ignore next */
                        if (data[0] !== null && data[0] !== undefined) {
                            let progressBarData = data[0];
                            if (progressBarData.hasOwnProperty("expr") && progressBarData.expr !== null && progressBarData.expr !== undefined) {
                                let progressBarExp = progressBarData["expr"];
                                if (progressBarExp.hasOwnProperty("FEAT_SWITCH_ACTV_PRGR_BAR_POPOVER")) {
                                    this.showPopOver = progressBarExp.FEAT_SWITCH_ACTV_PRGR_BAR_POPOVER;
                                    this.retirementElectionRestService.isActivePBEnabled = this.showPopOver;
                                }
                                if (progressBarExp.hasOwnProperty("HAS_MULTI_BENE_SUPPORTED")) {
                                    this.retirementElectionRestService.isMultiBeneSupported = progressBarExp.HAS_MULTI_BENE_SUPPORTED;
                                    this.PBPopoverDataCacheService.isMultiBeneSupported = progressBarExp.HAS_MULTI_BENE_SUPPORTED;
                                    this.PBPopoverDataCacheService.setPBStepCodeArray();
                                }
                                if (progressBarExp.hasOwnProperty("DB_RETIREMENT_SHOW_QUIT_BTTN_CD")) {
                                    if (progressBarExp.DB_RETIREMENT_SHOW_QUIT_BTTN_CD === false) {
                                        this.retirementElectionRestService.showQuitButton = false;
                                    }
                                }
                                if (progressBarExp.hasOwnProperty("DB_RTRM_SHOW_CBL_BTTN_CD")) {
                                    if (progressBarExp.DB_RTRM_SHOW_CBL_BTTN_CD === false) {
                                        this.retirementElectionRestService.showCBLButton = false;
                                    }
                                }
                            }
                            this.pageTitle = data[0]["asset"]["RTRM_CHOICES_FLOW_TITLE_GROUP"]["RTRM_CHOICES_FLOW_TITLE_TXT"]["assetValue"];
                            this.printButtonText = data[0]["asset"]["DB_ELEC_FLOW_AG"]["DB_ELEC_PRINT_TEXT"]["assetValue"];
                            this.errorModalContent.errorMessage = data[0]["asset"]["RTRM_CHOICES_INFO_UNAVAILABLE_GROUP"]["RTRM_CHOICES_INFO_UNAVAILABLE"]["assetValue"];
                        }
                    }
                }
            );
    }

    checkPreActivityEdit(event) {
        let response: any;
        let responseData: any;
        this.retirementElectionRestService.checkPreActivityEdit()
            .pipe(
                finalize(() => {
                    /* istanbul ignore next */
                    if (responseData.hasOwnProperty("statusCode") && responseData.statusCode && responseData.statusCode !== null &&
                        responseData.statusCode !== undefined && responseData.statusCode === 200) {
                        if (responseData.hasOwnProperty("preActivityEdit") && responseData.preActivityEdit && responseData.preActivityEdit !== null
                            && responseData.preActivityEdit !== undefined && responseData.preActivityEdit.hasEdit) {
                            this.preactivityEditData = responseData.preActivityEdit;
                            this.editModal.showDialog(event);
                        } else {
                            this.onCancel();
                        }
                    } else {
                        this.errorModal.showDialog(event);
                    }
                }))
            .subscribe(
                (data) => {
                    if (data && data !== null && data !== undefined) {
                        if (data.hasOwnProperty("_body")) {
                            response = data["_body"];
                            /* istanbul ignore next */
                            if (response && response !== null && response !== undefined &&
                                response.hasOwnProperty("data") && response.data && response.data !== null && response.data !== undefined) {
                                responseData = response.data;
                                this.logger._debug(JSON.stringify(data), "Getting Retirement Election details successfully", LoggingConstants.INFO, "RetirementElection - checkPreActivityEdit for cancel Service");
                            }
                        }
                    }
                },
                /* istanbul ignore next */
                (error) => {
                    this.errorModal.showDialog(event);
                    this.logger._error(JSON.stringify(response), "Error in preActivityEdit cancel service response", LoggingConstants.ERROR, "RetirementElection - Get Service");
                }
            );
    }

    /* istanbul ignore next */
    refreshPage() {
        if (this.isCancelServiceFail) {
            let retirementStepQps = "";
            let currUrl = this.router.url;

            if (currUrl.includes("payment-destination") || currUrl.includes("review-choices")) {
                retirementStepQps = "ReviewReturn";
            } else if (currUrl.includes("rollover-amount") || currUrl.includes("rollover-destination")) {
                retirementStepQps = "RolloverDeliveryReturn";
            }
            if (retirementStepQps && retirementStepQps !== "" && window.location.href.indexOf("retirementStep") === -1) {
                if (window.location.href.indexOf("?") !== -1) {
                    window.location.href = window.location.href + "&retirementStep=" + retirementStepQps;
                } else {
                    window.location.href = window.location.href + "?retirementStep=" + retirementStepQps;
                }
            }
            Promise.resolve().then(() => {
                window.location.reload();
            });
        }
    }

    onCancel() {
        let response;
        let requestBody = {};
        let businessProcessId = 0;
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    if (response && response.statusCode && response.statusCode !== null && response.statusCode !== undefined && response.statusCode === 200) {
                        if (this.routeLink !== undefined && this.routeLink !== null) {
                            let createAnchor: any = document.createElement("a");
                            document.body.appendChild(createAnchor);
                            createAnchor.setAttribute("href", this.routeLink);
                            createAnchor.click();
                            document.body.removeChild(createAnchor);
                        }
                    } else {
                        this.isCancelServiceFail = true;
                        this.errorModal.showDialog(event);
                    }
                })
            )
            .subscribe(
                (data) => {
                    if (data.hasOwnProperty("body")) {
                        response = data.body;
                        this.logger._debug(JSON.stringify(data), "Getting Retirement Election details successfully", LoggingConstants.INFO, "RetirementElection - cancel Service");
                    }
                },
                /* istanbul ignore next */
                (error) => {
                    this.isCancelServiceFail = true;
                    this.errorModal.showDialog(event);
                    this.logger._error(JSON.stringify(response), "Error in cancel service response", LoggingConstants.ERROR, "RetirementElection - Put Service");
                }
            );
    }

    setChangeModalContent(data) {
        if (data.hasOwnProperty("changeModal") && data.changeModal !== null && data.changeModal !== undefined) {
            this.changeModalContent = data.changeModal;
        }
        if (data.hasOwnProperty("routeLink") && data.routeLink !== null && data.routeLink !== undefined) {
            this.routeLink = data.routeLink;
        }
    }
    /* istanbul ignore next */
    printBtnClick() {
        window.print();
    }

}
