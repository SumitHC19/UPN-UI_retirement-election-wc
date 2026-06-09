import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   SavePpsDataService   } from "./save-pps-data.service";

describe("SavePpsDataService", () => {


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                SavePpsDataService
            ]
        }); /* To compile html and css code */

    }));


    it("Component Service call Successfully Executed", inject([SavePpsDataService], (tmpService: SavePpsDataService) => {
        expect(tmpService).toBeTruthy();
    }));
});
