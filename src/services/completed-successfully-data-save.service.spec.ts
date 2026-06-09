import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   CompletedSuccessfullyDSService   } from "./completed-successfully-data-save.service";

describe("CompletedSuccessfullyDSService", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                CompletedSuccessfullyDSService
            ]
        }); /* To compile html and css code */

    }));

    it("Component Service call Successfully Executed", inject([CompletedSuccessfullyDSService], (tmpService: CompletedSuccessfullyDSService) => {
        expect(tmpService).toBeTruthy();
        let beneficiaryContent = {
            "showChangeButton": true
        };
        tmpService.saveBeneficiaryContent(beneficiaryContent);
        tmpService.getBeneficiaryContent();
        let paymentElections = [
            {
                "paymentElectionBenefits": [
                    {"showChangeButton": true}
                ],
                "paymentDeductions": [
                    {"showChangeButton": true}
                ],
                "paymentDestinationsContent": {
                    "paymentDestinations": [
                        {"showChangeButton": true}
                    ]
                },
                "withholdingContent": {
                    "showChangeButton": true
                }
            }
        ];
        let deferredBene = {
            "showChangeButton": true
        };
        tmpService.savePaymentElections(paymentElections);
        tmpService.getPaymentElections();
        let emptyPmtElec: any;
        tmpService.savePaymentElections(emptyPmtElec);
        tmpService.saveRetirementDatesContent({});
        tmpService.getRetirementDatesContent();
        tmpService.saveDeferredBenefitsContent(deferredBene);
        tmpService.getDeferredBenefitsContent();
    }));

});
