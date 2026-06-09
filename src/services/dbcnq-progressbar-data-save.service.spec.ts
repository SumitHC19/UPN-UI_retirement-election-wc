import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {   ProgressBarSaveDataSService   } from "./dbcnq-progressbar-data-save.service";

describe("ProgressBarSaveDataSService", () => {

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                ProgressBarSaveDataSService
            ]
        });

    }));

    it("Component Service call Successfully Executed", inject([ProgressBarSaveDataSService], (tmpService: ProgressBarSaveDataSService) => {
        expect(tmpService).toBeTruthy();
        let activeIndex = 0;
        let ofLabel = "";
        let stepDetail = "";
        let pageTitle = "";
        tmpService.setActiveIndex(activeIndex);
        expect(tmpService.getActiveIndex()).toBe(activeIndex);

        tmpService.setOfLabel(ofLabel);
        expect(tmpService.getOfLabel()).toBe(ofLabel);

        tmpService.setStepDetail(stepDetail);
        expect(tmpService.getStepDetail()).toBe(stepDetail);

        tmpService.setPageTitle(pageTitle);
        expect(tmpService.getPageTitle()).toBe(pageTitle);

    }));

});
