import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, DomStorageFallbackService, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService, CacheStorageService } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   FormsModule, ReactiveFormsModule   } from "@angular/forms";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   EditMessagesService   } from "../../../services/edit-messages.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   ReceivePaymentComponent   } from "./payment-destination.component";
import {   ReviewPensionChoicesService   } from "../../../services/review-pension-choices.service";
import {   ProgressBarPopoverDataCacheService   } from "../../../services/progressBarPopoverDataCache.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";

export class RetirementElectionRestServiceHelper {

    static receivePaymentService() {
        let mockConfig = require("../../../al-assets/data/paymentdestination.json");
        return of(mockConfig as any as Response);
    }
    static getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/paymentdestination.json");
        return of(mockConfig as any as Response);
    }
    static getCommonContent() {
        let mockConfig = require("../../../al-assets/data/cancel.json");
        return of(mockConfig as any as Response);
    }
    static paymentDestinationSaveServices() {
        let mockConfig = {
            body: JSON.stringify({statusCode: 200,statusMessage: "OK", status: "OK", hasEdit: false, hasServerEdit: true})
        };
        return of(mockConfig as any as Response);
    }
    static extractEditMessages() {
        return [];
    }
    static onCancelService() {
        let mockConfig = {
            body: JSON.stringify({statusCode: 200, statusMessage: "OK", status: "OK", hasEdit: false, hasServerEdit: true})
        };
        return of(mockConfig as any as Response);
    }
    static checkPreActivityEdit() {
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
        return of(mockConfig as any as Response);
    }
}

