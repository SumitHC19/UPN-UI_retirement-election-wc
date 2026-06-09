import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {  TestBed, ComponentFixture, waitForAsync, inject  } from "@angular/core/testing";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   DeferredSuccessfullyComponent   } from "./deferred.component";
import {   RetirementElectionRestService   } from "../../services/retirement-election-rest.service";
import {   AuthorizationCommonService   } from "../../services/authorization-common.service";
import {   DeferredSuccessfullyDSService   } from "../../services/deferred-successfully-data-save.service";
import {   ErrorComponent   } from "../shared/error/error.component";
import {   AuthorizationCommonComponent   } from "../shared/authorization-common/authorization-common.component";
import {   RightSideComponent   } from "../shared/right-side-components/right-side-components.component";
import {   AlCoreModuleLibrary,LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement   } from "@angular/core";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteService   } from "../../services/footnote-common.service";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";












export class RetirementElectionRestServiceMock {
    constructor() {

    }
    deferredSuccessfullyService() {
        let mockConfig = require("../../al-assets/data/deferred.json");
        return of(mockConfig);
    }
    getQueryParameters(){
        let mockConfig = require("../../al-assets/data/completedSuccessfully.json");
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
        let screenCaptureInit = "Deferred";
    }
}

describe("DeferredSuccessfullyComponent", ()=>{

    let component: DeferredSuccessfullyComponent;
    let fixture: ComponentFixture<DeferredSuccessfullyComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({

            declarations:
            [
                DeferredSuccessfullyComponent,
                ErrorComponent,
                AuthorizationCommonComponent,
                RightSideComponent
            ],
            providers:
            [
                provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                AuthorizationCommonService,
                LoggingService,
                LoggingStartupConfigService,
                AppUtility,
                GoogleAnalyticsService,
                DynamicComponentService,
                FootnoteService,
                {
                    provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                },
                DeferredSuccessfullyDSService

            ],
            imports:
            [
                AlCoreModuleLibrary.forRoot(),
                RouterTestingModule,
                BrowserAnimationsModule,
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
        }).compileComponents();
    }));

    beforeEach(()=> {
        fixture = TestBed.createComponent(DeferredSuccessfullyComponent);
        component = fixture.componentInstance;
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should invoke sevice", inject([RetirementElectionRestService ], (tmpService: RetirementElectionRestService, ) => {
        expect(tmpService).toBeTruthy();
    }));
    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));
    it("Should able to call print page", (() => {
        let printSpy = spyOn(window, "print").and.callFake(() => {});
        component.printPage();
        expect(printSpy).toHaveBeenCalled();
    }));
});
