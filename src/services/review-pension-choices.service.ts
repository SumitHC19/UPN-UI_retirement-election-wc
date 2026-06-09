import {  Injectable  } from "@angular/core";
import {  Subject  } from "rxjs";

@Injectable()
export class ReviewPensionChoicesService {
    private paymentReviewList: any;
    private beneficiaryContent: any;
    private nqBenefit: any;
    private changeButtonText: any;
    private changeModalContent: any;
    private isBackButton = false;
    private deferredBenefitsContent: any;
    expandPageSubject = new Subject();
    private disclaimer: string;
    private para1: string;
    private para2: string;
    constructor() {
    }
    public setPaymentReviewList(val: any): void {
        this.paymentReviewList = val;
    }
    public getPaymentReviewList(): any {
        return this.paymentReviewList;
    }
    public setBeneficiaryContent(val: any): void {
        this.beneficiaryContent = val;
    }
    public setNonQualifiedBenefitContent(val: any): void {
        this.nqBenefit = val;
    }

    public getBeneficiaryContent(): any {
        return this.beneficiaryContent;
    }
    public getNonQualifiedBenefitContent(): any {
        return this.nqBenefit;
    }
    public setChangeButtonText(val: any): void {
        this.changeButtonText = val;
    }
    public getChangeButtonText(): any {
        return this.changeButtonText;
    }
    public setChangeModalContent(val: any): any {
        this.changeModalContent = val;
    }
    public getChangeModalContent(): any {
        return this.changeModalContent;
    }
    public setPaymentId(val: any): void {
        localStorage.setItem("incomeTaxPaymentID", JSON.stringify(val));
    }
    public getPaymentId(): any {
        let data = localStorage.getItem("incomeTaxPaymentID");
        return JSON.parse(data);
    }
    public setBackButton(val: boolean): void {
        this.isBackButton = val;
    }
    public getBackButton(): any {
        return this.isBackButton;
    }
    public setDeferredBenefitsContent(val: any): void {
        this.deferredBenefitsContent = val;
    }
    public getDeferredBenefitsContent(): any {
        return this.deferredBenefitsContent;
    }

    public setDisclaimer(val: any): void {
        this.disclaimer = val;
    }
    public getDisclaimer(): any {
        return this.disclaimer;
    }
    public setPara1(val: any): void {
        this.para1 = val;
    }
    public getPara1(): any {
        return this.para1;
    }
    public setPara2(val: any): void {
        this.para2 = val;
    }
    public getPara2(): any {
        return this.para2;
    }

}
