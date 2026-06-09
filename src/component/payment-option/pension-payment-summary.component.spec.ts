import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA  } from "@angular/core";
import {   AlPanelSectionService   } from "../../services/al-panel-section.service";
import {   EditMessagesService   } from "../../services/edit-messages.service";
import {   IntegrationCpoPpsService   } from "../../services/integration-cpo-pps.service";
import {   NextStepIndexService   } from "../../services/next-step-index.service";
import {   RetirementElectionRestService   } from "../../services/retirement-election-rest.service";
import {   RouterService   } from "../../services/router.service";
import {   SavePpsDataService   } from "../../services/save-pps-data.service";
import {   StepsActiveIndexService   } from "../../services/steps-active-index-service";
import {   DeferredSuccessfullyDSService   } from "../../services/deferred-successfully-data-save.service";
import {   ProgressBarComponent   } from "../progress-bar/progress-bar.component";
import {   ErrorComponent   } from "../shared/error/error.component";
import {   PanelSectionComponent   } from "../shared/panel-section/panel-section.component";
import {   PensionPaymentSummaryComponent   } from "./pension-payment-summary.component";
import {   DynamicEditLoaderComponent   } from "../shared/dynamic-edit-loader/dynamic-edit-loader.component";
import {   RightSideComponent   } from "../shared/right-side-components/right-side-components.component";
import {   ComparePaymentOptionsComponent   } from "../shared/right-side-components/compare-payment-options/compare-payment-options.component";
import {   ConsiderIraRolloverImpactComponent   } from "../shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
import {   DocumentsAndResourcesComponent   } from "../shared/right-side-components/documents-and-resources/documents-and-resources.component";
import {   OtherResourcesComponent   } from "../shared/right-side-components/other-resources/other-resources.component";
import {   PeopleLikeMeComponent   } from "../shared/right-side-components/people-like-me/people-like-me.component";
import {   QuestionsComponent   } from "../shared/right-side-components/questions/questions.component";
import {   WantToAddAnotherBeneficiaryComponent   } from "../shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
import {   ReviewPensionChoicesService   } from "../../services/review-pension-choices.service";
import {   RightSideContentService   } from "../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../services/footnote-common.service";
import {   ProgressBarPopoverDataCacheService   } from "../../services/progressBarPopoverDataCache.service";
import {   NonQualifiedBenefitComponent  } from "../shared/retirement-review-details/non-qualified-benefit/non-qualified-benefit.component";

export class RetirementElectionRestServiceMock {
    orgName;
    popoverDataSubject = new Subject();
    isActivePBEnabled = true;
    locale = "fr";
    constructor() {
        this.orgName = "retirement3x";
    }
    pensionPaymentSummaryService() {
        let mockConfig = require("../../al-assets/data/ppsMatrixPage.json");
        return of(mockConfig);
    }
    getRightSideContent() {
        let mockConfig = require("../../al-assets/data/common.json");
        return of(mockConfig);
    }
    getCommonContent() {
        let mockConfig = require("../../al-assets/data/cancel.json");
        return of(mockConfig);
    }

    getQueryParameters() {
        let mockConfig = require("../../al-assets/data/ppsMatrixPage.json");
        return of(mockConfig);
    }
    getPpsData() {
        let mockConfig = require("../../al-assets/data/ppsMatrixPage.json");
        return of(mockConfig);
    }
    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    pensionPaymentSummarySaveService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    getBackButton() {
        return true;
    }

    setSystemTickets() {

    }

    removeSystemTickets() {
    }

    onRouteDBElec() {

    }
    extractEditMessages() {
        let editMessages = [];
        return editMessages;
    }
    setBackButton(val: boolean){

    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "PPS";
    }
    getDeferParameters() {}
    getLocale() {}
    isDefaultLocale(locale) {
        return true;
    }
    isCallBackAllowed() {
        return true;
    }
    getProgressBarPopoverDataInCache() {
        return of("data");
    }
    getProgressBarPopoverContent(data: any) {}
    checkPreActivityEdit() {
        let  mockConfig = {
            "_body": {
                "data": {
                    "statusCode": 200,
                    "isUaCrossEnabled": false,
                    "isUaClientEnabled": false,
                    "preActivityEdit": {
                        "hasEdit": false
                    }
                }
            }
        };
        return of(mockConfig);
    }