describe("ReceivePaymentComponent", () => {
    let component: ReceivePaymentComponent;
    let fixture: ComponentFixture<ReceivePaymentComponent>;
    let retirementElectionRestServiceSpy: jasmine.SpyObj<RetirementElectionRestService>;
    let reviewPensionChoicesServiceSpy: jasmine.SpyObj<ReviewPensionChoicesService>;
    let progressBarPopoverDataCacheServiceSpy: jasmine.SpyObj<ProgressBarPopoverDataCacheService>;


    beforeEach(async () => {

        retirementElectionRestServiceSpy = jasmine.createSpyObj("RetirementElectionRestService", [
            "ViewRhrComponents", "isCurrentStepRolloverDest", "showQuitButton", "showCBLButton", "isMultiBeneSupported","isActivePBEnabled",

            "isCallBackAllowed",
            "getQueryParameters",
            "screenCapture",
            "getLocale",
            "isDefaultLocale",
            "receivePaymentService",
            "setSystemTickets",
            "gaPageTracking",
            "setProgressbarData",
            "setRightRailData",
            "getProgressBarPopoverContent",
            "screenCaptureInit",
            "paymentDestinationSaveServices",
            "extractEditMessages",
            "renderNextPage",
            "onRouteDBElec",
            "checkPreActivityEdit",
            "onCancelService",
            "getCommonContent",
            "redirectToCancelPage",
            "redirectToDBNQCancelPage",
        ]);
        retirementElectionRestServiceSpy.AuthorizePageSubject = new Subject<string>();
        retirementElectionRestServiceSpy.isCallBackAllowed.and.callFake(() => true);
        retirementElectionRestServiceSpy.receivePaymentService.and.callFake(RetirementElectionRestServiceHelper.receivePaymentService);
        retirementElectionRestServiceSpy.getQueryParameters.and.callFake(RetirementElectionRestServiceHelper.getQueryParameters);
        retirementElectionRestServiceSpy.getCommonContent.and.callFake(RetirementElectionRestServiceHelper.getCommonContent);
        retirementElectionRestServiceSpy.paymentDestinationSaveServices.and.callFake(RetirementElectionRestServiceHelper.paymentDestinationSaveServices);
        retirementElectionRestServiceSpy.extractEditMessages.and.callFake(RetirementElectionRestServiceHelper.extractEditMessages);
        retirementElectionRestServiceSpy.onCancelService.and.callFake(RetirementElectionRestServiceHelper.onCancelService);
        retirementElectionRestServiceSpy.checkPreActivityEdit.and.callFake(RetirementElectionRestServiceHelper.checkPreActivityEdit);

        reviewPensionChoicesServiceSpy = jasmine.createSpyObj("ReviewPensionChoicesService", ["getBackButton", "setBackButton"]);
        reviewPensionChoicesServiceSpy.getBackButton.and.callFake(() => true);

        progressBarPopoverDataCacheServiceSpy = jasmine.createSpyObj("ProgressBarPopoverDataCacheService", ["getProgressBarPopoverDataInCache"]);
        progressBarPopoverDataCacheServiceSpy.popOverIDBData = "";
        progressBarPopoverDataCacheServiceSpy.getProgressBarPopoverDataInCache.and.callFake(() => of("data"));



        await TestBed.configureTestingModule({
            declarations:
                    [
                        ReceivePaymentComponent,
                        ErrorComponent
                    ],
            providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        EditMessagesService,
                        StepsActiveIndexService,
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        GoogleAnalyticsService,
                        DynamicComponentService,
                        {
                            provide: RetirementElectionRestService, useValue: retirementElectionRestServiceSpy
                        },
                        {
                            provide: ReviewPensionChoicesService, useValue: reviewPensionChoicesServiceSpy
                        },
                        {
                            provide: ProgressBarPopoverDataCacheService, useValue: progressBarPopoverDataCacheServiceSpy
                        }
                    ],
            imports:
                    [
                        BrowserAnimationsModule,
                        AlCoreModuleLibrary.forRoot(),
                        FormsModule,
                        ReactiveFormsModule,
                        RouterTestingModule.withRoutes([
                            { path: "web/retirement3x/retirement-election/review-choices", component: ReceivePaymentComponent},
                            { path: "web/retirement3x/retirement-election/payment-destination", component: ReceivePaymentComponent}
                        ])
                    ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
        }).compileComponents();

        fixture = TestBed.createComponent(ReceivePaymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    it("Component call secondaryDestinationValidator", () => {
        fixture.whenStable().then(() => {
            spyOn(component, "secondaryDestinationValidator").and.callThrough();
            component.secondaryDestinationValidator();
            fixture.detectChanges();
            expect(component.secondaryDestinationValidator).toHaveBeenCalled();
        });
    });

    it("Should able call onChange", () => {
        component.onChange();

    });

    it("Should able call onChange with split value", () => {
        component.form.get("amount_2000_3000").setValue("100");
        fixture.detectChanges();
        component.onChange();

    });

    it("Should able call onChange with split value 0", () => {
        component.form.get("amount_2000_3000").setValue("0");
        fixture.detectChanges();
        component.onChange();

    });

    it("should call the getPatterns", () => {
        component.getPatterns();
        fixture.detectChanges();
        expect(component.pattern).toBeDefined();
    });

    it("Component call onCancel", () => {
        fixture.whenStable().then(() => {
            spyOn(component, "onCancel").and.callThrough();
            component.onCancel();
            fixture.detectChanges();
            expect(component.onCancel).toBeTruthy();
        });
    });

    it("Component call cancontinue", () => {
        fixture.whenStable().then(() => {
            spyOn(component, "cancontinue").and.callThrough();
            component.cancontinue(true, true, false);
            fixture.detectChanges();
            expect(component.cancontinue).toBeTruthy();
        });
    });

    it("Should able call onContinueClick", () => {
        let FormValue = {
            value: { "1000_5000": "", "2000_2000": 10, "amount_2000_3000": "100.0", "2000_3000": 10 }
        };
        component.form.get("amount_2000_3000").setValue("0");
        fixture.detectChanges();
        component.onContinueClick(FormValue, false, true, true, false);
    });



    it("Should able call onContinueClick - comebacklater", () => {
        let FormValue = {value: { "1000_5000": "", "2000_2000": 10, "amount_2000_3000": "100.0", "2000_3000": 10 }};
        component.form.get("amount_2000_3000").setValue("0");
        fixture.detectChanges();
        component.onContinueClick(FormValue, false, false, false, false);
    });

    it("Should able call onContinueClick - comebacklater valid case", () => {
        let FormValue = {value: { "1000_5000": 140, "2000_2000": 10, "amount_2000_3000": "100.0", "2000_3000": 10 }};
        component.form.get("amount_2000_3000").setValue("0");
        fixture.detectChanges();
        component.onContinueClick(FormValue, true, false, false, false);
    });

    it("should call saveApiResponseAction function true", waitForAsync(() => {
        let apiResponse: any = {};
        component.saveApiResponseAction(apiResponse, true, false, false);
    }));

    it("should call saveApiResponseAction function false", waitForAsync(() => {
        let apiResponse: any = {};
        component.saveApiResponseAction(apiResponse, false, false, false);
    }));

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
        };
        component.hassTBAEdit = true;

        component.saveApiResponseAction(saveApiResponse, buttonActionType, isCashoutFlag, isNQFlag);

        expect(extractEditMessageSpy).toHaveBeenCalled();
        expect(renderNextPageSpy).toHaveBeenCalledTimes(1);
    });

    it("should able to call continueclick", waitForAsync(() => {
        component.allowContinue = true;
        component.allowContinueAddOne = true;
        fixture.detectChanges();
        let FormValue = {
            value: { "1000_5000": 140, "2000_2000": 10, "amount_2000_3000": "100.0", "2000_3000": 10 }
        };
        component.form.get("amount_2000_3000").setValue("0");
        component.onContinueClick(FormValue, true, true, true, false);
    }));

    it("should able to call continueclick false case", waitForAsync(() => {
        component.allowContinue = false;
        component.allowContinueAddOne = false;
        fixture.detectChanges();
        let FormValue = {
            value: { "1000_5000": 140, "2000_2000": 10, "amount_2000_3000": "100.0", "2000_3000": 10 }
        };
        component.form.get("amount_2000_3000").setValue("0");
        component.onContinueClick(FormValue, true, true, true, false);
    }));

    it("should call onCancel", () => {
        component.onCancel();
    });

    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });

    it("should call redirectBack", () => {
        component.redirectBack();
    });
});
