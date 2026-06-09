import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, DynamicComponentService  } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   RetirementElectionRestService   } from "../../services/retirement-election-rest.service";
import {   CancelledComponent   } from "./cancelled.component";
import {   ErrorComponent   } from "../shared/error/error.component";
import {   RightSideComponent   } from "../shared/right-side-components/right-side-components.component";
import {   ComparePaymentOptionsComponent   } from "../shared/right-side-components/compare-payment-options/compare-payment-options.component";
import {   ConsiderIraRolloverImpactComponent   } from "../shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
import {   DocumentsAndResourcesComponent   } from "../shared/right-side-components/documents-and-resources/documents-and-resources.component";
import {   OtherResourcesComponent   } from "../shared/right-side-components/other-resources/other-resources.component";
import {   PeopleLikeMeComponent   } from "../shared/right-side-components/people-like-me/people-like-me.component";
import {   QuestionsComponent   } from "../shared/right-side-components/questions/questions.component";
import {   WantToAddAnotherBeneficiaryComponent   } from "../shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
import {   RightSideContentService   } from "../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   ProgressBarPopoverDataCacheService   } from "../../services/progressBarPopoverDataCache.service";
import {   StepsActiveIndexService   } from "../../services/steps-active-index-service";
import {  SavePpsDataService  } from "../../services/save-pps-data.service";
import {  SaveChooseCategoryDataService  } from "../../services/save-choosecategory-data.service";
import {  IntegrationCpoPpsService  } from "../../services/integration-cpo-pps.service";

export class RetirementElectionRestServiceMock {
    getCommonContent() {
        let mockConfig = require("../../al-assets/data/cancel.json");
        return of(mockConfig);
    }

    getRightSideContent() {
        let mockConfig = require("../../al-assets/data/common.json");
        return of(mockConfig);
    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "Cancelled";
    }
    clearIndexDBCache() { }
}

export class DynamicComponentServiceStub {
    loadCustomJS() {
    }
    loadScript() {
    }
    initializePageComponents() {
    }
}

describe("CancelledComponent", () => {
    let component: CancelledComponent;
    let fixture: ComponentFixture<CancelledComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        CancelledComponent,
                        ErrorComponent,
                        RightSideComponent,
                        ComparePaymentOptionsComponent,
                        ConsiderIraRolloverImpactComponent,
                        DocumentsAndResourcesComponent,
                        OtherResourcesComponent,
                        PeopleLikeMeComponent,
                        QuestionsComponent,
                        WantToAddAnotherBeneficiaryComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        { provide: DynamicComponentService, useClass: DynamicComponentServiceStub },
                        RightSideContentService,
                        ProgressBarPopoverDataCacheService,
                        StepsActiveIndexService,
                        SavePpsDataService,
                        SaveChooseCategoryDataService,
                        IntegrationCpoPpsService
                    ],
                imports:
                    [
                        AlCoreModuleLibrary.forRoot(),
                        RouterTestingModule
                    ]
            }
        ).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(CancelledComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should call the removeCallBackAllowedMakeChoices", () => {
        component.removeCallBackAllowedMakeChoices();
    });
});
