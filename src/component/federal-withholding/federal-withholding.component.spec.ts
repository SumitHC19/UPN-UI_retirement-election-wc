import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FederalWithholdingComponent } from "./federal-withholding.component";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { BrowserModule, By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { DomStorageFallbackService, DynamicComponentService } from "@alight/core-utilities-lib";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MockDomStorageFallbackService } from "../../services/mock-services/dom-storage-service";
import { RetirementElectionRestServiceMock } from "../../services/mock-services/retirement-rest-service-mock";
import { ActivatedRoute } from "@angular/router";
import { RouterService } from "../../services/router.service";
import { MockRouterService } from "../../services/mock-services/router.service.mock";
import { of } from "rxjs";
import { EFlowId } from "../../models/flow-id.enum";
import { RouteChildHelper } from "../web-components/navigate-from-child-helper";
describe("FederalWithholdingComponent", () => {

    let component: FederalWithholdingComponent;
    let fixture: ComponentFixture<FederalWithholdingComponent>;
    let stepIndex: StepsActiveIndexService;
    let activatedRoute: ActivatedRoute;
    let routerService: RouterService;
    let domFBService: DomStorageFallbackService;
    let setStepSpy: jasmine.Spy;
    let setItemSpy: jasmine.Spy;
    let getItemSpy: jasmine.Spy;
    let requestSystemTicket;

    const getHeader = (hasSystemTicket = false): string => hasSystemTicket
        ? "{\"locale\":\"en_US\",\"roleId\":\"19941_WDCDS_1.0-E:19941_1.0-E:@PPT@\",\"channelRequestData\":\"URL::retirement-election::MAS_CURRENT_REQUESTED_ACTIVE_ACCT_TYPE::HRBPO::IS_HIDE_PRIMARY_ACCOUNT_IN_MAS_DROP_DOWN::true::tgtSite::::csid::log-off::BPOWE::0, NA::BPOLoc::null,null::BPORel::T,F,F,F::BPOLE::0::WDDOWN::F,F,F,F::gblsId::e817fdbb-75e1-49b4-a1a6-f028eb5ed60e_2020-08-19-13.03.49.099000::uxPageRequestId::af224edb-667a-42ef-a534-01911115258b::pageName::retirement-election::deviceType::null::sessionCreatedTimestamp::2020-08-19-13.03.49.099000::widgetName::null::ds::2020-08-19::\",\"clientId\":\"19941\",\"systemTickets\":[{\"key\":\"D$9B\",\"value\":\"CT6C - 0004725 - 4733 - g6mWbUb7b0W - CT6C0004725\"}]}"
        : "{\"locale\":\"en_US\",\"roleId\":\"19941_WDCDS_1.0-E:19941_1.0-E:@PPT@\",\"channelRequestData\":\"URL::retirement-election::MAS_CURRENT_REQUESTED_ACTIVE_ACCT_TYPE::HRBPO::IS_HIDE_PRIMARY_ACCOUNT_IN_MAS_DROP_DOWN::true::tgtSite::::csid::log-off::BPOWE::0, NA::BPOLoc::null,null::BPORel::T,F,F,F::BPOLE::0::WDDOWN::F,F,F,F::gblsId::e817fdbb-75e1-49b4-a1a6-f028eb5ed60e_2020-08-19-13.03.49.099000::uxPageRequestId::af224edb-667a-42ef-a534-01911115258b::pageName::retirement-election::deviceType::null::sessionCreatedTimestamp::2020-08-19-13.03.49.099000::widgetName::null::ds::2020-08-19::\",\"clientId\":\"19941\" }";

    beforeEach(waitForAsync(() => {
        const dynamicComponentServiceStub = () => ({
            loadMFScript: (string, string1) => ({}),
            initializePageComponents: () => ({})
        });
        TestBed.configureTestingModule({
            declarations: [ FederalWithholdingComponent ],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(), StepsActiveIndexService,
                {
                    provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                },{
                    provide: DomStorageFallbackService, useClass: MockDomStorageFallbackService
                },
                { provide: DynamicComponentService, useFactory: dynamicComponentServiceStub },
                {
                    provide: ActivatedRoute, useValue: {
                        queryParams: of({})
                    }
                },
                {
                    provide: RouterService, useClass: MockRouterService
                }
            ],
            imports: [ RouterTestingModule,
                BrowserModule],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
        })
            .compileComponents();
    }));

    beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(FederalWithholdingComponent);
        component = fixture.componentInstance;
        stepIndex = TestBed.inject(StepsActiveIndexService);
        requestSystemTicket = TestBed.inject(DomStorageFallbackService);
        activatedRoute = TestBed.inject(ActivatedRoute);
        routerService = TestBed.inject(RouterService);
        domFBService = TestBed.inject(DomStorageFallbackService);
        setStepSpy = spyOn(stepIndex, "setStepIndex").and.callThrough();
        setItemSpy = spyOn(domFBService, "setItem").and.callThrough();
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should set step7", () => {
        expect(setStepSpy).toHaveBeenCalledOnceWith(6);
    });

    it("should render the W4Form", () => {
        const w4Form =  fixture.debugElement.query(By.css("income-tax-withholding-wc"))?.nativeElement;
        expect(w4Form).toBeDefined();
    });

    it("should set widget Data ",() => {
        const expectedValue = {
            dbPaymentId: "",
            flowId: null,
            systemTicket: null,
            businessProcessReferenceId: "0"
        };
        expect(component["widgetData"]).toEqual(expectedValue);
    });

    it("should not set a systemTicket", () => {
        expect(setItemSpy).not.toHaveBeenCalled();
    });

    describe("when flowId is elections", () => {

        const electionsQueryParams = {
            dbPaymentId: "2000",
            flowId: EFlowId.DB_RETIREMENT
        };

        describe("when no systemTicket is passed", () => {

            beforeEach(() => {
                component["activatedRoute"].queryParams = of({ ...electionsQueryParams });
                const header = getHeader(false);
                getItemSpy = spyOn(domFBService, "getItem").and.returnValue(header);
                spyOn(RouteChildHelper, "isCurrentLocationExternal").and.returnValue(false);
            });

            beforeEach(waitForAsync(() => {
                component.ngOnInit();
                fixture.detectChanges();
            }));

            it("should not set a systemTicket", () => {
                expect(setItemSpy).not.toHaveBeenCalled();
            });

            it("should set widget Data ",() => {
                const expectedValue = {
                    dbPaymentId: "2000",
                    flowId: EFlowId.DB_RETIREMENT,
                    systemTicket: null,
                    businessProcessReferenceId: "0"
                };
                expect(component["widgetData"]).toEqual(expectedValue);
            });

        });



        describe("when a systemTicket is provided", () => {
            const systemTicket = [{ key: "D$9B", value: "CT6C - 0004725 - 4733 - g6mWbUb7b0W - CT6C0004725" }];
            beforeEach(waitForAsync(() => {
                component["activatedRoute"].queryParams = of({ ...electionsQueryParams, systemTicket });
                const header = getHeader(true);
                getItemSpy = spyOn(domFBService, "getItem").and.returnValue(header);
                spyOn(RouteChildHelper, "isCurrentLocationExternal").and.returnValue(false);
                setItemSpy.calls.reset();
                component.ngOnInit();
                fixture.detectChanges();
            }));

            it("should set widget Data ",() => {
                const expectedValue = {
                    dbPaymentId: "2000",
                    flowId: EFlowId.DB_RETIREMENT,
                    systemTicket,
                    businessProcessReferenceId: "0"
                };
                expect(component["widgetData"]).toEqual(expectedValue);
            });

            it("should set systemTicket", () => {
                expect(setItemSpy).toHaveBeenCalled();
            });

            it("should provide a systemTicket", () => {
                expect(typeof(component["electionsSystemTicket"])).toEqual("object");
            });

            it("blah", () => {
                expect(component["getSystemTickets"](EFlowId.DB_RETIREMENT)).toEqual(systemTicket);
            });
        });

        describe("when user clicks back", () => {
            let renderNextSpy: jasmine.Spy;
            beforeEach(waitForAsync(() => {
                component["activatedRoute"].queryParams = of({ ...electionsQueryParams });
                getItemSpy = spyOn(domFBService, "getItem").and.returnValue(null);
                spyOn(RouteChildHelper, "isCurrentLocationExternal").and.returnValue(false);
                component.ngOnInit();
                fixture.detectChanges();
            }));

            beforeEach(() => {
                renderNextSpy = spyOn(routerService, "renderNextPage").and.callThrough();
                component.back();
            });

            it("should navigate to review", () => {
                expect(renderNextSpy).toHaveBeenCalledWith("../review-choices", component["activatedRoute"]);
            });
        });

        describe("when user clicks save - ", () => {
            let renderNextSpy: jasmine.Spy;

            beforeEach(waitForAsync(() => {
                component["activatedRoute"].queryParams = of({ ...electionsQueryParams });
                const header = getHeader(false);
                getItemSpy = spyOn(domFBService, "getItem").and.returnValue(header);
                spyOn(RouteChildHelper, "isCurrentLocationExternal").and.returnValue(false);
                component.ngOnInit();
                fixture.detectChanges();
            }));

            beforeEach(() => {
                renderNextSpy = spyOn(routerService, "renderNextPage").and.callThrough();
                component.save();
            });

            it("should navigate to review", () => {
                expect(renderNextSpy).toHaveBeenCalledWith("../review-choices", component["activatedRoute"]);
            });
        });
    });

    describe("when flowId is nonQualified", () => {

        beforeEach(waitForAsync(() => {
            component["activatedRoute"].queryParams = of({
                flowId: EFlowId.DB_NON_QUALIFIED_RETIREMENT
            });
            spyOn(RouteChildHelper, "isCurrentLocationExternal").and.returnValue(false);
            component.ngOnInit();
            fixture.detectChanges();
        }));

        it("should update the flowId", () => {
            expect(component["flowId"]).toEqual(EFlowId.DB_NON_QUALIFIED_RETIREMENT);
        });

        describe("when user clicks back", () => {
            let renderNextSpy: jasmine.Spy;
            beforeEach(() => {
                renderNextSpy = spyOn(routerService, "renderNextPage").and.callThrough();
                component.back();
            });

            it("should navigate to review", () => {
                expect(renderNextSpy).toHaveBeenCalledWith("../dbNQEnrollmentReview", component["activatedRoute"]);
            });
        });

        describe("when user clicks save - ", () => {
            let renderNextSpy: jasmine.Spy;
            beforeEach(() => {
                renderNextSpy = spyOn(routerService, "renderNextPage").and.callThrough();
                component.save();
            });

            it("should navigate to review", () => {
                expect(renderNextSpy).toHaveBeenCalledWith("../dbNQEnrollmentReview", component["activatedRoute"]);
            });
        });
    });

    describe("when flowId is cashout", () => {

        beforeEach(waitForAsync(() => {
            component["activatedRoute"].queryParams = of({
                flowId: EFlowId.DB_CASH_OUT
            });
            spyOn(RouteChildHelper, "isCurrentLocationExternal").and.returnValue(false);
            component.ngOnInit();
            fixture.detectChanges();
        }));

        it("should create", () => {
            {
                expect(true).toEqual(true);
            }
        });

        it("should update the flowId", () => {
            expect(component["flowId"]).toEqual(EFlowId.DB_CASH_OUT);
        });

        describe("when user clicks back", () => {
            let renderNextSpy: jasmine.Spy;
            beforeEach(() => {
                renderNextSpy = spyOn(routerService, "renderNextPage").and.callThrough();
                component.back();
            });

            it("should navigate to review", () => {
                expect(renderNextSpy).toHaveBeenCalledWith("../dbCashoutReview", component["activatedRoute"]);
            });
        });

        describe("when user clicks save - ", () => {
            let renderNextSpy: jasmine.Spy;
            beforeEach(() => {
                renderNextSpy = spyOn(routerService, "renderNextPage").and.callThrough();
                component.save();
            });

            it("should navigate to review", () => {
                expect(renderNextSpy).toHaveBeenCalledWith("../dbCashoutReview", component["activatedRoute"]);
            });
        });
    });
});

