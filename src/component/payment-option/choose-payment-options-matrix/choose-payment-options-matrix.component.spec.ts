import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   of , Observable   } from "rxjs";
import {   AlCoreModuleLibrary, LoggingService, LoggingStartupConfigService, AppUtility, DynamicComponentService, CacheStorageService, GoogleAnalyticsService   } from "@alight/core-utilities-lib";
import {   waitForAsync, ComponentFixture, TestBed   } from "@angular/core/testing";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RetirementElectionRestService   } from "../../../services/retirement-election-rest.service";
import {   IntegrationCpoPpsService   } from "../../../services/integration-cpo-pps.service";
import {   SavePpsDataService   } from "../../../services/save-pps-data.service";
import {   ChoosePaymentOptionsMatrixComponent   } from "./choose-payment-options-matrix.component";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   EditMessagesService   } from "../../../services/edit-messages.service";
import {   AlPanelSectionService   } from "../../../services/al-panel-section.service";
import {   FootnoteService   } from "../../../services/footnote-common.service";

export class RetirementElectionRestServiceMock {
    public systemTickets: any;
    public response: any;
    loadMFScript(wcName, wcSelec) {}
    onRouteDBElec(path) {}
    getItem(key, store){
        switch(key) {
            case "paymentOptionsDetail":
                this.response = [];
                break;
            case "opfmServiceResponse":
                this.response = {
                    dbRetirementOpfmMatrixResponse: {
                        responseStatus: {
                            statusCode: 200,
                            status: 200
                        },
                        choosePaymentOptionHeader: {
                            headerPanelList: []
                        }
                    }
                };
                break;
            default:
                this.response = "";
                break;
        }
        return of(this.response);
    }
    initializePageComponents() {}
    onCancelService() {
        let mockConfig = {
            body: {"statusCode": 200,"statusMessage": "OK","status": "OK","hasEdit": false,"hasServerEdit": true}
        };
        return of(mockConfig);
    }
    getPpsData() {
        let mockConfig = require("../../../al-assets/data/ppsMatrixPage.json");
        return of(mockConfig);
    }
    pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody: any, businessProcessReferenceId: any, buttonActionType, hasTbaEdit: boolean): Observable<any> {
        let mockConfig = require("../../../al-assets/data/saveResponse.json");
        return of(mockConfig);
    }
    removeSystemTickets() {
    }

    isCallBackAllowed() {
        return true;
    }
    screenCapture() {
        let screenCapture = true;
    }
    screenCaptureInit() {
        let screenCaptureInit = "choose payment options matrix";
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

describe("ChoosePaymentOptionsMatrixComponent", () => {
    let component: ChoosePaymentOptionsMatrixComponent;
    let fixture: ComponentFixture<ChoosePaymentOptionsMatrixComponent>;
    let expand = false;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        ChoosePaymentOptionsMatrixComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        IntegrationCpoPpsService,
                        LoggingService,
                        LoggingStartupConfigService,
                        GoogleAnalyticsService,
                        EditMessagesService,
                        AppUtility,
                        {
                            provide: DynamicComponentService, useClass: RetirementElectionRestServiceMock
                        },
                        { provide:CacheStorageService, useClass: RetirementElectionRestServiceMock},
                        AlPanelSectionService,
                        FootnoteService,
                        { provide:SavePpsDataService, useClass: RetirementElectionRestServiceMock }
                    ],
                imports:
                    [
                        AlCoreModuleLibrary.forRoot(),
                        BrowserAnimationsModule,
                    ],
                schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
            }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChoosePaymentOptionsMatrixComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it ("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it ("Component Created ngOnInit", (() => {
        component.ngOnInit();
    }));

    it("should call setactive", () => {
        component.setactive(expand, undefined);
    });

    it("should call getOpfmMtarixData", () => {
        component.getOpfmMtarixData();
    });

    it("should call formatPaymentOptionsData function value - nonElecGrp Scenario",waitForAsync(() => {
        component.selectedPlans = [
            {
                id: "3744_0_10_2325_3140",
                planId: "3744",
                electionGroupId: "0",
                electionId: "10",
                optionalFormGroupId: 2325,
                optionalFormId: 3140,
                optionalFormDescription: "Joint & Survivor w/Pop Up",
                optionalFormType: "JSPU",
                isHypotheticalOptionalForm: true,
                paymentOptionDetail: [
                    {
                        label: null,
                        labelCode: null,
                        amountToYouFormatted: "$406.00",
                        amountToYou: 406,
                        frequencyText: "(monthly)",
                        optionalFormFrequency: "M",
                        amountToBeneFormatted: "$203.00",
                        amountToBene: 203,
                        popupText: "If your beneficiary dies before you, your payments will increase to $500.00.",
                        dateRanageDetail: []
                    }]
            }
        ];
        fixture.detectChanges();
        component.formatPaymentOptionsData(true);
    }));

    it("should call formatPaymentOptionsData function value - ElecGrp Scenario", waitForAsync(() => {
        component.data = {
            optionalFormMatrixTableHeader: [
                {
                    id: "3744_0_10_2325",
                    planId: null,
                    header1: "CB Pension Plan",
                    header2Id: null,
                    header2: null,
                    header3Id: null,
                    header3: null,
                    optionalFormPanelDetailPlan: null,
                    optionalFormPanelDetailElection: null
                },
                {
                    id: "5744_2202_60_5508",
                    planId: "5744",
                    header1: "Contributory Pension Plan-Contributions Elec Gp",
                    header2Id: "60",
                    header2: "Contributions Retained",
                    header3Id: null,
                    header3: "Contributory Pension Plan-Contributions Retained-Contributions Retained",
                    optionalFormPanelDetailPlan: {
                        panelLeadTitle: "Contributory Pension Plan-Contributions Elec Gp",
                        panelLeadDescription: "Placeholder text for Plan Glossary. Client should override",
                        learnMoreLink: ""
                    }
                }
            ]
        };
        component.selectedPlans = [
            {
                id: "5744_2202_60_5508_3140",
                mainId: "5744_2202_60_5508",
                planId: "5744",
                electionGroupId: "2202",
                electionId: "60",
                optionalFormGroupId: "5508",
                optionalFormId: "3140",
                optionalFormDescription: "Joint & Survivor w/Pop Up",
                optionalFormType: "JSPU",
                isHypotheticalOptionalForm: true,
                paymentOptionDetail: [
                    {
                        label: null,
                        labelCode: null,
                        amountToYouFormatted: "$3,737.20",
                        amountToYou: 3737.2,
                        frequencyText: "(monthly)",
                        optionalFormFrequency: "M",
                        amountToBeneFormatted: "$1,868.60",
                        amountToBene: 1868.6,
                        popupText: "If your beneficiary dies before you, your payments will increase to $1,000.00.",
                        dateRanageDetail: []
                    }
                ]
            }
        ];
        fixture.detectChanges();
        component.formatPaymentOptionsData(true);
    }));
    it("should call formatPaymentOptionsData function value - defer Scenario",waitForAsync(() => {
        component.selectedPlans = [
            {
                id: "3744_0_10_2325",
                deferId: "3744_0_10",
                label: "Defer Benefit",
                optionalFormPanelDetail: {
                    panelLeadTitle: "Defer Benefit",
                    panelLeadDescription: "<p>You can skip (defer) making a pension choice and come back to make that choice later.</p><p>You may choose to defer payment of a pension benefit if:</p>",
                    learnMoreLink: ""
                }
            }
        ];
        fixture.detectChanges();
        component.formatPaymentOptionsData(true);
    }));
    it("should call cancontinue function - come back later scenario", () => {
        component.selectedPlans = [
            {
                id: "3744_0_10_2325_3140",
                planId: "3744",
                electionGroupId: "0",
                electionId: "10",
                optionalFormGroupId: 2325,
                optionalFormId: 3140,
                optionalFormDescription: "Joint & Survivor w/Pop Up",
                optionalFormType: "JSPU",
                isHypotheticalOptionalForm: true,
                paymentOptionDetail: [
                    {
                        label: null,
                        labelCode: null,
                        amountToYouFormatted: "$406.00",
                        amountToYou: 406,
                        frequencyText: "(monthly)",
                        optionalFormFrequency: "M",
                        amountToBeneFormatted: "$203.00",
                        amountToBene: 203,
                        popupText: "If your beneficiary dies before you, your payments will increase to $500.00.",
                        dateRanageDetail: []
                    }]
            }
        ];
        fixture.detectChanges();
        component.canContinue(false);
    });
    // it('should call onCancel function', waitForAsync(() => {
    //   component.onCancel();
    //   fixture.detectChanges();
    // }));
    it("should call preActivityForCancel service", () => {
        component.checkPreActivityEdit();
    });

    it("should call groupPaymentOptions function", () => {
        component.groupPaymentOptions();
    });

    it("should call getUpdatedPpsData function", waitForAsync(() => {
        component.paymentOptionsData = [
            {
                planId: "8744",
                elecGroupId: "0",
                elecId: "190",
                opformGroupId: 2325,
                electionDescription: "Simple Election 2",
                opfmGrpDescription: "Simple Election Opfm Gp",
                benefitDescription: "Simple Election 2—Simple Election Opfm Gp",
                isDeferred: false,
                paymentOption: {
                    paymentOptionId: 3040,
                    paymentOptionDescription: "Single Life Annuity",
                    paymentOptionToYouAmt: "$2,202.09",
                    paymentOptionFrequency: "(monthly)",
                    labelFrequencyId: "M"
                }
            }
        ];
        fixture.detectChanges();
        component.getUpdatedPpsData();
    }));

    it("should call validateOpfmSelections function value",waitForAsync(() => {
        component.selectedPlans = [
            {
                id: "3744_0_10_2325",
                deferId: "3744_0_10",
                label: "Defer Benefit",
                optionalFormPanelDetail: {
                    panelLeadTitle: "Defer Benefit",
                    panelLeadDescription: "<p>You can skip (defer) making a pension choice and come back to make that choice later.</p><p>You may choose to defer payment of a pension benefit if:</p>",
                    learnMoreLink: ""
                }
            }
        ];
        fixture.detectChanges();
        component.validateOpfmSelections();
    }));
    it("should call opfmMatrixHeaderStoreID function", waitForAsync(() => {
        component.data = {
            optionalFormMatrixTableHeader: [
                {
                    id: "3744_0_10_2325",
                    planId: null,
                    header1: "CB Pension Plan",
                    header2Id: null,
                    header2: null,
                    header3Id: null,
                    header3: null,
                    optionalFormPanelDetailPlan: null,
                    optionalFormPanelDetailElection: null
                }
            ]
        };
        fixture.detectChanges();
        component.opfmMatrixHeaderStoreId();
    }));
    it("should call formatElecGrpNotOnFile", waitForAsync(() => {
        let PlanItem = {
            planId: "0"
        };
        let elecGrpItem = {
            elecGroupId: "0"
        };
        let defaultItem = {
            elecId: "0",
            opformGroupId: "0",
            isDeferred: false,
            firstOptionalFormId: "0"
        };
        component.formatElecGrpNotOnFile(PlanItem,elecGrpItem,defaultItem);
    }));
    it("should call formatOptionalForm - defer scenario", waitForAsync(() => {
        let PlanItem = {
            planId: "0"
        };
        let elecGrpItem = {
            elecGroupId: "0"
        };
        let benefitItem = {
            elecId: "0",
            opformGroupId: "0",
            isDeferred: true,
            firstOptionalFormId: "0"
        };
        component.formatOptionalForm(PlanItem,elecGrpItem,benefitItem);
    }));
    it("should call formatOptionalForm - payment option unavailable", waitForAsync(() => {
        let PlanItem = {
            planId: "0"
        };
        let elecGrpItem = {
            elecGroupId: "0"
        };
        let benefitItem = {
            elecId: "0",
            opformGroupId: "0",
            isDeferred: false,
            firstOptionalFormId: "0"
        };
        component.formatOptionalForm(PlanItem,elecGrpItem,benefitItem);
    }));
    it("should call formatOptionalForm - payment option available secnario", waitForAsync(() => {
        let PlanItem = {
            planId: "0"
        };
        let elecGrpItem = {
            elecGroupId: "0"
        };
        let benefitItem = {
            elecId: "0",
            opformGroupId: "0",
            isDeferred: false,
            firstOptionalFormId: "0",
            paymentOption: {
                paymentOptionId: "0"
            }
        };
        component.formatOptionalForm(PlanItem,elecGrpItem,benefitItem);
    }));
    it("should call opfmMatrixSaveService",() => {
        component.opfmMatrixSaveService(false);
    });
    it("should call formatSaveApiRequestPayload", waitForAsync(() => {
        component.ppsData = {
            "planList":[
                {
                    "planId": "5744",
                    "planDescription": "Contributory Pension Plan",
                    "planNote": "<strong>Note:</strong> Amounts are before tax, and don't include any payments to your beneficiary after you die (if applicable).",
                    "hasDeferOption": true,
                    "isQualifiedPlan": true,
                    "isCashBalancePlan": false,
                    "electionGroupList": [
                        {
                            "displayElecGroup": false,
                            "elecGroupId": "0",
                            "elecGroupDescription": "Election Group",
                            "elecGroupSelected": true,
                            "benefitList": [
                                {
                                    "elecId": "10",
                                    "opformGroupId": 2325,
                                    "electionDescription": "Simple Election",
                                    "opfmGrpDescription": "CB-Simple Election Opfm Grp",
                                    "benefitDescription": "Simple Election—CB-Simple Election Opfm Grp",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3140
                                },
                                {
                                    "elecId": "50",
                                    "opformGroupId": 3704,
                                    "electionDescription": "Contribution Vested Withdrawal",
                                    "opfmGrpDescription": "Ctrb Withdrawal Opfm Gp",
                                    "benefitDescription": "Contribution Vested Withdrawal—Ctrb Withdrawal Opfm Gp",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3010
                                }
                            ],
                            "defaultElectionGroupDeferredElection": []
                        }
                    ]
                }
            ]
        };
        fixture.detectChanges();
        component.formatSaveApiRequestPayload();
    }));
    it("should call formatSaveApiRequestPayload", waitForAsync(() => {
        component.ppsData = {
            "planList":[
                {
                    "planId": "5744",
                    "planDescription": "Contributory Pension Plan",
                    "planNote": "<strong>Note:</strong> Amounts are before tax, and don't include any payments to your beneficiary after you die (if applicable).",
                    "hasDeferOption": true,
                    "isQualifiedPlan": true,
                    "isCashBalancePlan": false,
                    "electionGroupList": [
                        {
                            "displayElecGroup": true,
                            "elecGroupId": "2202",
                            "elecGroupDescription": "Contributions Elec Gp",
                            "elecGroupSelected": false,
                            "benefitList": [],
                            "defaultElectionGroupDeferredElection": [
                                {
                                    "elecId": "60",
                                    "opformGroupId": 5508,
                                    "electionDescription": "Contributions Retained",
                                    "opfmGrpDescription": "Contributions Retained",
                                    "benefitDescription": "Contributions Retained—Contributions Retained",
                                    "isDeferred": true,
                                    "firstOptionalFormId": 3170
                                },
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5609,
                                    "electionDescription": "Contributions Refunded",
                                    "opfmGrpDescription": "Contributions Refunded",
                                    "benefitDescription": "Contributions Refunded—Contributions Refunded",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3040
                                },
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5771,
                                    "electionDescription": "Contributions Refunded",
                                    "opfmGrpDescription": "Contribution Rfnd LS",
                                    "benefitDescription": "Contributions Refunded—Contribution Rfnd LS",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3010
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        fixture.detectChanges();
        component.formatSaveApiRequestPayload();
    }));
    it("should call formatSaveApiRequestPayload", waitForAsync(() => {
        component.ppsData = {
            "planList":[
                {
                    "planId": "5744",
                    "planDescription": "Contributory Pension Plan",
                    "planNote": "<strong>Note:</strong> Amounts are before tax, and don't include any payments to your beneficiary after you die (if applicable).",
                    "hasDeferOption": true,
                    "isQualifiedPlan": true,
                    "isCashBalancePlan": false,
                    "electionGroupList": [
                        {
                            "displayElecGroup": true,
                            "elecGroupId": "2202",
                            "elecGroupDescription": "Contributions Elec Gp",
                            "elecGroupSelected": true,
                            "benefitList": [
                                {
                                    "elecId": "60",
                                    "opformGroupId": 5508,
                                    "electionDescription": "Contributions Retained",
                                    "opfmGrpDescription": "Contributions Retained",
                                    "benefitDescription": "Contributions Retained—Contributions Retained",
                                    "isDeferred": true
                                }
                            ],
                            "defaultElectionGroupDeferredElection": [
                                {
                                    "elecId": "60",
                                    "opformGroupId": 5508,
                                    "electionDescription": "Contributions Retained",
                                    "opfmGrpDescription": "Contributions Retained",
                                    "benefitDescription": "Contributions Retained—Contributions Retained",
                                    "isDeferred": true,
                                    "firstOptionalFormId": 3170
                                },
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5609,
                                    "electionDescription": "Contributions Refunded",
                                    "opfmGrpDescription": "Contributions Refunded",
                                    "benefitDescription": "Contributions Refunded—Contributions Refunded",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3040
                                },
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5771,
                                    "electionDescription": "Contributions Refunded",
                                    "opfmGrpDescription": "Contribution Rfnd LS",
                                    "benefitDescription": "Contributions Refunded—Contribution Rfnd LS",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3010
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        fixture.detectChanges();
        component.formatSaveApiRequestPayload();
    }));
    it("should call formatSaveApiRequestPayload", waitForAsync(() => {
        component.ppsData = {
            "planList":[
                {
                    "planId": "5744",
                    "planDescription": "Contributory Pension Plan",
                    "planNote": "<strong>Note:</strong> Amounts are before tax, and don't include any payments to your beneficiary after you die (if applicable).",
                    "hasDeferOption": true,
                    "isQualifiedPlan": true,
                    "isCashBalancePlan": false,
                    "electionGroupList": [
                        {
                            "displayElecGroup": true,
                            "elecGroupId": "2202",
                            "elecGroupDescription": "Contributions Elec Gp",
                            "elecGroupSelected": true,
                            "benefitList": [
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5508,
                                    "electionDescription": "Contributions Retained",
                                    "opfmGrpDescription": "Contributions Retained",
                                    "benefitDescription": "Contributions Retained—Contributions Retained",
                                    "isDeferred": true
                                }
                            ],
                            "defaultElectionGroupDeferredElection": [
                                {
                                    "elecId": "60",
                                    "opformGroupId": 5508,
                                    "electionDescription": "Contributions Retained",
                                    "opfmGrpDescription": "Contributions Retained",
                                    "benefitDescription": "Contributions Retained—Contributions Retained",
                                    "isDeferred": true,
                                    "firstOptionalFormId": 3170
                                },
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5609,
                                    "electionDescription": "Contributions Refunded",
                                    "opfmGrpDescription": "Contributions Refunded",
                                    "benefitDescription": "Contributions Refunded—Contributions Refunded",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3040
                                },
                                {
                                    "elecId": "70",
                                    "opformGroupId": 5771,
                                    "electionDescription": "Contributions Refunded",
                                    "opfmGrpDescription": "Contribution Rfnd LS",
                                    "benefitDescription": "Contributions Refunded—Contribution Rfnd LS",
                                    "isDeferred": false,
                                    "firstOptionalFormId": 3010
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        fixture.detectChanges();
        component.formatSaveApiRequestPayload();
    }));
    it("should call cancontinue function - continue scenario -form valid", waitForAsync(() => {
        component.allowContinueElectionGrp = true;
        component.allowContinueNonElectionGrp = true;
        component.selectedPlans = [
            {
                id: "3744_0_10_2325_3140",
                planId: "3744",
                electionGroupId: "0",
                electionId: "10",
                optionalFormGroupId: 2325,
                optionalFormId: 3140,
                optionalFormDescription: "Joint & Survivor w/Pop Up",
                optionalFormType: "JSPU",
                isHypotheticalOptionalForm: true,
                paymentOptionDetail: [
                    {
                        label: null,
                        labelCode: null,
                        amountToYouFormatted: "$406.00",
                        amountToYou: 406,
                        frequencyText: "(monthly)",
                        optionalFormFrequency: "M",
                        amountToBeneFormatted: "$203.00",
                        amountToBene: 203,
                        popupText: "If your beneficiary dies before you, your payments will increase to $500.00.",
                        dateRanageDetail: []
                    }]
            }
        ];
        fixture.detectChanges();
        component.canContinue(true);
    }));
    it("should call cancontinue function - continue scenario -form invalid", waitForAsync(() => {
        component.allowContinueElectionGrp = false;
        component.allowContinueNonElectionGrp = true;
        component.data = {
            dbRetirementOpfmMatrixResponse: {
                editList: []
            }
        };
        component.selectedPlans = [
            {
                id: "3744_0_10_2325_3140",
                planId: "3744",
                electionGroupId: "0",
                electionId: "10",
                optionalFormGroupId: 2325,
                optionalFormId: 3140,
                optionalFormDescription: "Joint & Survivor w/Pop Up",
                optionalFormType: "JSPU",
                isHypotheticalOptionalForm: true,
                paymentOptionDetail: [
                    {
                        label: null,
                        labelCode: null,
                        amountToYouFormatted: "$406.00",
                        amountToYou: 406,
                        frequencyText: "(monthly)",
                        optionalFormFrequency: "M",
                        amountToBeneFormatted: "$203.00",
                        amountToBene: 203,
                        popupText: "If your beneficiary dies before you, your payments will increase to $500.00.",
                        dateRanageDetail: []
                    }]
            }
        ];
        fixture.detectChanges();
        component.canContinue(true);
    }));

});
