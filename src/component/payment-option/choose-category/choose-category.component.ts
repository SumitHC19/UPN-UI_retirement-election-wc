import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AlPanelSectionService } from "../../../services/al-panel-section.service";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { StepsActiveIndexService } from "../../../services/steps-active-index-service";
import { AlTipsAlertComponent, UISafePipe, DomStorageFallbackService, LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService, AlLoaderComponent } from "@alight/core-utilities-lib";
import { IntegrationCpoPpsService } from "../../../services/integration-cpo-pps.service";
import { SaveChooseCategoryDataService } from "../../../services/save-choosecategory-data.service";
import { EditMessagesService } from "../../../services/edit-messages.service";
import { RightSideContentService } from "../../../services/right-side-content.service";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";

// declare var require:any;

@Component({
    selector: "al-choose-category",
    templateUrl: "./choose-category.component.html",
    providers: [AlLoaderComponent]
})

export class ChooseCategoryComponent implements OnInit {
    data: any;
    planidlist: any;
    checkresponse = false;
    mocked: string;
    queryParameters: any;
    responseData: any;
    showError = true;
    UPNCategoryFlow = true;
    planId: any;
    electionGroupId: any;
    selectedButton = {};
    electionId: any;
    electionListId: any;
    @ViewChild("display") display: any;
    cpoResponse: any;
    dataFromService: any;
    chosenplan: any;
    chosenIds: any;
    isDisabled = false;
    disallowcontinue = false;
    editMessageList: any[];
    selectedChosenArray = [];
    chosenObject: any;
    paymentOptionfrmId: any;
    chosenCategoryPlan: any;
    deferredFlag: any;
    businessProcessReferenceId: any;
    rawSaveResponseData: any;
    isPlanElectionDeferred: any;
    planIdItem: any;
    electionGroupItem: any;
    electionItem: any;
    opformGroupIdItem: any;
    paymentOptionIdItem: any;
    saveApiRequestBody: any;
    isElectionDeferredItem: any;
    plandetails: any;
    ppsDataStorePlan: any;
    ViewRhrComponents = new ViewRhrComponentsModel();
    routeToPageLocation: any;
    hassTBAEdit = false;
    notOnFileData: any;
    benefitItem: any;
    notOnArry: any;
    optionalformnone = false;
    showQuitButton = true;
    showCBLButton = true;

