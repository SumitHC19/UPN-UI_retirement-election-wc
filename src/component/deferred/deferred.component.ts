import {  Component, OnInit  } from "@angular/core";
import {  RetirementElectionRestService  } from "../../services/retirement-election-rest.service";
import {  AuthorizationCommonService  } from "../../services/authorization-common.service";
import {  DeferredSuccessfullyDSService  } from "../../services/deferred-successfully-data-save.service";
import {  ViewRhrComponentsModel  } from "../shared/models/view-rhr-components.model";
import {  finalize  } from "rxjs";
import {  LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, DomStorageFallbackService  } from "@alight/core-utilities-lib";
import {  FootnoteService  } from "../../services/footnote-common.service";

@Component({
    selector: "al-defer",
    templateUrl: "./deferred.component.html"
})
export class DeferredSuccessfullyComponent implements OnInit{

    data: any;
    checkResponse = false;
    showError = true;
    ViewRhrComponents = new ViewRhrComponentsModel();
    isFromDeferPage = true;

    constructor(
        private retirementElectionRestService: RetirementElectionRestService,
        private authorizationCommonService: AuthorizationCommonService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private logger: LoggingService,
        private footnoteService: FootnoteService,
        private deferredSuccessfullyDSService: DeferredSuccessfullyDSService,
        private domFBService: DomStorageFallbackService) {
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.domFBService.setItem("isDBEleclFlowComp", true, "sessionStorage", true);
        this.dynamicComponentService.initializePageComponents();
        this.retirementElectionRestService.getQueryParameters();
        this.getDeferSuccessfullyData();
        this.retirementElectionRestService.screenCapture(true);
    }

    getDeferSuccessfullyData() {
        this.retirementElectionRestService.deferredSuccessfullyService()
            .pipe(
                finalize( () => {
                    this.checkResponse = true;
                    /* istanbul ignore if */
                    if(this.data !== null && this.data !== undefined) {
                        if(this.data.responseStatus !== undefined && this.data.responseStatus.statusCode !== undefined) {
                            let responseStatusCode = this.data.responseStatus.statusCode;
                            if(responseStatusCode === 200) {
                                this.showError = false;
                                this.googleAnalyticsService.postGACustomPageTracking("UPN_DbRtrmChoices185DeferSucPage");
                                this.footnoteService.setFootnoteData(this.data.footnoteContent);
                                this.authorizationCommonService.setNextStepContent(this.data.nextStepsSection);
                                this.data.deferredSuccessfullySummary["summaryEffectiveDate"] = this.deferredSuccessfullyDSService.getEffecDate();
                                this.data.deferredSuccessfullySummary["summaryPlansDescText"] = this.deferredSuccessfullyDSService.getPlanDescriptionList();
                                this.authorizationCommonService.setSummaryRequestContent(this.data.deferredSuccessfullySummary);
                            }
                        }
                    }
                    this.retirementElectionRestService.screenCaptureInit("deferred");
                })
            )
            .subscribe(
                (data) => {
                    if(data !== undefined && data !== null) {
                        this.data = data;
                    }
                    this.logger._debug(JSON.stringify(data), "Getting deferred details successfully", LoggingConstants.INFO, "RetirementElection - deferred - Get Service");
                },
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in deferred component response", LoggingConstants.ERROR, "RetirementElection - deferred - Get Service");
                }
            );
    }
    printPage() {
        window.print();
    }

}
