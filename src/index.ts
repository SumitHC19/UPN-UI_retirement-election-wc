import { APP_BASE_HREF, CommonModule, Location, registerLocaleData } from "@angular/common";
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, DoBootstrap } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import localeFr from "@angular/common/locales/fr";
import { createCustomElement } from "@angular/elements";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";

import { AlCoreModuleLibrary, LoggingService } from "@alight/core-utilities-lib";

import { RetirementElectionComponent } from "./components/retirement-election.component";
import { PensionPaymentSummaryComponent } from "./components/payment-option/pension-payment-summary.component";
import { ChoosePaymentOptionComponent } from "./components/payment-option/choose-payment-option/choose-payment-option.component";
import { CustomAlPanelComponent } from "./components/shared/custom-al-panel/custom-al-panel.component";
import { PanelSectionComponent } from "./components/shared/panel-section/panel-section.component";
import { BenefitSectionComponent } from "./components/payment-option/choose-payment-option/benefit-section/benefit-section.component";
import { HypotheticalPanelSectionComponent } from "./components/payment-option/choose-payment-option/benefit-section/hypothetical-panel-section/hypothetical-panel-section.component";
import { HowMuchToRolloverComponent } from "./components/payment-option/how-much-to-rollover/how-much-to-rollover.component";
import { CancelledComponent } from "./components/cancelled/cancelled.component";
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { ErrorComponent } from "./components/shared/error/error.component";
import { RetirementElectionLazyComponent } from "./components/retirement-election/retirement-election-lazy.component";
import { ReceiveRolloverComponent } from "./components/destination/rollover-destination/rollover-destination.component";
import { ReceivePaymentComponent } from "./components/destination/payment-destination/payment-destination.component";
import { AddressDetailsComponent } from "./components/destination/payment-destination/addressdetails/addressdetails.component";
import { EditMessagesComponent } from "./components/shared/edit-messages/edit-messages.component";
import { SavedSuccessfullyComponent } from "./components/saved/saved.component";
import { RetirementElectionRestService } from "./services/retirement-election-rest.service";
import { IntegrationCpoPpsService } from "./services/integration-cpo-pps.service";
import { AlPanelSectionService } from "./services/al-panel-section.service";
import { SavePpsDataService } from "./services/save-pps-data.service";
import { NextStepIndexService } from "./services/next-step-index.service";
import { RouterService } from "./services/router.service";
import { StepsActiveIndexService } from "./services/steps-active-index-service";
import { EditMessagesService } from "./services/edit-messages.service";
import { AuthorizationCommonService } from "./services/authorization-common.service";
import { NoticeRightsComponent } from "./components/rights/notice-rights.component";
import { ReviewPensionChoicesComponent } from "./components/review/review-pension-choices.component";
import { RetirementReviewDetailsComponent } from "./components/shared/retirement-review-details/retirement-review-details.component";
import { BeneficiariesComponent } from "./components/shared/retirement-review-details/beneficiaries/beneficiaries.component";
import { NonQualifiedBenefitComponent } from "./components/shared/retirement-review-details/non-qualified-benefit/non-qualified-benefit.component";
import { PaymentReviewComponent } from "./components/shared/retirement-review-details/payment-review/payment-review.component";
import { PaymentTableComponent } from "./components/shared/retirement-review-details/payment-review/payment-table/payment-table.component";
import { OtherDetailsComponent } from "./components/shared/retirement-review-details/payment-review/other-details/other-details.component";
import { PaymentAmountComponent } from "./components/shared/retirement-review-details/payment-review/other-details/payment-amount/payment-amount.component";
import { EstimatedIncomeTaxComponent } from "./components/shared/retirement-review-details/payment-review/other-details/estimated-income-tax/estimated-income-tax.component";
import { TaxationInformationComponent } from "./components/shared/retirement-review-details/payment-review/other-details/taxation-information/taxation-information.component";
import { PaymentDestinationComponent } from "./components/shared/retirement-review-details/payment-review/other-details/payment-destination/payment-destination.component";
import { ReviewPensionChoicesService } from "./services/review-pension-choices.service";
import { CompletedSuccessfullyDSService } from "./services/completed-successfully-data-save.service";
import { AuthorizeYourChoicesComponent } from "./components/authorize/authorize-your-choices";
import { CompletedSuccessfullyComponent } from "./components/complete/completed-successfully/completed-successfully.component";
import { IncomeTaxComponent } from "./components/income-tax/income-tax-component";
import { AuthorizationCommonComponent } from "./components/shared/authorization-common/authorization-common.component";
import { NextStepsComponent } from "./components/shared/authorization-common/next-steps/next-steps.component";
import { SummaryOfRequestComponent } from "./components/shared/authorization-common/summary-of-request/summary-of-request.component";
import { DynamicEditLoaderComponent } from "./components/shared/dynamic-edit-loader/dynamic-edit-loader.component";
import { DeferredSuccessfullyComponent } from "./components/deferred/deferred.component";
import { NoticeRightsReadOnlyComponent } from "./components/rights/noticerights-readonly/noticerights-readonly.component";
import { NoticeRightsCommonComponent } from "./components/shared/rights-common/notice-rights-common.component";
import { ChooseCategoryComponent } from "./components/payment-option/choose-category/choose-category.component";
import { SubmittedSuccessfullyComponent } from "./components/complete/submitted-successfully/submitted-successfully.component";
import { SaveChooseCategoryDataService } from "./services/save-choosecategory-data.service";
import { RightSideComponent } from "./components/shared/right-side-components/right-side-components.component";
import { DocumentsAndResourcesComponent } from "./components/shared/right-side-components/documents-and-resources/documents-and-resources.component";
import { QuestionsComponent } from "./components/shared/right-side-components/questions/questions.component";
import { ComparePaymentOptionsComponent } from "./components/shared/right-side-components/compare-payment-options/compare-payment-options.component";
import { PeopleLikeMeComponent } from "./components/shared/right-side-components/people-like-me/people-like-me.component";
import { ConsiderIraRolloverImpactComponent } from "./components/shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
import { OtherResourcesComponent } from "./components/shared/right-side-components/other-resources/other-resources.component";
import { WantToAddAnotherBeneficiaryComponent } from "./components/shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
import { ChoosePaymentOptionsMatrixComponent } from "./components/payment-option/choose-payment-options-matrix/choose-payment-options-matrix.component";
import { RightSideContentService } from "./services/right-side-content.service";
import { DeferredSuccessfullyDSService } from "./services/deferred-successfully-data-save.service";
import { ProgressBarSaveDataSService } from "./services/dbcnq-progressbar-data-save.service";
import { FootnoteService } from "./services/footnote-common.service";
import { RightRailSaveDataService } from "./services/dbcnq-right-rail-data-save.service";
import { RightRailComponent } from "./components/shared/dbcnq-right-rail/dbcnq-right-rail.component";
import { DBCNQProgressBarComponent } from "./components/progress-bar/dbcnq-progress-bar.component";
import { FootnoteComponent } from "./components/shared/footnote-common/footnote-common-component";
import { ReviewPensionChoicesReadOnlyComponent } from "./components/review/review-pension-choices-readonly/review-pension-choices-readonly.component";
import { ProgressBarPopoverDataCacheService } from "./services/progressBarPopoverDataCache.service";
import { FederalWithholdingComponent } from "./components/federal-withholding/federal-withholding.component";
import { provideRouter, Router, RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DbNqEnrollPaymentDestinationWcComponent } from "./components/web-components/db-nq-enroll-payment-destination-wc/db-nq-enroll-payment-destination-wc.component";
import { DbNqEnrollReviewPensionChoicesWcComponent } from "./components/web-components/db-nq-enroll-review-pension-choices-wc/db-nq-enroll-review-pension-choices-wc.component";
import { DbNqEnrollIncomeTaxWcComponent } from "./components/web-components/db-nq-enroll-income-tax-wc/db-nq-enroll-income-tax-wc.component";
import { DbNqEnrollCompletedSuccessfullyWcComponent } from "./components/web-components/db-nq-enroll-completed-successfully-wc/db-nq-enroll-completed-successfully-wc.component";
import { FederalWithholdingWcComponent } from "./components/web-components/federal-withholding-wc/federal-withholding-wc.component";
import { DbCashOutPaymentDestinationWcComponent } from "./components/web-components/db-cashout-payment-destination-wc/db-cashout-payment-destination-wc.component";
import { DbCashOutCompletedSuccessfullyWcComponent } from "./components/web-components/db-cashout-completed-successfully-wc/db-cashout-completed-successfully-wc.component";
import { DbCashOutWhereToReceiveRolloverPaymentWcComponent } from "./components/web-components/db-cashout-receive-rollover-payment-wc/db-cashout-receive-rollover-payment-wc.component";
import { DbCashOutOneTimeRolloverPaymentWcComponent } from "./components/web-components/db-cashout-onetime-rollover-payment-wc/db-cashout-onetime-rollover-payment-wc.component";
import { DbCashOutReviewPensionChoicesWcComponent } from "./components/web-components/db-cashout-review-pension-choices-wc/db-cashout-review-pension-choices-wc.component";
import { DbCashOutIncomeTaxWcComponent } from "./components/web-components/db-cashout-income-tax-wc/db-cashout-income-tax-wc.component";

