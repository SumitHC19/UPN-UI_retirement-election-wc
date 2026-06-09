import {  Injectable  } from "@angular/core";
import {  CacheStorageService, LoggingService, LoggingConstants  } from "@alight/core-utilities-lib";
import {  StepsActiveIndexService  } from "./steps-active-index-service";
import {  forkJoin , Observable  } from "rxjs";
import {  Router  } from "@angular/router";

@Injectable()
export class  ProgressBarPopoverDataCacheService {
    private isFormDataChanged = false;
    public popOverIDBData: any;
    public isMultiBeneSupported = false;

    ProgressbarStepCodeArray = [
        {
            stepCode: "VRYI",
            stepID: 1,
            gaTrackingName: "DbPrtlRtrmChoices020VerifyInfoPage",
            pageName: "VerifyYourInfo"
        },
        {
            stepCode: "DATS",
            stepID: 2,
            gaTrackingName: "DbPrtlRtrmChoices030ChooseRtrmDatesPage",
            pageName: "RetirementDates"
        },
        {
            stepCode: "BENE",
            stepID: 3,
            gaTrackingName: "DbPrtlRtrmChoices050PensionBenePage",
            pageName: "PensionBeneficiaries"
        },
        {
            stepCode: "NORS",
            stepID: 4,
            gaTrackingName: "DbPrtlRtrmChoices080NotcOfRightsPage",
            pageName: "NoticeOfRights"
        },
        {
            stepCode: "PAYT",
            stepID: 5,
            gaTrackingName: "DbPrtlRtrmChoices090OpfmSumPage",
            pageName: "PensionPaymentSummary"
        },
        {
            stepCode: "DEST",
            stepID: 6,
            gaTrackingName: "DbPrtlRtrmChoices130ChooWhereRcvPmtPage",
            gaTrackingNameRollover: "DbPrtlRtrmChoices120ChooWhereRcvRlvrPage",
            pageName: "PaymentDestination"
        },
        {
            stepCode: "REVW",
            stepID: 7,
            gaTrackingName: "DbPrtlRtrmChoices150ReviewChoicesPage",
            pageName: "Review"
        },
        {
            stepCode: "AUTH",
            stepID: 8,
            gaTrackingName: "DbPrtlRtrmChoices160AuthPage",
            pageName: "AuthorizeYourChoices"
        }
    ];

    ProgressbarStepDetailsArray = {
        VRYI: {
            routePath: ""
        },
        DATS: {
            routePath: ""
        },
        BENE: {
            routePath: ""
        },
        NORS: {
            routePath: ""
        },
        PAYT: {
            routePath: "pension-payment-summary"
        },
        DEST: {
            RLVD: {
                routePath: "rollover-destination"
            },
            PMTD: {
                routePath: "payment-destination"
            }
        },
        REVW: {
            routePath: ""
        }
    };

    constructor(private cacheStorageService: CacheStorageService,
        private logger: LoggingService,
        private stepsActiveIndexService: StepsActiveIndexService,
        private router: Router) {
    }
    setPBStepCodeArray() {
        if (this.isMultiBeneSupported) {
            this.ProgressbarStepCodeArray.splice(2, 1);
        }
    }
    /**
     * @method setProgressBarPopoverDataInCache
     * @param key
     * @param value
     * gets the key value pair as param and stores in IDB using cache service
     */
    setProgressBarPopoverDataInCache(key, value) {
        this.cacheStorageService.setItem(key, value, "ActiveProgressBarStore")
            .subscribe(
                (response: any) => {
                    this.logger._debug("Response :" + JSON.stringify(response) , "Item " + key + " added in ActiveProgressBarStore successfully", LoggingConstants.INFO, "Retirement election - progressBarPopoverDataCacheService");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error("Response :" + JSON.stringify(error), "Adding Item "  + key + " in ActiveProgressBarStore failed", LoggingConstants.ERROR, "Retirement election - progressBarPopoverDataCacheService");
                }
            );
    }
    /**
     * @method getProgressBarPopoverDataInCache
     * Creates a array of observables returned by cache service getItem method ( from 1 to current active index )
     * Returns the observables
     */
    getProgressBarPopoverDataInCache(): Observable<Object> {
        let activeIndex = this.stepsActiveIndexService.getActiveIndexStepID();
        let observables = [];
        for (let i = 0; i < activeIndex; i++) {
            observables.push(this.cacheStorageService.getItem(this.ProgressbarStepCodeArray[i].stepCode, "ActiveProgressBarStore"));
        }
        return forkJoin(observables);
    }
    /**
     * @method clearProgressBarPopoverDataInCache
     * Clears the store ActiveProgressBarStore
     * using cache service
     */

