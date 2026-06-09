import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   AlPanelSectionService   } from "../../../services/al-panel-section.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   CustomAlPanelComponent   } from "../../shared/custom-al-panel/custom-al-panel.component";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   PanelSectionComponent   } from "../../shared/panel-section/panel-section.component";
import {   ChooseCategoryComponent   } from "./choose-category.component";
import {   RightSideComponent   } from "../../shared/right-side-components/right-side-components.component";
import {   IntegrationCpoPpsService   } from "../../../services/integration-cpo-pps.service";
import {   SaveChooseCategoryDataService  } from "../../../services/save-choosecategory-data.service";
import {   EditMessagesService  } from "../../../services/edit-messages.service";
import {   DynamicEditLoaderComponent   } from "../../shared/dynamic-edit-loader/dynamic-edit-loader.component";
import {   ComparePaymentOptionsComponent   } from "../../shared/right-side-components/compare-payment-options/compare-payment-options.component";
import {   ConsiderIraRolloverImpactComponent   } from "../../shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
import {   DocumentsAndResourcesComponent   } from "../../shared/right-side-components/documents-and-resources/documents-and-resources.component";
import {   OtherResourcesComponent   } from "../../shared/right-side-components/other-resources/other-resources.component";
import {   PeopleLikeMeComponent   } from "../../shared/right-side-components/people-like-me/people-like-me.component";
import {   QuestionsComponent   } from "../../shared/right-side-components/questions/questions.component";
import {   WantToAddAnotherBeneficiaryComponent   } from "../../shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
import {   RightSideContentService   } from "../../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";

export class RetirementElectionRestServiceMock {
    public choosePaymentOptionResponse: any;
    orgName;
    constructor() {
        this.orgName = "retirement3x";
    }

    chooseCategorydataService() {
        let mockConfig = require("../../../al-assets/data/choosecategorydata.json");
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
    getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/AutoSelectExample.json");
        return of(mockConfig);
    }

    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    onRouteDBElec() {

    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "CC";
    }
    isCallBackAllowed() {
        return true;
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

describe("ChooseCategoryComponent", () => {
    let component: ChooseCategoryComponent;
    let fixture: ComponentFixture<ChooseCategoryComponent>;
    let compiled: any;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        ChooseCategoryComponent,
                        PanelSectionComponent,
                        CustomAlPanelComponent,
                        ErrorComponent,
                        DynamicEditLoaderComponent,
                        RightSideComponent,
                        ComparePaymentOptionsComponent,
                        ConsiderIraRolloverImpactComponent,
                        DocumentsAndResourcesComponent,
                        OtherResourcesComponent,
                        PeopleLikeMeComponent,
                        QuestionsComponent,
                        WantToAddAnotherBeneficiaryComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        AlPanelSectionService,
                        StepsActiveIndexService,
                        IntegrationCpoPpsService,
                        SaveChooseCategoryDataService,
                        EditMessagesService,
                        LoggingService,
                        LoggingStartupConfigService,
                        AppUtility,
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        RightSideContentService,
                        GoogleAnalyticsService,
                        DynamicComponentService
                    ],
                imports:
                    [
                        // RouterTestingModule,
                        AlCoreModuleLibrary.forRoot(),
                        BrowserAnimationsModule,
                        RouterTestingModule.withRoutes([
                            { path: "web/retirement3x/retirement-election/pension-payment-summary", component: ChooseCategoryComponent},
                            { path: " web/retirement3x/retirement-election/saved", component: ChooseCategoryComponent},
                            { path: "web/retirement3x/retirement-election/choose-payment-option", component: ChooseCategoryComponent}
                        ])


                    ]
            }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChooseCategoryComponent);
        component = fixture.componentInstance;
        compiled = fixture.debugElement.nativeElement;
        spyOn(component, "continueClick").and.callThrough();
        spyOn(component, "cancontinue").and.callThrough();
        fixture.detectChanges();
    });

    it ("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it ("Component Created ngOnInit", (() => {

        component.ngOnInit();
    }));

    it ("should call the setDefaultChosen", (() => {
        component.data = require("../../../al-assets/data/choosecategorydata.json");
        component.setDefaultChosen();
    }));
    it ("should call the findEditMessage", (() => {
        component.data = require("../../../al-assets/data/choosecategorydata.json");
        let editId = "10";
        component.findEditMessage(editId);
    }));

    it ("should call the setChosenCategoryGroupPlan", (() => {
        component.data = require("../../../al-assets/data/choosecategorydata.json");
        let electionIdData = [{
            "electionId":"60"
        }];
        component.setChosenCategoryGroupPlan(electionIdData, true);
    }));

    it ("should call the enableDisableRule", (() => {
        component.data = require("../../../al-assets/data/choosecategorydata.json");
        let electionIdData = "1";
        component.enableDisableRule(electionIdData);
    }));


    it ("Should call the cancontinue", () => {
        component.disallowcontinue = false;
        fixture.detectChanges();
        component.cancontinue(true);
    });

    it ("should call the storeDatatoCategoryService", () => {
        component.data = require("../../../al-assets/data/choosecategorydata.json");
        let i =0;
        component.storeDatatoCategoryService(i);
    });
    it ("should call the onCancel", () => {
        component.onCancel();
    });

    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });
    it ("should call redirectNext", () => {
        component.redirectNext(true);
    });


});
