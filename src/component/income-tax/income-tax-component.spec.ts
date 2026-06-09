import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, GoogleAnalyticsService, DynamicComponentService   } from "@alight/core-utilities-lib";
import {   ComponentFixture, TestBed, tick, fakeAsync, waitForAsync   } from "@angular/core/testing";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   RetirementElectionRestService   } from "../../services/retirement-election-rest.service";
import {   ErrorComponent   } from "../shared/error/error.component";
import {   IncomeTaxComponent   } from "./income-tax-component";
import {   DynamicEditLoaderComponent   } from "../shared/dynamic-edit-loader/dynamic-edit-loader.component";
import {   RightSideComponent   } from "../shared/right-side-components/right-side-components.component";
import {   ComparePaymentOptionsComponent   } from "../shared/right-side-components/compare-payment-options/compare-payment-options.component";
import {   ConsiderIraRolloverImpactComponent   } from "../shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
import {   DocumentsAndResourcesComponent   } from "../shared/right-side-components/documents-and-resources/documents-and-resources.component";
import {   OtherResourcesComponent   } from "../shared/right-side-components/other-resources/other-resources.component";
import {   PeopleLikeMeComponent   } from "../shared/right-side-components/people-like-me/people-like-me.component";
import {   QuestionsComponent   } from "../shared/right-side-components/questions/questions.component";
import {   WantToAddAnotherBeneficiaryComponent   } from "../shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
import {   StepsActiveIndexService   } from "../../services/steps-active-index-service";
import {   EditMessagesService   } from "../../services/edit-messages.service";
import {   FormsModule, ReactiveFormsModule   } from "@angular/forms";
import {   ReviewPensionChoicesService   } from "../../services/review-pension-choices.service";
import {   RightSideContentService   } from "../../services/right-side-content.service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   DBCNQProgressBarComponent   } from "../progress-bar/dbcnq-progress-bar.component";
import {   RightRailComponent   } from "../../components/shared/dbcnq-right-rail/dbcnq-right-rail.component";
import { By } from "@angular/platform-browser";

export class RetirementElectionRestServiceMock {
    orgName;
    editMessageFlagSubject: Subject<boolean> = new Subject<boolean>();
    redirectToUrlSubject: Subject<String> = new Subject<String>();
    AuthorizeButtonSubject =  new Subject();
    pageNameSubject = new Subject();
    buttonActionTypeSubject = new Subject();
    editButtonListSubject = new Subject();
    saveApiRequestBodySubject = new Subject();
    isDbCashoutFlagSubject: Subject<boolean> = new Subject<boolean>();
    hasEditFlagSubject: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this.orgName = "retirement3x";
    }
    getQueryParameters() {
        let mockConfig = require("../../al-assets/data/incometaxwithholdingUSLS.json");
        return of(mockConfig);
    }
    incomeTaxWithHoldingServices() {
        let mockConfig = require("../../al-assets/data/incometaxwithholdingUSLS.json");
        return of(mockConfig);
    }
    getRightSideContent() {
        let mockConfig = require("../../al-assets/data/common.json");
        return of(mockConfig);
    }
    extractEditMessages(headers) {
        return {};
    }
    incomeTaxWithHoldingSaveServices() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    setSystemTickets(data: any) {
    }
    getCommonContent() {
        let mockConfig = require("../../al-assets/data/cancel.json");
        return of(mockConfig);
    }
    saveEditArray(val) {}
    getLocale() {}
    isDefaultLocale(en_US) {}
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "income Tax";
    }

    gaPageTracking(href) {

    }
    onRouteDBElec() {

    }
    isCallBackAllowed() {
        return true;
    }
}

