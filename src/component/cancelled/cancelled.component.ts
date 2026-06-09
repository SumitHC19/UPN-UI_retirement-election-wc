import {  Component, OnInit  } from "@angular/core";
import {  finalize  } from "rxjs";
import {  RetirementElectionRestService  } from "../../services/retirement-election-rest.service";
import {  OnCancel  } from "../shared/models/cancelled.model";
import {  LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, AlLoaderComponent, DomStorageFallbackService  } from "@alight/core-utilities-lib";
import {  ViewRhrComponentsModel  } from "../shared/models/view-rhr-components.model";
import {  ProgressBarPopoverDataCacheService  } from "../../services/progressBarPopoverDataCache.service";
import {  SavePpsDataService  } from "../../services/save-pps-data.service";
import {  SaveChooseCategoryDataService  } from "../../services/save-choosecategory-data.service";
import {  IntegrationCpoPpsService  } from "../../services/integration-cpo-pps.service";


@Component({
    selector: "al-cancelled",
    templateUrl: "./cancelled.component.html",
    providers: [AlLoaderComponent]
})
export class CancelledComponent implements OnInit {

    data: any;
    clearData: any;
    assetGroups: any;
    assetGroup: any;
    showError = true;
    cancelContent = new OnCancel();
    ViewRhrComponents = new ViewRhrComponentsModel();
    checkResponse = false;
    constructor(private retirementElectionRestService: RetirementElectionRestService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private logger: LoggingService,
        private domFBService: DomStorageFallbackService,
        private progressBarPopoverDataCacheService: ProgressBarPopoverDataCacheService,
        private savePpsDataService: SavePpsDataService,
        private saveChooseCategoryDataService: SaveChooseCategoryDataService,
        private integrationCpoPpsService: IntegrationCpoPpsService,


    ) {
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }
    /* istanbul ignore next */
    ngOnInit() {
        window.scrollTo(0, 0);
        this.domFBService.setItem("isDBEleclFlowComp", true, "sessionStorage", true);
        this.dynamicComponentService.initializePageComponents();
        this.retirementElectionRestService.getCommonContent()
            .pipe(
                finalize(() => {
                    this.checkResponse = true;
                    if(this.data !== null && this.data !== undefined && Array.isArray(this.data)) {
                        this.showError = false;
                        this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices190CnclPage");
                        this.assetGroups = this.data[0]["asset"];
                        this.assetGroup = this.assetGroups["RTRM_CHOICES_CANCEL_GROUP"];
                        /* istanbul ignore next */
                        if(this.assetGroup["RTRM_CHOICES_CANCEL_TXT"]) {
                            this.cancelContent.cancelText = this.assetGroup["RTRM_CHOICES_CANCEL_TXT"]["assetValue"];
                        }
                        this.assetGroup = this.assetGroups["RTRM_CHOICES_BENEFICIARY_SHARED_NEXT_GEN_GROUP"];
                        /* istanbul ignore next */
                        if(this.assetGroup["RTRM_CHOICES_NEXT_GEN_CANCEL_INTRO_TXT"]) {
                            this.cancelContent.cancelIntroText = this.assetGroup["RTRM_CHOICES_NEXT_GEN_CANCEL_INTRO_TXT"]["assetValue"];
                            this.removeCallBackAllowedMakeChoices();
                        }
                    }
                    this.retirementElectionRestService.screenCaptureInit("cancelled");
                })
            )
            .subscribe(
                (data) => {
                    this.data = data;
                    this.logger._debug(JSON.stringify(data), "Getting cancelled details successfully", LoggingConstants.INFO, "RetirementElection - cancelled - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in cancelled component response", LoggingConstants.ERROR, "RetirementElection - cancelled - Get Service");
                }
            );
        this.retirementElectionRestService.screenCapture(true);
        this.retirementElectionRestService.clearIndexDBCache();
        if (this.retirementElectionRestService.isActivePBEnabled) {
            this.progressBarPopoverDataCacheService.clearProgressBarPopoverDataInCache(true, [0]);
        }
        this.savePpsDataService.setPpsData(this.clearData);
        this.saveChooseCategoryDataService.setCCPlanElecData(this.clearData);
        this.saveChooseCategoryDataService.setCCData(this.clearData);
        this.integrationCpoPpsService.setData(this.clearData);
        this.integrationCpoPpsService.setChosenPlanDetails(this.clearData);
        this.integrationCpoPpsService.setChosenCategoryPlanDetails(this.clearData);
        this.integrationCpoPpsService.setCategoryData(this.clearData);
        this.integrationCpoPpsService.setAllOptionalForms(this.clearData);
    }
    removeCallBackAllowedMakeChoices() {
        this.domFBService.removeItem("isDBEleclFlowComp", "sessionStorage");
    }

}
