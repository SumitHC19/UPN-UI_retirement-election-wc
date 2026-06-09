import {   TestBed, waitForAsync, inject   } from "@angular/core/testing";
import {   IntegrationCpoPpsService   } from "./integration-cpo-pps.service";

describe("IntegrationCpoPpsService", () => {

    let service: IntegrationCpoPpsService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                IntegrationCpoPpsService
            ]
        }); /* To compile html and css code */

    }));

    beforeEach(() => {
        service = TestBed.inject(IntegrationCpoPpsService);
    });

    it("Component Service call Successfully Executed", inject([IntegrationCpoPpsService], (tmpService: IntegrationCpoPpsService) => {
        expect(tmpService).toBeTruthy();
    }));

    it("call ", () => {
        let mockBenefitList = [
            {
                elecId: "10",
                opformGroupId: 2325,
                electionDescription: "Simple Election",
                opfmGrpDescription: "CB-Simple Election Opfm Grp",
                benefitDescription: "Simple Election - CB-Simple Election Opfm Grp",
                isDeferred: false
            }
        ];
        service.setChosenPlanDetails(mockBenefitList);
        expect(service.getChosenPlanDetails()).toBe(mockBenefitList);
    });

    it("call data", () => {
        let cpoResponse = [
            {
                elecId: "190",
                opformGroupId: 9451,
                electionDescription: "FP Simple Election2",
                opfmGrpDescription: "Defaulted Opfm Gp 1",
                benefitDescription: "FP Simple Election2 - Defaulted Opfm Gp 1",
                isDeferred: false,
                paymentOption: {
                    paymentOptionId: 3010,
                    paymentOptionDescription: "Lump Sum Distribution",
                    paymentOptionToYouAmt: "$500.00",
                    paymentOptionFrequency: "(one-time)",
                    labelFrequencyId: "L"
                }
            }
        ];

        service.setData(cpoResponse);
        expect(service.getData()).toBe(cpoResponse);
    });

    it("call defer Data", () => {
        let planId = "8744";
        let electionGroupId = "0";
        let electionId = "10";
        let expectedResponse = {};
        let UpnPpsflow = true;
        let deferredflag = false;
        expectedResponse["planId"] = planId;
        expectedResponse["ElectionId"] = electionId;
        expectedResponse["electionGroupId"] = electionGroupId;
        expectedResponse["UpnPpsflow"] = UpnPpsflow;
        expectedResponse["deferredflag"] = deferredflag;
        service.setChosenIds(planId, electionGroupId, electionId, UpnPpsflow, deferredflag);
        let flag = JSON.stringify(expectedResponse) === JSON.stringify(service.getChosenIds());
        expect(flag).toBe(false);
    });
    it("should set and get CategoryData", () => {
        let categoryResponse = [
            {
                elecId: "190",
                opformGroupId: 9451,
                electionDescription: "FP Simple Election2",
                opfmGrpDescription: "Defaulted Opfm Gp 1",
                benefitDescription: "FP Simple Election2 - Defaulted Opfm Gp 1",
                isDeferred: false,
                paymentOption: {
                    paymentOptionId: 3010,
                    paymentOptionDescription: "Lump Sum Distribution",
                    paymentOptionToYouAmt: "$500.00",
                    paymentOptionFrequency: "(one-time)",
                    labelFrequencyId: "L"
                }
            }
        ];
        service.setCategoryData(categoryResponse);
        expect(service.getCategoryData()).toBe(categoryResponse);
    });
    it("should get and set AllOptionalForms", () => {
        let allOptionalForms = "defer";
        service.setAllOptionalForms(allOptionalForms);
        expect(service.getAllOptionalForms()).toBe(allOptionalForms);
    });
    it("should get and set cpoComebacklater", () => {
        let cpoComebacklater = true;
        service.setCpoComebacklater(cpoComebacklater);
        expect(service.getCpoComebacklater()).toBe(cpoComebacklater);
    });
    it("should get and set ChosenCategoryPlanDetails", () => {
        let ChosenCategoryPlanDetails = [
            {
                elecId: "190",
                opformGroupId: 9451,
                electionDescription: "FP Simple Election2",
                opfmGrpDescription: "Defaulted Opfm Gp 1",
                benefitDescription: "FP Simple Election2 - Defaulted Opfm Gp 1",
                isDeferred: false,
                paymentOption: {
                    paymentOptionId: 3010,
                    paymentOptionDescription: "Lump Sum Distribution",
                    paymentOptionToYouAmt: "$500.00",
                    paymentOptionFrequency: "(one-time)",
                    labelFrequencyId: "L"
                }
            }
        ];
        service.setChosenCategoryPlanDetails(ChosenCategoryPlanDetails);
        expect(service.getChosenCategoryPlanDetails()).toBe(ChosenCategoryPlanDetails);
    });
});
