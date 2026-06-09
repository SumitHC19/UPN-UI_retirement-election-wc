import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Subject   } from "rxjs";
import {   UISafePipe, DomStorageFallbackService, LoggingService, LoggingStartupConfigService, AppUtility, DynamicComponentService, GoogleAnalyticsService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   EditMessagesService   } from "../../services/edit-messages.service";
import {   RetirementElectionRestService   } from "../../services/retirement-election-rest.service";
import {   StepsActiveIndexService   } from "../../services/steps-active-index-service";
import {   CompletedSuccessfullyDSService   } from "../../services/completed-successfully-data-save.service";
import {   ProgressBarPopoverDataCacheService   } from "../../services/progressBarPopoverDataCache.service";
import {   AuthorizeYourChoicesComponent   } from "./authorize-your-choices";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";

export class RetirementElectionRestServiceMock {
    orgName;
    AuthorizeButtonSubject =  new Subject();
    editMessageFlagSubject = new Subject();
    redirectToUrlSubject = new Subject();
    editButtonListSubject = new Subject();
    pageNameSubject = new Subject();
    buttonActionTypeSubject = new Subject();
    saveApiRequestBodySubject = new Subject();
    popoverDataSubject = new Subject();
    isActivePBEnabled = true;
    constructor() {
        this.orgName = "retirement3x";
    }
    authorizeYourChoicesService() {
        let mockConfig = require("../../al-assets/data/authorizeyourpage.json");
        return of(mockConfig);
    }
    authorizeYourChoicesSaveService(saveApiRequestBody, buttonActionType, businessProcessReferenceId) {
        let mockConfig = {
            "body": {
                "statusCode": 200,
                "statusMessage": "200 OK",
                "status": "OK",
                "hasEdit": false,
                "hasServerEdit": false
            }
        };
        return of(mockConfig);
    }
    reviewYourPensionChoice(isFromAuthPage: boolean, isDbCashoutFlag: boolean, isRoutedToSUA: boolean) {
        let mockConfig = require("../../al-assets/data/reviewyourpensionchoice.json");
        return of(mockConfig);
    }
    getQueryParameters() {
        let mockConfig = require("../../al-assets/data/authorizeyourpage.json");
        return of(mockConfig);
    }
    setItem(name,value,storage,cookie) {
    }
    extractEditMessages(headers) {
        return {};
    }
    saveEditArray(val) {

    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "Authorize Your Choices";
    }
    getItem(){

    }
    onRouteDBElec() {

    }
    registerBeforePrintHandler(){

    }
    registerAfterPrintHandler(){

    }
    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
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
}

export class DynamicComponentServiceStub {
    loadCustomJS() {
    }
    loadScript() {
    }
    initializePageComponents() {
    }
}

describe("AuthorizeYourChoicesComponent", () => {
    let component: AuthorizeYourChoicesComponent;
    let fixture: ComponentFixture<AuthorizeYourChoicesComponent>;
    let expand = false;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({

            declarations:
                [
                    AuthorizeYourChoicesComponent,
                    UISafePipe
                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    StepsActiveIndexService,
                    CompletedSuccessfullyDSService,
                    LoggingService,
                    LoggingStartupConfigService,
                    AppUtility,
                    {
                        provide: EditMessagesService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: DomStorageFallbackService, useClass: RetirementElectionRestServiceMock
                    },
                    GoogleAnalyticsService,
                    { provide: DynamicComponentService, useClass: DynamicComponentServiceStub },
                    {
                        provide: ProgressBarPopoverDataCacheService, useClass: RetirementElectionRestServiceMock
                    }
                ],
            imports:
                [
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election/saved", component: AuthorizeYourChoicesComponent },
                        { path: "web/retirement3x/retirement-election/authorization-complete", component: AuthorizeYourChoicesComponent }
                    ])
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthorizeYourChoicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });
    it("should call initializer function in constructor", () => {
        fixture = TestBed.createComponent(AuthorizeYourChoicesComponent);
        component = fixture.componentInstance;
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should call the collapse all", () => {
        component.collapseAll();
    });
    it("should call the expand all", () => {
        component.expandAll();
    });
    it("should call the authtoggle all", () => {
        let printSpy = spyOn(window, "print").and.callFake(() => {});
        component.authToggleAll();
        expect(printSpy).toHaveBeenCalled();
    });
    it("should call setgeneralNorExpand", () => {
        component.setgeneralAuthExpand(expand);
    });
    it("should call setactive", () => {
        component.setactive(expand, undefined);
    });
    it("should able to call canContinue", waitForAsync(() => {
        component.selectedValues = undefined;
        component.canContinue(true);
        fixture.detectChanges();
    }));
    it("should call saveApiResponse service true", () => {
        let saveApiResponse = {
            "statusCode": 200,
            "statusMessage": "200 OK",
            "status": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };
        component.responseStatusCode = 200;
        fixture.detectChanges();
        component.saveApiResponseAction(saveApiResponse,true);
    });
    it("should call saveApiResponse service false", () => {
        let saveApiResponse = {
            "statusCode": 200,
            "statusMessage": "200 OK",
            "status": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };
        component.responseStatusCode = 200;
        fixture.detectChanges();
        component.saveApiResponseAction(saveApiResponse,false);
    });
    it("should call saveApiResponse service edit case", () => {
        let saveApiResponse = {
            "statusCode": 400,
            "statusMessage": "200 OK",
            "status": "OK",
            "hasEdit": true,
            "hasServerEdit": false
        };
        component.responseStatusCode = 400;
        fixture.detectChanges();
        component.saveApiResponseAction(saveApiResponse,false);
    });
    it("should call saveApiResponse service edit case", () => {
        let saveApiResponse = {
            "statusCode": 200,
            "statusMessage": "200 OK",
            "status": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };
        component.responseStatusCode = 400;
        fixture.detectChanges();
        component.saveApiResponseAction(saveApiResponse,false);
    });
    it("should able to call cancel service",() => {
        component.onCancel();
    });
    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });
    it("should able to call showNotificationPopover",() => {
        component.showNotificationPopover();
    });
    it("should able to call authorizeSaveService",() => {
        component.authorizeSaveService(true);
    });
});
