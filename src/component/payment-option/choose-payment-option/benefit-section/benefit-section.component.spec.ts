import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility   } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   IntegrationCpoPpsService   } from "../../../../services/integration-cpo-pps.service";
import {   RetirementElectionRestService   } from "../../../../services/retirement-election-rest.service";
import {   CustomAlPanelComponent   } from "../../../shared/custom-al-panel/custom-al-panel.component";
import {   BenefitSectionComponent   } from "./benefit-section.component";
import {   HypotheticalPanelSectionComponent   } from "./hypothetical-panel-section/hypothetical-panel-section.component";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   FootnoteComponent   } from "../../../shared/footnote-common/footnote-common-component";
import {   FootnoteService   } from "../../../../services/footnote-common.service";
import {   EditMessagesService   } from "../../../../services/edit-messages.service";

export class RetirementElectionRestServiceMock {
    public choosePaymentOptionResponse: any;
    orgName;
    constructor() {
        this.orgName = "retirement3x";
    }

    getChoosePaymentOptionData() {
        let mockConfig = require("../../../../al-assets/data/AutoSelectExample.json");
        this.choosePaymentOptionResponse = mockConfig;
        return of(this.choosePaymentOptionResponse);
    }
    onRouteDBElec() {

    }
}
describe("BenefitSectionComponent", () => {

    let component: BenefitSectionComponent;
    let fixture: ComponentFixture<BenefitSectionComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        BenefitSectionComponent,
                        HypotheticalPanelSectionComponent,
                        CustomAlPanelComponent,
                        FootnoteComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        IntegrationCpoPpsService,
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        FootnoteService,
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        EditMessagesService
                    ],
                imports:
                    [
                        AlCoreModuleLibrary.forRoot(),
                        RouterTestingModule,
                        BrowserAnimationsModule
                    ]
            }
        ).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BenefitSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });
    it ("Component Created ngOnInit", (() => {

        component.ngOnInit();
    }));


    /*   it('should call handle error', () => {
        let error = Error;
        component.handleError(error);
        fixture.detectChanges();
    }); */

});
