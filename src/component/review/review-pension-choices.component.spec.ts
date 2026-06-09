import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Observable , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, DynamicComponentService, GoogleAnalyticsService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed, inject   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   AlPanelSectionService   } from "../../services/al-panel-section.service";
import {   IntegrationCpoPpsService   } from "../../services/integration-cpo-pps.service";
import {   RetirementElectionRestService   } from "../../services/retirement-election-rest.service";
import {   ReviewPensionChoicesService   } from "../../services/review-pension-choices.service";
import {   SavePpsDataService   } from "../../services/save-pps-data.service";
import {   StepsActiveIndexService   } from "../../services/steps-active-index-service";
import {   CompletedSuccessfullyDSService   } from "../../services/completed-successfully-data-save.service";
import {   ProgressBarComponent   } from "../progress-bar/progress-bar.component";
import {   PanelSectionComponent   } from "../shared/panel-section/panel-section.component";
import {   BeneficiariesComponent   } from "../shared/retirement-review-details/beneficiaries/beneficiaries.component";
import {   EstimatedIncomeTaxComponent   } from "../shared/retirement-review-details/payment-review/other-details/estimated-income-tax/estimated-income-tax.component";
import {   OtherDetailsComponent   } from "../shared/retirement-review-details/payment-review/other-details/other-details.component";
import {   PaymentAmountComponent   } from "../shared/retirement-review-details/payment-review/other-details/payment-amount/payment-amount.component";
import {   PaymentDestinationComponent   } from "../shared/retirement-review-details/payment-review/other-details/payment-destination/payment-destination.component";
import {   TaxationInformationComponent   } from "../shared/retirement-review-details/payment-review/other-details/taxation-information/taxation-information.component";
import {   PaymentReviewComponent   } from "../shared/retirement-review-details/payment-review/payment-review.component";
import {   PaymentTableComponent   } from "../shared/retirement-review-details/payment-review/payment-table/payment-table.component";
import {   RetirementReviewDetailsComponent   } from "../shared/retirement-review-details/retirement-review-details.component";
import {   ReviewPensionChoicesComponent   } from "./review-pension-choices.component";
import {   RightSideComponent   } from "../shared/right-side-components/right-side-components.component";
import {   ErrorComponent   } from "../shared/error/error.component";
import {   EditMessagesService   } from "../../services/edit-messages.service";
import {   RightSideContentService   } from "../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../services/footnote-common.service";
import {   ProgressBarPopoverDataCacheService   } from "../../services/progressBarPopoverDataCache.service";

class RetirementElectionRestServiceHelper {
    static reviewYourPensionChoice(isFromAuthPage: boolean, isDbCashoutFlag: boolean) {
        const mockConfig = require("../../al-assets/data/reviewyourpensionchoice.json");
        return of(mockConfig);
    }
    static getRightSideContent() {
        const mockConfig = require("../../al-assets/data/common.json");
        return of(mockConfig);
    }
    static getCommonContent() {
        const mockConfig = require("../../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    static extractEditMessages() {
        const editMessages = [];
        return editMessages;
    }
    static getQueryParameters() {
        const mockConfig = require("../../al-assets/data/reviewyourpensionchoice.json");
        return of(mockConfig);
    }
    static onCancelService(pRequestBody: any, businessprocessid: any) {
        const mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}",
        };
        return of(mockConfig as any as Response);
    }
    static setSystemTickets(data: any) {    }
    static onRouteDBElec() { }
    static reviewPensionChoicesSaveServices(saveApiRequestBody: any, businessProcessReferenceId: any, buttonActionType, isSUAResultMode: boolean, isDbCashoutFlag: boolean, hasTbaEdit: boolean): Observable<any> {
        let saveApiResponse = {
            "systemTickets": "[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}]",
            "statusCode": 200,
            "alightResponseHeader": "{\"transactionHeader\":{\"transactionInfo\":[{\"activityId\":\"000005640\",\"activityDescription\":\"Accept New Payment Elections\",\"activityReferenceNumber\":\"83400098\",\"tbaActivity\":{\"activityBrandCode\":\"\",\"planBrandCode\":\"\",\"planDescription\":\"\",\"planId\":\"000000000\"},\"effectiveDate\":\"2019-12-18\"}]},\"systemTickets\":[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}],\"responseCode\":\"0\",\"responseDescription\":\"\"}",
            "statusMessage": "OK",
            "hasEdit": false,
            "hasServerEdit": false,
            "suaChannelResponse": {
                "isResultMode": true,
                "statusCode": 3,
                "suaStatus": "success"
            }
        };
        let mockConfig ={
            body:JSON.stringify(saveApiResponse)
        };
        return of(mockConfig as any as Response);
    }
    static screenCapture() {
        const screenCapture = true;
    }
    static screenCaptureInit() {
        const screenCaptureInit = "Review";
    }

    static gaPageTracking(href) { }
    static isCallBackAllowed() {
        return true;
    }
    static getProgressBarPopoverContent(data: any) {}
    static checkPreActivityEdit() {
        const  mockConfig = {
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
        return of(mockConfig as any as Response);
    }
    static getConfigurationData() {
        //  let mockConfig = require("../../../../al-assets/data/cancel.json");
        const mockjson = {
            status: {
                statusCode: 200,
                statusMessage: "OK",
                errorMessage: "The information that usually displays here is currently unavailable."
            }
        };
        return of(mockjson);
    }
}

