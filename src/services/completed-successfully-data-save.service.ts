import {  Injectable  } from "@angular/core";

@Injectable()
export class CompletedSuccessfullyDSService {
    private paymentElections: any;
    private beneficiaryContent: any;
    private retirementDatesContent: any;
    public isFromReviewPage = false;
    private isAllowedToBeneficiaries = false;
    private deferredBenefitsContent: any;
    constructor() {
    }
    public savePaymentElections(val: any): void {
        if (val !== undefined) {
            this.paymentElections = JSON.parse(JSON.stringify(val));
            this.paymentElections.forEach(paymentElectionItem => {
                paymentElectionItem.paymentElectionBenefits.forEach(paymentElectionBenefitsItem => {
                    paymentElectionBenefitsItem["showChangeButton"] = false;
                });
                if (paymentElectionItem.paymentDeductions !== undefined) { // Db Cashout Code Added For RollOver All Amount - As paymentDeductions will not come for this type
                    paymentElectionItem.paymentDeductions.forEach(paymentDeductionsItem => {
                        paymentDeductionsItem["showChangeButton"] = false;
                    });
                }
                paymentElectionItem.paymentDestinationsContent.paymentDestinations.forEach(paymentDestinationsItem => {
                    paymentDestinationsItem["showChangeButton"] = false;
                });
                if (paymentElectionItem.withholdingContent !== undefined) { // Db Cashout Code Added For RollOver All Amount - As withholdingContent will not come for this type
                    paymentElectionItem.withholdingContent["showChangeButton"] = false;
                }
            });
        }
    }
    public getPaymentElections(): any {
        return this.paymentElections;
    }

    public saveBeneficiaryContent(val: any): void {
        this.beneficiaryContent = Object.assign({}, val);
        this.beneficiaryContent["showChangeButton"] = false;
    }
    public getBeneficiaryContent(): any {
        return this.beneficiaryContent;
    }
    public saveRetirementDatesContent(val: any): void {
        this.retirementDatesContent = val;
    }
    public getRetirementDatesContent(): any {
        return this.retirementDatesContent;
    }
    setIsAllowedToBeneficiaries(additionalBeneficiaryText) {
        this.isAllowedToBeneficiaries = additionalBeneficiaryText;
    }
    getIsAllowedToBeneficiaries() {
        return  this.isAllowedToBeneficiaries;
    }
    /**
     * @method saveDeferredBenefitsContent
     * @param val
     * saves DeferredBenefits content and disables showChangesButton flag
     */
    public saveDeferredBenefitsContent(val: any): void {
        this.deferredBenefitsContent = Object.assign({}, val);
        if (this.deferredBenefitsContent !== undefined && this.deferredBenefitsContent.hasOwnProperty("showChangeButton")) {
            this.deferredBenefitsContent.showChangeButton = false;
        }
    }
    /**
     * @method getDeferredBenefitsContent
     * returns saved DefrredBenefitsContent
     */
    public getDeferredBenefitsContent(): void {
        return this.deferredBenefitsContent;
    }
}
