import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   AppStartupService, AppUtility, CacheStorageService, DomStorageFallbackService, GenericService, IDBService, LocalCacheService, LogFrontendError, LoggingService, LoggingStartupConfigService, RemoteService, UIStorageService   } from "@alight/core-utilities-lib";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   RetirementElectionRestService   } from "./retirement-election-rest.service";
import {   RouterService   } from "./router.service";

export class RetirementElectionRestServiceMock {
    orgName = "retirement3x";
}

describe("RouterService", () => {


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                RouterService,
                {
                    provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                },
                RemoteService,
                UIStorageService,
                IDBService,
                LoggingService,
                AppUtility,
                DomStorageFallbackService,
                LoggingStartupConfigService,
                LocalCacheService,
                CacheStorageService,
                AppStartupService,
                LogFrontendError,
                {
                    provide: GenericService, useValue: {
                        getOrgName: () => "retirement3x"
                    }
                }
            ],
            imports: [
                RouterTestingModule,
            ]
        }); /* To compile html and css code */

    }));


    it("Component Service call Successfully Executed", inject([RouterService], (tmpService: RouterService) => {
        expect(tmpService).toBeTruthy();
        tmpService.onRouteLoaded("");
    }));
});