describe("ReviewPensionChoicesComponent", () => {
    let component: ReviewPensionChoicesComponent;
    let fixture: ComponentFixture<ReviewPensionChoicesComponent>;
    let retirementElectionRestServiceSpy: jasmine.SpyObj<RetirementElectionRestService>;

    beforeEach(async () => {
        retirementElectionRestServiceSpy = jasmine.createSpyObj("RetirementElectionRestService", [
            "reviewYourPensionChoice",
            "getRightSideContent",
            "getCommonContent",
            "extractEditMessages",
            "getQueryParameters",
            "onCancelService",
            "setSystemTickets",
            "onRouteDBElec",
            "reviewPensionChoicesSaveServices",
            "screenCapture",
            "screenCaptureInit",
            "gaPageTracking",
            "isCallBackAllowed",
            "getProgressBarPopoverContent",
            "checkPreActivityEdit",
            "getConfigurationData",
            "renderNextPage"
        ]);
        retirementElectionRestServiceSpy.reviewYourPensionChoice.and.callFake(RetirementElectionRestServiceHelper.reviewYourPensionChoice);
        retirementElectionRestServiceSpy.getRightSideContent.and.callFake(RetirementElectionRestServiceHelper.getRightSideContent);
        retirementElectionRestServiceSpy.getCommonContent.and.callFake(RetirementElectionRestServiceHelper.getCommonContent);
        retirementElectionRestServiceSpy.extractEditMessages.and.callFake(RetirementElectionRestServiceHelper.extractEditMessages);
        retirementElectionRestServiceSpy.getQueryParameters.and.callFake(RetirementElectionRestServiceHelper.getQueryParameters);
        retirementElectionRestServiceSpy.onCancelService.and.callFake(RetirementElectionRestServiceHelper.onCancelService);
        retirementElectionRestServiceSpy.setSystemTickets.and.callFake(RetirementElectionRestServiceHelper.setSystemTickets);
        retirementElectionRestServiceSpy.onRouteDBElec.and.callFake(RetirementElectionRestServiceHelper.onRouteDBElec);
        retirementElectionRestServiceSpy.reviewPensionChoicesSaveServices.and.callFake(RetirementElectionRestServiceHelper.reviewPensionChoicesSaveServices);
        retirementElectionRestServiceSpy.screenCapture.and.callFake(RetirementElectionRestServiceHelper.screenCapture);
        retirementElectionRestServiceSpy.screenCaptureInit.and.callFake(RetirementElectionRestServiceHelper.screenCaptureInit);
        retirementElectionRestServiceSpy.gaPageTracking.and.callFake(RetirementElectionRestServiceHelper.gaPageTracking);
        retirementElectionRestServiceSpy.isCallBackAllowed.and.callFake(RetirementElectionRestServiceHelper.isCallBackAllowed);
        retirementElectionRestServiceSpy.getProgressBarPopoverContent.and.callFake(RetirementElectionRestServiceHelper.getProgressBarPopoverContent);
        retirementElectionRestServiceSpy.checkPreActivityEdit.and.callFake(RetirementElectionRestServiceHelper.checkPreActivityEdit);
        retirementElectionRestServiceSpy.getConfigurationData.and.callFake(RetirementElectionRestServiceHelper.getConfigurationData);
        retirementElectionRestServiceSpy.AuthorizePageSubject = new Subject<string>();


        await TestBed.configureTestingModule({
            declarations:
                [
                    ReviewPensionChoicesComponent,
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
                    RightSideComponent,
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
                        provide: RetirementElectionRestService, useValue: retirementElectionRestServiceSpy
                    },
                    RightSideContentService,
                    DynamicComponentService,
                    GoogleAnalyticsService,
                    ProgressBarPopoverDataCacheService
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement],
            imports:
                [
                    AlCoreModuleLibrary.forRoot(),
                    BrowserAnimationsModule,
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election/pension-payment-summary", component: ReviewPensionChoicesComponent},
                        { path: "web/retirement3x/retirement-election/payment-destination", component: ReviewPensionChoicesComponent}
                    ])
                ]
        }).compileComponents();

        fixture = TestBed.createComponent(ReviewPensionChoicesComponent);
        component = fixture.componentInstance;
        spyOn(component, "onClickContinue").and.callThrough();
        fixture.detectChanges();
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));
    it ("Component Created setConfigurationData", (() => {
        component.setConfigurationData();
    }));

    it("should invoke service", inject([RetirementElectionRestService ], (tmpService: RetirementElectionRestService, ) => {
        expect(tmpService).toBeTruthy();
    }));

    it("Should call the onClickContinue true", () => {
        component.onClickContinue(true, true , true);
        fixture.detectChanges();
    });

    it("Should call the onClickContinue false", () => {
        component.onClickContinue(false, false, false);
        fixture.detectChanges();
    });

    it("Should call the reviewSuaSaveService", () => {
        component.reviewSuaSaveService(true);
        fixture.detectChanges();
    });

    it("Should call the reviewSuaSaveService", () => {
        component.reviewSuaSaveService(false);
        fixture.detectChanges();
    });

    it("should call saveApiResponseAction", () => {

        let button = fixture.debugElement.nativeElement.querySelector("button");
        button.click();
        let saveApiResponse = {
            "systemTickets": "[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}]",
            "statusCode": 200,
            "alightResponseHeader": "{\"transactionHeader\":{\"transactionInfo\":[{\"activityId\":\"000005640\",\"activityDescription\":\"Accept New Payment Elections\",\"activityReferenceNumber\":\"83400098\",\"tbaActivity\":{\"activityBrandCode\":\"\",\"planBrandCode\":\"\",\"planDescription\":\"\",\"planId\":\"000000000\"},\"effectiveDate\":\"2019-12-18\"}]},\"systemTickets\":[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}],\"responseCode\":\"0\",\"responseDescription\":\"\"}",
            "statusMessage": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };

        component.saveApiResponseAction(saveApiResponse, true, true, true);
        component.saveApiResponseAction(saveApiResponse, false, false, false);

    });

    it("should trigger an event for isNQFlag true when saveApiResponseAction is called", () => {
        let renderNextPageSpy = retirementElectionRestServiceSpy.renderNextPage.and.callFake(() => {});
        let extractEditMessageSpy = retirementElectionRestServiceSpy.extractEditMessages.and.callFake(() => undefined);
        const buttonActionType = true;
        const isCashoutFlag = false;
        const isNQFlag = true;
        let saveApiResponse = {
            "systemTickets": "[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}]",
            "statusCode": 200,
            "alightResponseHeader": "{\"transactionHeader\":{\"transactionInfo\":[{\"activityId\":\"000005640\",\"activityDescription\":\"Accept New Payment Elections\",\"activityReferenceNumber\":\"83400098\",\"tbaActivity\":{\"activityBrandCode\":\"\",\"planBrandCode\":\"\",\"planDescription\":\"\",\"planId\":\"000000000\"},\"effectiveDate\":\"2019-12-18\"}]},\"systemTickets\":[{\"key\":\"$T6K\",\"value\":\"CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898\"}],\"responseCode\":\"0\",\"responseDescription\":\"\"}",
            "statusMessage": "OK",
            "hasEdit": false,
            "hasServerEdit": false,
            "routingPage": "SUBS"
        };
        component.hassTBAEdit = true;
        component.saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isNQFlag);
        expect(extractEditMessageSpy).toHaveBeenCalled();
        expect(renderNextPageSpy).toHaveBeenCalledTimes(1);
    });

    it("Should call the onCancel", () => {
        component.onCancel();
        fixture.detectChanges();
    });

    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });

    it("should continue when continueEdit is triggered", () => {
        const parameters = {
            buttonActionType: true,
            isCashoutFlag: false,
            isNQFlag: true
        };

        const continueClickSpy = spyOn(component, "continueClick").and.callFake(() => {});
        component.continueEdit(parameters);

        expect(continueClickSpy).toHaveBeenCalled();
    });

});
