import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   FormsModule, ReactiveFormsModule   } from "@angular/forms";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   EditMessagesService   } from "../../../services/edit-messages.service";
import {   NextStepIndexService   } from "../../../services/next-step-index.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   RouterService   } from "../../../services/router.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   HowMuchToRolloverComponent   } from "./how-much-to-rollover.component";
import {   ReviewPensionChoicesService   } from "../../../services/review-pension-choices.service";
import {   ProgressBarPopoverDataCacheService   } from "../../../services/progressBarPopoverDataCache.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";

export class RetirementElectionRestServiceMock {
    orgName;
    popoverDataSubject = new Subject();
    isActivePBEnabled = true;
    constructor() {
        this.orgName = "retirement3x";
    }
    howMuchRollOverdataService1() {
        let mockConfig = require("../../../al-assets/data/choosehowmuchtorolloverlldresponse.json");
        return of(mockConfig);
    }
    howMuchRollOverdataService() {
        let mockConfig = require("../../../al-assets/data/choosehowmuchtorolloverlldresponse.json");
        return of(mockConfig);
    }
    getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/choosehowmuchtorolloverlldresponse.json");
        return of(mockConfig);
    }
    howMuchRollOverSaveService() {
        let mockConfig = require("../../../al-assets/data/choosehowmuchtorolloverlldresponse.json");
        return of(mockConfig);
    }
    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    getCommonContent() {
        let mockConfig = require("../../../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    extractEditMessages() {
        let editMessages = [];
        return editMessages;
    }
    setSystemTickets(data: any) {
    }
    onRouteDBElec() {
    }
    getBackButton() {
        return true;
    }
    setBackButton(val: boolean){

    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "rollover amount";
    }
    // pageUrlFromCashoutRoot(href){

    // }
    gaPageTracking(href) {

    }
    isCallBackAllowed() {
        return true;
    }
    getProgressBarPopoverDataInCache() {
        return of("data");
    }
    getProgressBarPopoverContent(data: any) {}
    getLocale() {}
    isDefaultLocale(en_US) {}
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

describe("HowMuchToRolloverComponent", () => {
    let component: HowMuchToRolloverComponent;
    let fixture: ComponentFixture<HowMuchToRolloverComponent>;
    let compiled: any;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        HowMuchToRolloverComponent,
                        ErrorComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        EditMessagesService,
                        StepsActiveIndexService,
                        NextStepIndexService,
                        RouterService,
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        GoogleAnalyticsService,
                        DynamicComponentService,
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        {
                            provide: ReviewPensionChoicesService, useClass: RetirementElectionRestServiceMock
                        },
                        {
                            provide: ProgressBarPopoverDataCacheService, useClass: RetirementElectionRestServiceMock
                        }
                    ],
                imports:
                    [
                        BrowserAnimationsModule,
                        AlCoreModuleLibrary.forRoot(),
                        FormsModule,
                        ReactiveFormsModule,
                        RouterTestingModule.withRoutes([
                            { path: "web/retirement3x/retirement-election/review-choices", component: HowMuchToRolloverComponent}
                        ])
                    ],
                schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
            }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HowMuchToRolloverComponent);
        component = fixture.componentInstance;
        compiled = fixture.debugElement.nativeElement;
        // spyOn(component, 'onCancel').and.callThrough();
        spyOn(component, "continueClick").and.callThrough();
        spyOn(component, "canContinue").and.callThrough();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should call the getPatterns", () => {
        component.getPatterns();
        // fixture.detectChanges();
        expect(component.pattern).toBeDefined();
    });

    it ("should call the expand all", () => {
        component.onCancel();
    });
    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });
    it("should call continueClick", () => {
        component.continueClick(true, true);
        component.canContinue(true, true);

    });

    it("should call continueClick", () => {
        component.continueClick(true, false);
        component.canContinue(true, false);

    });

    it("should call continueClick false", () => {
        component.continueClick(false, false);
        component.canContinue(false, false);
    });

    it("should call continueClick false", () => {
        component.continueClick(false, true);
        component.canContinue(false, true);
    });

    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    it("should call saveApiResponseAction", () => {

        /*  let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click(); */
        let saveApiResponse = {
            "systemTickets": "[{'key':'$T6K','value':'CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898'}]",
            "statusCode": 200,
            "alightResponseHeader": "{'transactionHeader':{'transactionInfo':[{'activityId':'000005640','activityDescription':'Accept New Payment Elections','activityReferenceNumber':'83400098','tbaActivity':{'activityBrandCode':'','planBrandCode':'','planDescription':'','planId':'000000000'},'effectiveDate':'2019-12-18'}]},'systemTickets':[{'key':'$T6K','value':'CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898'}],'responseCode':'0','responseDescription':''}",
            "statusMessage": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };

        component.saveApiResponseAction(saveApiResponse, null, true);

    });

    it("should call saveApiResponseAction false", () => {

        /*  let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click(); */
        let saveApiResponse = {
            "systemTickets": "[{'key':'$T6K','value':'CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898'}]",
            "statusCode": 400,
            "alightResponseHeader": "{'transactionHeader':{'transactionInfo':[{'activityId':'000005640','activityDescription':'Accept New Payment Elections','activityReferenceNumber':'83400098','tbaActivity':{'activityBrandCode':'','planBrandCode':'','planDescription':'','planId':'000000000'},'effectiveDate':'2019-12-18'}]},'systemTickets':[{'key':'$T6K','value':'CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898'}],'responseCode':'0','responseDescription':''}",
            "statusMessage": "OK",
            "hasEdit": true,
            "hasServerEdit": false
        };
        component.saveApiResponseAction(saveApiResponse, null, false);
    });

    it("should call setUpAccount", () => {
        component.setUpAccount();
    });

    it("should call redirectBack", () => {
        component.redirectBack();
    });
    it ("Component Created handleRCMessages", (() => {
        component.handleRCMessages(event);
    }));
    it("should call clickOnLink when event data matches redirect condition", () => {
        spyOn(component, "clickOnLink");
        const mockEvent = { origin: component.rcPageLink, data: "redirectToIRALanding" };
        component.handleRCMessages(mockEvent);
        // expect(component.clickOnLink).toHaveBeenCalledWith(component.iralandingLink);
    });

    it("should create and click an anchor element when a valid link is provided", () => {

        const testLink = "<a href='https://example.com'>Click here</a>";
        spyOn(document.body, "appendChild");
        spyOn(document.body, "removeChild");
        spyOn(HTMLElement.prototype, "click").and.callFake(() => console.log("Click simulated"));


        component.clickOnLink(testLink);

        const tempElement = document.createElement("div");
        tempElement.innerHTML = testLink.trim();
        const anchorElement = tempElement.firstChild as HTMLElement;

        expect(document.body.appendChild).toHaveBeenCalledWith(anchorElement);
        expect(document.body.removeChild).toHaveBeenCalledWith(anchorElement);
    });
});