    getConfigurationData() {
        //  let mockConfig = require("../../../../al-assets/data/cancel.json");
        let mockjson = {"status": {
            "statusCode": 200,
            "statusMessage": "OK",
            "errorMessage": "The information that usually displays here is currently unavailable."
        }};
        return of(mockjson);
    }
}

describe("PensionPaymentSummaryComponent", () => {
    let component: PensionPaymentSummaryComponent;
    let fixture: ComponentFixture<PensionPaymentSummaryComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({

            declarations:
                [
                    PensionPaymentSummaryComponent,
                    PanelSectionComponent,
                    ProgressBarComponent,
                    ErrorComponent,
                    DynamicEditLoaderComponent,
                    RightSideComponent,
                    ComparePaymentOptionsComponent,
                    ConsiderIraRolloverImpactComponent,
                    DocumentsAndResourcesComponent,
                    OtherResourcesComponent,
                    PeopleLikeMeComponent,
                    QuestionsComponent,
                    WantToAddAnotherBeneficiaryComponent,
                    FootnoteComponent,
                    NonQualifiedBenefitComponent
                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    IntegrationCpoPpsService,
                    AlPanelSectionService,
                    SavePpsDataService,
                    EditMessagesService,
                    NextStepIndexService,
                    RouterService,
                    LoggingService,
                    LoggingStartupConfigService,
                    AppUtility,
                    FootnoteService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: ReviewPensionChoicesService, useClass: RetirementElectionRestServiceMock
                    },
                    StepsActiveIndexService,
                    RightSideContentService,
                    GoogleAnalyticsService,
                    DynamicComponentService,
                    DeferredSuccessfullyDSService,
                    {
                        provide: ProgressBarPopoverDataCacheService, useClass: RetirementElectionRestServiceMock
                    }
                ],
            imports:
                [
                    AlCoreModuleLibrary.forRoot(),
                    BrowserAnimationsModule,
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election/pension-payment-summary", component: PensionPaymentSummaryComponent},
                        { path: "web/retirement3x/retirement-election/choose-category", component: PensionPaymentSummaryComponent},
                        { path: "web/retirement3x/retirement-election/review-choices", component: PensionPaymentSummaryComponent},
                        { path: "web/retirement3x/retirement-election/payment-destination", component: PensionPaymentSummaryComponent},
                        { path: "web/retirement3x/retirement-election/choose-payment-options-matrix", component: PensionPaymentSummaryComponent}
                    ])
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PensionPaymentSummaryComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it ("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    it ("Should call the redirectNext", () => {
        component.redirectNext(true);
    });

    it ("Should call the redirectNext", () => {
        component.redirectBack();
    });

    it ("Should call the cancontinue", () => {
        component.allowContinue = false;
        fixture.detectChanges();
        component.cancontinue(true);
        component.cancontinue(false);
    });

    it ("Should call the setMatrixPageDetails", () => {
        component.setMatrixPageDetails();
    });

    it ("Should call the updatePaymentOption", () => {
        component.updatePaymentOption();
    });

    it ("should call the expand all", () => {
        component.onCancel();
    });
    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });

    /*  it ('should invoke sevice', inject([RetirementElectionRestService], (tmpService: RetirementElectionRestService) => {
         expect(tmpService).toBeTruthy();
     }));  */

    it ("Should able call deferall", () => {
        component.deferAllFunc();
    });

    it ("Should able call defereach", () => {
        component.deferEachFunc(0);
        fixture.detectChanges();
    });

    it ("should call saveApiResponseAction", () => {

        /* let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click(); */
        let saveApiResponse = {
            "systemTickets": "[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}]",
            "statusCode": 200,
            "alightResponseHeader": "{\"transactionHeader\":{\"transactionInfo\":[{\"activityId\":\"000005640\",\"activityDescription\":\"Accept New Payment Elections\",\"activityReferenceNumber\":\"83400098\",\"tbaActivity\":{\"activityBrandCode\":\"\",\"planBrandCode\":\"\",\"planDescription\":\"\",\"planId\":\"000000000\"},\"effectiveDate\":\"2019-12-18\"}]},\"systemTickets\":[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}],\"responseCode\":\"0\",\"responseDescription\":\"\"}",
            "statusMessage": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };

        component.saveApiResponseAction(saveApiResponse, true);
        component.saveApiResponseAction(saveApiResponse, false);

    });

    it ("Should able call checkForPaymentOptions", () => {
        component.checkForPaymentOptions();
    });
    it ("Should able call onPopState", () => {
        component.onPopState("Back");
    });

});
