import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   RetirementElectionRestService   } from "../services/retirement-election-rest.service";
import {   ReviewPensionChoicesService   } from "../services/review-pension-choices.service";
import {   ProgressBarPopoverDataCacheService   } from "../services/progressBarPopoverDataCache.service";
import {   RouterService   } from "../services/router.service";
import {   StepsActiveIndexService   } from "../services/steps-active-index-service";
import {   ProgressBarComponent   } from "./progress-bar/progress-bar.component";
import {   RetirementElectionComponent   } from "./retirement-election.component";
import {   EditMessagesComponent   } from "./shared/edit-messages/edit-messages.component";
import {   ActivatedRoute   } from "@angular/router";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA  } from "@angular/core";
import { DeferredSuccessfullyDSService } from "src/services/deferred-successfully-data-save.service";

export class RetirementElectionRestServiceMock {
    orgName;
    constructor() {
        this.orgName = "retirement3x";
    }
    pensionPaymentSummaryService() {
        let mockConfig = require("../al-assets/data/reviewbutton.json");
        return of(mockConfig);
    }
    getCommonContent() {
        let mockConfig = require("../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    onRouteDBElec() {

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
    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
}

describe("RetirementElectionComponent", () => {
    let component: RetirementElectionComponent;
    let fixture: ComponentFixture<RetirementElectionComponent>;
    let dynamicComponentServiceSpy: jasmine.SpyObj<DynamicComponentService>;

    beforeEach(waitForAsync(() => {
        dynamicComponentServiceSpy = jasmine.createSpyObj(
            "DynamicComponentService",
            ["initializePageComponents", "loadMFScript"]
        );
        TestBed.configureTestingModule({
            declarations:
                [
                    RetirementElectionComponent,
                    ProgressBarComponent,
                    EditMessagesComponent
                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    ReviewPensionChoicesService,
                    StepsActiveIndexService,
                    RouterService,
                    ProgressBarPopoverDataCacheService,
                    DeferredSuccessfullyDSService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    { provide: ActivatedRoute, useValue: { queryParams: of({ cbPageId: "" }) } },
                    { provider: DynamicComponentService, useValue: dynamicComponentServiceSpy}
                ],
            imports:
                [
                    AlCoreModuleLibrary.forRoot(),
                    BrowserAnimationsModule,
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election", component: RetirementElectionComponent}
                    ])
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RetirementElectionComponent);
        component = fixture.componentInstance;
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });
    it("Should call the getCommonContentFunction", () => {
        component.getCommonContentFuncton();
    });

    it("Should call the ngOnInit", () => {
        component.ngOnInit();
    });
    it("Should setup wcs on ng after content init", async () => {
        component.ngAfterContentInit();
    });

    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit(event);
    });

    it("should call cancel service", () => {
        component.onCancel();
    });

    it("should set property 'changeModal' when setChangeModalContent is called", () => {
        const data = { changeModal: "test" };
        component.changeModalContent  = undefined;
        component.setChangeModalContent(data);
        expect(component.changeModalContent ).not.toBeUndefined();
    });

    it("should set property 'routeLink' when setChangeModalContent is called", () => {
        const data = { routeLink: "test" };
        component.routeLink = undefined;
        component.setChangeModalContent(data);
        expect(component.routeLink).not.toBeUndefined();
    });

    it("should call the print btn click", () => {
        let printSpy = spyOn(window, "print").and.callFake(() => {});
        component.printBtnClick();
        expect(printSpy).toHaveBeenCalled();
    });
});
