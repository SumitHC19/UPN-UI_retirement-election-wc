import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   AlPanelSectionService   } from "./al-panel-section.service";

describe("AlPanelSectionService", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                AlPanelSectionService
            ]
        }); /* To compile html and css code */

    }));

    it("Component Service call Successfully Executed", inject([AlPanelSectionService], (tmpService: AlPanelSectionService) => {
        expect(tmpService).toBeTruthy();
    }));

});
