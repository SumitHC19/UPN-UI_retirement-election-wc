import {  of , Observable  } from "rxjs";
import {  Injectable  } from "@angular/core";

@Injectable()
export class RightSideContentService {
    private rightSideContent;
    private additionalBeneficiaryText;
    private planId;
    private elecId;
    private calcRefNum;
    private calcFrmSupportFlag: any;
    /**
     * sets the variable rightSideContent
     * @method setRightSideContent
     * @param val response value fprom config service
     */
    setRightSideContent(val: any) {
        this.rightSideContent = val;
    }

    /**
     * @method getRightSideContent
     * return the variable rightSideContent
     */
    getRightSideContent() {
        return of(this.rightSideContent);
    }

    /**
     * Sets the variable additionalBeneficiaryText
     * @method setAdditionalBeneficiaryText
     * @param additionalBeneficiaryText value from submitted pages
     */
    setAdditionalBeneficiaryText(additionalBeneficiaryText) {
        this.additionalBeneficiaryText = additionalBeneficiaryText;
    }

    /**
     * @method getAdditionalBeneficiaryText
     * returns the variable additionalBeneficiaryText
     */
    getAdditionalBeneficiaryText() {
        return  this.additionalBeneficiaryText;
    }

    /**
     * Sets the dynamic Plan and Elec Id
     * @method setParamIDs
     * @param planId plan Id from respective page
     * @param elecId election Id from respective page
     */
    setParamIDs(planId, elecId) {
        this.planId = planId;
        this.elecId = elecId;
    }

    /**
     * @method getPlanId
     * returns the Plan Id
     */
    getPlanId() {
        return this.planId;
    }

    /**
     * @method getElecId
     * returns the Election Id
     */
    getElecId() {
        return this.elecId;
    }

    /**
     * Sets the Variable calcRefNum
     * @method setCalcRefNum
     * @param calcRefNum calculation reference number/ID from respective pages
     */
    setCalcRefNum(calcRefNum) {
        this.calcRefNum = calcRefNum;
    }

    /**
     * @method getCalcRefNum
     * returns the calcRefNum
     */
    getCalcRefNum() {
        return this.calcRefNum;
    }

    /**
     * Sets the calculation formula support flag calcFrmSupportFlag
     * @method setCalcFrmSupportFlag
     * @param supportFlag
     */
    setCalcFrmSupportFlag(supportFlag) {
        this.calcFrmSupportFlag = supportFlag;
    }

    /**
     * returns the calcFrmSupportFlag
     * @method getCalcFrmSupportFlag
     */
    getCalcFrmSupportFlag() {
        return this.calcFrmSupportFlag;
    }
}