    clearProgressBarPopoverDataInCache(clearAllStepCode, clearCurrentStepId ) {
        let currentStepCode;
        if (clearAllStepCode) {
            this.cacheStorageService.clearCache(["ActiveProgressBarStore"]).subscribe(
                (response: any) => {
                    this.logger._debug("Response :" + JSON.stringify(response), "Cleared the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "Retirement election - progressBarPopoverDataCacheService");
                },
                /* istanbul ignore next */
                (error) => {
                    this.logger._error("Response :" + JSON.stringify(error), "Failed to clear the ActiveProgressBarStore", LoggingConstants.ERROR, "Retirement election - progressBarPopoverDataCacheService");
                }
            );
        } else {
            /* istanbul ignore next */
            for (let i = 0; i < this.ProgressbarStepCodeArray.length; i++) {
                for (let j = 0; j < clearCurrentStepId.length; j++) {
                    if ( clearCurrentStepId[j] === this.ProgressbarStepCodeArray[i].stepID ) {
                        currentStepCode = this.ProgressbarStepCodeArray[i].stepCode;
                        this.cacheStorageService.removeItem(currentStepCode, "ActiveProgressBarStore").subscribe(
                            (response: any) => {
                                this.logger._debug("Response :" + JSON.stringify(response), "Cleared the  ActiveProgressBarStore successfully", LoggingConstants.INFO, "Retirement election - progressBarPopoverDataCacheService");
                            },
                            /* istanbul ignore next */
                            (error) => {
                                this.logger._error("Response :" + JSON.stringify(error), "Failed to clear the ActiveProgressBarStore", LoggingConstants.ERROR, "Retirement election - progressBarPopoverDataCacheService");
                            }
                        );
                    }
                }
            }
        }
    }
    /**
     * @method checkProgressBarPopoverDataExistsInCache
     * @param key
     * Return a boolean value based on whether the given key is available in IDB or not
     */
    checkProgressBarPopoverDataExistsInCache(key): boolean {
        let isValidDataAvailable = false;
        if (this.popOverIDBData !== undefined && Array.isArray(this.popOverIDBData)) {
            let index = this.popOverIDBData.findIndex((item) => {
                if (item !== undefined && item.hasOwnProperty("stepCode") && item.stepCode === key) {
                    return item;
                }
            });
            if (index !== -1) {
                if (this.popOverIDBData[index].hasOwnProperty("hasError") && !this.popOverIDBData[index].hasError) {
                    isValidDataAvailable = true;
                }
            }
        }
        return isValidDataAvailable;
    }

    /**
 * @method setFormDataChanged
 * @method getFormDataChanged
 * method to indicate component value changes. will be used for future if dynamic popovers are implemented in DbElec */
    setFormDataChanged(response) {
        this.isFormDataChanged = false;
        if ( this.isFormDataChanged !== undefined ) {
            this.isFormDataChanged = response;
        }
    }
    getFormDataChanged() {
        if (this.isFormDataChanged !== undefined) {
            return this.isFormDataChanged;
        }
    }


    /**
     * @method getCurrentPageName
     * processes the current active route path and returns the current active page route name
     */
    getCurrentPageName() {
        let currentActivePage = "";
        let url = this.router.url;
        if (url.indexOf("?") !== -1) {
            url = url.slice(0, url.indexOf("?"));
        }
        url = url.slice(url.lastIndexOf("/") + 1);
        /* istanbul ignore next */
        switch (url) {
            case "pension-payment-summary":
                currentActivePage = "PensionPaymentSummary";
                break;
            case "choose-payment-option":
                currentActivePage = "ChoosePaymentOption";
                break;
            case "choose-category":
                currentActivePage = "ChooseCategory";
                break;
            case "choose-payment-options-matrix":
                currentActivePage = "ChoosePaymentOptionsMatrix";
                break;
            case "rollover-amount":
                currentActivePage = "HowMuchToRollover";
                break;
            case "rollover-destination":
                currentActivePage = "RolloverDestination";
                break;
            case "payment-destination":
                currentActivePage = "PaymentDestination";
                break;
            case "review-choices":
                currentActivePage = "Review";
                break;
            case "income-tax":
                currentActivePage = "IncomeTaxWithHolding";
                break;
            case "federal-withholding":
                currentActivePage = "FederalWithholding";
                break;
        }

        return currentActivePage;
    }
}
