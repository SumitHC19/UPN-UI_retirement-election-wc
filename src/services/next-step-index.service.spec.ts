import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {   NextStepIndexService   } from "./next-step-index.service";
import {   StepsActiveIndexService   } from "./steps-active-index-service";
import {   RetirementElectionRestService   } from "./retirement-election-rest.service";
import {   RouterService   } from "./router.service";
import {   RouterTestingModule   } from "@angular/router/testing";
import { MockRouterService } from "./mock-services/router.service.mock";

export class RetirementElectionRestServiceMock {
    orgName = "retirement3x";
}

describe("NextStepIndexService", () => {

    let service: NextStepIndexService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                NextStepIndexService,
                StepsActiveIndexService,
                { provide: RouterService, useClass: MockRouterService },
                {
                    provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                }
            ],
            imports: [
                RouterTestingModule
            ]
        }); /* To compile html and css code */

    }));

    beforeEach(() => {
        service = TestBed.inject(NextStepIndexService);
        spyOn(service, "renderNextPage");
    });

    it("Component Service call Successfully Executed", inject([NextStepIndexService], (tmpService: NextStepIndexService) => {
        expect(tmpService).toBeTruthy();
        let Str = "";
        tmpService.setErrorMessage(Str);
        tmpService.getErrorMessage();
        tmpService.clearErrorMessage();
        let path = "pension-payment-summary";
        tmpService.switchPage(path);
        expect(tmpService.renderNextPage).toHaveBeenCalled();
        path = "rollover-amount";
        tmpService.switchPage(path);
        expect(tmpService.renderNextPage).toHaveBeenCalled();
    }));
});