// Angular specific imports
// ========================================

// Widget specific exports
// ========================================
export { RetirementElectionComponent } from "./components/retirement-election.component";
export { PensionPaymentSummaryComponent } from "./components/payment-option/pension-payment-summary.component";
export { ChoosePaymentOptionComponent } from "./components/payment-option/choose-payment-option/choose-payment-option.component";
export { CustomAlPanelComponent } from "./components/shared/custom-al-panel/custom-al-panel.component";
export { PanelSectionComponent } from "./components/shared/panel-section/panel-section.component";
export { BenefitSectionComponent } from "./components/payment-option/choose-payment-option/benefit-section/benefit-section.component";
export { HypotheticalPanelSectionComponent } from "./components/payment-option/choose-payment-option/benefit-section/hypothetical-panel-section/hypothetical-panel-section.component";
export { HowMuchToRolloverComponent } from "./components/payment-option/how-much-to-rollover/how-much-to-rollover.component";
export { CancelledComponent } from "./components/cancelled/cancelled.component";
export { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
export { ReceiveRolloverComponent } from "./components/destination/rollover-destination/rollover-destination.component";
export { ReceivePaymentComponent } from "./components/destination/payment-destination/payment-destination.component";
export { ErrorComponent } from "./components/shared/error/error.component";
export { AddressDetailsComponent } from "./components/destination/payment-destination/addressdetails/addressdetails.component";
export { EditMessagesComponent } from "./components/shared/edit-messages/edit-messages.component";
export { SavedSuccessfullyComponent } from "./components/saved/saved.component";
export { RetirementElectionLazyComponent } from "./components/retirement-election/retirement-election-lazy.component";
export { IntegrationCpoPpsService } from "./services/integration-cpo-pps.service";
export { AlPanelSectionService } from "./services/al-panel-section.service";
export { SavePpsDataService } from "./services/save-pps-data.service";
export { EditMessagesService } from "./services/edit-messages.service";
export { RetirementElectionRestService } from "./services/retirement-election-rest.service";
export { NextStepIndexService } from "./services/next-step-index.service";
export { RouterService } from "./services/router.service";
export { StepsActiveIndexService } from "./services/steps-active-index-service";
export { AuthorizationCommonService } from "./services/authorization-common.service";
export { NoticeRightsComponent } from "./components/rights/notice-rights.component";
export { NoticeRightsCommonComponent } from "./components/shared/rights-common/notice-rights-common.component";
export { ReviewPensionChoicesComponent } from "./components/review/review-pension-choices.component";
export { RetirementReviewDetailsComponent } from "./components/shared/retirement-review-details/retirement-review-details.component";
export { BeneficiariesComponent } from "./components/shared/retirement-review-details/beneficiaries/beneficiaries.component";
export { NonQualifiedBenefitComponent } from "./components/shared/retirement-review-details/non-qualified-benefit/non-qualified-benefit.component";
export { PaymentReviewComponent } from "./components/shared/retirement-review-details/payment-review/payment-review.component";
export { PaymentTableComponent } from "./components/shared/retirement-review-details/payment-review/payment-table/payment-table.component";
export { OtherDetailsComponent } from "./components/shared/retirement-review-details/payment-review/other-details/other-details.component";
export { PaymentAmountComponent } from "./components/shared/retirement-review-details/payment-review/other-details/payment-amount/payment-amount.component";
export { EstimatedIncomeTaxComponent } from "./components/shared/retirement-review-details/payment-review/other-details/estimated-income-tax/estimated-income-tax.component";
export { TaxationInformationComponent } from "./components/shared/retirement-review-details/payment-review/other-details/taxation-information/taxation-information.component";
export { PaymentDestinationComponent } from "./components/shared/retirement-review-details/payment-review/other-details/payment-destination/payment-destination.component";
export { ChoosePaymentOptionsMatrixComponent } from "./components/payment-option/choose-payment-options-matrix/choose-payment-options-matrix.component";
export { ReviewPensionChoicesService } from "./services/review-pension-choices.service";
export { CompletedSuccessfullyDSService } from "./services/completed-successfully-data-save.service";
export { AuthorizeYourChoicesComponent } from "./components/authorize/authorize-your-choices";
export { CompletedSuccessfullyComponent } from "./components/complete/completed-successfully/completed-successfully.component";
export { IncomeTaxComponent } from "./components/income-tax/income-tax-component";
export { AuthorizationCommonComponent } from "./components/shared/authorization-common/authorization-common.component";
export { NextStepsComponent } from "./components/shared/authorization-common/next-steps/next-steps.component";
export { SummaryOfRequestComponent } from "./components/shared/authorization-common/summary-of-request/summary-of-request.component";
export { DynamicEditLoaderComponent } from "./components/shared/dynamic-edit-loader/dynamic-edit-loader.component";
export { DeferredSuccessfullyComponent } from "./components/deferred/deferred.component";
export { NoticeRightsReadOnlyComponent } from "./components/rights/noticerights-readonly/noticerights-readonly.component";
export { ChooseCategoryComponent } from "./components/payment-option/choose-category/choose-category.component";
export { SubmittedSuccessfullyComponent } from "./components/complete/submitted-successfully/submitted-successfully.component";
export { SaveChooseCategoryDataService } from "./services/save-choosecategory-data.service";
export { RightSideComponent } from "./components/shared/right-side-components/right-side-components.component";
export { DocumentsAndResourcesComponent } from "./components/shared/right-side-components/documents-and-resources/documents-and-resources.component";
export { QuestionsComponent } from "./components/shared/right-side-components/questions/questions.component";
export { ComparePaymentOptionsComponent } from "./components/shared/right-side-components/compare-payment-options/compare-payment-options.component";
export { PeopleLikeMeComponent } from "./components/shared/right-side-components/people-like-me/people-like-me.component";
export { ConsiderIraRolloverImpactComponent } from "./components/shared/right-side-components/consider-ira-rollover-impact/consider-ira-rollover-impact.component";
export { OtherResourcesComponent } from "./components/shared/right-side-components/other-resources/other-resources.component";
export { WantToAddAnotherBeneficiaryComponent } from "./components/shared/right-side-components/want-to-add-another-beneficiary/want-to-add-other-beneficiary.component";
export { RightSideContentService } from "./services/right-side-content.service";
export { DeferredSuccessfullyDSService } from "./services/deferred-successfully-data-save.service";
export { ProgressBarSaveDataSService } from "./services/dbcnq-progressbar-data-save.service";
export { DBCNQProgressBarComponent } from "./components/progress-bar/dbcnq-progress-bar.component";
export { RightRailSaveDataService } from "./services/dbcnq-right-rail-data-save.service";
export { RightRailComponent } from "./components/shared/dbcnq-right-rail/dbcnq-right-rail.component";
export { FootnoteService } from "./services/footnote-common.service";
export { FootnoteComponent } from "./components/shared/footnote-common/footnote-common-component";
export { ReviewPensionChoicesReadOnlyComponent } from "./components/review/review-pension-choices-readonly/review-pension-choices-readonly.component";
export { ProgressBarPopoverDataCacheService } from "./services/progressBarPopoverDataCache.service";
export { FederalWithholdingComponent } from "./components/federal-withholding/federal-withholding.component";
registerLocaleData(localeFr);

const routes: Routes = [{
    path: "web/:orgName/retirement-election",
    component: RetirementElectionComponent,
    children: [{
        path: "",
        component: NoticeRightsComponent
    }, {
        path: "pension-payment-summary", component: PensionPaymentSummaryComponent
    }, {
        path: "choose-payment-option", component: ChoosePaymentOptionComponent
    }, {
        path: "choose-category", component: ChooseCategoryComponent
    }, {
        path: "choose-payment-options-matrix", component: ChoosePaymentOptionsMatrixComponent
    }, {
        path: "rollover-amount", component: HowMuchToRolloverComponent
    }, {
        path: "cancelled", component: CancelledComponent
    }, {
        path: "rollover-destination", component: ReceiveRolloverComponent
    }, {
        path: "payment-destination", component: ReceivePaymentComponent
    }, {
        path: "review-choices", component: ReviewPensionChoicesComponent
    }, {
        path: "authorize-your-choices", component: AuthorizeYourChoicesComponent
    }, {
        path: "authorization-complete", component: CompletedSuccessfullyComponent
    }, {
        path: "income-tax", component: IncomeTaxComponent
    }, {
        path: "saved", component: SavedSuccessfullyComponent
    }, {
        path: "deferred", component: DeferredSuccessfullyComponent
    }, {
        path: "authorization-required", component: SubmittedSuccessfullyComponent
    }, {
        path: "federal-withholding", component: FederalWithholdingComponent
    }]
},{
    path: "web/:orgName/db-notice-of-rights",
    component: NoticeRightsReadOnlyComponent
},{
    path: "web/:orgName/db-election-review",
    component: ReviewPensionChoicesReadOnlyComponent
}];

export function getBaseUrl() {
    let bsehref_url = window.location.origin;
    return "/";
}
@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AlCoreModuleLibrary.forRoot(),
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    declarations: [
        RetirementElectionComponent,
        PensionPaymentSummaryComponent,
        ChoosePaymentOptionComponent,
        CustomAlPanelComponent,
        PanelSectionComponent,
        HypotheticalPanelSectionComponent,
        HowMuchToRolloverComponent,
        CancelledComponent,
        ProgressBarComponent,
        BenefitSectionComponent,
        RetirementElectionLazyComponent,
        ReceiveRolloverComponent,
        ReceivePaymentComponent,
        AddressDetailsComponent,
        EditMessagesComponent,
        ErrorComponent,
        NoticeRightsComponent,
        NoticeRightsCommonComponent,
        ReviewPensionChoicesComponent,
        RetirementReviewDetailsComponent,
        BeneficiariesComponent,
        NonQualifiedBenefitComponent,
        PaymentReviewComponent,
        PaymentTableComponent,
        OtherDetailsComponent,
        PaymentAmountComponent,
        EstimatedIncomeTaxComponent,
        TaxationInformationComponent,
        PaymentDestinationComponent,
        AuthorizeYourChoicesComponent,
        CompletedSuccessfullyComponent,
        IncomeTaxComponent,
        AuthorizationCommonComponent,
        NextStepsComponent,
        SummaryOfRequestComponent,
        SavedSuccessfullyComponent,
        DynamicEditLoaderComponent,
        DeferredSuccessfullyComponent,
        NoticeRightsReadOnlyComponent,
        ChooseCategoryComponent,
        SubmittedSuccessfullyComponent,
        RightSideComponent,
        DocumentsAndResourcesComponent,
        QuestionsComponent,
        ComparePaymentOptionsComponent,
        PeopleLikeMeComponent,
        ConsiderIraRolloverImpactComponent,
        OtherResourcesComponent,
        WantToAddAnotherBeneficiaryComponent,
        DBCNQProgressBarComponent,
        RightRailComponent,
        FootnoteComponent,
        ChoosePaymentOptionsMatrixComponent,
        ReviewPensionChoicesReadOnlyComponent,
        FederalWithholdingComponent,
        DbNqEnrollPaymentDestinationWcComponent,
        DbNqEnrollReviewPensionChoicesWcComponent,
        DbNqEnrollIncomeTaxWcComponent,
        DbNqEnrollCompletedSuccessfullyWcComponent,
        DbCashOutPaymentDestinationWcComponent,
        DbCashOutCompletedSuccessfullyWcComponent,
        DbCashOutWhereToReceiveRolloverPaymentWcComponent,
        DbCashOutOneTimeRolloverPaymentWcComponent,
        DbCashOutReviewPensionChoicesWcComponent,
        DbCashOutIncomeTaxWcComponent,
        FederalWithholdingWcComponent
    ],

    exports: [
        RetirementElectionComponent,
        PensionPaymentSummaryComponent,
        ChoosePaymentOptionComponent,
        RetirementElectionLazyComponent,
        CustomAlPanelComponent,
        PanelSectionComponent,
        HypotheticalPanelSectionComponent,
        HowMuchToRolloverComponent,
        CancelledComponent,
        ProgressBarComponent,
        BenefitSectionComponent,
        ReceiveRolloverComponent,
        ReceivePaymentComponent,
        AddressDetailsComponent,
        ErrorComponent,
        NoticeRightsComponent,
        ReviewPensionChoicesComponent,
        RetirementReviewDetailsComponent,
        BeneficiariesComponent,
        NonQualifiedBenefitComponent,
        PaymentReviewComponent,
        PaymentTableComponent,
        OtherDetailsComponent,
        PaymentAmountComponent,
        EstimatedIncomeTaxComponent,
        TaxationInformationComponent,
        PaymentDestinationComponent,
        AuthorizeYourChoicesComponent,
        CompletedSuccessfullyComponent,
        IncomeTaxComponent,
        AuthorizationCommonComponent,
        NextStepsComponent,
        SummaryOfRequestComponent,
        SavedSuccessfullyComponent,
        DynamicEditLoaderComponent,
        DeferredSuccessfullyComponent,
        NoticeRightsReadOnlyComponent,
        ChooseCategoryComponent,
        SubmittedSuccessfullyComponent,
        RightSideComponent,
        DocumentsAndResourcesComponent,
        QuestionsComponent,
        ComparePaymentOptionsComponent,
        PeopleLikeMeComponent,
        ConsiderIraRolloverImpactComponent,
        OtherResourcesComponent,
        WantToAddAnotherBeneficiaryComponent,
        DBCNQProgressBarComponent,
        RightRailComponent,
        FootnoteComponent,
        ChoosePaymentOptionsMatrixComponent,
        ReviewPensionChoicesReadOnlyComponent,
        DbNqEnrollPaymentDestinationWcComponent,
        DbNqEnrollReviewPensionChoicesWcComponent,
        DbNqEnrollIncomeTaxWcComponent,
        DbNqEnrollCompletedSuccessfullyWcComponent,
        DbCashOutPaymentDestinationWcComponent,
        DbCashOutCompletedSuccessfullyWcComponent,
        DbCashOutWhereToReceiveRolloverPaymentWcComponent,
        DbCashOutOneTimeRolloverPaymentWcComponent,
        DbCashOutReviewPensionChoicesWcComponent,
        DbCashOutIncomeTaxWcComponent,
        FederalWithholdingWcComponent

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [provideHttpClient(withInterceptorsFromDi()), {
        provide: APP_BASE_HREF,
        useFactory: getBaseUrl
    }, provideRouter(routes),
    RetirementElectionRestService,
    IntegrationCpoPpsService,
    AlPanelSectionService,
    SavePpsDataService,
    NextStepIndexService,
    RouterService,
    StepsActiveIndexService,
    EditMessagesService,
    ReviewPensionChoicesService,
    AuthorizationCommonService,
    SaveChooseCategoryDataService,
    CompletedSuccessfullyDSService,
    RightSideContentService,
    DeferredSuccessfullyDSService,
    ProgressBarSaveDataSService,
    RightRailSaveDataService,
    FootnoteService,
    ProgressBarPopoverDataCacheService]
})
export class RetirementElectionModule implements DoBootstrap {
    constructor(private injector: Injector) {
    }