describe("IncomeTaxComponent", () => {

    let component: IncomeTaxComponent;
    let fixture: ComponentFixture<IncomeTaxComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({

            declarations:
                [
                    IncomeTaxComponent,
                    ErrorComponent,
                    DynamicEditLoaderComponent,
                    RightSideComponent,
                    ComparePaymentOptionsComponent,
                    ConsiderIraRolloverImpactComponent,
                    DocumentsAndResourcesComponent,
                    OtherResourcesComponent,
                    PeopleLikeMeComponent,
                    QuestionsComponent,
                    WantToAddAnotherBeneficiaryComponent,
                    DBCNQProgressBarComponent,
                    RightRailComponent
                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    StepsActiveIndexService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: EditMessagesService, useClass: RetirementElectionRestServiceMock
                    },
                    ReviewPensionChoicesService,
                    LoggingService,
                    LoggingStartupConfigService,
                    AppUtility,
                    RightSideContentService,
                    GoogleAnalyticsService,
                    DynamicComponentService
                ],
            imports:
                [
                    AlCoreModuleLibrary.forRoot(),
                    BrowserAnimationsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election/review-choices", component: IncomeTaxComponent}
                    ])
                ]
        }).compileComponents();
    }));

    beforeEach(() => {
        const service=TestBed.inject(RetirementElectionRestService);
        service.isCallBackAllowed();
        fixture = TestBed.createComponent(IncomeTaxComponent);
        component = fixture.componentInstance;
    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    it("should able call incomeTaxWithHoldingData false", (() => {
        component.incomeTaxWithHoldingData(false);
    }));

    it("Should able call onSelectChange", () => {
        component.onSelectChange();
        fixture.detectChanges();
    });

    it("Should able call useThisStateBtnClick", () => {
        fixture.detectChanges();
        /* eslint-disable no-unused-expressions */
        component.incomeTaxWthlForm.get("fieldUS_STATEstate").value;
        component.useThisStateBtnClick(false, false);
    });


    it("Should able call useThisStateBtnClick true", () => {
        fixture.detectChanges();
        component.currentState ="IL";
        component.incomeTaxWthlForm.get("fieldUS_STATEstate").setValue("AZ");
        component.useThisStateBtnClick(false, false);
    });

    it("Should able call onChange", waitForAsync(() => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;

        fixture.detectChanges();

    }));

    it("Should able call onChange", () => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;

        fixture.detectChanges();

    });

    it("Should able call onChange", waitForAsync(() => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;

        fixture.detectChanges();

    }));

    it("Should able call onChange", waitForAsync(() => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;

        fixture.detectChanges();

    }));

    it("Should able call onChange", waitForAsync(() => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;

        fixture.detectChanges();

    }));

    it("Should able call cancontinue", () => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;
        fixture.detectChanges();
        component.cancontinue(true, false, false);
        component.allowContinue = true;
        component.editMessageList=[];
        fixture.detectChanges();
        component.cancontinue(true, false, false);
    });

    it("Should able call continueClick", () => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;
        fixture.detectChanges();
        component.continueClick("formval", true, true, false, false);
        fixture.detectChanges();
    });

    it("Should able call onContinueClick", () => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;
        fixture.detectChanges();
        component.onContinueClick("formval", true, true, false, false);
        fixture.detectChanges();
    });

    it("Should able call onContinueClick USSTATE NULL", () => {
        fixture.detectChanges();
        let FormValue = { "fieldUS_FEDERALfedWithholdAmount": null, "fieldUS_FEDERALfedWithholdPercent": null, "US_FEDERAL": "fedWithholdDefault", "fieldUS_STATEstate": "IL", "fieldUS_STATEstWithholdAmount": 0, "US_STATE": "stWithholdNothing" };
        component.incomeTaxWthlForm.get("US_STATE").setValue(null);
        component.onContinueClick(FormValue, false, true, false, false);
    });

    it("Should able call onContinueClick  USFEDERAL NULL", () => {
        fixture.detectChanges();
        let FormValue = { "fieldUS_FEDERALfedWithholdAmount": null, "fieldUS_FEDERALfedWithholdPercent": null, "US_FEDERAL": "fedWithholdDefault", "fieldUS_STATEstate": "IL", "fieldUS_STATEstWithholdAmount": 0, "US_STATE": "stWithholdNothing" };
        component.incomeTaxWthlForm.get("US_FEDERAL").setValue(null);
        component.onContinueClick(FormValue, false, true, false, false);
    });

    it("Should able call onContinueClick USSTATE NULL", () => {
        fixture.detectChanges();
        let FormValue = { "fieldUS_FEDERALfedWithholdAmount": null, "fieldUS_FEDERALfedWithholdPercent": null, "US_FEDERAL": "fedWithholdDefault", "fieldUS_STATEstate": "IL", "fieldUS_STATEstWithholdAmount": 0, "US_STATE": "stWithholdNothing" };
        component.incomeTaxWthlForm.get("US_STATE").setValue(null);
        component.onContinueClick(FormValue, false, true, false, false);
    });

    it("Should able call updateInitialValidators", () => {
        let incomeTaxWthlTablesJson = require("../../al-assets/data/incometaxwthldtesting.json");
        component.incomeTaxWthlTables = incomeTaxWthlTablesJson;
        fixture.detectChanges();
        component.updateInitialValidators();
    });

    it("should call cancelClick", () => {
        component.cancelClick();
    });

    it("Should able call createFederalValues ", () => {
        component.incomeTaxWthlTables = require("../../al-assets/data/incometaxwthldtesting.json");
        fixture.detectChanges();
        component.createFederalValues();
    });

    it("Should able call createStateValues true", () => {
        component.incomeTaxWthlTables = require("../../al-assets/data/incometaxwthldtesting.json");
        fixture.detectChanges();
        component.createStateValues(true);
    });

    it("Should able call createStateValues false", () => {
        component.incomeTaxWthlTables = require("../../al-assets/data/incometaxwthldtesting.json");
        fixture.detectChanges();
        component.createStateValues(false);
    });

    it("should call savecancontinue", () => {
        component.incomeTaxWthlTables = require("../../al-assets/data/incometaxwthldtesting.json");
        fixture.detectChanges();
        component.savecancontinue(true, false, false);
    });

    it("should call savecancontinue false", () => {
        component.incomeTaxWthlTables = require("../../al-assets/data/incometaxwthldtesting.json");
        fixture.detectChanges();
        component.savecancontinue(false, false, false);
    });

    it("should call saveApiResponse service true", () => {
        let saveApiResponse = {
            "statusCode": 200,
            "statusMessage": "200 OK",
            "status": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };
        fixture.detectChanges();
        component.saveApiResponseAction(saveApiResponse,true, false, false);
    });

    describe("when isStateOnly value is true", () => {

        beforeEach(() => {
            component.ngOnInit();
            component.data.changeIncomeTaxWithholding.isStateOnly = true;
            fixture.detectChanges();
        });


        it("should not render the federal table",()=>{
            const federalTable= fixture.debugElement.query(By.css("#US_FEDERAL"))?.nativeElement;
            expect(federalTable).toBeUndefined();
        });

        it("should render the state table",()=>{
            const stateTable = fixture.debugElement.query(By.css("#US_STATE")).nativeElement;
            expect(stateTable).toBeDefined();

        });


    });

    describe("when isStateOnly value is false", () => {
        let tableSpy;
        beforeEach(() => {
            component.ngOnInit();
            component.data.changeIncomeTaxWithholding.isStateOnly = false;
            tableSpy = spyOn(component, "showTable").and.returnValue(true);
            fixture.detectChanges();

        });

        it("should return true",() => {
            expect(tableSpy).toHaveBeenCalled();
        });

        it("should  render the federal table",()=>{
            const federalTable = fixture.debugElement.query(By.css("#US_FEDERAL")).nativeElement;
            expect(federalTable).toBeDefined();
        });

        it("should render the state table",()=>{
            const stateTable = fixture.debugElement.query(By.css("#US_STATE")).nativeElement;
            expect(stateTable).toBeDefined();
        });
    });

});




