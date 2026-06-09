import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {   EditMessagesService   } from "./edit-messages.service";

describe("EditMessagesService", () => {

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                EditMessagesService
            ]
        }); /* To compile html and css code */

    }));

    it("Component Service call Successfully Executed", inject([EditMessagesService], (tmpService: EditMessagesService) => {
        expect(tmpService).toBeTruthy();
        let ifCaseValues = [
            {
                "editId": "$",
                "editDiagnostics": undefined,
                "editSeverity": undefined
            }
        ];
        tmpService.saveEditArray(ifCaseValues);
        let elseCaseValues = [
            {
                "editId": "1",
                "editDiagnostics": "",
                "editSeverity": ""
            }
        ];
        tmpService.saveEditArray(elseCaseValues);
        tmpService.editMessageFlagSubject.next(true);
        tmpService.redirectToUrlSubject.next("");
        tmpService.editButtonListSubject.next([]);
        tmpService.isDbCashoutFlagSubject.next(false);
        tmpService.hasEditFlagSubject.next(false);
        tmpService.issTbaEditSubject.next(false);
    }));

});
