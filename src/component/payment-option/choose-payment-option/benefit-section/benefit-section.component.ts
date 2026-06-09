import {  Component, EventEmitter, OnInit, Output, ViewChild  } from "@angular/core";
import {  Router  } from "@angular/router";
import {  IntegrationCpoPpsService  } from "../../../../services/integration-cpo-pps.service";
import {  RetirementElectionRestService  } from "../../../../services/retirement-election-rest.service";
import {  LoggingConstants, LoggingService  } from "@alight/core-utilities-lib";
import {  FootnoteComponent  } from "../../../shared/footnote-common/footnote-common-component";

@Component({
    selector: "al-choose-payment-option-benefit-section",
    templateUrl: "./benefit-section.component.html"
})
export class BenefitSectionComponent implements OnInit {
    data: any;
    defer = false;
    selectedButton = {};
    chosenplan: any;
    selectedChosenArray = [];
    checkContinueFlag = false;
    chosenIds: any;
    planDetails: any;
    electionDetailKey: string;
    @ViewChild("deferdialog", { static: true }) deferbtn;
    @ViewChild("display", { static: true }) display: any;
    @Output() valueSelected = new EventEmitter();
    @ViewChild(FootnoteComponent, { static: false })  childFootnote: FootnoteComponent;
    relativeValueTxt = true;
    planIdRelativeValue: any;
    /**
     * Standard constructor code to do
     * the dependency injection.
     */
    constructor(private router: Router, private retirementElectionRestService: RetirementElectionRestService, private integrationCpoPpsService: IntegrationCpoPpsService,
        private logger: LoggingService) {

    }

    /**
   * Standard code to subscribe for servce data
   * which in turn give call to mircroservice.
   */
    ngOnInit() {
        let planDetails = this.integrationCpoPpsService.getChosenIds();
        this.planIdRelativeValue = planDetails?.planId;
        let electionGroupId = (planDetails.electionGroupId && planDetails.electionGroupId !== null && planDetails.electionGroupId !== undefined) ? planDetails.electionGroupId : 0;
        this.electionDetailKey= planDetails.planId + "#" + electionGroupId + "#" + planDetails.ElectionId;  // Format we get from channel PlanId#EleGrpId#ElectionId (5744#2202#60)
        this.getDataFromChannel();
        this.setDefaultChosen();
        if (sessionStorage.getItem("relativeValueswitch") === "true") {
            this.displayRelativevalue();
        }
    }

