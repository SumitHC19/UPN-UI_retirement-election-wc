import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   CacheStorageService, IDBService, LoggingService, AppUtility, DomStorageFallbackService, LoggingStartupConfigService, AppStartupService   } from "@alight/core-utilities-lib";
import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {    ProgressBarPopoverDataCacheService   } from "./progressBarPopoverDataCache.service";
import {   StepsActiveIndexService   } from "./steps-active-index-service";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   RouterTestingModule   } from "@angular/router/testing";

export class RetirementElectionRestServiceMock {
    orgName = "retirement3x";
}

describe("ProgressBarPopoverDataCacheService", () => {

    let service: ProgressBarPopoverDataCacheService;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                ProgressBarPopoverDataCacheService,
                CacheStorageService,
                IDBService,
                LoggingService,
                AppUtility,
                DomStorageFallbackService,
                LoggingStartupConfigService,
                AppStartupService,
                StepsActiveIndexService
            ],
            imports: [
                RouterTestingModule
            ]
        });

    }));

    beforeEach(() => {
        service = TestBed.inject(ProgressBarPopoverDataCacheService);
    });

    it("Component Service call Successfully Executed", inject([ProgressBarPopoverDataCacheService], (tmpService: ProgressBarPopoverDataCacheService) => {
        expect(tmpService).toBeTruthy();
    }));
    it("Should call service methods", () => {
        service.setProgressBarPopoverDataInCache("BENE", {});
        service.getProgressBarPopoverDataInCache();
        service.clearProgressBarPopoverDataInCache(true, [0]);
        service.getFormDataChanged();
        service.setFormDataChanged(true);
        service.checkProgressBarPopoverDataExistsInCache("BENE");
        service.popOverIDBData = [{
            hasError: false,
            stepId: 3,
            stepName: "beneficiaries",
            stepCode: "BENE",
            title: "3. Beneficiaries",
            linkText: "Change",
            contentList: [
                {
                    contentData: [
                        "DB FAP Pension Plan",
                        "No Beneficiary"
                    ]
                }
            ],
            changeModal: {
                changeModalText: "Do you want to change your choices?<br><br> You’ll need to start the retirement process again from the beginning. That’s because making changes to this information may impact your benefits options and payment amounts.",
                yesBtn: "Yes",
                noBtn: "No"
            }
        }];
        service.checkProgressBarPopoverDataExistsInCache("BENE");
        service.getCurrentPageName();
    });
});
