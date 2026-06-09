import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of  , Subject   } from "rxjs";
import {   AlCoreModuleLibrary, AlLoaderComponent, DomStorageFallbackService, LoggingService, AppUtility, LoggingStartupConfigService, GoogleAnalyticsService, DynamicComponentService  } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA, Injectable, OnDestroy   } from "@angular/core";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   FormsModule, ReactiveFormsModule   } from "@angular/forms";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   EditMessagesService   } from "../../../services/edit-messages.service";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   ReviewPensionChoicesService   } from "../../../services/review-pension-choices.service";
import {   StepsActiveIndexService   } from "../../../services/steps-active-index-service";
import {   ProgressBarPopoverDataCacheService   } from "../../../services/progressBarPopoverDataCache.service";
import {   ErrorComponent   } from "../../shared/error/error.component";
import {   ReceiveRolloverComponent   } from "./rollover-destination.component";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";

export class RetirementElectionRestServiceMock {
    orgName;
    popoverDataSubject = new Subject();
    isActivePBEnabled = true;
    constructor() {
        this.orgName = "retirement3x";
    }
    rolloverDestinationServices() {
        let mockConfig = require("../../../al-assets/data/chooseyourrolloverdestination.json");
        return of(mockConfig);
    }
    onCancelService() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    rolloverDestinationSaveServices() {
        let mockConfig = {
            body: "{\"statusCode\": 200,\"statusMessage\": \"OK\",\"status\": \"OK\",\"hasEdit\": false,\"hasServerEdit\": true}"
        };
        return of(mockConfig);
    }
    getQueryParameters() {
        let mockConfig = require("../../../al-assets/data/chooseyourrolloverdestination.json");
        return of(mockConfig);
    }
    extractEditMessages() {
        let editMessages = [];
        return editMessages;
    }
    setSystemTickets(data: any) {
    }
    setSystemTicketsDOM(data: any) {
    }
    onRouteDBElec() {

    }
    setItem(name,value,storage,cookie) {
    }
    getItem(name,value,storage,cookie) {
    }
    getBackButton() {
        return true;
    }
    setBackButton(val: boolean){

    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "rollover destination";
    }
    // pageUrlFromCashoutRoot(href){

