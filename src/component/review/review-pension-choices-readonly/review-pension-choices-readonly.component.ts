import {  Component, OnInit, ViewChild, Input  } from "@angular/core";
import {  RetirementElectionRestService  } from "../../../services/retirement-election-rest.service";
import {  ReviewPensionChoicesService  } from "../../../services/review-pension-choices.service";
import {  CompletedSuccessfullyDSService  } from "../../../services/completed-successfully-data-save.service";
import {  ViewRhrComponentsModel  } from "../../shared/models/view-rhr-components.model";
import {  Router, ActivatedRoute  } from "@angular/router";
import {  AlLoaderComponent, LoggingService , DomStorageFallbackService, DynamicComponentService  } from "@alight/core-utilities-lib";
import {  FootnoteService  } from "../../../services/footnote-common.service";
import {  FootnoteComponent  } from "../../shared/footnote-common/footnote-common-component";

// declare var require:any;

@Component({
    selector: "al-pension-choices-readonly",
    templateUrl: "./review-pension-choices-readonly.component.html",
    providers: [AlLoaderComponent]
})
export class ReviewPensionChoicesReadOnlyComponent implements OnInit {
    data: any;
    printButtonText: any;
    saveApiRequestBody: any;
    checkresponse = false;
    showError = true;
    routeToPageLocation: any;
    responseData: any;
    rawGetResponseData: any;
    domSystemTickets: any;
    isSUAResultMode = false;
    disableSubmit = false;
    editMessageList: any[];
    allowContinue = false;
    ViewRhrComponents = new ViewRhrComponentsModel();
    skipSUA = false;
    @ViewChild("display", { static: true }) display: any;
    cancelOnContinue = false;
    isDbCashoutPageLoading = false;
    @ViewChild("footnoteDbElec") footnoteDbElec: any;
    hassTBAEdit = false;
    reviewSuaEditList: any;
    showLDWDate = false;
    // @Input() isDbCashoutFlag: boolean;
    isDbCashoutFlag = false;
    @ViewChild("aldialogCancel") aldialogCancel;
    @ViewChild(FootnoteComponent, { static: false })  childFootnote: FootnoteComponent;
    isECSUser: boolean;
    isReviewSubmitted = false;
    isRoutedToSUA = false;
    constructor(private retirementElectionRestService: RetirementElectionRestService,
        private reviewPensionChoicesService: ReviewPensionChoicesService,
        private completedSuccessfullyDSService: CompletedSuccessfullyDSService,
        private router: Router,
        private loading: AlLoaderComponent,
        private domFBService: DomStorageFallbackService,
        private activatedRoute: ActivatedRoute,
        private dynamicComponentService: DynamicComponentService,
        private logger: LoggingService,
        private footnoteService: FootnoteService
    ) {
        this.ViewRhrComponents.viewOtherResComp = true;
        this.retirementElectionRestService.ViewRhrComponents = this.ViewRhrComponents;
    }

    ngOnInit() {
        this.dynamicComponentService.loadScript("Header", "header-wc");
        this.dynamicComponentService.initializePageComponents();
        this.setConfigurationData();
        this.reviewReadOnlyContent();
    }
    /* istanbul ignore next */
    setConfigurationData(){
        this.retirementElectionRestService.getConfigurationData().subscribe((data) => {
            if (data && data[0] ) {
                if (data[0]["expr"]["SHOW_LDW_YOUR_DATES_TABLE"] !== undefined) {
                    this.showLDWDate = data[0]["expr"]["SHOW_LDW_YOUR_DATES_TABLE"];
                }
            }
        },
        err => {
        });
    }

    reviewReadOnlyContent() {
        this.checkresponse = true;
        let readOnlyData = this.domFBService.getItem("reviewPageData", "sessionStorage", true);
        if (readOnlyData !== null && readOnlyData !== undefined) {
            this.data = JSON.parse(readOnlyData);
            /* istanbul ignore next */
            if (this.data.responseStatus !== undefined && this.data.responseStatus.statusCode !== undefined) {
                let responseStatusCode = this.data.responseStatus.statusCode;
                if (responseStatusCode === 200) {
                    this.showError = false;
                    document.title = this.data.pageTitle;
                    this.reviewPensionChoicesService.setBeneficiaryContent(this.data.beneficiaryContent);
                    if (this.data.hasOwnProperty("nqBenefit") && this.data.nqBenefit && this.data.nqBenefit !== null) {
                        this.reviewPensionChoicesService.setNonQualifiedBenefitContent(this.data.nqBenefit);
                    }
                    this.reviewPensionChoicesService.setDeferredBenefitsContent(this.data.deferredBenefitsContent);
                    this.reviewPensionChoicesService.setChangeButtonText(this.data.changeButtonLabel);
                    this.reviewPensionChoicesService.setPaymentReviewList(this.data.paymentElections);
                    if (this.data.beneficiaryContent !== undefined && this.data.beneficiaryContent.showChangeButton !== undefined) {
                        this.data.beneficiaryContent.showChangeButton = false;
                    }
                    this.data.paymentElections.forEach(paymentElectionItem => {
                        paymentElectionItem.paymentElectionBenefits.forEach(paymentElectionBenefitsItem => {
                            paymentElectionBenefitsItem["showChangeButton"] = false;
                        });
                        if (paymentElectionItem.paymentDeductions !== undefined) {
                            paymentElectionItem.paymentDeductions.forEach(paymentDeductionsItem => {
                                paymentDeductionsItem["showChangeButton"] = false;
                            });
                        }
                        paymentElectionItem.paymentDestinationsContent.paymentDestinations.forEach(paymentDestinationsItem => {
                            paymentDestinationsItem["showChangeButton"] = false;
                        });
                        if (paymentElectionItem.withholdingContent !== undefined) {
                            paymentElectionItem.withholdingContent["showChangeButton"] = false;
                        }
                    });
                }
            }
        }
    }
}
