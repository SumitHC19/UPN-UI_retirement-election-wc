import {   waitForAsync, inject, TestBed   } from "@angular/core/testing";
import {   ReviewPensionChoicesService   } from "./review-pension-choices.service";

describe("ReviewPensionChoicesService", () => {


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                ReviewPensionChoicesService
            ]
        }); /* To compile html and css code */

    }));


    it("Component Service call Successfully Executed", inject([ReviewPensionChoicesService], (tmpService: ReviewPensionChoicesService) => {
        expect(tmpService).toBeTruthy();
        let beneficiaryContent = {
            "showChangeButton": true
        };
        tmpService.setBeneficiaryContent(beneficiaryContent);
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
        tmpService.setPaymentReviewList(paymentElections);
        tmpService.getPaymentReviewList();
        tmpService.setPaymentId("1000");
        tmpService.getPaymentId();
        tmpService.setChangeButtonText("change");
        tmpService.getChangeButtonText();
        tmpService.setChangeModalContent({});
        tmpService.getChangeModalContent();
        tmpService.setBackButton(true);
        tmpService.getBackButton();
        tmpService.setDisclaimer("text");
        tmpService.getDisclaimer();
        tmpService.setPara1("text");
        tmpService.getPara1();
        tmpService.setPara2("text");
        tmpService.getPara2();
    }));

});
