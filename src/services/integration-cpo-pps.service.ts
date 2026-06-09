import {  Injectable  } from "@angular/core";
import {  Observable  } from "rxjs";

//

@Injectable()
export class IntegrationCpoPpsService {
    private responseFromCpo: any;
    private chosenPlanId: any;
    private chosenelectionGroupId: any;
    private chosenElectionId: any;
    private chosenPlan: any;
    private chosenIds: any;
    UpnPpsflow: any;
    private deferredFlag: any;
    private allOptionFrm: any;
    private chosenplancpofromcc: any;
    private calculationReferenceNumber: any;
    getData() {
        if (this.responseFromCpo !== undefined) {
            return this.responseFromCpo;
        }
    }

    setData(response) {
        this.responseFromCpo = response;
    }

    setChosenIds(planId, electionGroupId, electionId, flagType, deferredFlag) {
        this.chosenPlanId = planId;
        this.chosenelectionGroupId = electionGroupId;
        this.chosenElectionId = electionId;
        this.UpnPpsflow = flagType;
        this.deferredFlag = deferredFlag;
    }
    getChosenIds() {
        this.chosenIds = {};
        this.chosenIds["planId"] = this.chosenPlanId;
        this.chosenIds["ElectionId"] = this.chosenElectionId;
        this.chosenIds["electionGroupId"] = this.chosenelectionGroupId;
        this.chosenIds["UpnPpsflow"] = this.UpnPpsflow;
        this.chosenIds["deferredFlag"] = this.deferredFlag;
        return this.chosenIds;
    }

    setChosenPlanDetails(chosenPlan) {
        this.chosenPlan = chosenPlan;
    }

    getChosenPlanDetails() {
        return this.chosenPlan;
    }

    setChosenCategoryPlanDetails(chosenPlan) {
        this.chosenPlan = chosenPlan;
    }

    getChosenCategoryPlanDetails() {
        return this.chosenPlan;
    }
    getCategoryData() {
        if (this.responseFromCpo !== undefined) {
            return this.responseFromCpo;
        }
    }

    setCategoryData(response) {
        this.responseFromCpo = response;
    }

    setAllOptionalForms(allOptionfrm) {
        this.allOptionFrm = allOptionfrm;
    }

    getAllOptionalForms() {
        if (this.allOptionFrm !== undefined) {
            return this.allOptionFrm;
        }
    }
    setCpoComebacklater(comeBackOptionfrm) {
        this.chosenplancpofromcc = comeBackOptionfrm;
    }
    getCpoComebacklater() {
        if (this.chosenplancpofromcc !== undefined) {
            return this.chosenplancpofromcc;
        }
    }

    /**
     * @method setCalculationReferenceNumber
     * @param calcRefNum
     * Sets the calc ref num from PPS GET
     */
    setCalculationReferenceNumber(calcRefNum: any) {
        this.calculationReferenceNumber = calcRefNum;
    }

    /**
     * @method getCalculationReferenceNumber
     * returns the calc ref number saved
     */
    getCalculationReferenceNumber() {
        if (this.calculationReferenceNumber !== undefined) {
            return this.calculationReferenceNumber;
        }
    }
}
