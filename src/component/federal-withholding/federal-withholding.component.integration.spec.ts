import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FederalWithholdingComponent } from "./federal-withholding.component";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { BrowserModule, By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { AppUtility, BrandingService, DomStorageFallbackService, DynamicComponentService, GenericService, IDBService, LoggingService, LoggingStartupConfigService, RemoteService, UIStorageService } from "@alight/core-utilities-lib";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { MockDomStorageFallbackService } from "../../services/mock-services/dom-storage-service";
import { RetirementElectionRestServiceMock } from "../../services/mock-services/retirement-rest-service-mock";
import { RouterService } from "../../services/router.service";
import { ActivatedRoute, Router } from "@angular/router";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { defer, Observable, of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { EFlowId } from "../../models/flow-id.enum";

export class MockRemoteService {
    public request(a, b, c, d?, e?, f?, g?, h?, i?): Observable<any> {
        const w4rData = require("../../al-assets/data/w4r-data.json");
        return defer(() => of({ body: w4rData }));
    }

}

const queryParams = {
    dbPaymentId:"2000",
    flowId:"dbelec",
    isW4PrFormWithholdingApplicable:true,
    paymentWithholdingFormType:"w4r"
};

xdescribe("Federal Withholding Integration", () => {
    let component: FederalWithholdingComponent;
    let service: RetirementElectionRestService;
    let domStorageService: DomStorageFallbackService;
    let fixture: ComponentFixture<FederalWithholdingComponent>;
    let router: Router;
    let alightRequestHeader = "{\"locale\":\"en_US\",\"roleId\":\"19941_WDCDS_1.0-E:19941_1.0-E:@PPT@\",\"channelRequestData\":\"URL::retirement-election::MAS_CURRENT_REQUESTED_ACTIVE_ACCT_TYPE::HRBPO::IS_HIDE_PRIMARY_ACCOUNT_IN_MAS_DROP_DOWN::true::tgtSite::::csid::log-off::BPOWE::0, NA::BPOLoc::null,null::BPORel::T,F,F,F::BPOLE::0::WDDOWN::F,F,F,F::gblsId::e817fdbb-75e1-49b4-a1a6-f028eb5ed60e_2020-08-19-13.03.49.099000::uxPageRequestId::af224edb-667a-42ef-a534-01911115258b::pageName::retirement-election::deviceType::null::sessionCreatedTimestamp::2020-08-19-13.03.49.099000::widgetName::null::ds::2020-08-19::\",\"clientId\":\"19941\",\"systemTickets\":[{\"key\":\"D$9B\",\"value\":\"CT6C - 0004725 - 4733 - g6mWbUb7b0W - CT6C0004725\"}]}";
    let mockActiveRoute = {
        snapshot: {
            queryParams
        },
        queryParams: of(queryParams)
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ FederalWithholdingComponent ],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(), StepsActiveIndexService,
                {
                    provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                },
                {
                    provide: DomStorageFallbackService, useClass: MockDomStorageFallbackService
                },
                {
                    provide: RemoteService, useClass: MockRemoteService
                },
                GenericService,
                LoggingService,
                AppUtility,
                LoggingStartupConfigService,
                DynamicComponentService,
                IDBService,
                UIStorageService,
                BrandingService,
                {
                    provide: ActivatedRoute, useValue: {
                        queryParams: of({
                            flowId: EFlowId.DB_RETIREMENT
                        })
                    }
                },
                RouterService,
                {
                    provide: Router,
                    useValue: {
                        navigate: (path) => {}
                    }
                }
            ],
            imports: [ RouterTestingModule,
                NoopAnimationsModule,
                BrowserModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(FederalWithholdingComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(RetirementElectionRestService);
        router = TestBed.inject(Router);
        domStorageService = TestBed.inject(DomStorageFallbackService);
        spyOn(domStorageService, "getItem").and.returnValue(alightRequestHeader);
        fixture.detectChanges();
    });
    it("should render", () => {
        expect(component).toBeTruthy();
    });

    it("should render the W4 form container", () => {
        const w4Container =  fixture.debugElement.query(By.css("income-tax-withholding-view-container"));
        expect(w4Container).toBeDefined();
    });

    it("should render the main view", () => {
        const w4Form =  fixture.debugElement.query(By.css("income-tax-withholding-wc"));
        expect(w4Form).toBeDefined();
    });

    it("should render the w4 resource section", () => {
        const w4Section =  fixture.debugElement.query(By.css("income-tax-withholding-other-resources-section"));
        expect(w4Section).toBeDefined();
    });

    it("should render the loading indicator", () => {
        const w4Section =  fixture.debugElement.query(By.css("al-loading-indicator"))?.nativeElement;
        expect(w4Section).toBeDefined();
    });

    describe("when widget is done loading", () => {

        beforeEach(waitForAsync(() => {
            component.loaded = true;
            fixture.detectChanges();
        }));

        it("should not render the loading indicator", () => {
            const loadingIndicator =  fixture.debugElement.query(By.css("al-loading-indicator"))?.nativeElement;
            expect(loadingIndicator).toBeUndefined();
        });

    });

});


