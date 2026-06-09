import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   AlPanelSectionService   } from "../../../services/al-panel-section.service";
import {   EditMessagesService   } from "../../../services/edit-messages.service";
import {   IntegrationCpoPpsService   } from "../../../services/integration-cpo-pps.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   CustomAlPanelComponent   } from "../../shared/custom-al-panel/custom-al-panel.component";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   PanelSectionComponent   } from "../../shared/panel-section/panel-section.component";
import {   BenefitSectionComponent   } from "./benefit-section/benefit-section.component";
import {   HypotheticalPanelSectionComponent   } from "./benefit-section/hypothetical-panel-section/hypothetical-panel-section.component";
import {   ChoosePaymentOptionComponent   } from "./choose-payment-option.component";
import {   DynamicEditLoaderComponent   } from "../../shared/dynamic-edit-loader/dynamic-edit-loader.component";
import {   RightSideComponent   } from "../../shared/right-side-components/right-side-components.component";
import {   ComparePaymentOptionsComponent   } from "../../shared/right-side-components/compare-payment-options/compare-payment-options.component";
import {   ConsiderIraRolloverImpactComponent   } from "../../shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
import {   DocumentsAndResourcesComponent   } from "../../shared/right-side-components/documents-and-resources/documents-and-resources.component";
import {   OtherResourcesComponent   } from "../../shared/right-side-components/other-resources/other-resources.component";
import {   PeopleLikeMeComponent   } from "../../shared/right-side-components/people-like-me/people-like-me.component";
import {   QuestionsComponent   } from "../../shared/right-side-components/questions/questions.component";
import {   WantToAddAnotherBeneficiaryComponent   } from "../../shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
import {   RightSideContentService   } from "../../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../../services/footnote-common.service";

export class RetirementElectionRestServiceMock {
    public choosePaymentOptionResponse: any;
    orgName;
    constructor() {
        this.orgName = "retirement3x";
    }
    choosePaymentOptionService() {
        let mockConfig = require("../../../al-assets/data/AutoSelectExample.json");
        this.choosePaymentOptionResponse = mockConfig;
        return of(mockConfig);
    }
    choosePaymentOptionServiceParams(planId, electionId, electionGroupId) {
        let mockConfig = require("../../../al-assets/data/AutoSelectExample.json");
        this.choosePaymentOptionResponse = mockConfig;
        return of(mockConfig);
    }
    getChoosePaymentOptionData() {
        return of(this.choosePaymentOptionResponse);
    }
    getRightSideContent() {
        let mockConfig = require("../../../al-assets/data/common.json");
        return of(mockConfig);
    }
    getCommonContent() {
        let mockConfig = require("../../../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/AutoSelectExample.json");
        return of(mockConfig);
    }
    onRouteDBElec() {

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
    extractEditMessages() {
        let editMessages = [];
        return editMessages;
    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "CPO";
    }
    isCallBackAllowed() {
        return true;
    }
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
}

describe("ChoosePaymentOptionComponent", () => {
    let component: ChoosePaymentOptionComponent;
    let fixture: ComponentFixture<ChoosePaymentOptionComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        ChoosePaymentOptionComponent,
                        BenefitSectionComponent,
                        HypotheticalPanelSectionComponent,
                        PanelSectionComponent,
                        CustomAlPanelComponent,
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
                        FootnoteComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        IntegrationCpoPpsService,
                        AlPanelSectionService,
                        EditMessagesService,
                        StepsActiveIndexService,
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        FootnoteService,
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        RightSideContentService,
                        GoogleAnalyticsService,
                        DynamicComponentService
                    ],
                imports:
                    [
                        // RouterTestingModule,
                        AlCoreModuleLibrary.forRoot(),
                        BrowserAnimationsModule,
                        RouterTestingModule.withRoutes([
                            { path: "web/retirement3x/retirement-election/pension-payment-summary", component: ChoosePaymentOptionComponent},
                            { path: "web/retirement3x/retirement-election/choose-category", component: ChoosePaymentOptionComponent}
                        ])
                    ]
            }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChoosePaymentOptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it ("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    it("should able to call enable continue", () => {
        let cpoSelectedArray = {};
        cpoSelectedArray["deferValue"] = true;
        component.enableContinue(cpoSelectedArray);
        fixture.detectChanges();
    });

    it("should able to call continue", () => {
        component.continue(true);
    });

    // it('should able to call cancontinue', () => {
    //     component.cancontinue(false);

    // });

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
        // component.saveApiResponseAction(saveApiResponse, false);

    });

    it ("should call the expand all", () => {
        component.onCancel();
    });

    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });
});
