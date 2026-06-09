import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   SaveChooseCategoryDataService   } from "./save-choosecategory-data.service";

describe("SaveChooseCategoryDataService", () => {


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                SaveChooseCategoryDataService
            ]
        }); /* To compile html and css code */

    }));

    it("Component Service call Successfully Executed", inject([SaveChooseCategoryDataService], (tmpService: SaveChooseCategoryDataService) => {
        expect(tmpService).toBeTruthy();
    }));
});
