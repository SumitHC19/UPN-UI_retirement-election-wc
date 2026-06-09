import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AlPanelSectionService } from "../../../services/al-panel-section.service";
import { EditMessagesService } from "../../../services/edit-messages.service";
import { IntegrationCpoPpsService } from "../../../services/integration-cpo-pps.service";
import { RetirementElectionRestService } from "../../../services/retirement-election-rest.service";
import { StepsActiveIndexService } from "../../../services/steps-active-index-service";
import { RightSideContentService } from "../../../services/right-side-content.service";
import { AlLoaderComponent, LoggingConstants, LoggingService, DynamicComponentService, GoogleAnalyticsService } from "@alight/core-utilities-lib";
import { ViewRhrComponentsModel } from "../../shared/models/view-rhr-components.model";
import { FootnoteService } from "../../../services/footnote-common.service";

@Component({
    selector: "al-choose-payment-option",
    templateUrl: "./choose-payment-option.component.html",
    providers: [AlLoaderComponent]
})
export class ChoosePaymentOptionComponent implements OnInit {
    data: any;
    defer = false;
    plandetails: any;
    opfmgroupscount: any;
    checkresponse = false;
    disallowcontinue = false;
    @ViewChild("deferdialog", { static: true }) deferbtn;
    @ViewChild("display", { static: true }) display: any;
    chosenArray: any;
    queryParameters: any;
    responseData: any;
    showError = true;
    editMessageList: any[];
    selectedChosenArray = [];
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
    ppsDataStorePlan: any;
    ViewRhrComponents = new ViewRhrComponentsModel();
    routeToPageLocation: any;
    hassTBAEdit = false;
    notOnFileData: any;
    benefitItem: any;
    notOnArry: any;
    showQuitButton = true;
    showCBLButton = true;
    calculationReferenceNumber: String;
    /**
   * Standard constructor code to do
   * the dependency injection.
   */
    constructor(private router: Router, private retirementElectionRestService: RetirementElectionRestService, private integrationCpoPpsService: IntegrationCpoPpsService, private alPanelSectionService: AlPanelSectionService, private editMessagesService: EditMessagesService, private stepsActiveIndexService: StepsActiveIndexService,
        private loading: AlLoaderComponent, private logger: LoggingService,
        private rightSideContentService: RightSideContentService,
        private dynamicComponentService: DynamicComponentService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private footnoteService: FootnoteService
    ) {
        this.ViewRhrComponents.viewPplLikemeComp = true;
        this.ViewRhrComponents.viewComparePoComp = true;
        this.ViewRhrComponents.viewDocAndResComp = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    /**
   * Standard code to subscribe for servce data
   * which in turn give call to mircroservice.
   */
    ngOnInit() {
        // this.stepsActiveIndexService.setStepIndex(4);
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(3);
        } else {
            this.stepsActiveIndexService.setStepIndex(4);
        }
        this.dynamicComponentService.initializePageComponents();
        this.calculationReferenceNumber = this.integrationCpoPpsService.getCalculationReferenceNumber();
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
            this.rightSideContentService.setParamIDs(this.plandetails.planId, this.plandetails.ElectionId);
            this.ppsDataStorePlan = this.integrationCpoPpsService.getAllOptionalForms();
            this.getDataFromChannel();
            this.retirementElectionRestService.screenCapture(true);
        } else {
            this.checkresponse = true;
        }
    }


    getDataFromChannel() {
        this.retirementElectionRestService.choosePaymentOptionServiceParams(this.plandetails.planId, this.plandetails.ElectionId, this.plandetails.electionGroupId, this.calculationReferenceNumber)
            // this.retirementElectionRestService.choosePaymentOptionService()
            .pipe(
                finalize(() => {
                    this.checkresponse = true;
                    if (this.data !== null && this.data !== undefined) {
                        if (this.data.responseStatus !== undefined && this.data.responseStatus.statusCode !== undefined) {
                            let responseStatusCode = this.data.responseStatus.statusCode;
                            if (responseStatusCode === 200) {
                                document.title = this.data.choosePaymentOptionHeader.pageTitle;
                                this.showError = false;
                                this.googleAnalyticsService.postGACustomPageTracking("UPN_DbPrtlRtrmChoices100ChooFormPmtPage");
                                this.footnoteService.setFootnoteData(this.data.footnoteContent);
                                this.rightSideContentService.setCalcRefNum(this.data.calculationReferenceNumber);
                                this.rightSideContentService.setCalcFrmSupportFlag(this.data.areCalculationFormulasSupported);
                                this.opfmgroupscount = this.data.choosePaymentOptionTable.paymentOptionGroupDetailList.length;
                                this.alPanelSectionService.setPanelList(this.data.paymentChoicePanelList);
                                this.responseData = this.data.responseStatus.statusCode;
                            }
                        }
                    }
                    this.retirementElectionRestService.screenCaptureInit("choose-payment-option");
                })
            ).subscribe(
                (data) => {
                    if (data !== undefined && data !== null) {
                        this.data = data;
                    }
                    this.logger._debug(JSON.stringify(data), "Getting CPO details successfully", LoggingConstants.INFO, "RetirementElection - CPO - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error(JSON.stringify(error), "Error in CPO component response", LoggingConstants.ERROR, "RetirementElection - CPO - Get Service");
                }
            );
        window.scrollTo(0, 0);
    }
    public enableContinue(cpoSelectedArray) {
        this.chosenArray = cpoSelectedArray.selectedArray;
        this.defer = cpoSelectedArray.deferValue;
        this.selectedChosenArray = [];
    }

    continue(buttonActionType) {
        this.disallowcontinue = false;
        /* istanbul ignore next */
        if (buttonActionType) {
            if (Array.isArray(this.chosenArray) && this.chosenArray.length) {
                if (this.chosenArray.length === this.opfmgroupscount) {
                    for (let i = 0; i < this.opfmgroupscount; i++) {
                        if (this.chosenArray[i] === undefined) {
                            this.disallowcontinue = true;
                            window.scrollTo(0, 0);
                            break;
                        }
                    }
                }
            } else {
                this.disallowcontinue = true;
                window.scrollTo(0, 0);
            }
        }
        this.cancontinue(buttonActionType);
    }

    cancontinue(buttonActionType) {
        this.hassTBAEdit = this.editMessagesService.issTbaEdit;
        this.editMessagesService.pageNameSubject.next("choosepaymentoption");
        this.editMessagesService.buttonActionTypeSubject.next(buttonActionType);
        let selectedOptionalForms = [];
        let responseStatusCode: any;
        let saveApiResponse: any;
        let optionalFormNotSelected;
        let paymentOptionId;
        this.deferredFlag = true;
        this.businessProcessReferenceId = 0;
        let cpoDatafromcc;
        let cpoSelectedData;
        let paymentOptionfrmId;
        /* istanbul ignore next */
        if (!this.disallowcontinue || this.defer) {
            this.editMessageList = [];
            this.notOnArry = [];
            this.editMessagesService.editMessageFlagSubject.next(false);

            if (buttonActionType) {
                if (this.plandetails.UpnPpsflow) {
                    this.retirementElectionRestService.onRouteDBElec("pension-payment-summary");
                } else {
                    this.retirementElectionRestService.onRouteDBElec("choose-category");
                }
            } else if (!buttonActionType) {

                let ccDataId = this.integrationCpoPpsService.getChosenIds();
                if (!ccDataId.UpnPpsflow) {
                    cpoDatafromcc = this.integrationCpoPpsService.getCategoryData();
                    let pmtObjarray = [];
                    if (cpoDatafromcc && cpoDatafromcc[0].optionalFormGroupPaymentData) {
                        for (let j = 0; j < cpoDatafromcc[0].optionalFormGroupPaymentData.length; j++) {
                            let paymentOptionObject = {};
                            let paymentOptionObject1 = {};
                            let optionalFormGroupPaymentList = cpoDatafromcc[0].optionalFormGroupPaymentData[j];

                            paymentOptionObject["elecId"] = cpoDatafromcc[0].electionId;
                            paymentOptionObject["opformGroupId"] = Number(optionalFormGroupPaymentList.optionalFormGroupId);
                            paymentOptionObject["isDeferred"] = cpoDatafromcc[0].isElectionDeferred;
                            if (optionalFormGroupPaymentList.selectedOptionalFormPaymentData && optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormId) {
                                paymentOptionfrmId = Number(optionalFormGroupPaymentList.selectedOptionalFormPaymentData.optionalFormId);
                            }
                            paymentOptionObject1["paymentOptionId"] = paymentOptionfrmId;
                            paymentOptionObject["paymentOption"] = paymentOptionObject1;
                            pmtObjarray.push(paymentOptionObject);
                        }
                        this.integrationCpoPpsService.setCpoComebacklater(pmtObjarray);
                    }
                } else {
                    cpoSelectedData = this.integrationCpoPpsService.getData();
                }
                if (!this.hassTBAEdit) {
                    for (let i = 0; i < this.ppsDataStorePlan.length; i++) {
                        let ppsDataStorePlan = this.ppsDataStorePlan[i];
                        if (ppsDataStorePlan.planId === this.plandetails.planId) {
                            /* istanbul ignore next */
                            for (let j = 0; j < ppsDataStorePlan.electionGroupList.length; j++) {
                                let electionGroupList = ppsDataStorePlan.electionGroupList[j];
                                if (electionGroupList.elecGroupId === this.plandetails.electionGroupId) {
                                    if (!ccDataId.UpnPpsflow) {
                                        let cpoSelectedItems = this.integrationCpoPpsService.getCpoComebacklater();
                                        electionGroupList.benefitList = cpoSelectedItems;
                                    } else {
                                        for (let k = 0; k < electionGroupList.benefitList.length; k++) {
                                            let benefitList = electionGroupList.benefitList[k];
                                            if (benefitList.elecId === this.plandetails.ElectionId) {
                                                for (let m = 0; m < cpoSelectedData.length; m++) {
                                                    if (cpoSelectedData[m].opformGroupId === benefitList.opformGroupId) {
                                                        this.ppsDataStorePlan[i].electionGroupList[j].benefitList[k] = cpoSelectedData[m];
                                                    }
                                                }
                                            }
                                        }
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
                                    optionalFormNotSelected = false;
                                    this.isPlanElectionDeferred = false;
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
                            this.logger._debug(JSON.stringify(data), "Getting PPS details successfully", LoggingConstants.INFO, "RetirementElection - CPO - Save Service");
                        },
                        (error) => {
                            /* istanbul ignore next */
                            this.rawSaveResponseData = error;
                            saveApiResponse = error.body;
                            this.logger._error(JSON.stringify(error), "Error in CPO component response", LoggingConstants.ERROR, "RetirementElection - CPO - Save Service");
                        });
            }
        } else {
            this.editMessageList = [];
            this.editMessageList.push(this.data.editList[0]);
            this.editMessagesService.saveEditArray(this.editMessageList);
            this.editMessagesService.editMessageFlagSubject.next(true);
        }
    }


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
            if (saveEditList !== undefined) {
                /**
          * Case: Server side edits and service status 400
        */
                this.logger._debug("Getting edit message for CPO component response", LoggingConstants.INFO, "RetirementElection -CPO - Save Service");
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
                                this.editMessagesService.pageNameSubject.next("cancelFromCPO");
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
        let businessProcessId = 123;
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    if (response && response.statusCode) {
                        this.responseData = response.statusCode;
                        /* istanbul ignore next */
                        if (this.responseData !== 200) {
                            this.showError = true;
                        } else {
                            this.showError = false;
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting CPO details successfully", LoggingConstants.INFO, "RetirementElection - CPO - Cancel Service");
                }
            );
    }

}
