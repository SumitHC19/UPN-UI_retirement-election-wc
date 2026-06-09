import { Component, ViewChild, OnInit, ElementRef, AfterContentInit, AfterViewInit } from "@angular/core";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { IntegrationCpoPpsService } from "../../../services/integration-cpo-pps.service";
import { SavePpsDataService } from "../../../services/save-pps-data.service";
import { DynamicComponentService, CacheStorageService, LoggingService, LoggingConstants, GoogleAnalyticsService, AlLoaderComponent } from "@alight/core-utilities-lib";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";
import { finalize } from "rxjs";
import { EditMessagesService } from "../../../services/edit-messages.service";
import { AlPanelSectionService } from "../../../services/al-panel-section.service";
import { FootnoteService } from "../../../services/footnote-common.service";

@Component({
    selector: "al-choose-payment-options-matrix",
    templateUrl: "./choose-payment-options-matrix.component.html",
    providers: [AlLoaderComponent]
})

export class ChoosePaymentOptionsMatrixComponent implements OnInit, AfterContentInit, AfterViewInit {
    calculationReferenceNumber: String;
    retirementFlow = true;
    paymentOptionsData: any = [];
    opfmHeaderData: any;
    showHeader = false;
    ViewRhrComponents = new ViewRhrComponentsModel();
    panelListExpand = [];
    buttonData: any;
    selectedPlans: any = [];
    data: any;
    opfmPanelContent: any;
    hypotheticalPanelContent = [];
    allPanelContent = [];
    pageLegalNote: any;
    beneficiaryText: any;
    beneficiaryLink: any;
    showError = false;
    ppsData: any;
    saveApiRequestBody: any;
    allowContinueElectionGrp = false;
    allowContinueNonElectionGrp = false;
    nonElectionMatrixGrpItem: any;
    electionMatrixGrpItem: any;
    electionMatrixHeaderId: any;
    editMessageList = [];
    opfmHeaderId: any;
    opfmHeaderIdLgth: any;
    opfmHeadermatrixId: any;
    opfmHeadermatrixIdLgth: any;
    hasTBAEdit: boolean;
    deferredFlag = true;
    businessProcessReferenceId = 0;
    rawSaveResponseData: true;
    routeToPageLocation: string;
    showQuitButton = true;
    showCBLButton = true;
    clientParaList: any;
    expandedParaFeatEnbled = false;
    customParaFeatEnbled = false;
    @ViewChild("dbProjOpfmMatrix", { static: true }) dbProjOpfmMatrix: ElementRef;
    constructor(
        private retirementElectionRestService: RetirementElectionRestService,
        private integrationCpoPpsService: IntegrationCpoPpsService,
        private dynamicComponentService: DynamicComponentService,
        private cacheService: CacheStorageService,
        private logger: LoggingService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private alPanelSectionService: AlPanelSectionService,
        private footnoteService: FootnoteService,
        private loading: AlLoaderComponent,
        private editMessagesService: EditMessagesService,
        private savePpsDataService: SavePpsDataService) {
        this.calculationReferenceNumber = this.integrationCpoPpsService.getCalculationReferenceNumber();
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    /* istanbul ignore next */
    ngOnInit() {
        this.retirementElectionRestService.removeSystemTickets();
        this.dynamicComponentService.initializePageComponents();
        let isCallBackAllowed: boolean = this.retirementElectionRestService.isCallBackAllowed();
        if (isCallBackAllowed) {
            if (!this.retirementElectionRestService.showQuitButton) {
                this.showQuitButton = false;
            }
            if (!this.retirementElectionRestService.showCBLButton) {
                this.showCBLButton = false;
            }
            // this.dynamicComponentService.loadScript("db-opfm-matrix-wc", "db-opfm-matrix-wc");
            this.retirementElectionRestService.screenCapture(true);
        } else {
            this.showError = true;
        }
    }

    ngAfterContentInit() {
        this.dynamicComponentService.loadMFScript("db-opfm-matrix-wc", "db-opfm-matrix-wc");
    }

    ngAfterViewInit() {
        this.loadComponent();
    }
    /* istanbul ignore next */
    loadComponent(){
        let pageutilityContainer = document.querySelector("#opfmMatrixComponent");
        if (pageutilityContainer) {
            pageutilityContainer.innerHTML = "";
            let pageulilitySelector = document.createElement("db-opfm-matrix-wc");
            pageulilitySelector.setAttribute("calcRefNo", this.calculationReferenceNumber + "");
            pageulilitySelector.setAttribute("retirementFlow", this.retirementFlow + "");
            (pageulilitySelector as any).callBackFun=this.callBackFun;
            pageutilityContainer.appendChild(pageulilitySelector);
        }
        this.dynamicComponentService.loadMFScript("db-opfm-matrix-wc", "db-opfm-matrix-wc");
    }
    callBackFun = (plan: CustomEvent) => {
        this.getOpfmMtarixData();
    };

    /**
     * @method getOpfmMtarixData
     * To retrive the opfm service data stored from IDB
     */

    /* istanbul ignore next */
    getOpfmMtarixData() {
        this.loading.showIndicator("#saveServiceLoader", "");
        this.cacheService.getItem("opfmServiceResponse", "dbOpfmMatrixStore")
            .subscribe((opfmData: any) => {
                if (opfmData && opfmData.dbRetirementOpfmMatrixResponse.responseStatus && opfmData.dbRetirementOpfmMatrixResponse.responseStatus !== null
                    && opfmData.dbRetirementOpfmMatrixResponse.responseStatus !== undefined && opfmData.dbRetirementOpfmMatrixResponse.responseStatus.statusCode === 200) {
                    this.loading.hideIndicator("#saveServiceLoader", "");
                    this.showError = false;
                    this.googleAnalyticsService.postGACustomPageTracking("UPN_DbRtrmChoices250MtrxChooOpFormPage");
                    this.data = opfmData;
                    if (this.data.isPPORetirementSupported === true) {
                        this.ViewRhrComponents.viewPplLikemeComp = false;
                        this.ViewRhrComponents.viewComparePoComp = false;
                    }
                    if (this.data !== null && this.data !== undefined && this.data.hasOwnProperty("optionalFormMatrixTableHeader")) {
                        if (this.data.optionalFormMatrixTableHeader !== null && this.data.optionalFormMatrixTableHeader !== undefined) {
                            this.opfmMatrixHeaderStoreId();
                        }
                    }
                    this.opfmHeaderData = opfmData.dbRetirementOpfmMatrixResponse.choosePaymentOptionHeader;
                    this.expandedParaFeatEnbled = opfmData.dbRetirementOpfmMatrixResponse.expandedParaFeatEnbled;
                    this.customParaFeatEnbled = opfmData.dbRetirementOpfmMatrixResponse.customParaFeatEnbled;
                    if (opfmData.dbRetirementOpfmMatrixResponse.clientParaList !== undefined && opfmData.dbRetirementOpfmMatrixResponse.clientParaList) {
                        this.clientParaList = opfmData.dbRetirementOpfmMatrixResponse.clientParaList;
                    }
                    this.pageLegalNote = opfmData.dbRetirementOpfmMatrixResponse.pageLegalNote;
                    if (this.opfmHeaderData.pageTitle !== null && this.opfmHeaderData.pageTitle !== undefined) {
                        document.title = this.opfmHeaderData.pageTitle;
                    }
                    if (this.opfmHeaderData.headerPanelList && this.opfmHeaderData.headerPanelList !== null && this.opfmHeaderData.headerPanelList !== undefined && Array.isArray(this.opfmHeaderData.headerPanelList)) {
                        this.panelListExpand.length = this.opfmHeaderData.headerPanelList.length;
                        for (let i = 0; i < this.panelListExpand.length; i++) {
                            this.panelListExpand[i] = false;
                            /* if(this.opfmHeaderData.headerPanelList[i].panelContent.hasOwnProperty('panelContentBoxList')) {
                            for (let j = 0; j < this.opfmHeaderData.headerPanelList[i].panelContent.panelContentBoxList.length; j++) {
                                if(this.opfmHeaderData.headerPanelList[i].panelContent.panelContentBoxList[j].panelLink.indexOf('DB_PAYMENT_OPTION_COMPARE_LINK') !== -1) {
                                    this.opfmHeaderData.headerPanelList[i].panelContent.panelContentBoxList[j].panelLink = this.opfmHeaderData.headerPanelList[i].panelContent.panelContentBoxList[j].panelLink.replaceAll('linkId=DB_PAYMENT_OPTION_COMPARE_LINK', 'calcRefId=' + this.calculationReferenceNumber + '&amp;linkId=DB_PAYMENT_OPTION_COMPARE_LINK');
                                }
                            }
                        } */
                        }
                    }
                    this.buttonData = opfmData.dbRetirementOpfmMatrixResponse.flowButtonNavigation;
                    /* istanbul ignore next */
                    if (opfmData.dbRetirementOpfmMatrixResponse.paymentChoicePanelList && opfmData.dbRetirementOpfmMatrixResponse.paymentChoicePanelList !== null && opfmData.dbRetirementOpfmMatrixResponse.paymentChoicePanelList !== undefined) {
                        this.opfmPanelContent = opfmData.dbRetirementOpfmMatrixResponse.paymentChoicePanelList;
                        for (let k = 0; k < this.opfmPanelContent.length; k++) {
                            if (this.opfmPanelContent[k].panelContentList !== undefined && this.opfmPanelContent[k].panelContentList.length > 0) {
                                if (this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent && this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent !== null && this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent !== undefined) {
                                    this.hypotheticalPanelContent.push(this.opfmPanelContent[k]);
                                    if (this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText && this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText !== null && this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText !== undefined) {
                                        let index = this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText.indexOf("<a");
                                        let text = this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText.substring(0, index);
                                        let link = this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText.substring(index, this.opfmPanelContent[k].panelContentList[0].hypotheticalPanelContent.survivorText.length);
                                        this.beneficiaryText = text;
                                        this.beneficiaryLink = link;
                                    }
                                } else {
                                    this.allPanelContent.push(this.opfmPanelContent[k]);
                                }
                            }
                        }
                        this.alPanelSectionService.setPanelList(this.allPanelContent);
                    }
                    this.footnoteService.setFootnoteData(opfmData.dbRetirementOpfmMatrixResponse.footnoteContent);
                    this.showHeader = true;
                    this.logger._debug("OPFMData: " + this.opfmHeaderData, "opfmServiceResponse retrived from indexDB", LoggingConstants.INFO, "RetirementElectionNg8Widget - Choose Payment Option Matrix Component");
                } else {
                    this.showError = true;
                    this.showHeader = false;
                    this.logger._error("OPFMData: " + this.opfmHeaderData, "opfmServiceResponse retrived from indexDB", LoggingConstants.ERROR, "RetirementElectionNg8Widget - Choose Payment Option Matrix Component");
                }
                this.retirementElectionRestService.screenCaptureInit("choose-payment-options-matrix");
            });
        window.scrollTo(0, 0);
    }
    setactive(expand, i) {
        this.panelListExpand[i] = !(expand);
    }

    /**
     * @method saveServices
     * @param buttonActionType
     * Gets updated PPS and save API payload
     * calls save service method
     */
    saveServices(buttonActionType: boolean) {
        this.getUpdatedPpsData();
        this.opfmMatrixSaveService(buttonActionType);
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
                                this.editMessagesService.pageNameSubject.next("cancelFromCPOM");
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
        this.loading.showIndicator("#saveServiceLoader", "");
        let response;
        let requestBody = {};
        let businessProcessId = 123;
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    this.loading.hideIndicator("#saveServiceLoader", "");
                    if (response && response.statusCode) {
                        let statusCode = response.statusCode;
                        if (statusCode === 200) {
                            this.showError = false;
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                        } /* istanbul ignore next */else {
                            this.showError = true;
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting CPO Matrix Cancel response successfully", LoggingConstants.INFO, "RetirementElection - CPO Matrix- Cancel Service");
                },
                /* istanbul ignore next */
                (error) => {
                    response = error;
                    this.logger._error(JSON.stringify(error), "Error in CPO Matrix component cancel response", LoggingConstants.ERROR, "RetirementElection - CPO Matrix- cancel Service");
                }
            );
    }

    canContinue(buttonActionType: boolean) {
        this.editMessagesService.editMessageFlagSubject.next(false);
        this.cacheService.getItem("paymentOptionsDetail", "dbOpfmMatrixStore")
            .pipe(
                finalize(() => {
                    if (!buttonActionType) {
                        if (this.selectedPlans !== null && this.selectedPlans !== undefined) {
                            this.formatPaymentOptionsData(buttonActionType);
                        }
                    } else {
                        this.validateOpfmSelections();
                        if (this.allowContinueElectionGrp && this.allowContinueNonElectionGrp) {
                            this.formatPaymentOptionsData(buttonActionType);
                        } else {
                            if (this.data.dbRetirementOpfmMatrixResponse.editList !== null && this.data.dbRetirementOpfmMatrixResponse.editList !== undefined) {
                                this.editMessagesService.saveEditArray(this.data.dbRetirementOpfmMatrixResponse.editList);
                                this.editMessagesService.editMessageFlagSubject.next(true);
                                window.scrollTo(0, 0);
                            }
                        }
                    }
                })
            )
            .subscribe(res => {
                this.selectedPlans = res;
            });
    }

    /**
     * @method formatPaymentOptionsData
     * @param buttonActionType
     * formats the payment option details from opfm wc to PPS payment option format
     */
    formatPaymentOptionsData(buttonActionType: boolean) {
        if (this.selectedPlans.length > 0) {
            let paymentOptionsDetail = [];
            this.selectedPlans.forEach(autoOptionItem => {
                if (autoOptionItem.autoSelectAvailable !== undefined && autoOptionItem.autoSelectAvailable === true) {
                    autoOptionItem.paymentOptionDetail.forEach(autoPaymentItem => {
                        if (autoPaymentItem.labelCode !== undefined && autoPaymentItem.labelCode === "Lump") {
                            autoPaymentItem.dateRanageDetail.forEach(lumpItem => {
                                autoOptionItem.paymentOptionDetail[0].dateRanageDetail.push(lumpItem);
                            });
                        }
                    });
                }
            });
            this.selectedPlans.forEach(optionItem => {
                let tempPlanDetailsObject = {};
                if (optionItem.hasOwnProperty("deferId")) {
                    tempPlanDetailsObject["isDeferred"] = true;
                    let planDetails = optionItem.id.split("_");
                    tempPlanDetailsObject["planId"] = planDetails[0];
                    tempPlanDetailsObject["electionGroupId"] = planDetails[1];
                    tempPlanDetailsObject["elecId"] = planDetails[2];
                    tempPlanDetailsObject["opformGroupId"] = Number(planDetails[3]);
                    if (tempPlanDetailsObject["electionGroupId"] !== "0") {
                        let headerRow = this.data.optionalFormMatrixTableHeader.filter((item) => item.id === optionItem.id);
                        let benefitDescription = headerRow[0].header5;
                        tempPlanDetailsObject["benefitDescription"] = benefitDescription;
                        tempPlanDetailsObject["electionDescription"] = headerRow[0].header2;
                        tempPlanDetailsObject["opfmGrpDescription"] = headerRow[0].header4;
                    }
                } else {
                    tempPlanDetailsObject["planId"] = optionItem.planId;
                    tempPlanDetailsObject["elecId"] = optionItem.electionId;
                    tempPlanDetailsObject["electionGroupId"] = optionItem.electionGroupId;
                    tempPlanDetailsObject["opformGroupId"] = Number(optionItem.optionalFormGroupId);
                    if (optionItem.electionGroupId !== "0") {
                        let headerRow = this.data.optionalFormMatrixTableHeader.filter((item) => item.id === optionItem.mainId);
                        let benefitDescription = headerRow[0].header5;
                        tempPlanDetailsObject["benefitDescription"] = benefitDescription;
                        tempPlanDetailsObject["electionDescription"] = headerRow[0].header2;
                        tempPlanDetailsObject["opfmGrpDescription"] = headerRow[0].header4;
                    }
                    let tempPaymentOptionObject = {};
                    tempPlanDetailsObject["isDeferred"] = false;
                    /* istanbul ignore next */
                    if (optionItem.autoSelectAvailable !== undefined && optionItem.autoSelectAvailable === true) {
                        if (optionItem.optionalFormType !== undefined && optionItem.optionalFormType === "LS") {
                            tempPaymentOptionObject["paymentOptionId"] = Number(optionItem.optionalFormId);
                            tempPaymentOptionObject["paymentOptionDescription"] = optionItem.optionalFormDescription;
                            tempPaymentOptionObject["paymentOptionToYouAmt"] = optionItem.paymentOptionDetail[0].amountToYouFormatted;
                            tempPaymentOptionObject["labelFrequencyId"] = optionItem.paymentOptionDetail[0].optionalFormFrequency;
                            tempPaymentOptionObject["paymentOptionFrequency"] = optionItem.paymentOptionDetail[0].frequencyText;
                            if (optionItem.paymentOptionDetail[0].dateRanageDetail.length > 0) {
                                let autoSelectionPaymentList = [];
                                optionItem.paymentOptionDetail[0].dateRanageDetail.forEach(autoDateRanageOptionItem => {
                                    if (autoDateRanageOptionItem.dateRangeAutoSelect !== undefined && autoDateRanageOptionItem.dateRangeAutoSelect === true) {
                                        let tempAutoPaymentOptionObject = {};
                                        tempAutoPaymentOptionObject["autoSelectedFormOfPayment"] = autoDateRanageOptionItem.label;
                                        tempAutoPaymentOptionObject["autoSelectedPaymentToYouAmt"] = autoDateRanageOptionItem.amountToYouFormatted;
                                        tempAutoPaymentOptionObject["labelFrequencyId"] = autoDateRanageOptionItem.optionalFormFrequency;
                                        tempAutoPaymentOptionObject["autoSelectOpFormId"] = Number(optionItem.optionalFormId);
                                        autoSelectionPaymentList.push(tempAutoPaymentOptionObject);
                                    }
                                });
                                tempPaymentOptionObject["autoSelectedFormsOfPaymentList"] = autoSelectionPaymentList;
                            }
                        } else {
                            tempPaymentOptionObject["paymentOptionId"] = Number(optionItem.optionalFormId);
                            tempPaymentOptionObject["paymentOptionDescription"] = optionItem.paymentOptionDetail[0].dateRanageDetail[0].label;
                            tempPaymentOptionObject["paymentOptionToYouAmt"] = optionItem.paymentOptionDetail[0].dateRanageDetail[0].amountToYouFormatted;
                            tempPaymentOptionObject["labelFrequencyId"] = optionItem.paymentOptionDetail[0].dateRanageDetail[0].optionalFormFrequency;
                            tempPaymentOptionObject["paymentOptionFrequency"] = optionItem.paymentOptionDetail[0].dateRanageDetail[0].frequencyText;
                            if (optionItem.paymentOptionDetail[0].dateRanageDetail.length > 0) {
                                let autoSelectionPaymentList = [];
                                optionItem.paymentOptionDetail[0].dateRanageDetail.forEach(autoDateRanageOptionItem => {
                                    if (autoDateRanageOptionItem.dateRangeAutoSelect !== undefined && autoDateRanageOptionItem.dateRangeAutoSelect === true) {
                                        let tempAutoPaymentOptionObject = {};
                                        tempAutoPaymentOptionObject["autoSelectedFormOfPayment"] = autoDateRanageOptionItem.label;
                                        tempAutoPaymentOptionObject["autoSelectedPaymentToYouAmt"] = autoDateRanageOptionItem.amountToYouFormatted;
                                        tempAutoPaymentOptionObject["labelFrequencyId"] = autoDateRanageOptionItem.optionalFormFrequency;
                                        tempAutoPaymentOptionObject["autoSelectOpFormId"] = Number(optionItem.optionalFormId);
                                        autoSelectionPaymentList.push(tempAutoPaymentOptionObject);
                                    }
                                });
                                tempPaymentOptionObject["autoSelectedFormsOfPaymentList"] = autoSelectionPaymentList;
                            }
                        }
                    } else {
                        tempPaymentOptionObject["paymentOptionId"] = Number(optionItem.optionalFormId);
                        tempPaymentOptionObject["paymentOptionDescription"] = optionItem.optionalFormDescription;
                        tempPaymentOptionObject["paymentOptionToYouAmt"] = optionItem.paymentOptionDetail[0].amountToYouFormatted;
                        tempPaymentOptionObject["labelFrequencyId"] = optionItem.paymentOptionDetail[0].optionalFormFrequency;
                        tempPaymentOptionObject["paymentOptionFrequency"] = optionItem.paymentOptionDetail[0].frequencyText;
                    }
                    tempPlanDetailsObject["paymentOption"] = tempPaymentOptionObject;
                }
                paymentOptionsDetail.push(tempPlanDetailsObject);
            });
            this.paymentOptionsData = paymentOptionsDetail;
            this.groupPaymentOptions();
            this.integrationCpoPpsService.setData(this.paymentOptionsData);
        }
        if (buttonActionType) {
            this.retirementElectionRestService.onRouteDBElec("pension-payment-summary");
        } else {
            this.saveServices(buttonActionType);
        }
    }
    /**
   * @method groupPaymentOptions
   * merges the election grp data if available
  */

    groupPaymentOptions() {
        let elecGrpData = this.paymentOptionsData.filter((item) => item.electionGroupId !== "0");
        this.paymentOptionsData = this.paymentOptionsData.filter((item) => item.electionGroupId === "0");
        if (elecGrpData.length > 0) {
            let formatedElecGrpData = elecGrpData.reduce((r, { planId: planId, electionGroupId: electionGroupId, ...object }) => {
                let temp = r.find(o => o.planId === planId && o.electionGroupId === electionGroupId);
                if (!temp) {
                    r.push(temp = { planId, electionGroupId, benefitList: [] });
                }
                temp.benefitList.push(object);
                return r;
            }, []);
            this.paymentOptionsData = this.paymentOptionsData.concat(formatedElecGrpData);
        }
    }

    /**
   * @method getUpdatedPpsData
   * get the PPS data from savePPSData service for PPS Put service
   */
    getUpdatedPpsData() {
        this.savePpsDataService.getPpsData()
            .pipe(
                finalize(() => {
                    if (this.paymentOptionsData.length > 0) {
                        // if payment options chosen integrate with PPS data
                        this.paymentOptionsData.forEach((paymentOptionItem) => {
                            this.integratePaymentOptions(paymentOptionItem);
                        });
                    }
                    this.formatSaveApiRequestPayload();
                }),
            ).subscribe(
                (data: any) => {
                    this.ppsData = data;
                }
            );
    }

    /**
   * @method integratePaymentOptions
   * @param paymentOptionItem
   * integrate the PaymentOption with PPS benefit item
  */
    integratePaymentOptions(paymentOptionItem) {
        // simple elections
        if (paymentOptionItem.electionGroupId === "0") {
            /* istanbul ignore next */
            for (let i = 0; i < this.ppsData.planList.length; i++) {
                let planlist = this.ppsData.planList[i];
                if (planlist.planId === paymentOptionItem.planId) {
                    for (let j = 0; j < planlist.electionGroupList.length; j++) {
                        let electionGroupList = planlist.electionGroupList[j];
                        if (electionGroupList.elecGroupId === paymentOptionItem.electionGroupId) {
                            for (let k = 0; k < electionGroupList.benefitList.length; k++) {
                                let benefitList = electionGroupList.benefitList[k];
                                if (benefitList.elecId === paymentOptionItem.elecId && benefitList.opformGroupId === paymentOptionItem.opformGroupId) {
                                    if (paymentOptionItem.isDeferred === true) {
                                        benefitList.isDeferred = true;
                                    } else {
                                        benefitList.isDeferred = false;
                                        benefitList.paymentOption = paymentOptionItem.paymentOption;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else { // non zero elec grp scenario
            /* istanbul ignore next */
            for (let i = 0; i < this.ppsData.planList.length; i++) {
                let planlist = this.ppsData.planList[i];
                if (planlist.planId === paymentOptionItem.planId) {
                    for (let j = 0; j < planlist.electionGroupList.length; j++) {
                        let electionGroupList = planlist.electionGroupList[j];
                        if (electionGroupList.elecGroupId === paymentOptionItem.electionGroupId) {
                            electionGroupList.benefitList = paymentOptionItem.benefitList;
                        }
                    }
                }
            }
        }
    }
    /**
   * @method formatSaveApiRequestPayload
   * formats PPS save service request payload
  */
    formatSaveApiRequestPayload() {
        let selectedOptionalForms = [];
        this.ppsData.planList.forEach(planItem => {
            planItem.electionGroupList.forEach(electionGroupItem => {
                // Election Group Item
                if (electionGroupItem.displayElecGroup) {
                    // No payment option chosen or available
                    if (electionGroupItem.benefitList.length === 0) {
                        electionGroupItem.defaultElectionGroupDeferredElection.forEach((item) => {
                            item.isDeferred = false;
                            let tempOpfmObj = this.formatElecGrpNotOnFile(planItem, electionGroupItem, item);
                            selectedOptionalForms.push(tempOpfmObj);
                        });
                    }else {
                        let elecId = electionGroupItem.benefitList[0].elecId;
                        let defaultElecData = electionGroupItem.defaultElectionGroupDeferredElection.filter(item => item.elecId === elecId);
                        let notSelectedData = [];
                        // payment options chosen completely
                        if (electionGroupItem.benefitList.length === defaultElecData.length) {
                            electionGroupItem.benefitList.forEach(benefitItem => {
                                let tempOpfmObj = this.formatOptionalForm(planItem, electionGroupItem, benefitItem);
                                selectedOptionalForms.push(tempOpfmObj);
                            });
                            notSelectedData = electionGroupItem.defaultElectionGroupDeferredElection.filter(item => item.elecId !== elecId);
                        } else {
                            let beneList = electionGroupItem.benefitList;
                            let defaultElectionGroupDeferredElection = electionGroupItem.defaultElectionGroupDeferredElection;
                            beneList.forEach(benefitItem => {
                                let tempOpfmObj = this.formatOptionalForm(planItem, electionGroupItem, benefitItem);
                                selectedOptionalForms.push(tempOpfmObj);
                            });
                            let tempArray = JSON.parse(JSON.stringify(defaultElectionGroupDeferredElection));
                            beneList.forEach(beneItem => {
                                defaultElectionGroupDeferredElection.forEach((defaultItem, index) => {
                                    if (beneItem.elecId === defaultItem.elecId && beneItem.opformGroupId === defaultItem.opformGroupId) {
                                        tempArray.splice(index, 1);
                                    }
                                });
                            });
                            notSelectedData = tempArray;
                        }
                        notSelectedData.forEach(benefitItem => {
                            benefitItem.isDeferred = false;
                            let tempOpfmObj = this.formatOptionalForm(planItem, electionGroupItem, benefitItem);
                            selectedOptionalForms.push(tempOpfmObj);
                        });
                    }
                } else {
                    electionGroupItem.benefitList.forEach(benefitItem => {
                        let tempOpfmObj = this.formatOptionalForm(planItem, electionGroupItem, benefitItem);
                        selectedOptionalForms.push(tempOpfmObj);
                    });
                }
            });
        });
        this.saveApiRequestBody = {
            "shouldAdvanceStep": false,
            "hasElectedToDeferAllOptionalForms": false,
            "retirementStep": "Forms of Payment",
            "selectedOptionalForms": selectedOptionalForms
        };
    }

    opfmMatrixHeaderStoreId() {
        let nonElectionMatrixGrpDetail = [];
        let electionMatrixGrpDetail = [];
        let electionMatrixIdDetail = [];
        if (this.data.optionalFormMatrixTableHeader) {
            this.data.optionalFormMatrixTableHeader.forEach(opfmatrixItem => {
                if (opfmatrixItem.id) {
                    let planDetails = opfmatrixItem.id.split("_");
                    let electionMatrixGroupId = planDetails[1];
                    if (electionMatrixGroupId === "0") {
                        nonElectionMatrixGrpDetail.push(opfmatrixItem);
                    } else {
                        electionMatrixGrpDetail.push(opfmatrixItem);
                        electionMatrixIdDetail.push(opfmatrixItem.header2Id);
                    }
                }
            });
            this.nonElectionMatrixGrpItem = nonElectionMatrixGrpDetail;
            this.electionMatrixGrpItem = electionMatrixGrpDetail;
            this.electionMatrixHeaderId = electionMatrixIdDetail;
        }
    }

    /* istanbul ignore next */
    validateOpfmSelections() {
        let nonElectionGrpPaymentDetail = [];
        let electionGrpPaymentDetail = [];
        let nonElectionGrpPaymentItem;
        let electionGrpPaymentItem;
        this.allowContinueElectionGrp = false;
        this.allowContinueNonElectionGrp = false;
        if (this.selectedPlans !== null && this.selectedPlans !== undefined && this.selectedPlans.length > 0) {
            this.selectedPlans.forEach(opfmItem => {
                if (opfmItem.electionGroupId === "0") {
                    nonElectionGrpPaymentDetail.push(opfmItem);
                } else {
                    electionGrpPaymentDetail.push(opfmItem);
                }
            });
            nonElectionGrpPaymentItem = nonElectionGrpPaymentDetail;
            electionGrpPaymentItem = electionGrpPaymentDetail;
            if (nonElectionGrpPaymentItem && this.nonElectionMatrixGrpItem && nonElectionGrpPaymentItem.length === this.nonElectionMatrixGrpItem.length) {
                this.allowContinueNonElectionGrp = true;
            }
            /* istanbul ignore next */
            if (this.electionMatrixHeaderId && electionGrpPaymentItem.length > 0) {
                this.electionMatrixHeaderId.sort();
                let counts = {};
                for (let i = 0; i < this.electionMatrixHeaderId.length; i++) {
                    if (counts[this.electionMatrixHeaderId[i]]) {
                        counts[this.electionMatrixHeaderId[i]] += 1;
                    } else {
                        counts[this.electionMatrixHeaderId[i]] = 1;
                    }
                }
                let selectedCount = {};
                for (let k = 0; k < electionGrpPaymentItem.length; k++) {
                    if (selectedCount[electionGrpPaymentItem[k].electionId]) {
                        selectedCount[electionGrpPaymentItem[k].electionId] += 1;
                    } else {
                        selectedCount[electionGrpPaymentItem[k].electionId] = 1;
                    }
                }
                let validatedCnt = 0;
                for (let prop in counts) {
                    if (prop) {
                        for (let j = 0; j < electionGrpPaymentItem.length; j++) {
                            if (prop === electionGrpPaymentItem[j].electionId && counts[prop] === selectedCount[prop]) {
                                validatedCnt++;
                            }
                        }
                    }
                }
                if (validatedCnt === electionGrpPaymentItem.length) {
                    this.allowContinueElectionGrp = true;
                }
            } else if (electionGrpPaymentItem.length === 0 && this.electionMatrixGrpItem.length === 0) {
                this.allowContinueElectionGrp = true;
            }
        }
    }
    /**
   * @method opfmMatrixSaveService
   * @param buttonActionType - indicates CBL
   * Calls PPS PUT service and process the response
   */
    opfmMatrixSaveService(buttonActionType: boolean) {
        this.retirementElectionRestService.removeSystemTickets();
        this.loading.showIndicator("#saveServiceLoader", "");
        this.hasTBAEdit = this.editMessagesService.issTbaEdit;
        let saveApiResponse;
        let responseStatusCode;
        this.retirementElectionRestService.pensionPaymentSummarySaveService(this.deferredFlag, this.hasTBAEdit ? this.editMessagesService.saveApiRequestBody : this.saveApiRequestBody, this.businessProcessReferenceId, buttonActionType, this.hasTBAEdit)
            .pipe(
                finalize(() => {
                    this.loading.hideIndicator("#saveServiceLoader", "");
                    if (saveApiResponse) {
                        responseStatusCode = saveApiResponse.statusCode;
                        /* istanbul ignore if */
                        if ((responseStatusCode !== 200) && (responseStatusCode !== 400)) {
                            this.showError = true;
                        } else {
                            this.saveApiResponseAction(saveApiResponse);
                        }
                    } else {
                        this.showError = true;
                    }
                })
            )
            .subscribe(
                (data: any) => {
                    this.rawSaveResponseData = data;
                    if (data.body !== undefined && data.body !== null) {
                        saveApiResponse = data.body;
                    }
                    this.logger._debug(JSON.stringify(data), "Getting CPO Matrix save service details successfully", LoggingConstants.INFO, "RetirementElection - CPO Matrix - Save Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.rawSaveResponseData = error;
                    if (error["error"] !== undefined && error["error"] !== null) {
                        saveApiResponse = error["error"];
                    }
                    this.logger._error(JSON.stringify(error), "Error in CPO Matrix component response", LoggingConstants.ERROR, "RetirementElection - CPO Matrix - Save Service");
                }
            );
    }

    /**
   * @method saveApiResponseAction
   * @param saveApiResponse - PPS PUT success response
   * Process the PPS PUT response and acts on it
   */
    saveApiResponseAction(saveApiResponse) {
        this.routeToPageLocation = "saved";
        /**
     * Check for TBA Edits/ Server side edits
    */
        let saveEditList = this.retirementElectionRestService.extractEditMessages(this.rawSaveResponseData);
        /* istanbul ignore if */
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
        } else {
            this.showError = true;
        }

    }

    /**
   * @method formatOptionalForm
   * @param planItem - Current Plan
   * @param electionGroupItem - Current Election group
   * @param benefitItem - Current benefit
   * formats the selectionOptionalForm list item for PUT service payload
   */
    formatOptionalForm(planItem, electionGroupItem, benefitItem) {
        let optionalFormObj = {};
        optionalFormObj["planId"] = planItem.planId;
        optionalFormObj["electionGroupId"] = electionGroupItem.elecGroupId;
        optionalFormObj["electionId"] = benefitItem.elecId;
        optionalFormObj["optionalFormGroupId"] = benefitItem.opformGroupId;
        if (benefitItem.isDeferred) {
            optionalFormObj["isPlanElectionDeferred"] = true;
            optionalFormObj["optionalFormNotSelected"] = true;
            optionalFormObj["optionalFormId"] = 0;
        } else if (!benefitItem.isDeferred && benefitItem.paymentOption !== undefined) {
            optionalFormObj["isPlanElectionDeferred"] = false;
            optionalFormObj["optionalFormNotSelected"] = false;
            optionalFormObj["optionalFormId"] = benefitItem.paymentOption.paymentOptionId;
        } else {
            optionalFormObj["isPlanElectionDeferred"] = false;
            optionalFormObj["optionalFormNotSelected"] = true;
            optionalFormObj["optionalFormId"] = benefitItem.firstOptionalFormId;
        }
        return optionalFormObj;
    }

    /**
   * @method formatElecGrpNotOnFile
   * @param planItem - Current Plan
   * @param electionGroupItem - Current Election group
   * @param defaultElecItem - Current defaultElectionGrp
   * when Elecgrp benefit list is empty / partially chosen
   * formats the selectionOptionalForm list item for PUT service payload
   */
    formatElecGrpNotOnFile(planItem, electionGroupItem, defaultElecItem) {
        let optionalFormObj = {};
        optionalFormObj["planId"] = planItem.planId;
        optionalFormObj["electionGroupId"] = electionGroupItem.elecGroupId;
        optionalFormObj["electionId"] = defaultElecItem.elecId;
        optionalFormObj["optionalFormGroupId"] = defaultElecItem.opformGroupId;
        optionalFormObj["isPlanElectionDeferred"] = defaultElecItem.isDeferred;
        optionalFormObj["optionalFormNotSelected"] = true;
        optionalFormObj["optionalFormId"] = defaultElecItem.firstOptionalFormId;
        return optionalFormObj;
    }
}
