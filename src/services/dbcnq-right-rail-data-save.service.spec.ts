import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {   RightRailSaveDataService   } from "./dbcnq-right-rail-data-save.service";

describe("RightRailSaveDataSService", () => {

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                RightRailSaveDataService
            ]
        });
    }));

    it("Component Service call Successfully Executed", inject([RightRailSaveDataService], (tmpService: RightRailSaveDataService) => {
        expect(tmpService).toBeTruthy();
        let activeIndex = {};
        let ofLabel = {};
        let isQuestionTile = true;
        let isIRATile = true;
        let isNORLink = true;

        tmpService.setIraChecklist(activeIndex);
        expect(tmpService.getIraChecklist()).toBe(activeIndex);

        tmpService.setQuestion(ofLabel);
        expect(tmpService.getQuestion()).toBe(ofLabel);

        tmpService.setIsQuestionTile(isQuestionTile);
        expect(tmpService.getIsQuestionTile()).toBe(isQuestionTile);

        tmpService.setIsIRATile(isIRATile);
        expect(tmpService.getIsIRATile()).toBe(isIRATile);

        tmpService.setIsNORLink(isNORLink);
        expect(tmpService.getIsNORLink()).toBe(isNORLink);

    }));

});
