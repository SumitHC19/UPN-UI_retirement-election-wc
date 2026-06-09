import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of } from "rxjs";
import {   TestBed, inject, waitForAsync   } from "@angular/core/testing";
import {   RetirementElectionRestService   } from "./retirement-election-rest.service";
import {   DeferredSuccessfullyDSService   } from "./deferred-successfully-data-save.service";
import {   UIStorageService, IDBService, IUrlOptions, AppUtility, DynamicComponentService, GoogleAnalyticsService, BrandingService, DomStorageFallbackService, LoggingStartupConfigService, LogFrontendError , LocalCacheService   } from "@alight/core-utilities-lib";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   ProgressBarSaveDataSService   } from "./dbcnq-progressbar-data-save.service";
import {   RightRailSaveDataService   } from "./dbcnq-right-rail-data-save.service";
import {   StepsActiveIndexService   } from "./steps-active-index-service";
import {   ProgressBarPopoverDataCacheService   } from "./progressBarPopoverDataCache.service";
import {  RemoteService, CacheStorageService, LoggingService,AppStartupService, GenericService  } from "@alight/core-utilities-lib";

export class MockGenericService {
    alightRequestHeader = "{\"responseCode\":\"0\",\"responseDescription\":\"\",\"transactionHeader\":{\"transactionInfo\":[{\"activityId\":\"000005640\",\"activityDescription\":\"Accept New Payment Elections\",\"activityReferenceNumber\":\"227400081\",\"tbaActivity\":{\"activityBrandCode\":\"\",\"planBrandCode\":\"\",\"planDescription\":\"\",\"planId\":\"000000000\"},\"effectiveDate\":\"2020-04-16\"}]},\"systemTickets\":[{\"key\":\"$T6B\",\"value\":\"CT6B - 0069913 - 69913 - lBabhbOS205 - CT6B0069913\"}]}";
    events = {
        pipe : () => {
            return of({});
        }
    };
    public getOrgName() {
        return "";
    }
    getItem(item, session, flag) {
        return this.alightRequestHeader;
    }

    setItem(item, value) {
        this.alightRequestHeader = value;
    }
    hasDomStorageSupport() {
        return true;
    }
    postGACustomPageTracking(pageView) {
        return true;
    }
    initializePageComponents() {
    }
    getActiveIndexStepID() {
        return 2;
    }
    public isNgLoggingEnabled() {
    }
    _debug(){
    }
    _usage() {
    }
    _uxScreenCapture() {
    }
}
class MockRemoteService {
    request(requestType: string, urlOptions: IUrlOptions, body?: any) {
        return of({});
    }
    getRequest(urlOptions: IUrlOptions, key?: string) {
        return of({});
    }
}