    constructor(private router: Router,
        private retirementElectionRestService: RetirementElectionRestService,
        private alPanelSectionService: AlPanelSectionService,
        private integrationCpoPpsService: IntegrationCpoPpsService,
        private stepsActiveIndexService: StepsActiveIndexService,
        private loading: AlLoaderComponent,
        private saveChooseCategoryDataService: SaveChooseCategoryDataService,
        private editMessagesService: EditMessagesService,
        private logger: LoggingService,
        private rightSideContentService: RightSideContentService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService
    ) {
        this.ViewRhrComponents.viewPplLikemeComp = true;
        this.ViewRhrComponents.viewComparePoComp = true;
        this.ViewRhrComponents.viewDocAndResComp = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    ngOnInit() {
        this.dynamicComponentService.initializePageComponents();
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(3);
        } else {
            this.stepsActiveIndexService.setStepIndex(4);
        }
        // this.stepsActiveIndexService.setStepIndex(4);
        this.rightSideContentService.setParamIDs(0, 0);
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        if (isCallBackAllowed) {
            if (!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if (!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            this.retirementElectionRestService.getQueryParameters();
            this.plandetails = this.integrationCpoPpsService.getChosenIds();
            this.ppsDataStorePlan = this.integrationCpoPpsService.getAllOptionalForms();
            this.chooseCategoryData();
            this.retirementElectionRestService.screenCapture(true);
        } else {
            this.checkresponse = true;
        }
    }

    chooseCategoryData() {
        let planId = this.plandetails.planId;
        let electionGroupId = this.plandetails.electionGroupId;
        let makeGetCall = this.saveChooseCategoryDataService.decideGetCallOrCache(planId, electionGroupId);
        if (makeGetCall && makeGetCall !== undefined && makeGetCall === true) {
            this.retirementElectionRestService.chooseCategorydataService(planId, electionGroupId)
                .pipe(
                    finalize(() => {
                        this.checkresponse = true;
                        /* istanbul ignore next */
                        if (this.data !== null && this.data !== undefined) {
                            if (this.data.status !== undefined && this.data.status.statusCode !== undefined) {
                                let responseStatusCode = this.data.status.statusCode;
                                if (responseStatusCode === 200) {
                                    this.showError = false;
                                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices095ChooCatPage");
                                    this.saveChooseCategoryDataService.planArr.push({
                                        "planId": planId,
                                        "electionGroupId": electionGroupId,
                                        "data": this.data
                                    });
                                    this.saveChooseCategoryDataService.setCCPlanElecData(this.saveChooseCategoryDataService.planArr);
                                    this.saveChooseCategoryDataService.setCCData(this.data);
                                    this.setDefaultChosen();
                                    if (this.data && this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.pageTitle) {
                                        document.title = this.data.choosePaymentCategoryBean.pageTitle;
                                        this.rightSideContentService.setCalcRefNum(this.data.choosePaymentCategoryBean.calculationReferenceNumber);
                                        this.rightSideContentService.setCalcFrmSupportFlag(this.data.choosePaymentCategoryBean.areCalculationFormulasSupported);
                                    }
                                    if (this.data && this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.paymentChoicePanelList) {
                                        this.alPanelSectionService.setPanelList(this.data.choosePaymentCategoryBean.paymentChoicePanelList);
                                    }
                                    this.cpoResponse = this.integrationCpoPpsService.getCategoryData();
                                    if (this.cpoResponse !== undefined) {
                                        this.saveChooseCategoryDataService.setCCPlanElecData(this.saveChooseCategoryDataService.planArr);
                                        this.saveChooseCategoryDataService.setCCData(this.data);
                                    }
                                }
                            }
                        }
                        this.retirementElectionRestService.screenCaptureInit("choose-category");
                    }),
                ).subscribe(
                    (data: any) => {
                        if (data !== undefined && data !== null && data.body !== undefined) {
                            this.data = data.body;
                        }
                        this.logger._debug(JSON.stringify(data), "Getting CC details successfully", LoggingConstants.INFO, "RetirementElection - CC - Get Service");
                    },
                    /* istanbul ignore next */
                    (error) => {
                        this.logger._error(JSON.stringify(error), "Error in  CC component response", LoggingConstants.ERROR, "RetirementElection - CC - Get Service");
                    }
                );
        } else {
            let currentChooseCategoryData = this.saveChooseCategoryDataService.getCCPlanElecData().filter((item) => planId === item.planId && electionGroupId === item.electionGroupId);
            this.checkresponse = true;
            /* istanbul ignore next */
            if (currentChooseCategoryData) {
                this.data = currentChooseCategoryData[0].data;
                if (this.data !== undefined && this.data !== null) {
                    this.showError = false;
                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices095ChooCatPage");
                    this.saveChooseCategoryDataService.setCCData(this.data);
                    this.setDefaultChosen();
                    if (this.data && this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.pageTitle) {
                        document.title = this.data.choosePaymentCategoryBean.pageTitle;
                    }
                    if (this.data && this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.paymentChoicePanelList) {
                        this.alPanelSectionService.setPanelList(this.data.choosePaymentCategoryBean.paymentChoicePanelList);
                    }
                    this.cpoResponse = this.integrationCpoPpsService.getCategoryData();
                    if (this.cpoResponse !== undefined) {
                        this.saveChooseCategoryDataService.setCCData(this.data);
                    }
                } else {
                    this.logger._error("ERROR", "Error in getting cached data response", LoggingConstants.ERROR, "RetirementElection - CC - Get Service");
                }
            }
            this.retirementElectionRestService.screenCaptureInit("choose-category");
        }
        window.scrollTo(0, 0);
    }


    /* istanbul ignore next */
    setDefaultChosen() {
        this.chosenIds = this.integrationCpoPpsService.getChosenIds();
        if (!this.chosenIds.UpnPpsflow) {
            if (this.chosenIds.deferredFlag) {
                this.deferredFlag = false;
                this.integrationCpoPpsService.setChosenIds(this.chosenIds.planId, this.chosenIds.electionGroupId, this.chosenIds.ElectionId, this.chosenIds.UpnPpsflow, this.deferredFlag);
                let electionGroupList = this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent;
                electionGroupList.map((listItem, i) => {
                    /* istanbul ignore next */
                    if (this.chosenIds.ElectionId === listItem.electionId) {
                        listItem.isElectionDeferred = true;
                        this.enableDisableRule(i);
                    }
                });
            }

            this.chosenplan = this.integrationCpoPpsService.getChosenPlanDetails();
            /* istanbul ignore next */
            if (this.chosenplan !== undefined) {
                let electionGroupList = this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent;
                electionGroupList.map((listItem, i) => {
                    if (listItem.isElectionChosen) {
                        this.selectedButton = {};
                        this.selectedButton[i] = !this.selectedButton[i];
                        this.storeDatatoCategoryService(i);
                    }
                });
            }
        }
    }

    enableDisableRule(i) {
        this.selectedButton = {};
        this.selectedButton[i] = !this.selectedButton[i];
        if (this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.electionGroupTableData && this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent) {
            for (let i = 0; i < this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent.length; i++) {
                let chosenPlanList = this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent[i];
                chosenPlanList.isElectionChosen = false;
            }
            let chosenPlanList = this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent[i];
            chosenPlanList.isElectionChosen = true;
            this.storeDatatoCategoryService(i);
        }
    }

    setChosenCategoryGroupPlan(electionTableDataListIndex, flagType) {
        let deferredflag;
        this.editMessagesService.editMessageFlagSubject.next(false);
        if (this.data && this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.electionGroupTableData) {
            let chosenPlanList = this.data.choosePaymentCategoryBean.electionGroupTableData;
            let planListId = chosenPlanList.planId;
            let electionGroupId = chosenPlanList.electionGroupId;
            this.electionListId = chosenPlanList.electionTableDataContent[electionTableDataListIndex];
            if (this.electionListId && this.electionListId.electionId) {
                this.electionId = this.electionListId.electionId;
            }

            this.integrationCpoPpsService.setChosenIds(planListId, electionGroupId, this.electionId, flagType, this.deferredFlag);
            let selectedPlanList;
            selectedPlanList = chosenPlanList.electionTableDataContent.filter((item) => item.electionId === this.electionId);
            this.integrationCpoPpsService.setChosenCategoryPlanDetails(selectedPlanList);
            if (this.data.choosePaymentCategoryBean.calculationReferenceNumber !== undefined) {
                this.integrationCpoPpsService.setCalculationReferenceNumber(this.data.choosePaymentCategoryBean.calculationReferenceNumber);
            }
            this.retirementElectionRestService.onRouteDBElec("choose-payment-option");
        }
    }

    storeDatatoCategoryService(chosenObjectId) {
        if (this.data && this.data.choosePaymentCategoryBean && this.data.choosePaymentCategoryBean.electionGroupTableData && this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent) {
            this.chosenObject = this.data.choosePaymentCategoryBean.electionGroupTableData.electionTableDataContent[chosenObjectId];
            let pmtObjarray = [];
            if (this.chosenObject && this.chosenObject.optionalFormGroupPaymentData) {
                for (let j = 0; j < this.chosenObject.optionalFormGroupPaymentData.length; j++) {
                    let paymentOptionObject = {};
                    let paymentOptionObject1 = {};
                    let optionalFormGroupPaymentList = this.chosenObject.optionalFormGroupPaymentData[j];
                    paymentOptionObject["elecId"] = this.chosenObject.electionId;
                    paymentOptionObject["opformGroupId"] = Number(optionalFormGroupPaymentList.optionalFormGroupId);
                    paymentOptionObject["electionDescription"] = this.chosenObject.electionDescription;
                    paymentOptionObject["opfmGrpDescription"] = optionalFormGroupPaymentList.optionalFormGroupDescription;
                    paymentOptionObject["benefitDescription"] = this.chosenObject.electionDescription + "—" + optionalFormGroupPaymentList.optionalFormGroupDescription;
                    paymentOptionObject["isDeferred"] = this.chosenObject.isElectionDeferred;
                    if (optionalFormGroupPaymentList.selectedOptionalFormPaymentData && optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormId) {
                        this.paymentOptionfrmId = Number(optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormId);
                    } else {
                        this.paymentOptionfrmId = Number(optionalFormGroupPaymentList.firstOptionalFormId);
                        this.optionalformnone = true;
                    }
                    paymentOptionObject1["optionalFormNone"] = this.optionalformnone;
                    paymentOptionObject1["paymentOptionId"] = this.paymentOptionfrmId;
                    if (optionalFormGroupPaymentList.selectedOptionalFormPaymentData && optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormDescription) {
                        paymentOptionObject1["paymentOptionDescription"] = optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormDescription;
                    }
                    if (optionalFormGroupPaymentList.selectedOptionalFormPaymentData && optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormStartAmount) {
                        paymentOptionObject1["paymentOptionToYouAmt"] = optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormStartAmount;
                    }
                    if (optionalFormGroupPaymentList.selectedOptionalFormPaymentData && optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormFrequencyCode) {
                        paymentOptionObject1["labelFrequencyId"] = optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormFrequencyCode;
                    }
                    paymentOptionObject["paymentOption"] = paymentOptionObject1;
                    let chosenObjectAutoPaymentList = optionalFormGroupPaymentList.selectedOptionalFormPaymentData;
                    if (chosenObjectAutoPaymentList && chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList) {
                        if (chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList.length > 0) {
                            let autoSelectionPaymentList = [];
                            for (let i = 0; i < chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList.length; i++) {
                                let tempObject = {};
                                tempObject["autoSelectPlanId"] = this.data.choosePaymentCategoryBean.electionGroupTableData.planId;
                                tempObject["autoSelectElectionId"] = this.chosenObject.electionId;
                                tempObject["autoSelectOptionalFormGroupId"] = chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList[i].optionalFormId;
                                tempObject["autoSelectOpFormId"] = this.paymentOptionfrmId;
                                tempObject["autoSelectedFormOfPayment"] = chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList[i].optionalFormDescription;
                                tempObject["autoSelectedPaymentToYouAmt"] = chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList[i].optionalFormStartAmount;
                                tempObject["labelFrequencyId"] = chosenObjectAutoPaymentList.autoSelectedOptionalFormsOfPaymentList[i].optionalFormFrequencyCode;
                                autoSelectionPaymentList.push(tempObject);
                            }
                            paymentOptionObject1["autoSelectedFormsOfPaymentList"] = autoSelectionPaymentList;
                        }
                    }
                    pmtObjarray.push(paymentOptionObject);
                }
                this.integrationCpoPpsService.setData(pmtObjarray);
            }
        }
    }

    /* istanbul ignore next */
    redirectNext(buttonActionType) {
        if (this.disallowcontinue === true) {
            this.editMessagesService.editMessageFlagSubject.next(false);
            this.disallowcontinue = true;
            Promise.resolve().then(() => {
                this.continueClick(buttonActionType);
            });
        } else {
            this.continueClick(buttonActionType);
        }
    }



    /* istanbul ignore next */
    continueClick(buttonActionType) {
        this.businessProcessReferenceId = 0;
        let saveApiResponse: any;
        let editIdMsg: string;
        this.disallowcontinue = false;
        let throwException = {};
        if (buttonActionType) {
            try {
                if (this.selectedButton && (Object.keys(this.selectedButton).length === 0)) {
                    this.editMessageList = [];
                    this.editMessageList.push(this.findEditMessage("0"));
                    this.editMessagesService.saveEditArray(this.editMessageList);
                    this.editMessagesService.editMessageFlagSubject.next(true);
                    this.disallowcontinue = true;
                    window.scrollTo(0, 0);
                    throw throwException;
                }
                /* istanbul ignore next */
                if (this.chosenObject && this.chosenObject.optionalFormGroupPaymentData) {
                    for (let i = 0; i < this.chosenObject.optionalFormGroupPaymentData.length; i++) {
                        let optinFrmGrpPaymentData = this.chosenObject.optionalFormGroupPaymentData[i];
                        for (let j = 0; j < this.data.choosePaymentCategoryBean.editList.length; j++) {
                            let editListItem = this.data.choosePaymentCategoryBean.editList[j];
                            if (this.chosenObject.electionId === editListItem.editId) {
                                editIdMsg = editListItem.editId;
                            }
                        }
                        if (!this.chosenObject.isElectionDeferred) {
                            if (!optinFrmGrpPaymentData.selectedOptionalFormPaymentData) {
                                this.editMessageList = [];
                                this.editMessageList.push(this.findEditMessage(editIdMsg));
                                this.editMessagesService.saveEditArray(this.editMessageList);
                                this.editMessagesService.editMessageFlagSubject.next(true);
                                this.disallowcontinue = true;
                                window.scrollTo(0, 0);
                                throw throwException;
                            }
                        }
                    }
                }
                this.cancontinue(buttonActionType);
            } catch (throwException) {
                this.cancontinue(buttonActionType);
            }
        } else {
            this.cancontinue(buttonActionType);
        }
    }

    findEditMessage(editId) {
        return this.data.choosePaymentCategoryBean.editList.find(editItem => editId === editItem.editId);
    }

    cancontinue(buttonActionType) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("choosecategory");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        let selectedOptionalForms = [];
        let responseStatusCode: any;
        let saveApiResponse: any;
        let optionalFormNotSelected;
        let paymentOptionId;
        this.businessProcessReferenceId = 0;
        /* istanbul ignore next */
        if (!this.disallowcontinue) {
            this.deferredFlag = true;
            this.editMessageList = [];
            this.notOnArry = [];
            this.editMessagesService.editMessageFlagSubject.next(false);
            if (buttonActionType) {
                this.retirementElectionRestService.onRouteDBElec("pension-payment-summary");
            } else if (!buttonActionType) {
                let ccDataId = this.integrationCpoPpsService.getChosenIds();
                let ccSelectedData = this.integrationCpoPpsService.getData();
                if (!this.hassTBAEdit) {
                    if (ccSelectedData !== undefined) {
                        for (let i = 0; i < this.ppsDataStorePlan.length; i++) {
                            let ppsGetData = this.ppsDataStorePlan[i];
                            if (ppsGetData.planId === ccDataId.planId) {
                                /* istanbul ignore next */
                                for (let j = 0; j < ppsGetData.electionGroupList.length; j++) {
                                    let electionGroupList = ppsGetData.electionGroupList[j];
                                    if (electionGroupList.elecGroupId === ccDataId.electionGroupId) {
                                        electionGroupList.benefitList = ccSelectedData;
                                    }
                                }
                            }
                        }
                    }
                    for (let r = 0; r < this.ppsDataStorePlan.length; r++) {
                        let ppsAllFrm = this.ppsDataStorePlan[r];
                        for (let s = 0; s < ppsAllFrm.electionGroupList.length; s++) {
                            let frmAllGroupList = ppsAllFrm.electionGroupList[s];
                            if (frmAllGroupList.displayElecGroup && frmAllGroupList.benefitList.length === 0) {
                                for (let w = 0; w < frmAllGroupList.defaultElectionGroupDeferredElection.length; w++) {
                                    let deferAllSetData = frmAllGroupList.defaultElectionGroupDeferredElection[w];
                                    deferAllSetData.isDeferred = false;
                                }
                                frmAllGroupList.benefitList = frmAllGroupList.defaultElectionGroupDeferredElection;
                            } else if (frmAllGroupList.displayElecGroup && frmAllGroupList.benefitList.length !== 0) {
                                for (let j = 0; j < frmAllGroupList.benefitList.length; j++) {
                                    this.benefitItem = frmAllGroupList.benefitList[j];
                                    this.notOnArry.push(this.benefitItem);
                                }
                                for (let w = 0; w < frmAllGroupList.defaultElectionGroupDeferredElection.length; w++) {
                                    this.notOnFileData = frmAllGroupList.defaultElectionGroupDeferredElection[w];
                                    if (this.benefitItem.elecId !== this.notOnFileData.elecId) {
                                        this.notOnFileData.isDeferred = false;
                                        this.notOnArry.push(this.notOnFileData);
                                    }
                                }
                                frmAllGroupList.benefitList = this.notOnArry;
                            }
                        }
                    }


                    this.deferredFlag = true;
                    this.ppsDataStorePlan.forEach(planIdItem => {
                        let planId = planIdItem.planId;
                        planIdItem.electionGroupList.forEach(electionGroupIdItem => {
                            let elecGroupId = electionGroupIdItem.elecGroupId;
                            electionGroupIdItem.benefitList.forEach(benefitIdItem => {
                                let elecId = benefitIdItem.elecId;
                                let opformGroupId = benefitIdItem.opformGroupId;
                                if (benefitIdItem.isDeferred) {
                                    paymentOptionId = 0;
                                    this.isPlanElectionDeferred = true;
                                    optionalFormNotSelected = true;
                                } else if (!benefitIdItem.isDeferred && benefitIdItem.paymentOption !== undefined) {
                                    paymentOptionId = benefitIdItem.paymentOption.paymentOptionId;
                                    this.isPlanElectionDeferred = false;
                                    if (benefitIdItem.paymentOption.optionalFormNone !== undefined && benefitIdItem.paymentOption.optionalFormNone === true) {
                                        optionalFormNotSelected = true;
                                    } else {
                                        optionalFormNotSelected = false;
                                    }
                                } else {
                                    paymentOptionId = benefitIdItem.firstOptionalFormId;
                                    optionalFormNotSelected = true;
                                    this.isPlanElectionDeferred = false;
                                }
                                selectedOptionalForms.push(
                                    {
                                        "planId": planId,
                                        "electionGroupId": elecGroupId,
                                        "electionId": elecId,
                                        "optionalFormGroupId": opformGroupId,
                                        "optionalFormId": paymentOptionId,
                                        "optionalFormNotSelected": optionalFormNotSelected,
                                        "isPlanElectionDeferred": this.isPlanElectionDeferred
                                    }
                                );

                            });
                        });
                    });

                    this.editMessagesService.editMessageFlagSubject.next(false);
                    this.saveApiRequestBody = {
                        "shouldValidate": false,
                        "shouldAdvanceStep": false,
                        "retirementStep": "Forms of Payment",
                        "hasElectedToDeferAllOptionalForms": false,
                        "selectedOptionalForms": selectedOptionalForms
                    };
                    this.editMessagesService.saveApiRequestBodySubject.next(this.saveApiRequestBody);
                }
                this.loading.showIndicator("#saveServiceLoader", "");
                this.retirementElectionRestService.pensionPaymentSummarySaveService(this.deferredFlag, this.hassTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType, this.hassTBAEdit)
                    .pipe(
                        finalize(() => {
                            if (saveApiResponse) {
                                responseStatusCode = saveApiResponse.statusCode;
                                this.loading.hideIndicator("#saveServiceLoader", "");
                                if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                                    this.showError = true;
                                } else {
                                    /* istanbul ignore next */
                                    this.saveApiResponseAction(saveApiResponse, buttonActionType);
                                }
                            }
                        })
                    )
                    .subscribe(
                        (data: any) => {
                            this.rawSaveResponseData = data;
                            saveApiResponse = data.body;
                            this.logger._debug(JSON.stringify(data), "Getting CC details successfully", LoggingConstants.INFO, "RetirementElection - CC - Save Service");
                        },
                        (error) => {
                            /* istanbul ignore next */
                            this.rawSaveResponseData = error;
                            saveApiResponse = error.body;
                            this.logger._error(JSON.stringify(error), "Error in CC component response", LoggingConstants.ERROR, "RetirementElection - CC - Save Service");
                        });
            } else {
                /* istanbul ignore next */
                this.editMessagesService.saveEditArray(this.data.editList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            }
        }
    }

    /* istanbul ignore next */
    saveApiResponseAction(saveApiResponse, buttonActionType) {
        this.routeToPageLocation = "saved";
        /**
     * Check for TBA Edits/ Server side edits
    */
        let saveEditList = this.retirementElectionRestService.extractEditMessages(this.rawSaveResponseData);
        if (saveEditList !== undefined) {
            this.editMessagesService.redirectToUrlSubject.next(this.routeToPageLocation);
            this.editMessagesService.saveEditArray(saveEditList);
            this.editMessagesService.editMessageFlagSubject.next(true);
            window.scrollTo(0, 0);
        } else if ((saveEditList === undefined) && (saveApiResponse.statusCode === 200) && (saveApiResponse.hasEdit === false)) {
            this.retirementElectionRestService.onRouteDBElec(this.routeToPageLocation);
        } else if ((saveApiResponse.statusCode === 400) && (saveApiResponse.hasEdit === true)) {
            /**
        * Case: Server side edits and service status 400
      */
            if (saveEditList !== undefined) {
                this.editMessagesService.saveEditArray(saveEditList);
                this.editMessagesService.editMessageFlagSubject.next(true);
                window.scrollTo(0, 0);
            } else {
                this.showError = true;
            }
        }

    }


    checkPreActivityEdit() {
        let headers: any;
        let response: any;
        this.retirementElectionRestService.checkPreActivityEdit()
            .pipe(
                finalize(() => {
                    /* istanbul ignore next */
                    if (response.hasOwnProperty("statusCode") && response.statusCode && response.statusCode !== null &&
                        response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.hasOwnProperty("preActivityEdit") && response.preActivityEdit && response.preActivityEdit !== null
                            && response.preActivityEdit !== undefined && response.preActivityEdit.hasEdit) {
                            let saveEditList = this.retirementElectionRestService.extractEditMessages(headers);
                            let editButtonList = this.editMessagesService.getEditButtonList(response);
                            if (editButtonList.length !== 0) {
                                this.editMessagesService.editButtonListSubject.next(editButtonList);
                            }
                            if (saveEditList !== undefined) {
                                this.editMessagesService.pageNameSubject.next("cancelFromChooseCategory");
                                this.editMessagesService.saveEditArray(saveEditList);
                                this.editMessagesService.editMessageFlagSubject.next(true);
                                window.scrollTo(0, 0);
                            }
                        } else {
                            this.onCancel();
                        }
                    }
                }))
            .subscribe(
                (data) => {
                    if (data && data !== null && data !== undefined) {
                        headers = data;
                        if (data.hasOwnProperty("_body")) {
                            response = data["_body"];
                            /* istanbul ignore next */
                            if (response && response !== null && response !== undefined &&
                                response.hasOwnProperty("data") && response.data && response.data !== null && response.data !== undefined) {
                                response = response.data;
                                this.logger._debug(JSON.stringify(data), "Getting Retirement Election details successfully", LoggingConstants.INFO, "RetirementElection - checkPreActivityEdit for cancel Service");
                            }
                        }
                    }
                }
            );
    }

    onCancel() {
        let response;
        let requestBody = {};
        let businessProcessId = 0;
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    if (response && response.statusCode) {
                        this.responseData = response.statusCode;
                        /* istanbul ignore next */
                        if (this.responseData !== 200) {
                            this.showError = true;
                        } else {
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                            this.showError = false;
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting CC details successfully", LoggingConstants.INFO, "RetirementElection - CC - Cancel Service");
                }
            );
    }

}
