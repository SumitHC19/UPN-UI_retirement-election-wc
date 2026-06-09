import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {   DeferredSuccessfullyDSService   } from "./deferred-successfully-data-save.service";

describe("DeferredSuccessfullyDSService", () => {

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                DeferredSuccessfullyDSService
            ]
        }); /* To compile html and css code */

    }));

    it("Component Service call Successfully Executed", inject([DeferredSuccessfullyDSService], (tmpService: DeferredSuccessfullyDSService) => {
        expect(tmpService).toBeTruthy();
        let effecDate = "10-13-2020";
        tmpService.setEffecDate(effecDate);
        expect(tmpService.getEffecDate()).toBe(effecDate);
        let confNumber = "64010010";
        tmpService.setConfNumber(confNumber);
        expect(tmpService.getConfNumber()).toBe(confNumber);
        let planList = [
            {
                planId: "8744",
                planDescription: "DB FAP Pension Plan"
            },
            {
                planId: "8744",
                planDescription: "DB FAP Pension Plan"
            }
        ];
        tmpService.setPlanList(planList);
        expect(tmpService.getPlanDescriptionList()).toBe(tmpService.planDescriptionList);
    }));

});
