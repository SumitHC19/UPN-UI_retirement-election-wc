import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Observable , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, DynamicComponentService, GoogleAnalyticsService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed, inject   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   AlPanelSectionService   } from "../../../services/al-panel-section.service";
import {   IntegrationCpoPpsService   } from "../../../services/integration-cpo-pps.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   ReviewPensionChoicesService   } from "../../../services/review-pension-choices.service";
import {   SavePpsDataService   } from "../../../services/save-pps-data.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   CompletedSuccessfullyDSService   } from "../../../services/completed-successfully-data-save.service";
import {   ProgressBarComponent   } from "../../progress-bar/progress-bar.component";
import {   PanelSectionComponent   } from "../../shared/panel-section/panel-section.component";
import {   BeneficiariesComponent   } from "../../shared/retirement-review-details/beneficiaries/beneficiaries.component";
import {   EstimatedIncomeTaxComponent   } from "../../shared/retirement-review-details/payment-review/other-details/estimated-income-tax/estimated-income-tax.component";
import {   OtherDetailsComponent   } from "../../shared/retirement-review-details/payment-review/other-details/other-details.component";
import {   PaymentAmountComponent   } from "../../shared/retirement-review-details/payment-review/other-details/payment-amount/payment-amount.component";
import {   PaymentDestinationComponent   } from "../../shared/retirement-review-details/payment-review/other-details/payment-destination/payment-destination.component";
import {   TaxationInformationComponent   } from "../../shared/retirement-review-details/payment-review/other-details/taxation-information/taxation-information.component";
import {   PaymentReviewComponent   } from "../../shared/retirement-review-details/payment-review/payment-review.component";
import {   PaymentTableComponent   } from "../../shared/retirement-review-details/payment-review/payment-table/payment-table.component";
import {   RetirementReviewDetailsComponent   } from "../../shared/retirement-review-details/retirement-review-details.component";
import {   ReviewPensionChoicesReadOnlyComponent  } from "./review-pension-choices-readonly.component";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   EditMessagesService   } from "../../../services/edit-messages.service";
import {   RightSideContentService   } from "../../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../../services/footnote-common.service";


export class RetirementElectionRestServiceMock {
    orgName;
    AuthorizePageSubject = new Subject();
    constructor() {
        this.orgName = "retirement3x";
    }
    getReviewReadOnlyData() {
        let mockConfig = require("../../../al-assets/data/reviewyourpensionchoice.json");
        return of(mockConfig);
    }
    getCommonContent() {
        let mockConfig = require("../../../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    getConfigurationData() {
        let mockjson = {"status": {
            "statusCode": 200,
            "statusMessage": "OK",
            "errorMessage": "The information that usually displays here is currently unavailable."
        }};
        return of(mockjson);
    }
}

describe("ReviewPensionChoicesReadOnlyComponent", () => {
    let component: ReviewPensionChoicesReadOnlyComponent;
    let fixture: ComponentFixture<ReviewPensionChoicesReadOnlyComponent>;
    let compiled: any;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations:
                [
                    ReviewPensionChoicesReadOnlyComponent,
                    PanelSectionComponent,
                    ProgressBarComponent,
                    OtherDetailsComponent,
                    TaxationInformationComponent,
                    PaymentDestinationComponent,
                    PaymentAmountComponent,
                    EstimatedIncomeTaxComponent,
                    PaymentTableComponent,
                    BeneficiariesComponent,
                    PaymentReviewComponent,
                    RetirementReviewDetailsComponent,
                    ErrorComponent,
                    FootnoteComponent
                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    IntegrationCpoPpsService,
                    LoggingService,
                    LoggingStartupConfigService,
                    AppUtility,
                    AlPanelSectionService,
                    SavePpsDataService,
                    ReviewPensionChoicesService,
                    StepsActiveIndexService,
                    EditMessagesService,
                    CompletedSuccessfullyDSService,
                    FootnoteService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    RightSideContentService,
                    DynamicComponentService,
                    GoogleAnalyticsService
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement],
            imports:
                [
                    AlCoreModuleLibrary.forRoot(),
                    BrowserAnimationsModule,
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election/pension-payment-summary", component: ReviewPensionChoicesReadOnlyComponent},
                        { path: "web/retirement3x/retirement-election/payment-destination", component: ReviewPensionChoicesReadOnlyComponent}
                    ])
                ]
        }).compileComponents();
    }));

    beforeEach(()=> {
        fixture = TestBed.createComponent(ReviewPensionChoicesReadOnlyComponent);
        component = fixture.componentInstance;
        compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));
    it ("Component Created ngOnInit", (() => {
        component.reviewReadOnlyContent();
    }));
    it ("Component Created setConfigurationData", (() => {
        component.setConfigurationData();
    }));
    it("should invoke sevice", inject([RetirementElectionRestService ], (tmpService: RetirementElectionRestService, ) => {
        expect(tmpService).toBeTruthy();
    }));

});
