import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, DynamicComponentService, GoogleAnalyticsService, IDBService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed, inject   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   ReviewPensionChoicesService   } from "../../../services/review-pension-choices.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   CompletedSuccessfullyDSService   } from "../../../services/completed-successfully-data-save.service";
import {   AuthorizationCommonService   } from "../../../services/authorization-common.service";
import {   AuthorizationCommonComponent   } from "../../shared/authorization-common/authorization-common.component";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   SubmittedSuccessfullyComponent   } from "./submitted-successfully.component";
import {   RightSideComponent   } from "../../shared/right-side-components/right-side-components.component";
import {   RightSideContentService   } from "../../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../../services/footnote-common.service";

export class RetirementElectionRestServiceMock {
    constructor() {

    }
    submittedSuccessfullyService() {
        let mockConfig = require("../../../al-assets/data/submittedSuccessfully.json");
        return of(mockConfig);
    }
    getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/submittedSuccessfully.json");
        return of(mockConfig);
    }
    getRightSideContent() {
        let mockConfig = require("../../../al-assets/data/common.json");
        return of(mockConfig);
    }
    getCommonContent() {
        let mockConfig = require("../../../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "Submitted Sucessfully";
    }
    onRouteDBElec() {

    }
    isCallBackAllowed() {
        return true;
    }
    loadScript() { }
    getRecordFromObjStore(retirementLockStatusWidget, retirementLockStatus) {
        let response = require("../../../al-assets/data/completedSubmittedSucces.json");
        return of(response);
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

describe("SubmittedSuccessfullyComponent", () => {

    let component: SubmittedSuccessfullyComponent;
    let fixture: ComponentFixture<SubmittedSuccessfullyComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({

            declarations:
                [
                    SubmittedSuccessfullyComponent,
                    ErrorComponent,
                    AuthorizationCommonComponent,
                    RightSideComponent,
                    FootnoteComponent
                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    ReviewPensionChoicesService,
                    AuthorizationCommonService,
                    StepsActiveIndexService,
                    CompletedSuccessfullyDSService,
                    RightSideContentService,
                    AppUtility,
                    LoggingService,
                    LoggingStartupConfigService,
                    DynamicComponentService,
                    GoogleAnalyticsService,
                    FootnoteService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: IDBService, useClass: RetirementElectionRestServiceMock
                    }
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement],
            imports:
                [
                    AlCoreModuleLibrary.forRoot(),
                    RouterTestingModule,
                    BrowserAnimationsModule,
                ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubmittedSuccessfullyComponent);
        component = fixture.componentInstance;
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });
    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    it("should invoke sevice", inject([RetirementElectionRestService], (tmpService: RetirementElectionRestService, ) => {
        expect(tmpService).toBeTruthy();
    }));

    it("getAccountLockData function called Successfully", () => {
        expect(component).toBeTruthy();
        component.getAccountLockData("value");
    });

});
