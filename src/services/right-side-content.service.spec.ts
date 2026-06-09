import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   RightSideContentService   } from "./right-side-content.service";

describe("RightSideContentService", () => {


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                RightSideContentService
            ]
        }); /* To compile html and css code */

    }));


    it("Component Service call Successfully Executed", inject([RightSideContentService], (tmpService: RightSideContentService) => {
        expect(tmpService).toBeTruthy();
        let rightSideContent = {
            "list": [],
            "expr": []
        };
        let addBeneFlag = true;
        let planId = 0;
        let elecId = 0;
        let calcRefNum = 0;
        let calcFrmSupportFlag = true;
        tmpService.setRightSideContent(rightSideContent);
        let returnResponse ;
        tmpService.getRightSideContent().subscribe((data) => returnResponse = data);
        expect(returnResponse).toBe(rightSideContent);
        tmpService.setAdditionalBeneficiaryText(addBeneFlag);
        expect(tmpService.getAdditionalBeneficiaryText()).toBe(addBeneFlag);
        tmpService.setParamIDs(planId, elecId);
        expect(tmpService.getPlanId()).toBe(planId);
        expect(tmpService.getElecId()).toBe(elecId);
        tmpService.setCalcRefNum(calcRefNum);
        expect(tmpService.getCalcRefNum()).toBe(calcRefNum);
        tmpService.setCalcFrmSupportFlag(calcFrmSupportFlag);
        expect(tmpService.getCalcFrmSupportFlag()).toBe(calcFrmSupportFlag);
    }));

});
