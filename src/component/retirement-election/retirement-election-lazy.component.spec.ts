import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { of } from "rxjs";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injectable } from "@angular/core";
import { LogFrontendError } from "@alight/core-utilities-lib";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RetirementElectionLazyComponent } from "./retirement-election-lazy.component";
import {
    IDBService,
    AppUtility,
    DomStorageFallbackService,
    LoggingService,
    LoggingStartupConfigService,
    RemoteService,
    UIStorageService,
    LocalCacheService,
    CacheStorageService,
    AppStartupService,
    BrandingService,
    GenericService
} from "@alight/core-utilities-lib";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";


describe("Component: RetirementElectionLazyComponent", () => {
    let component: RetirementElectionLazyComponent;
    let fixture: ComponentFixture<RetirementElectionLazyComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    let mockLocation: any;
    let idbServiceSpy: jasmine.SpyObj<IDBService>;

    beforeEach(waitForAsync(() => {

        routerSpy =  jasmine.createSpyObj("Router",["navigateByUrl"]);
        mockLocation = {
            path: () => "/retirement-election",
            subscribe: (callback: any) =>{
                callback({ url: "/retirement-election"});
            }
        };
        idbServiceSpy = jasmine.createSpyObj("IDBService",["deleteRecordAsync"]);

        TestBed.configureTestingModule({
            declarations: [
                RetirementElectionLazyComponent
            ],
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
                IDBService,
                AppUtility,
                LoggingService,
                DomStorageFallbackService,
                LoggingStartupConfigService,
                LocalCacheService,
                CacheStorageService,
                RemoteService,
                UIStorageService,
                AppStartupService,
                BrandingService,
                GenericService,
                LogFrontendError,
                { provide: Router, useValue: routerSpy },
                { provide: Location, useValue: mockLocation },
                { provide: IDBService, useValue: idbServiceSpy }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });

        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(RetirementElectionLazyComponent);
            component = fixture.debugElement.componentInstance;
        });
    }));

    it("should be created", () => {
        component.ngOnInit();
        component.ngOnDestroy();
        expect(component).toBeTruthy();
    });
    it("should navigate using router when url includes a matching route",() =>{
        component.setUpLocationChangeListener();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/retirement-election");
    });

    it("should clear IDB once component is destroyed", () => {
        component.ngOnDestroy();
        expect(idbServiceSpy.deleteRecordAsync).toHaveBeenCalledWith("upointpromotionswidget", "promotionsHomePageCache");
        expect(idbServiceSpy.deleteRecordAsync).toHaveBeenCalledWith("upointpromotionswidget", "WorklifeRecommended");
        expect(idbServiceSpy.deleteRecordAsync).toHaveBeenCalledWith("thriveheaderwidget", "thriveheaderwidgetCache");
        expect(idbServiceSpy.deleteRecordAsync).toHaveBeenCalledWith("leftrail", "quickActions");
        expect(idbServiceSpy.deleteRecordAsync).toHaveBeenCalledWith("todoTask", "todoTaskCache");
        expect(idbServiceSpy.deleteRecordAsync).toHaveBeenCalledTimes(5);
    });
});
