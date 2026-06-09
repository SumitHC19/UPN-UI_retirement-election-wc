import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility   } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   RetirementElectionRestService   } from "../../../../../services/retirement-election-rest.service";
import {   HypotheticalPanelSectionComponent   } from "./hypothetical-panel-section.component";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   EditMessagesService   } from "../../../../../services/edit-messages.service";

export class RetirementElectionRestServiceMock {
    public choosePaymentOptionResponse: any;
    constructor() { }

    getChoosePaymentOptionData() {
        let mockConfig = require("../../../../../al-assets/data/AutoSelectExample.json");
        this.choosePaymentOptionResponse = mockConfig;
        return of(this.choosePaymentOptionResponse);
    }

    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
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

describe("HypotheticalPanelSectionCom ponent", () => {
    let component: HypotheticalPanelSectionComponent;
    let fixture: ComponentFixture<HypotheticalPanelSectionComponent>;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        HypotheticalPanelSectionComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        EditMessagesService
                    ],
                imports:
                    [
                        AlCoreModuleLibrary.forRoot(),
                        RouterTestingModule,
                        BrowserAnimationsModule,
                    ]
            }
        ).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HypotheticalPanelSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it ("should call the onCancel", () => {
        component.onCancel();
    });
    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });
});
