import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   AuthorizationCommonService   } from "./authorization-common.service";

describe("AuthorizationCommonService", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthorizationCommonService
            ]
        }); /* To compile html and css code */

    }));

    it("Component Service call Successfully Executed", inject([AuthorizationCommonService], (tmpService: AuthorizationCommonService) => {
        expect(tmpService).toBeTruthy();
        let nextStepsSection = {
            "nextStepsTitle": "Your Next Steps",
            "nextStepsHMHeader": "Retiree Health Benefits"
        };
        let submittedSuccessfullySummary = {
            "summaryTitle": "Summary of Your Request",
            "summaryConfirmationText": "Confirmation Number"
        };
        tmpService.setNextStepContent(nextStepsSection);
        expect(tmpService.getNextStepContent()).toBe(nextStepsSection);
        tmpService.setSummaryRequestContent(submittedSuccessfullySummary);
        expect(tmpService.getSummaryRequestContent()).toBe(submittedSuccessfullySummary);
    }));

});