    static forRoot(): ModuleWithProviders<RetirementElectionModule> {
        return {
            ngModule: RetirementElectionModule,
            providers: [provideHttpClient(withInterceptorsFromDi()), provideRouter(routes),
                RetirementElectionRestService,
                IntegrationCpoPpsService,
                AlPanelSectionService,
                SavePpsDataService,
                NextStepIndexService,
                RouterService,
                StepsActiveIndexService,
                EditMessagesService,
                ReviewPensionChoicesService,
                AuthorizationCommonService,
                SaveChooseCategoryDataService,
                CompletedSuccessfullyDSService,
                RightSideContentService,
                DeferredSuccessfullyDSService,
                ProgressBarSaveDataSService,
                RightRailSaveDataService,
                FootnoteService,
                ProgressBarPopoverDataCacheService
            ]
        };
    }

    ngDoBootstrap() {
        if (!customElements.get("al-retirement-election-lazy")) {
            const customElement = createCustomElement(RetirementElectionLazyComponent, { injector: this.injector });
            customElements.define("al-retirement-election-lazy", customElement);
        }
        if (!customElements.get("al-noticerights-readonly")) {
            const customElement = createCustomElement(NoticeRightsReadOnlyComponent, { injector: this.injector });
            customElements.define("al-noticerights-readonly", customElement);
        }
        if (!customElements.get("al-pension-choices-readonly")) {
            const customElement = createCustomElement(ReviewPensionChoicesReadOnlyComponent, { injector: this.injector });
            customElements.define("al-pension-choices-readonly", customElement);
        }
        if (!customElements.get("al-federal-withholding-wc")) {
            const customElement = createCustomElement(FederalWithholdingWcComponent, { injector: this.injector });
            customElements.define("al-federal-withholding-wc", customElement);
        }
        if (!customElements.get("db-nq-enroll-al-payment-destination-wc")) {
            const customElement = createCustomElement(DbNqEnrollPaymentDestinationWcComponent, { injector: this.injector });
            customElements.define("db-nq-enroll-al-payment-destination-wc", customElement);
        }
        if (!customElements.get("db-nq-enroll-al-pension-choices-wc")) {
            const customElement = createCustomElement(DbNqEnrollReviewPensionChoicesWcComponent, { injector: this.injector });
            customElements.define("db-nq-enroll-al-pension-choices-wc", customElement);
        }
        if (!customElements.get("db-nq-enroll-al-completed-successfully-wc")) {
            const customElement = createCustomElement(DbNqEnrollCompletedSuccessfullyWcComponent, { injector: this.injector });
            customElements.define("db-nq-enroll-al-completed-successfully-wc", customElement);
        }
        if (!customElements.get("db-nq-enroll-al-income-tax-wc")) {
            const customElement = createCustomElement(DbNqEnrollIncomeTaxWcComponent, { injector: this.injector });
            customElements.define("db-nq-enroll-al-income-tax-wc", customElement);
        }
        if (!customElements.get("db-cashout-payment-destination-wc")) {
            const customElement = createCustomElement(DbCashOutPaymentDestinationWcComponent, { injector: this.injector });
            customElements.define("db-cashout-payment-destination-wc", customElement);
        }
        if (!customElements.get("db-cashout-receive-rollover-payment-wc")) {
            const customElement = createCustomElement(DbCashOutWhereToReceiveRolloverPaymentWcComponent, { injector: this.injector });
            customElements.define("db-cashout-receive-rollover-payment-wc", customElement);
        }
        if (!customElements.get("db-cashout-onetime-rollover-payment-wc")) {
            const customElement = createCustomElement(DbCashOutOneTimeRolloverPaymentWcComponent, { injector: this.injector });
            customElements.define("db-cashout-onetime-rollover-payment-wc", customElement);
        }
        if (!customElements.get("db-cashout-review-pension-choices-wc")) {
            const customElement = createCustomElement(DbCashOutReviewPensionChoicesWcComponent, { injector: this.injector });
            customElements.define("db-cashout-review-pension-choices-wc", customElement);
        }
        if (!customElements.get("db-cashout-income-tax-wc")) {
            const customElement = createCustomElement(DbCashOutIncomeTaxWcComponent, { injector: this.injector });
            customElements.define("db-cashout-income-tax-wc", customElement);
        }
        if (!customElements.get("db-cashout-completed-successfully-wc")) {
            const customElement = createCustomElement(DbCashOutCompletedSuccessfullyWcComponent, { injector: this.injector });
            customElements.define("db-cashout-completed-successfully-wc", customElement);
        }
    }
}