describe("RetirementElectionRestService", () => {
    let changeModal = {
        showDialog: e => { },
        hideDialog: () => { }
    };
    let changeModalContent = {
        emit: e => { }
    };
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                DynamicComponentService,
                { provide: GenericService, useClass: MockGenericService},
                { provide: RemoteService, useClass: MockRemoteService},
                CacheStorageService,
                AppStartupService,
                UIStorageService,
                { provide: DynamicComponentService, useClass: MockGenericService },
                IDBService,
                AppUtility,
                { provide: DomStorageFallbackService, useClass: MockGenericService },
                {provide: LoggingService, useClass: MockGenericService },
                LoggingStartupConfigService,
                LocalCacheService,
                CacheStorageService,
                RetirementElectionRestService,
                LogFrontendError,
                BrandingService,
                DeferredSuccessfullyDSService,
                RightRailSaveDataService,
                ProgressBarSaveDataSService,
                { provide: GoogleAnalyticsService, useClass: MockGenericService },
                { provide: StepsActiveIndexService, useClass: MockGenericService },
                ProgressBarPopoverDataCacheService
            ]
        });
    }));

    it("service should be created", inject([RetirementElectionRestService], (service: RetirementElectionRestService) => {
        expect(service).toBeTruthy();
        let planId = "", electionGroupId = "", calculationReferenceNumber = "", electionId = "", targetEndPoint = "", saveApiRequestBody = "", businessprocessid = "", buttonActionType = true, pRequestBody = "", deferredFlag = true, paymentId = "";
        let alightResponseHeader = "{\"responseCode\":\"0\",\"responseDescription\":\"\",\"transactionHeader\":{\"transactionInfo\":[{\"activityId\":\"000005640\",\"activityDescription\":\"Accept New Payment Elections\",\"activityReferenceNumber\":\"227400081\",\"tbaActivity\":{\"activityBrandCode\":\"\",\"planBrandCode\":\"\",\"planDescription\":\"\",\"planId\":\"000000000\"},\"effectiveDate\":\"2020-04-16\"}]},\"systemTickets\":[{\"key\":\"$T6B\",\"value\":\"CT6B - 0069913 - 69913 - lBabhbOS205 - CT6B0069913\"}],\"editMessageGroupResponse\":{\"sourceSystem\":\"TBA\",\"editMessages\":[],\"locale\":\"en_US\"}}";
        let saveResponse = {
            headers: {
                get: function() {
                    return alightResponseHeader;
                }
            }
        };
        saveResponse.headers["_headers"] = {
            get: () => {
                return alightResponseHeader;
            }
        };
        service.getRequestParameters(targetEndPoint);
        service.pensionPaymentSummaryService();
        service.pensionPaymentSummaryService().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.choosePaymentOptionServiceParams(planId, electionId, electionGroupId, calculationReferenceNumber);
        service.choosePaymentOptionServiceParams(planId, electionId, electionGroupId, calculationReferenceNumber).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.chooseCategorydataService(planId, electionGroupId);
        service.chooseCategorydataService(planId, electionGroupId).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.howMuchRollOverdataService(true);
        service.howMuchRollOverdataService(true).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.howMuchRollOverdataService(false);
        service.howMuchRollOverdataService(false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.rolloverDestinationServices(true);
        service.rolloverDestinationServices(true).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.rolloverDestinationServices(false);
        service.rolloverDestinationServices(false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.getCommonContent();
        service.getCommonContent().subscribe((res) => {
            expect(res).toBeDefined();
        });
        // service.rolloverDestinationServices();
        // service.rolloverDestinationServices().subscribe((res) => {
        //   expect(res).toBeDefined();
        // });
        service.receivePaymentService(true, false);
        service.receivePaymentService(true, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.receivePaymentService(false, true);
        service.receivePaymentService(false, true).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.receivePaymentService(false, false);
        service.receivePaymentService(false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.reviewYourPensionChoice(false, true, false);
        service.reviewYourPensionChoice(true, true, false);
        service.reviewYourPensionChoice(false, true, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.reviewYourPensionChoice(true, false, false);
        service.reviewYourPensionChoice(true, false, false);
        service.reviewYourPensionChoice(true, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.noticeOfRightsService();
        service.noticeOfRightsSaveService(saveApiRequestBody, businessprocessid, buttonActionType, false);
        service.noticeOfRightsSaveService(saveApiRequestBody, businessprocessid, buttonActionType, true);
        service.noticeOfRightsSaveService(saveApiRequestBody, businessprocessid, !buttonActionType, false);
        service.noticeOfRightsSaveService(saveApiRequestBody, businessprocessid, !buttonActionType, true);
        service.noticeOfRightsSaveService(saveApiRequestBody, businessprocessid, buttonActionType, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, buttonActionType, true, true);
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, buttonActionType, true, false);
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, buttonActionType, true, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, !buttonActionType, true, true);
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, !buttonActionType, true, false);
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, buttonActionType, false, true);
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, buttonActionType, false, false);
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, buttonActionType, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.howMuchRollOverSaveService(saveApiRequestBody, businessprocessid, !buttonActionType, false, false);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, true);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, true);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false, false);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false, true);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, false, true, false, false, true);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, false, true, false, false, false);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, true, true, false);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, true, true, true);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, false, true, true, true, false);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, false, true, true, true, true);
        service.reviewPensionChoicesSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, true, true, false ).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, false, false);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, false, true);

        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, true, false);
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false, false);
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, true, false);
        service.rolloverDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, true, true);

        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false);
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, true, false);
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, false, false, false);
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, false, true, false);
        // DB CASHOUT COMPONENT PAYMENT METHOD START
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, true, false, false);
        service.paymentDestinationSaveServices(saveApiRequestBody, businessprocessid, !buttonActionType, true, true, false);
        service.pageUrlFromCashoutRoot("/dbcashout/dbCashoutDistributionChoice");
        service.gaPageTracking("Shared Service");
        // DB CASHOUT COMPONENT PAYMENT METHOD END
        service.onCancelService(pRequestBody, businessprocessid);
        service.onCancelService(pRequestBody, businessprocessid).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.getRightSideContent();
        service.getRightSideContent().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.getOtherResourcesContent();
        service.getOtherResourcesContent().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.authorizeYourChoicesService();
        service.authorizeYourChoicesService().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.completedSuccessfullyService(true, true);
        service.completedSuccessfullyService(true, true).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.completedSuccessfullyService(false, false);
        service.completedSuccessfullyService(false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.getChoosePaymentOptionData();
        service.incomeTaxWithHoldingServices(paymentId, true, false, false);
        service.incomeTaxWithHoldingServices(paymentId, false, false, false);
        service.incomeTaxWithHoldingServices(paymentId, true, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.incomeTaxWithHoldingServices(paymentId, true, true, false);
        service.incomeTaxWithHoldingServices(paymentId, true, false, true);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false, true);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false, false);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, true);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, true, false, false).subscribe((res) => {
            expect(res).toBeDefined();
        });

        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, true, false);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, true, true);
        service.incomeTaxWithHoldingSaveServices(saveApiRequestBody, businessprocessid, buttonActionType, false, true, false).subscribe((res) => {
            expect(res).toBeDefined();
        });

        service.savedSuccessfullyService();
        service.savedSuccessfullyService().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.deferredSuccessfullyService();
        service.deferredSuccessfullyService().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody, businessprocessid, buttonActionType, false);
        service.pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody, businessprocessid, buttonActionType, true);
        service.pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody, businessprocessid, !buttonActionType, false);
        service.pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody, businessprocessid, !buttonActionType, true);
        service.pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody, businessprocessid, false, false);
        service.pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody, businessprocessid, buttonActionType, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.pensionPaymentSummarySaveService(saveApiRequestBody, businessprocessid, false, deferredFlag, false);
        service.pensionPaymentSummarySaveService(saveApiRequestBody, businessprocessid, false, deferredFlag, true);
        service.pensionPaymentSummarySaveService(saveApiRequestBody, businessprocessid, deferredFlag, "", false);
        service.pensionPaymentSummarySaveService(saveApiRequestBody, businessprocessid, deferredFlag, "", true);
        service.setSystemTickets(saveResponse);
        service.extractEditMessages(saveResponse);
        service.setSystemTicketsDOM([]);
        service.authorizeYourChoicesSaveService(saveApiRequestBody, buttonActionType, businessprocessid, false).subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.authorizeYourChoicesSaveService(saveApiRequestBody, false, businessprocessid, false);
        service.authorizeYourChoicesSaveService(saveApiRequestBody, false, businessprocessid, true);
        service.submittedSuccessfullyService().subscribe((res) => {
            expect(res).toBeDefined();
        });
        service.removeSystemTickets();
        service.getNorSystemTickets();
        service.screenCapture(true);
        service.getRequestHeaderWithOptionals();
        // service.renderNextPage('', this.ActivatedRoute);
        service.getRequestParamsWithCustomHeader("", []);
        service.getRequestHeaderWithOptionals();
        service.getSystemTicketMap();
        service.getDeferParameters(saveResponse);
        service.setProgressbarData("" , 0, "", []);
        service.setRightRailData({}, {}, true, true, true);
        service.setDocumentAndResourcesData([], "", true);
        service.redirectToCancelPage();
        service.isCallBackAllowed();
        service.onRouteDBElec("saved");
        service.onRouteDBElec("saved", "isFromAuth=true");
        service.screenCaptureInit("");
        service.setRequestParamProgressBarPopver("mocked=true");
        let mockUrl;
        service.setRequestParamProgressBarPopver(mockUrl);
        let popoverData = [{
            "hasError": false,
            "stepId": 3,
            "stepName": "beneficiaries",
            "stepCode": "BENE",
            "title": "3. Beneficiaries",
            "linkText": "Change",
            "contentList": [
                {
                    "contentData": [
                        "FAP Pension Plan",
                        "No Beneficiary"
                    ]
                }
            ]}];
        service.getProgressBarPopoverContent(popoverData);
        service.clearIndexDBCache();
        service.setProgressBarPopoverRoute(event, 1, 0, "", changeModal, changeModalContent);
        service.checkPreActivityEdit();
        service.updateFormDataChange();
    }));

    describe("when isdbnq flow",()=>{
        let service: RetirementElectionRestService;
        let domStorageService: DomStorageFallbackService;
        let serviceSpy: jasmine.Spy;
        let getItemSpy: jasmine.Spy;
        let alightRequestHeader = {
            alightTestingInstructions: {
                mockAll: false,
                resource: "reviewYourPensionChoicesWidget",
                scenario: "paymentelections-W4-DB-NQ-1"
            }
        };
        let alightRequestHeaderJSON = JSON.stringify(alightRequestHeader);
        beforeEach(waitForAsync(() => {
            service = TestBed.inject(RetirementElectionRestService);
            domStorageService = TestBed.inject(DomStorageFallbackService);
            serviceSpy = spyOn(service,"reviewYourPensionChoice").and.callThrough();
            service.reviewYourPensionChoice(false,false,true);
            getItemSpy= spyOn(domStorageService, "getItem").and.returnValue(alightRequestHeaderJSON);
        }));

        it("should call review your pension choice service",()=>{
            expect(serviceSpy).toHaveBeenCalled();
        });

        it("should call get item service",()=>{
            service.getRequestHeaderWithOptionals();
            expect(getItemSpy).toHaveBeenCalled();
        });

        it("should set alightTestingInstructions in the requestArray",()=>{
            const requestArray = service.getRequestHeaderWithOptionals();
            const expectedValue = [{key: "alightTestingInstructions", value: "{\"alightTestingInstructions\":{\"mockAll\":false,\"resource\":\"reviewYourPensionChoicesWidget\",\"scenario\":\"paymentelections-W4-DB-NQ-1\"}}"},{},{}];
            expect(requestArray).toEqual(expectedValue);

        });
    });
});