    /* istanbul ignore next */
    displayRelativevalue() {
        this.relativeValueTxt = true;
        let planIdstr = sessionStorage.getItem("relativePlanIdArray");
        if (planIdstr !== null && planIdstr !== undefined && planIdstr !== "") {
            let planArray = planIdstr.replace(/[['"]+/g, "").replace(/]+/g, "").split(",");
            if (planArray.length > 0) {
                planArray.forEach(plan => {
                    let planList = plan.trim();
                    if (planList === this.planIdRelativeValue) {
                        this.relativeValueTxt = false;
                    }
                });
                //  console.log(this.formalData.rowData);
            }
        }
    }

    showFootnoteSup(){
        this.childFootnote.showFootnote(event);
    }

    setDefaultChosen() {
        this.chosenIds = this.integrationCpoPpsService.getChosenIds();
        /* istanbul ignore next */
        if (!this.chosenIds.UpnPpsflow) {
            // set default value from choose catogory page
            this.chosenplan = this.integrationCpoPpsService.getChosenCategoryPlanDetails();
            if (this.chosenplan !== undefined) {
                let paymentOptionGroupList = this.data.choosePaymentOptionTable.paymentOptionGroupDetailList;
                this.selectedChosenArray.length = this.chosenplan.length;
                for (let i = 0; i < this.chosenplan.length; i++) {
                    if (this.chosenplan[i].isElectionDeferred === true) {
                        // if plan is deferred
                        this.selectedChosenArray = [];
                        this.defer = true;
                        let selectedArray = this.selectedChosenArray;
                        let deferValue = this.defer;
                        this.valueSelected.emit({ selectedArray, deferValue });
                    } else  {
                        if (this.chosenplan[i].optionalFormGroupPaymentData) {
                            for (let j = 0; j < paymentOptionGroupList.length; j++) {
                                if (paymentOptionGroupList[j].primaryOptionalFormPaymentList.length === 1) {
                                    // if plan has only 1 opfm by default select it
                                    paymentOptionGroupList[j].primaryOptionalFormPaymentList.map((listItem, index) => {
                                        this.selectedButton = {};
                                        this.selectedButton[index] = true;
                                        this.selectedChosenArray.splice(j, 1, this.selectedButton);
                                        let selectedArray = this.selectedChosenArray;
                                        let deferValue = this.defer;
                                        this.valueSelected.emit({ selectedArray, deferValue });
                                        this.enableDisableRule(index, j, paymentOptionGroupList[j].primaryOptionalFormPaymentList.length);
                                    });
                                }
                                paymentOptionGroupList[j].primaryOptionalFormPaymentList.map((listItem, index) => {
                                    if (this.chosenplan[i].optionalFormGroupPaymentData[0].hasOwnProperty("selectedOptionalFormPaymentData")) {
                                        if (listItem.optionalFormId === parseInt(this.chosenplan[i].optionalFormGroupPaymentData[0].selectedOptionalFormPaymentData.optionalFormId)) {
                                            if (listItem.optionalFormGroupId === parseInt(this.chosenplan[i].optionalFormGroupPaymentData[0].optionalFormGroupId)) {
                                                this.selectedButton = {};
                                                this.selectedButton[index] = true;
                                                this.selectedChosenArray.splice(j, 1, this.selectedButton);
                                                let selectedArray = this.selectedChosenArray;
                                                let deferValue = this.defer;
                                                this.valueSelected.emit({ selectedArray, deferValue });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                    /* else {
            let paymentOptionGroupListLength = paymentOptionGroupList.length;
            for (let j = 0; j < paymentOptionGroupListLength; j++) {
              if (paymentOptionGroupList[j].primaryOptionalFormPaymentList.length === 1) {
                paymentOptionGroupList[j].primaryOptionalFormPaymentList.pipe(map((listItem, index) => {
                  this.enableDisableRule(index, j, paymentOptionGroupListLength);
                }));
              }
            }
           } */
                }
            }
            this.integrationCpoPpsService.setCategoryData(this.chosenplan);
        } else {
            this.chosenplan = this.integrationCpoPpsService.getChosenPlanDetails();
            if (this.chosenplan !== undefined) {
                let paymentOptionGroupList = this.data.choosePaymentOptionTable.paymentOptionGroupDetailList;
                this.selectedChosenArray.length = this.chosenplan.length;
                for (let i = 0; i < this.chosenplan.length; i++) {
                    if (this.chosenplan[i].isDeferred === true) {
                        this.selectedChosenArray = [];
                        this.defer = true;
                        let selectedArray = this.selectedChosenArray;
                        let deferValue = this.defer;
                        this.valueSelected.emit({ selectedArray, deferValue });
                    } else if (this.chosenplan[i].paymentOption) {
                        for (let j = 0; j < paymentOptionGroupList.length; j++) {
                            if (paymentOptionGroupList[j].primaryOptionalFormPaymentList.length === 1) {
                                paymentOptionGroupList[j].primaryOptionalFormPaymentList.map((listItem, index) => {
                                    this.selectedButton = {};
                                    this.selectedButton[index] = true;
                                    this.selectedChosenArray.splice(j, 1, this.selectedButton);
                                    let selectedArray = this.selectedChosenArray;
                                    let deferValue = this.defer;
                                    this.valueSelected.emit({ selectedArray, deferValue });
                                });
                            }
                            paymentOptionGroupList[j].primaryOptionalFormPaymentList.map((listItem, index) => {
                                if (listItem.optionalFormId === this.chosenplan[i].paymentOption.paymentOptionId) {
                                    if (listItem.optionalFormGroupId === this.chosenplan[i].opformGroupId) {
                                        this.selectedButton = {};
                                        this.selectedButton[index] = true;
                                        this.selectedChosenArray.splice(j, 1, this.selectedButton);
                                        let selectedArray = this.selectedChosenArray;
                                        let deferValue = this.defer;
                                        this.valueSelected.emit({ selectedArray, deferValue });
                                    }
                                }
                            });
                        }
                    } else {
                        let paymentOptionGroupListLength = paymentOptionGroupList.length;
                        for (let j = 0; j < paymentOptionGroupListLength; j++) {
                            if (paymentOptionGroupList[j].primaryOptionalFormPaymentList.length === 1) {
                                paymentOptionGroupList[j].primaryOptionalFormPaymentList.map((listItem, index) => {
                                    this.enableDisableRule(index, j, paymentOptionGroupListLength);
                                });
                            }
                        }
                    }
                }
            }
            this.integrationCpoPpsService.setData(this.chosenplan);
        }
    }

    getDataFromChannel() {
        this.retirementElectionRestService.getChoosePaymentOptionData()
            .subscribe(
                (data) => {
                    this.data = data;
                    this.logger._debug(JSON.stringify(data), "Getting BenefitSection details successfully", LoggingConstants.INFO, "RetirementElection - BenefitSection - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.handleError(error);
                    this.logger._error(JSON.stringify(error), "Error in BenefitSection component response", LoggingConstants.ERROR, "RetirementElection - BenefitSection - Get Service");
                });
    }

    /* istanbul ignore next */
    enableDisableRule(id, i, length) {
        this.defer = false;
        this.selectedButton = {};
        this.selectedButton[id] = true;
        this.selectedChosenArray.length = length;
        this.checkContinueFlag = true;
        this.selectedChosenArray.splice(i, 1, this.selectedButton);
        let selectedArray = this.selectedChosenArray;
        let deferValue = this.defer;
        this.valueSelected.emit({ selectedArray, deferValue });
        this.storeDatatoService(this.data.choosePaymentOptionTable.paymentOptionGroupDetailList[i].primaryOptionalFormPaymentList[id], i);
    }

    /* istanbul ignore next */
    storeDatatoService(chosenObject, planIndex) {
        let paymentOptionObject = {};
        if (!this.chosenIds.UpnPpsflow) {
            let paymentOptionObject = {};
            paymentOptionObject["optionalFormId"] = chosenObject.optionalFormId;
            paymentOptionObject["optionalFormDescription"] = chosenObject.optionalFormPanelHeader;
            paymentOptionObject["optionalFormStartAmount"] = chosenObject.optionalFormToYouAmountList[0].optionalFormAmount;
            paymentOptionObject["optionalFormFrequencyCode"] = chosenObject.lableFrequencyId;
            paymentOptionObject["optionalFormFrequencyText"] = chosenObject.optionalFormToYouAmountList[0].optionalFormFrequencyDescription;
            paymentOptionObject["optionalFormShortDescription"] = chosenObject.optionalFormPanelHeader;

            let chosenObjectAutoPaymentList = chosenObject.autoSelectedFormsOfPaymentList;
            if (chosenObject.autoSelectedFormsOfPaymentList.length > 0) {
                let autoSelectionPaymentList = [];
                for (let i = 0; i < chosenObjectAutoPaymentList.length; i++) {
                    let tempObject = {};
                    tempObject["optionalFormId"] = chosenObjectAutoPaymentList[i].optionalFormId;
                    tempObject["optionalFormDescription"] = chosenObjectAutoPaymentList[i].optionalFormPanelHeader;
                    tempObject["optionalFormStartAmount"] = chosenObjectAutoPaymentList[i].optionalFormToYouAmountList[0].optionalFormAmount;
                    tempObject["optionalFormFrequencyCode"] = chosenObjectAutoPaymentList[i].lableFrequencyId;
                    tempObject["optionalFormFrequencyText"] = chosenObjectAutoPaymentList[i].optionalFormToYouAmountList[0].optionalFormFrequencyDescription;
                    tempObject["optionalFormShortDescription"] = chosenObjectAutoPaymentList[i].optionalFormPanelHeader;
                    tempObject["hideAutoSelect"]=chosenObjectAutoPaymentList[i].hideAutoSelect;
                    if(!chosenObjectAutoPaymentList[i].hideAutoSelect){
                        autoSelectionPaymentList.push(tempObject);
                    } else if (this.data.hasClntSprtAutoSelect && chosenObjectAutoPaymentList[i].hideAutoSelect) {
                        autoSelectionPaymentList.push(tempObject);
                    }
                }
                paymentOptionObject["autoSelectedOptionalFormsOfPaymentList"] = autoSelectionPaymentList;
            }

            for (let i = 0; i < this.chosenplan.length; i++) {
                for (let j = 0; j < this.chosenplan[i].optionalFormGroupPaymentData.length; j++) {
                    this.chosenplan[i].isElectionDeferred = false;
                    if (parseInt(this.chosenplan[i].optionalFormGroupPaymentData[j].optionalFormGroupId) === chosenObject.optionalFormGroupId) {
                        if (this.chosenplan[i].isElectionDeferred === true) {
                            this.chosenplan[i].isElectionDeferred = false;
                        }
                        this.chosenplan[i].optionalFormGroupPaymentData[j]["selectedOptionalFormPaymentData"] = paymentOptionObject;
                    }
                }
            }
            this.integrationCpoPpsService.setCategoryData(this.chosenplan);
        } else {
            paymentOptionObject["paymentOptionId"] = chosenObject.optionalFormId;
            paymentOptionObject["paymentOptionDescription"] = chosenObject.optionalFormPanelHeader;
            paymentOptionObject["paymentOptionToYouAmt"] = chosenObject.optionalFormToYouAmountList[0].optionalFormAmount;
            paymentOptionObject["labelFrequencyId"] = chosenObject.lableFrequencyId;

            let chosenObjectAutoPaymentList = chosenObject.autoSelectedFormsOfPaymentList;
            if (chosenObject.autoSelectedFormsOfPaymentList.length > 0) {
                let autoSelectionPaymentList = [];
                for (let i = 0; i < chosenObjectAutoPaymentList.length; i++) {
                    let tempObject = {};
                    tempObject["autoSelectPlanId"] = chosenObjectAutoPaymentList[i].planId;
                    tempObject["autoSelectElectionId"] = chosenObjectAutoPaymentList[i].electionId;
                    tempObject["autoSelectOptionalFormGroupId"] = chosenObjectAutoPaymentList[i].optionalFormId;
                    tempObject["autoSelectOpFormId"] = chosenObject.optionalFormId;
                    tempObject["autoSelectedFormOfPayment"] = chosenObjectAutoPaymentList[i].optionalFormPanelHeader;
                    tempObject["autoSelectedPaymentToYouAmt"] = chosenObjectAutoPaymentList[i].optionalFormToYouAmountList[0].optionalFormAmount;
                    tempObject["labelFrequencyId"] = chosenObjectAutoPaymentList[i].lableFrequencyId;
                    tempObject["hideAutoSelect"] = chosenObjectAutoPaymentList[i].hideAutoSelect;
                    if(!chosenObjectAutoPaymentList[i].hideAutoSelect){
                        autoSelectionPaymentList.push(tempObject);
                    } else if (this.data.hasClntSprtAutoSelect && chosenObjectAutoPaymentList[i].hideAutoSelect) {
                        autoSelectionPaymentList.push(tempObject);
                    }

                }

                paymentOptionObject["autoSelectedFormsOfPaymentList"] = autoSelectionPaymentList;

            }

            for (let i = 0; i < this.chosenplan.length; i++) {
                if (this.chosenplan[i].opformGroupId === chosenObject.optionalFormGroupId) {
                    if (this.chosenplan[i].isDeferred === true) {
                        this.chosenplan[i].isDeferred = false;
                    }
                    this.chosenplan[i]["paymentOption"] = paymentOptionObject;
                }
            }
            this.integrationCpoPpsService.setData(this.chosenplan);
        }
    }

    /* istanbul ignore next */
    deferbutton($event) {
        this.selectedChosenArray = [];
        this.defer = true;
        if (!this.chosenIds.UpnPpsflow) {
            for (let i = 0; i < this.chosenplan.length; i++) {
                this.chosenplan[i].isElectionDeferred = true;
            }
            this.integrationCpoPpsService.setCategoryData(this.chosenplan);
            this.retirementElectionRestService.onRouteDBElec("choose-category");
        } else {
            for (let i = 0; i < this.chosenplan.length; i++) {
                this.chosenplan[i].isDeferred = true;
            }
            this.integrationCpoPpsService.setData(this.chosenplan);
            this.retirementElectionRestService.onRouteDBElec("pension-payment-summary");
        }
    }
    /**
   * Standard code to handle errors.
   * @param error details of the error.
   */
    handleError(error) {
    }

}
