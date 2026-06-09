import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of ,Subject   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService, IDBService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   AuthorizationCommonService   } from "../../../services/authorization-common.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   ReviewPensionChoicesService   } from "../../../services/review-pension-choices.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   AuthorizationCommonComponent   } from "../../shared/authorization-common/authorization-common.component";
import {   CompletedSuccessfullyDSService   } from "../../../services/completed-successfully-data-save.service";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   CompletedSuccessfullyComponent   } from "./completed-successfully.component";
import {   RightSideComponent   } from "../../shared/right-side-components/right-side-components.component";
import {   RightSideContentService   } from "../../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../../services/footnote-common.service";

export class RetirementElectionRestServiceMock {
    popoverDataSubject = new Subject();
    constructor() {

    }
    completedSuccessfullyService() {
        let mockConfig = require("../../../al-assets/data/completedSuccessfully.json");
        return of(mockConfig);
    }
    getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/completedSuccessfully.json");
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
        let screenCaptureInit = "Completed Sucessfully";
    }
    // pageUrlFromCashoutRoot(href){

    // }
    gaPageTracking(href) {

    }
    isCallBackAllowed() {
        return true;
    }
    loadScript() {}
    getRecordFromObjStore(retirementLockStatusWidget: string, retirementLockStatus: string) {
        let response = require("../../../al-assets/data/completedSubmittedSucces.json");
        return of(response);
    }
}

describe("CompletedSuccessfullyComponent", () => {

    let component: CompletedSuccessfullyComponent;
    let fixture: ComponentFixture<CompletedSuccessfullyComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({

            declarations:
                [
                    CompletedSuccessfullyComponent,
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
                    LoggingService,
                    LoggingStartupConfigService,
                    AppUtility,
                    FootnoteService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    { provide: IDBService, useClass: RetirementElectionRestServiceMock },
                    GoogleAnalyticsService,
                    DynamicComponentService
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
        fixture = TestBed.createComponent(CompletedSuccessfullyComponent);
        component = fixture.componentInstance;
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    /*  it('Component call getCompletedSuccessfullyData', (() => {
        fixture.whenStable().then(() => {
            spyOn(component,
                'getCompletedSuccessfullyData').and.callThrough();
            component.getCompletedSuccessfullyData();
            fixture.detectChanges();
            expect(component.getCompletedSuccessfullyData()).toHaveBeenCalled();
        });
    })); */

    /* it('should invoke sevice', inject([RetirementElectionRestService], (tmpService: RetirementElectionRestService, ) => {
        expect(tmpService).toBeTruthy();
    }));

    */
    it("getAccountLockData function called Successfully", () => {
        expect(component).toBeTruthy();
        component.getAccountLockData("value");
    });

});