    // }
    gaPageTracking(href) {

    }
    isCallBackAllowed() {
        return true;
    }
    getProgressBarPopoverDataInCache() {
        return of("data");
    }
    getProgressBarPopoverContent(data: any) {}
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
@Injectable()
export class AlLoaderComponentMock implements OnDestroy {
    showIndicator(a, b) {}
    hideIndicator(a, b) {}
    ngOnDestroy() {}
}

describe("ReceiveRolloverComponent", () => {
    let component: ReceiveRolloverComponent;
    let fixture: ComponentFixture<ReceiveRolloverComponent>;
    let compiled: any;
    let AlLoaderComponentMockObj = new AlLoaderComponentMock();
    beforeEach(waitForAsync(() => {
        TestBed.overrideProvider(AlLoaderComponent, {useValue: AlLoaderComponentMockObj});
        TestBed.configureTestingModule({


            declarations:
                [
                    ReceiveRolloverComponent,
                    ErrorComponent

                ],
            providers:
                [
                    provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                    // AlLoaderComponent,
                    EditMessagesService,
                    StepsActiveIndexService,
                    LoggingService,
                    LoggingStartupConfigService,
                    AppUtility,
                    GoogleAnalyticsService,
                    DynamicComponentService,
                    {
                        provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: AlLoaderComponent, useClass: AlLoaderComponentMockObj
                    },
                    {
                        provide: DomStorageFallbackService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: ReviewPensionChoicesService, useClass: RetirementElectionRestServiceMock
                    },
                    {
                        provide: ProgressBarPopoverDataCacheService, useClass: RetirementElectionRestServiceMock
                    }
                ],
            imports:
                [
                    BrowserAnimationsModule,
                    AlCoreModuleLibrary.forRoot(),
                    FormsModule,
                    ReactiveFormsModule,
                    RouterTestingModule.withRoutes([
                        { path: "web/retirement3x/retirement-election/review-choices", component: ReceiveRolloverComponent},
                        { path: "web/retirement3x/retirement-election/payment-destination", component: ReceiveRolloverComponent}
                    ])
                ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReceiveRolloverComponent);
        component = fixture.componentInstance;

        /* compiled = fixture.debugElement.nativeElement;
         this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
         spyOn(component,'onCancel').and.callThrough();
         spyOn(component, 'continueClick').and.callThrough();
         spyOn(component, 'cancontinue').and.callThrough(); */

    });

    it("Should create the component", () => {
        expect(component).toBeTruthy();
    });

    // it("Component Created ngOnInit", (() => {
    //     component.ngOnInit();
    // }));

    it("should call onCancel", () => {
        component.onCancel();
    });

    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });

    it("should call redirectBack", () => {
        component.redirectBack();
    });

    it("should call onContinueClick", waitForAsync(() => {
        let loaderid: false;
        let FormValue = {
            value: {
                "1000": "primary",
                "2000": "secondary"
            }
        };
        /// let data = require('../../../al-assets/data/chooseyourrolloverdestination.json');

        let paymentTable = [
            {
                "tableHeaderText": "Premier Lump Sum Payment",
                "paymentId": 1000,
                "directDeliverPaymentDetailData": {
                    "rowHeaderText": "Amount Available to Roll Over",
                    "rollOverAmountAvailable": "76324.32",
                    "rolloverDeliveryId": "1000"
                },
                "addressDestinationDetailData": [
                    {
                        "addressDetail": {
                            "addressIdText": 10,
                            "addressTypeText": "PERM",
                            "addressTypeDescriptionText": "Permanent",
                            "addressText1": "123 Fake Street",
                            "addressText6": "Chicago IL 12345",
                            "addressText7": "USA",
                            "changeButtonText": "Change",
                            "changeButtonLink": "window.location.href=/web/retirement4x/update-pstl-addr?linkId=PRTL_CS_PRSN_UPDATE_PSTL_ADDR_LINK&technicalNameForLink=PRTL_CS_PRSN_UPDATE_PSTL_ADDR_LINK&userFriendlyNameForLink=Link to support update postal address functionality&domain=Ben-CM&baseClientIndicator=Base&srcPrlt=dbElecRcvRlvrDest'",
                            "methodOfDeliveryText": "Typically, you should receive the paper check 5&ndash;7 business days after the payment has been processed.",
                            "finalcialAddress": false,
                            "addressSelected": true,
                            "addrOnFile": true
                        }
                    }
                ]
            }
        ];
        component.paymentTable = paymentTable;
        component.onContinueClick(FormValue, true, true, false);

    }));

    it("should call onContinueClick - scenario form invalid", waitForAsync(() => {
        let FormValue = {
            value: {
                "1000": "primary",
                "2000": "secondary"
            }
        };
        let paymentTable = [
            {
                "tableHeaderText": "Premier Lump Sum Payment",
                "paymentId": 1000,
                "directDeliverPaymentDetailData": {
                    "rowHeaderText": "Amount Available to Roll Over",
                    "rollOverAmountAvailable": "76324.32",
                    "rolloverDeliveryId": "1000"
                },
                "addressDestinationDetailData": [
                    {
                        "addressDetail": {
                            "addressIdText": 10,
                            "addressTypeText": "PERM",
                            "addressTypeDescriptionText": "Permanent",
                            "addressText1": "123 Fake Street",
                            "addressText6": "Chicago IL 12345",
                            "addressText7": "USA",
                            "changeButtonText": "Change",
                            "changeButtonLink": "window.location.href=/web/retirement4x/update-pstl-addr?linkId=PRTL_CS_PRSN_UPDATE_PSTL_ADDR_LINK&technicalNameForLink=PRTL_CS_PRSN_UPDATE_PSTL_ADDR_LINK&userFriendlyNameForLink=Link to support update postal address functionality&domain=Ben-CM&baseClientIndicator=Base&srcPrlt=dbElecRcvRlvrDest'",
                            "methodOfDeliveryText": "Typically, you should receive the paper check 5&ndash;7 business days after the payment has been processed.",
                            "finalcialAddress": false,
                            "addressSelected": true,
                            "addrOnFile": true
                        }
                    }
                ]
            }
        ];
        component.paymentTable = paymentTable;
        component.data = {
            editList: [
                {
                    editId: "18000605",
                    editMessage: "You chose an address that's not on file.  Choose one that's on file or add a new one."
                },
                {
                    editId: "91000169",
                    editMessage: "An Address is required. Choose an item before continuing."
                }
            ]
        };
        component.onContinueClick(FormValue, false, true, false);

    }));
    it("should call saveApiResponseAction", () => {

        /*  let button = fixture.debugElement.nativeElement.querySelector('button');
          button.click(); */
        let saveApiResponse = {
            "systemTickets": "[{'key':'$T6K','value':'CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898'}]",
            "statusCode": 200,
            "alightResponseHeader": "{'transactionHeader':{'transactionInfo':[{'activityId':'000005640','activityDescription':'Accept New Payment Elections','activityReferenceNumber':'83400098','tbaActivity':{'activityBrandCode':'','planBrandCode':'','planDescription':'','planId':'000000000'},'effectiveDate':'2019-12-18'}]},'systemTickets':[{'key':'$T6K','value':'CT6B - 0011898 - 11898 - KTjiK0DNtXF - CT6B0011898'}],'responseCode':'0','responseDescription':''}",
            "statusMessage": "OK",
            "hasEdit": false,
            "hasServerEdit": false
        };

        component.saveApiResponseAction(saveApiResponse, null, false);

    });

    it("Should able call updateAddress", () => {
        fixture.whenStable().then(() => {
            component.updateAddress(0,0,0);
        });
    });

});
