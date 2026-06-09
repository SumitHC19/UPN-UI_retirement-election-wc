import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   StepsActiveIndexService   } from "./steps-active-index-service";

describe("StepsActiveIndexService", () => {


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                StepsActiveIndexService
            ]
        }); /* To compile html and css code */

    }));
    it("Component Service call Successfully Executed", inject([StepsActiveIndexService], (tmpService: StepsActiveIndexService) => {
        expect(tmpService).toBeTruthy();
        tmpService.getStepIndex();
        tmpService.setStepIndex(1);
        tmpService.getActiveIndexStepID();
    }));
});
