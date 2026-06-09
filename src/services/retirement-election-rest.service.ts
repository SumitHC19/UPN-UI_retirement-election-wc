import { of, catchError, map, Observable, Subject } from "rxjs";
import { IUrlOptions, DomStorageFallbackService, GoogleAnalyticsService, RemoteService, GenericService, LoggingService, LoggingConstants, AppUtility, DynamicComponentService, CacheStorageService } from "@alight/core-utilities-lib";
import { Injectable, NgZone, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ViewRhrComponentsModel } from "../components/shared/models/view-rhr-components.model";
import { DeferredSuccessfullyDSService } from "./deferred-successfully-data-save.service";
import { ProgressBarSaveDataSService } from "./dbcnq-progressbar-data-save.service";
import { RightRailSaveDataService } from "./dbcnq-right-rail-data-save.service";
import { StepsActiveIndexService } from "./steps-active-index-service";
import { ProgressBarPopoverDataCacheService } from "./progressBarPopoverDataCache.service";
import { FormatTocheck } from "../constants/locale";
import { HttpResponse } from "@angular/common/http";
import { RouteChildHelper } from "src/components/web-components/navigate-from-child-helper";
// declare var require: any;

@Injectable()
export class RetirementElectionRestService implements OnDestroy {
    public choosePaymentOptionResponse: any;
    /**
   * query parameters to be passed to service starts with ?
   */
    queryParameters: any;
    mockPaymentElectionScenario: any;
    mockScenario: any;
    udpMockScenario: any;
    mocked: any;
    mockDateScenario: any;
    public orgName: any;
    endPoint = "";
    mockPlanId: any;
    mockElectionId: any;
    mockElectionGroupId: any;
    isFromAuthorizationPage = true;
    systemTickets: any;
    isDbNQFlag = false;
    public AuthorizePageSubject = new Subject();
    public AuthorizeButtonSubject = new Subject();
    public popoverDataSubject = new Subject();
    public noticeRightsSetSystemTicket: any;
    public ViewRhrComponents = new ViewRhrComponentsModel();
    public beforePrintHandlers: (() => void)[] = [];
    public afterPrintHandlers: (() => void)[] = [];

    editHandlingInstructions = {
        "globalOverride": true
    };
    isActivePBEnabled = false;
    isMultiBeneSupported = false;
    popoverStepIds: String;
    isPaymentCall = false;
    isCurrentStepRolloverDest = false;
    showQuitButton = true;
    showCBLButton = true;
    businessProcessId: any;
    cmiretProcessId: any;
    hubProcessId: any;
    private formatTocheck = FormatTocheck;
    /**
   * End point of the micro service
   * your need not to pass host:port that is handled by uicore.
   */

    /**
   * flag to enable disbale cache for the whole service
   */
    enableCache = true;

    /**
   * key where the cache has to be stored
   * you can find file with this key in indexDb of browser.
   */
    templateCacheKey = "templateCacheKey";
    /**
  * Prefix for endpoint for cashout service
  */
    cashoutEndPointPrefix = "channel/dbretirementelectionwidgets/";
    postCallData: any;
    /**
   * Standard constructor code to do
   * the dependency injection.
   *
  //  * @param remoteService remote service of uicore.
  //  * @param logger logger service to be used for logging.
  //  */
    constructor(private router: Router,
        private remoteService: RemoteService,
        private logger: LoggingService,
        private genericService: GenericService,
        private domStorageFallbackService: DomStorageFallbackService,
        private loggingService: LoggingService,
        private appUtility: AppUtility,
        private gaService: GoogleAnalyticsService,
        private deferredSuccessfullyDSService: DeferredSuccessfullyDSService,
        private activatedRoute: ActivatedRoute,
        private progressBarSaveDataSService: ProgressBarSaveDataSService,
        private rightRailSaveDataSService: RightRailSaveDataService,
        private dynamicComponentService: DynamicComponentService,
        private stepsActiveIndexService: StepsActiveIndexService,
        private cacheService: CacheStorageService,
        private ngZone: NgZone,
        private PBPopoverDataCacheService: ProgressBarPopoverDataCacheService) {
        this.orgName = this.genericService.getOrgName();
        this.getQueryParameters();
        this.dynamicComponentService.initializePageComponents();
        window.onafterprint = () => {
            this.handleAfterPrint();
        };
        window.onbeforeprint = () => {
            this.handleBeforePrint();
        };
    }
    /* istanbul ignore next */
    getPdfPopService(mailBoxItemId: any, businessProcessReferenceId: any) {
        let endPoint = "channel/dbretirementelectionwidgets/retirementKitPdfWidget/" + businessProcessReferenceId + "/spm/" + mailBoxItemId;
        let IUrlOptions = this.getRequestParameters(endPoint);
        return this.remoteService.request("get", this.getRequestParameters(endPoint), null, null, null, true, "blob").pipe(map((response: HttpResponse<any>) => {
            return response["body"];
        }));
    }
    /* istanbul ignore next */
    downloadBlobFile(blob: Blob, filename: string, extension: string) {
        const fileName = `${filename}.${extension}`;
        if (navigator && (navigator as any).msSaveBlob) {
            (navigator as any).msSaveBlob(blob, fileName);
        } else {
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            if (link.download !== undefined) {
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.setAttribute("target", "_blank");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
            } else {
                /* eslint-disable no-unused-expressions */
                ((error) => {
                    // /* istanbul ignore next */
                    this.logger._debug(JSON.stringify(error), "Error in DcAftertaxRothComponent post call response", LoggingConstants.INFO, "DcAftertaxRothComponent WC - DcAftertaxRothComponent Component");
                });
            }
            document.body.removeChild(link);
        }
    }
    /**
   * This mehtod can be renamed as per need
   * but the standard operation this mehtod does
   * is to hit the microservice, return the listener
   * of the response and cache the response (if flag is on)
   */

    getRequestParameters(targetEndPoint): IUrlOptions {
        let options: IUrlOptions = {
            restOfUrl: this.queryParameters,
            endPoint: targetEndPoint,
            isSecure: true,
            contentType: "application/json",
            customHeader: []
        };
        return options;
    }

    getRequestParametersSave(targetEndPoint): IUrlOptions {
        let options: IUrlOptions = {
            restOfUrl: "",
            endPoint: targetEndPoint,
            isSecure: true,
            contentType: "application/json",
            customHeader: []
        };
        return options;
    }

    getRequestParametersReviewSave(targetEndPoint, addCustomheader): IUrlOptions {
        let options: IUrlOptions = {
            restOfUrl: "",
            endPoint: targetEndPoint,
            isSecure: true,
            contentType: "application/json",
            customHeader: addCustomheader ? this.getCustomHeader() : ""
        };
        return options;
    }
    isNullOrUndefinedOrBlank(value) {
        return value === null || value === undefined || value === "" || value === "null";
    }
    getbusinessProcessId() {
        this.cmiretProcessId = sessionStorage.getItem("dbElecProcessId");
        this.hubProcessId = sessionStorage.getItem("dbRtrmProcessId");
        if (!this.isNullOrUndefinedOrBlank(this.cmiretProcessId)) {
            this.businessProcessId = this.cmiretProcessId;
        } else if (!this.isNullOrUndefinedOrBlank(this.hubProcessId)) {
            this.businessProcessId = this.hubProcessId;
        } else {
            this.businessProcessId = "123";
        }
    }
    pensionPaymentSummaryService(): Observable<any> {
        this.getbusinessProcessId();
        // this.queryParameters = queryParameters;
        this.removeEditHandlingInstructions();
        let endPoint = "channel/dbretirementelectionwidgets/pensionPaymentSummaryWidget/" + this.businessProcessId + "?";
        let IUrlOptions = this.getRequestParameters(endPoint);
        if (this.isActivePBEnabled) {
            this.isPaymentCall = false;
            IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
        }
        /* let mockConfig = require('./al-assets/data/ppsMatrixPage.json');
    return of(mockConfig); */
        return this.remoteService.request("get", IUrlOptions, null, "", "", true)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    /* pensionPaymentSummaryService1(): Observable<any> {
     let mockConfig = require('./al-assets/data/ppsMatrixPage.json');
     return of(mockConfig);
   } */
    pensionPaymentSummarySaveService(deferredFlag, saveApiRequestBody: any, businessProcessReferenceId: any, buttonActionType, hasTbaEdit: boolean): Observable<any> {
        let endPointActionType;
        if (buttonActionType === true && deferredFlag === true) {
            endPointActionType = "continue";
        } else if (buttonActionType === false && deferredFlag === true) {
            endPointActionType = "comeBackLater";
        } else {
            endPointActionType = "deferAll";
        }
        if (hasTbaEdit) {
            this.overrideEdits();
        }
        let endPoint = "channel/dbretirementelectionwidgets/pensionPaymentSummaryWidget/" + businessProcessReferenceId + "/reviseOptionalFormChoices/" + endPointActionType;
        let IUrlOptions = this.getRequestParametersSave(endPoint);
        return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    return res;
                }));
    }

    /* choosePaymentOptionService(): Observable<Object> {
      let mockConfig = require('./al-assets/data/ManyOptionalFormsNew.json');
      this.choosePaymentOptionResponse = mockConfig;
      return of(mockConfig);
    } */
    /* istanbul ignore next */
    choosePaymentOptionServiceParams(planId, electionId, electionGroupId, calculationReferenceNumber): Observable<Object> {
        this.removeSystemTickets();
        let endPoint;
        if (this.queryParameters.includes("planId=") && this.queryParameters.includes("electionId=") && this.queryParameters.includes("electionGroupId=")) {
            endPoint = "channel/dbretirementelectionwidgets/choosePaymentOptionWidget/0?";
        } else {
            endPoint = "channel/dbretirementelectionwidgets/choosePaymentOptionWidget/0?planId=" + planId + "&electionId=" + electionId + "&electionGroupId=" + electionGroupId + "&calculationReferenceNumber=" + calculationReferenceNumber + "&";
        }
        let IUrlOptions = this.getRequestParameters(endPoint);
        return this.remoteService.getRequest(IUrlOptions)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    this.choosePaymentOptionResponse = res;
                    return res;
                }));
    }

    getChoosePaymentOptionData() {
        return of(this.choosePaymentOptionResponse);
    }
    howMuchRollOverdataService(isCashoutFlag): Observable<any> {
        if (isCashoutFlag) {
            this.removeEditHandlingInstructions();
            let queryParameters = "?benefitEligbleToRollover=" + sessionStorage.getItem("benefitEligbleToRollover");
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutHowMuchToRolloverWidget/" + dbCashoutBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), null, null, null, true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: any) => {
                        return res;
                    })), true, this.activatedRoute, isCashoutFlag, false);
        } else {
            this.removeEditHandlingInstructions();
            let endPoint = "channel/dbretirementelectionwidgets/howMuchToRolloverWidget/123?";
            let IUrlOptions = this.getRequestParameters(endPoint);
            if (this.isActivePBEnabled) {
                this.isPaymentCall = false;
                IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
            }
            /* let mockConfig = require('./al-assets/data/choosehowmuchtorolloverlldresponse.json');
      return of(mockConfig); */
            return this.remoteService.request("get", IUrlOptions, null, "", "", true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: Response) => {
                        return res;
                    }));
        }
    }

    rolloverDestinationServices(isCashoutFlag): Observable<any> {
        if (isCashoutFlag) {
            this.removeEditHandlingInstructions();
            let dbCashoutRefreshDetails = (sessionStorage.getItem("dbCashoutRefreshDetails") === "REFR_ADDR") ? "RefreshAddress" : null;
            let queryParameters = "?benefitEligbleToRollover=" + sessionStorage.getItem("benefitEligbleToRollover") + "&retirementStep=" + dbCashoutRefreshDetails;
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutRolloverDestinationWidget/" + dbCashoutBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), null, null, null, true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: any) => {
                        return res;
                    })), true, this.activatedRoute, isCashoutFlag, false);
        } else {
            this.removeEditHandlingInstructions();
            let endPoint = "channel/dbretirementelectionwidgets/rolloverDestinationWidget/0?";
            let IUrlOptions = this.getRequestParameters(endPoint);
            if (this.isActivePBEnabled) {
                this.isPaymentCall = true;
                IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
            }
            return this.remoteService.request("get", IUrlOptions, null, "", "", true)
                .pipe(map
                /* istanbul ignore next */
                ((res: Response) => {
                    return res;
                })
                );
        }
    }


    /*   howMuchRollOverdataService(): Observable<any> {
      let mockConfig = require('./al-assets/data/choosehowmuchtorolloverlldresponse.json');
      return of(mockConfig);
  } */

    chooseCategorydataService(planId, electionGroupId): Observable<Object> {
        let endPoint;
        if (this.queryParameters.includes("planId=") && this.queryParameters.includes("electionGroupId=")) {
            endPoint = "channel/dbretirementelectionwidgets/chooseElectionGroupWidget/0?";
        } else {
            endPoint = "channel/dbretirementelectionwidgets/chooseElectionGroupWidget/0?planId=" + planId + "&electionGroupId=" + electionGroupId + "&";
        }
        let IUrlOptions = this.getRequestParameters(endPoint);
        return this.remoteService.request("get", IUrlOptions, null, "", "", true)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    return res;
                }));
    }

    /* chooseCategorydataService(planId, electionGroupId): Observable<any> {
    let mockConfig = require('./al-assets/data/choosecategorydata.json');
    return of(mockConfig);
  } */

    receivePaymentService(isCashoutFlag, isDbNQFlag): Observable<any> {
        if (isCashoutFlag) {
            this.removeEditHandlingInstructions();
            let dbCashoutRefreshDetails = (sessionStorage.getItem("dbCashoutRefreshDetails") === "REFR_ADDR") ? "RefreshAddress" : null;
            let queryParameters = "?benefitEligbleToRollover=" + sessionStorage.getItem("benefitEligbleToRollover") + "&retirementStep=" + dbCashoutRefreshDetails;
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutPaymentDestinationWidget/" + dbCashoutBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), null, null, null, true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: any) => {
                        return res;
                    })), true, this.activatedRoute, isCashoutFlag, isDbNQFlag);
        } else if (isDbNQFlag) {
            //  return this.getJSONData('db_nq_payment_destination_channel');
            let queryParameters = "?retirementStep=" + sessionStorage.getItem("dbNQEnrollmentRefreshAddress");
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedPaymentDestinationWidget/" + dbNqEnrollmentBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), null, null, null, true)
                .pipe(map
                /* istanbul ignore next */
                ((res: any) => {
                    return res;
                })
                ), true, this.activatedRoute, isCashoutFlag, isDbNQFlag);
        } else {
            this.removeEditHandlingInstructions();
            let endPoint = "channel/dbretirementelectionwidgets/paymentDestinationWidget/0?";
            let IUrlOptions = this.getRequestParameters(endPoint);
            if (this.isActivePBEnabled) {
                this.isPaymentCall = true;
                IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
            }
            return this.remoteService.request("get", IUrlOptions, null, "", "", true)
                .pipe(map
                /* istanbul ignore next */
                ((res: Response) => {
                    return res;
                })
                );
        }
    }


    /* mock methods below - DO NOT DELETE and DO NOT ANYTHING BELOW THIS SECTION */
    /* istanbul ignore next */
    getJSONData(jsonFileName) {

        // let mockConfig = require('./al-assets/data/db_nq_payment_destination_channel.json');
        // return of(mockConfig);

        // let jsonurl = 'al-assets/data/' + jsonFileName + '.json';
        // return this.http.get(jsonurl)
        //   .pipe(map(/* istanbul ignore next */(res: any) => {
        //     return res;
        //   }));
    }
    /* END - mock methods */

    /*   receivePaymentService1() {
      let mockConfig = require('./al-assets/data/paymentdestination.json');
      return of(mockConfig);
    } */

    /* noticeOfRightsService() {
    let mockConfig = require('./al-assets/data/noticeofrights.json');
    return of(mockConfig);
  } */

    noticeOfRightsService() {
        this.getbusinessProcessId();
        let endPoint = "channel/dbretirementelectionwidgets/yourNoticeOfRightsWidget/" + this.businessProcessId + "/getNoticeOfRights?";
        let IUrlOptions = this.getRequestParameters(endPoint);
        if (this.isActivePBEnabled) {
            this.isPaymentCall = false;
            IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
        }
        /* let mockConfig = require('./al-assets/data/noticeofrights.json');
    return of(mockConfig); */
        return this.remoteService.getRequest(IUrlOptions)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    return res;
                }));
    }

    howMuchRollOverSaveService(saveApiRequestBody: any, businessprocessid: any, buttonActionType, isDbCashoutFlag: boolean, hasTbaEdit: boolean): Observable<any> {
        let endPointActionType;
        if (buttonActionType) {
            endPointActionType = "continue";
        } else {
            endPointActionType = "comeBackLater";
        }
        if (isDbCashoutFlag) {
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            this.endPoint = this.cashoutEndPointPrefix + "cashoutHowMuchToRolloverWidget/" + dbCashoutBusinessProcessReferenceId + "/paymentElections/continue";
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: any) => {
                        this.putSystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                        return res;
                    })), true, this.activatedRoute, isDbCashoutFlag, false);
        } else {
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            let endPoint = "channel/dbretirementelectionwidgets/howMuchToRolloverWidget/" + businessprocessid + "/paymentElections/" + endPointActionType;
            let IUrlOptions = this.getRequestParametersSave(endPoint);
            return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: Response) => {
                        return res;
                    }));
        }
    }
    // rolloverDestinationServices() {
    //   let endPoint = 'channel/dbretirementelectionwidgets/rolloverDestinationWidget/0?';
    //   let IUrlOptions = this.getRequestParameters(endPoint);
    //   return this.remoteService.request('get', IUrlOptions, null, '', '', true)
    //     .pipe(map((res: Response) => {
    //       return res;
    //     }));
    // }

    /* rolloverDestinationServices(): Observable<Object> {
    let mockConfig = require('./al-assets/data/chooseyourrolloverdestination.json');
        return of(mockConfig);
  } */
    noticeOfRightsSaveService(saveApiRequestBody: any, businessprocessid: any, buttonActionType: boolean, hasTbaEdit: boolean): Observable<any> {
        let endPointActionType = (buttonActionType === true) ? "continue" : "comeBackLater";
        let endPoint = "channel/dbretirementelectionwidgets/yourNoticeOfRightsWidget/" + businessprocessid + "/reviseNoticeOfRights/" + endPointActionType;
        let IUrlOptions = this.getRequestParametersSave(endPoint);
        return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    return res;
                }));
    }
    rolloverDestinationSaveServices(saveApiRequestBody: any, businessprocessid: any, buttonActionType: any, isDbCashoutFlag: boolean, hasTbaEdit: boolean): Observable<any> {
        let endPointActionType;
        if (buttonActionType) {
            endPointActionType = "continue";
        } else {
            endPointActionType = "comeBackLater";
        }
        if (isDbCashoutFlag) {
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            this.endPoint = this.cashoutEndPointPrefix + "cashoutRolloverDestinationWidget/" + dbCashoutBusinessProcessReferenceId + "/paymentElections/continue";
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map
                /* istanbul ignore next */
                ((res: any) => {
                    this.putSystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                    return res;
                })
                ), true, this.activatedRoute, isDbCashoutFlag, false);
        } else {
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            let endPoint = "channel/dbretirementelectionwidgets/rolloverDestinationWidget/" + businessprocessid + "/paymentElections/" + endPointActionType;
            let IUrlOptions = this.getRequestParametersSave(endPoint);
            return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: Response) => {
                        return res;
                    }));
        }
    }

    /* istanbul ignore next */
    paymentDestinationSaveServices(saveApiRequestBody: any, businessprocessid: any, buttonActionType: any, isDbCashoutFlag: boolean, hasTbaEdit: boolean, isDbNQFlag: boolean): Observable<any> {
        let endPointActionType;
        if (buttonActionType) {
            endPointActionType = "continue";
        } else {
            endPointActionType = "comeBackLater";
        }
        if (isDbNQFlag) {
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedPaymentDestinationWidget/" + dbNqEnrollmentBusinessProcessReferenceId + "/paymentElections/continue";
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: any) => {
                        this.putNQESystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                        return res;
                    })), true, this.activatedRoute, isDbCashoutFlag, isDbNQFlag);
        } else if (isDbCashoutFlag) {
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            this.endPoint = this.cashoutEndPointPrefix + "cashoutPaymentDestinationWidget/" + dbCashoutBusinessProcessReferenceId + "/paymentElections/continue";
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map((res: any) => {
                    this.putSystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                    return res;
                })), true, this.activatedRoute, isDbCashoutFlag, false);
        } else {
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            let endPoint = "channel/dbretirementelectionwidgets/paymentDestinationWidget/" + businessprocessid + "/paymentElections/" + endPointActionType;
            let IUrlOptions = this.getRequestParametersSave(endPoint);
            return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
                .pipe(map((res: Response) => {
                    return res;
                })
                );
        }
    }
    incomeTaxWithHoldingServices(paymentId, buttonActionType, isCashoutFlag, isDbNQFlag) {
        if (isCashoutFlag) {
            this.removeEditHandlingInstructions();
            let queryParameters = "?paymentId=" + paymentId;
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutChangeYourIncomeTaxWithholdingWidget/" + dbCashoutBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), null, null, null, true)
                .pipe(map((res: any) => {
                    return res;
                })), true, this.activatedRoute, isCashoutFlag, isDbNQFlag);
        } else if (isDbNQFlag) {
            this.removeEditHandlingInstructions();
            let queryParameters = "?paymentId=" + paymentId;
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedChangeYourIncomeTaxWithholdingWidget/" + dbNqEnrollmentBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), null, null, null, true)
                .pipe(map((res: any) => {
                    return res;
                })), true, this.activatedRoute, isCashoutFlag, isDbNQFlag);
        } else {
            let endPoint;
            this.removeEditHandlingInstructions();
            let incometaxSystemTickets = this.domStorageFallbackService.getItem("incomeTaxSystemTickets", "sessionStorage", true);
            if (incometaxSystemTickets !== undefined && incometaxSystemTickets !== null) {
                this.setSystemTicketsDOM(JSON.parse(incometaxSystemTickets));
            }
            if (!buttonActionType) {
                endPoint = "channel/dbretirementelectionwidgets/changeYourIncomeTaxWithholdingWidget/123?paymentId=" + paymentId + "&retirementStep=" + "UseState" + "";
            } else {
                if (this.queryParameters.includes("paymentId=")) {
                    endPoint = "channel/dbretirementelectionwidgets/changeYourIncomeTaxWithholdingWidget/123?";
                } else {
                    endPoint = "channel/dbretirementelectionwidgets/changeYourIncomeTaxWithholdingWidget/123?paymentId=" + paymentId + "&";
                }
            }
            let IUrlOptions = this.getRequestParameters(endPoint);
            return this.remoteService.request("get", IUrlOptions, null, "", "", true)
                .pipe(map((res: Response) => {
                    return res;
                }));
        }
    }
    incomeTaxWithHoldingSaveServices(saveApiRequestBody: any, businessprocessid: any, buttonActionType: any, isDbCashoutFlag: boolean, isDbNQFlag: boolean, hasTbaEdit: boolean): Observable<any> {
        let endPointActionType;
        if (buttonActionType) {
            endPointActionType = "continue";
        } else {
            endPointActionType = "useState";
        }
        if (isDbCashoutFlag) {
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            this.endPoint = this.cashoutEndPointPrefix + "cashoutChangeYourIncomeTaxWithholdingWidget/" + dbCashoutBusinessProcessReferenceId + "/paymentElections/" + endPointActionType;
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map((res: any) => {
                    this.putSystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                    return res;
                })), true, this.activatedRoute, isDbCashoutFlag, isDbNQFlag);
        } else if (isDbNQFlag) {
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedChangeYourIncomeTaxWithholdingWidget/" + dbNqEnrollmentBusinessProcessReferenceId + "/paymentElections/" + endPointActionType;
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map((res: any) => {
                    this.putNQESystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                    return res;
                })), true, this.activatedRoute, isDbCashoutFlag, isDbNQFlag);
        } else {
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            let endPoint = "channel/dbretirementelectionwidgets/changeYourIncomeTaxWithholdingWidget/" + businessprocessid + "/paymentElections/" + endPointActionType;
            let IUrlOptions = this.getRequestParametersSave(endPoint);
            return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
                .pipe(map((res: Response) => {
                    return res;
                }));
        }
    }
    getCommonContent(): Observable<Object> {
        let options: IUrlOptions = {
            restOfUrl: "",
            endPoint: "channel/widgetconfigurations/channel/widgetConfigurations/retirementchoice",
            isSecure: true,
            contentType: "application/json"
        };
        return this.remoteService
            .request("get", options)
            .pipe(map((res: Object) => {
                return res;
            }));
    }
    onCancelService(pRequestBody: any, businessprocessid: any) {
        this.removeSystemTickets();
        const options: IUrlOptions = {
            restOfUrl: "",
            endPoint:
                "channel/definedbenefitsretirementwidgets/dbRetirementV2RetirementHubWidget/123/Dates/cancel",
            isSecure: true,
            contentType: "application/json"
        };
        return this.remoteService
            .request("put", options, JSON.stringify(pRequestBody), "", "", true)
            .pipe(map((res: Response) => {
                return res;
            }));
    }
    reviewYourPensionChoice(isFromAuthPage: boolean, isDbCashoutFlag: boolean, isDbNQFlag: boolean): Observable<Object> {
        if (isDbCashoutFlag) {
            this.removeEditHandlingInstructions();
            let queryParameters = "?benefitEligbleToRollover=" + sessionStorage.getItem("benefitEligbleToRollover");
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutReviewYourPensionChoicesWidget/" + dbCashoutBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), null, null, null, true)
                .pipe(map((res: any) => {
                    return res;
                })), true, this.activatedRoute, isDbCashoutFlag, isDbNQFlag);
        } else if (isDbNQFlag) {

            //  let mockConfig = require('./al-assets/data/DBNQ_channel_Review.json');
            //  return of(mockConfig);
            /* istanbul ignore next */
            this.removeEditHandlingInstructions();
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            this.isDbNQFlag = isDbNQFlag;
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedReviewYourPensionChoicesWidget/" + dbNqEnrollmentBusinessProcessReferenceId + "?retirementStep=null";
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader("",
                this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), null, null, null, true)
                .pipe(map((res: any) => {
                    return res;
                })), true, this.activatedRoute, isDbCashoutFlag, isDbNQFlag);
        } else {
            this.removeEditHandlingInstructions();
            let endPoint = "channel/dbretirementelectionwidgets/reviewYourPensionChoicesWidget/123?";
            let IUrlOptions = this.getRequestParameters(endPoint);
            if (isFromAuthPage) {
                IUrlOptions.restOfUrl = "retirementStep=ReviewReturn";
            } else {
                if (this.isActivePBEnabled) {
                    this.isPaymentCall = false;
                    IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
                }
            }
            return this.remoteService.request("get", IUrlOptions, null, "", "", true)
                .pipe(map((res: Response) => {
                    return res;
                }));
        }

    }

    /* reviewYourPensionChoice(isFromAuthPage: boolean, isDbCashoutFlag: boolean, isRoutedToSUA: boolean): Observable<Object> {
    let mockConfig = require('./al-assets/data/reviewyourpensionchoice.json');
        return of(mockConfig);
  } */
    authorizeYourChoicesService(): Observable<Object> {
        /*    let mockConfig = require('./al-assets/data/authorizeyourpage.json');
            return of(mockConfig); */
        this.removeEditHandlingInstructions();
        let endPoint = "channel/dbretirementelectionwidgets/authorizeYourChoicesWidget/0?";
        let IUrlOptions = this.getRequestParameters(endPoint);
        if (this.isActivePBEnabled) {
            this.isPaymentCall = false;
            IUrlOptions.restOfUrl = this.setRequestParamProgressBarPopver(IUrlOptions.restOfUrl);
        }
        return this.remoteService.request("get", IUrlOptions, null, "", "", true)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    authorizeYourChoicesSaveService(saveApiRequestBody: any, buttonActionType: boolean, businessprocessid: any, hasTbaEdit: boolean): Observable<any> {
        let endPointActionType = buttonActionType ? "continue" : "comeBackLater";
        let endPoint = "channel/dbretirementelectionwidgets/authorizeYourChoicesWidget/" + businessprocessid + "/revisePensionElectionAuthorization/" + endPointActionType;
        let IUrlOptions = this.getRequestParametersSave(endPoint);
        if (hasTbaEdit) {
            this.overrideEdits();
        }
        return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    /**
   * Calls config service and returns the response
   * @method getRightSideContent
  */
    getRightSideContent() {
        /* let mockConfig = require('./al-assets/data/common.json');
        return of(mockConfig); */
        let options: IUrlOptions = {
            restOfUrl: "",
            endPoint: "channel/widgetconfigurations/channel/widgetConfigurations/retirementelectionrighthandrail",
            isSecure: true,
            contentType: "application/json"
        };
        return this.remoteService
            .request("get", options)
            .pipe(map((res: Object) => {
                return res;
            }));
    }

    /**
   * Calls upc service and returns the response
   * @method getOtherResourcesContent
  */
    getOtherResourcesContent() {
        let options: IUrlOptions = {
            restOfUrl: "",
            endPoint: "/channel/widgetconfigurations/channel/widgetConfigurations/upc?widgetName=dbRtrmNowDbElecPortlet_WAR_ahdbretirenowportlet",
            isSecure: true,
            contentType: "application/json"
        };
        return this.remoteService
            .request("get", options)
            .pipe(map((res: Object) => {
                return res;
            }));
    }
    completedSuccessfullyService(isCashoutFlag: boolean, isDbNQFlag: boolean) {
        if (isCashoutFlag) {
            this.removeEditHandlingInstructions();
            let queryParameters = "?benefitEligbleToRollover=" + sessionStorage.getItem("benefitEligbleToRollover") + "&isChngDstrPmtChcReq=" + sessionStorage.getItem("isCashoutChngDstrPmtReq");
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutCompletedSuccessfullyWidget/" + dbCashoutBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader(queryParameters,
                this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), null, null, null, true)
                .pipe(map((res: any) => {
                    return res;
                })), true, this.activatedRoute, isCashoutFlag, false);
        } else if (isDbNQFlag) {
            // let mockConfig = require('./al-assets/data/completedSuccessfully.json');
            // return of(mockConfig);
            this.removeEditHandlingInstructions();
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedCompletedSuccessfullyWidget/" + dbNqEnrollmentBusinessProcessReferenceId;
            return this.handleResponseGenericallyWithBody(this.remoteService.request("get", this.getRequestParamsWithCustomHeader("",
                this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), null, null, null, true)
                .pipe(map((res: any) => {
                    return res;
                })), true, this.activatedRoute, isCashoutFlag, isDbNQFlag);
        } else {
            /* let mockConfig = require('./al-assets/data/completedSuccessfully.json');
    return of(mockConfig); */
            this.removeEditHandlingInstructions();
            let endPoint = "channel/dbretirementelectionwidgets/completedSuccessfullyWidget/0?retirementStep=ReviewReturn";
            let IUrlOptions = this.getRequestParameters(endPoint);
            return this.remoteService.request("get", IUrlOptions, null, "", "", true)
                .pipe(map((res: Response) => {
                    return res;
                }));
        }
    }

    submittedSuccessfullyService() {
        /* let mockConfig = require('./al-assets/data/submittedSuccessfully.json');
        return of(mockConfig); */
        this.removeEditHandlingInstructions();
        let endPoint = "channel/dbretirementelectionwidgets/submittedSuccessfullyWidget/123?retirementStep=ReviewReturn";
        let IUrlOptions = this.getRequestParameters(endPoint);
        return this.remoteService.request("get", IUrlOptions, null, "", "", true)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    /* istanbul ignore next */
    getQueryParameters() {
        // this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        // .subscribe((e: NavigationEnd) => {
        // let url = window.location.href;
        let url = this.router.url;
        // let url = e.url;
        let wireMockData;
        let mockKeyArr: any = [];
        let queryKeyArr: any = [];
        mockKeyArr = ["mockScenario", "udpMockScenario", "mocked", "mockDateScenario", "planId", "electionId", "electionGroupId", "paymentId", "isFromAuthorizationPage", "mockPaymentElectionScenario", "mockPmtElectionsScenario", "mockPPSScenario", "confirmationNumber", "retirementStep"];
        if (url && url.indexOf("?") !== -1) {
            let sub = url.split("?");
            if (sub && sub[1]) {
                let queryData = sub[1];
                let res = sub[1].split("&");
                if (res) {
                    for (const key of res) {
                        if (key.indexOf("=") !== -1) {
                            let keyArr = key.split("=");
                            queryKeyArr.push(keyArr[0]);
                            if (queryKeyArr) {
                                let isMockFound = false;
                                isMockFound = mockKeyArr.some(ai => queryKeyArr.includes(ai));
                                if (isMockFound) {
                                    wireMockData = queryData;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!wireMockData) {
            wireMockData = "";
        }
        this.queryParameters = wireMockData;
        // });
    }

    /**
     * Standard method to create parameters
     * which are to be passed to microservice.
     *
     * restOfUrl - used to pass the query parameters.
     * endPoint - end point of the service.
     * isSecure - https or http.
     * contentType - type of request/response e.g. application/json.
     * customerHeader - apart from above if there is any need to
     *                  pass any other parameter in request header.
     */

    /**
   * custom header has the format of Array of type Item (key, value).
   * contains hardcoded values specific to footer component.
   *
   */

    /**
   * create and return a new item object.
   * @param key key of the item
   * @param value value of the item
   */
    private getItem(key, value) {
        let item = {
            "key": key,
            "value": value
        };
        return item;
    }
    savedSuccessfullyService() {
        this.removeEditHandlingInstructions();
        let endPoint = "channel/dbretirementelectionwidgets/savedSuccessfullyWidget/0?";
        let IUrlOptions = this.getRequestParameters(endPoint);
        return this.remoteService.getRequest(IUrlOptions)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    return res;
                }));
        // let mockConfig = require('./al-assets/data/savedSuccessfully.json');
        // return of(mockConfig);
    }


    deferredSuccessfullyService() {
        /* let mockConfig = require('./al-assets/data/deferred.json');
        return of(mockConfig) */
        this.removeEditHandlingInstructions();
        let confNumber = this.deferredSuccessfullyDSService.getConfNumber();
        let endPoint = "channel/dbretirementelectionwidgets/deferredSuccessfullyWidget/123?confirmationNumber=" + confNumber;
        let IUrlOptions = this.getRequestParameters(endPoint);
        return this.remoteService.getRequest(IUrlOptions)
            .pipe(map(
                /* istanbul ignore next */
                (res: Response) => {
                    return res;
                }));
    }

    /* istanbul ignore next */
    setSystemTickets(saveResponse: any) {
        let alightRequestHeader = this.domStorageFallbackService.getItem("alightRequestHeader", "sessionStorage", true);
        alightRequestHeader = JSON.parse(alightRequestHeader);
        if (alightRequestHeader && saveResponse.headers) {
            let alightresponseheader = saveResponse.headers.get("alightresponseheader");
            if (alightresponseheader !== null && alightresponseheader !== undefined && alightresponseheader[0] !== null && alightresponseheader[0] !== undefined) {
                alightresponseheader = JSON.parse(alightresponseheader);
                this.systemTickets = alightresponseheader.systemTickets;
                if (this.systemTickets !== undefined) {
                    alightRequestHeader.systemTickets = this.systemTickets;
                    this.domStorageFallbackService.setItem("alightRequestHeader", JSON.stringify(alightRequestHeader));
                }
            }
        }
    }
    /* istanbul ignore next */
    extractEditMessages(saveResponse: any) {
        let editMessages;
        if (saveResponse.headers) {
            let alightresponseheader = saveResponse.headers.get("alightresponseheader");
            if (alightresponseheader !== null && alightresponseheader !== undefined && alightresponseheader[0] !== null && alightresponseheader[0] !== undefined) {
                alightresponseheader = JSON.parse(alightresponseheader);
                if (alightresponseheader.editMessageGroupResponse !== undefined && alightresponseheader.editMessageGroupResponse.editMessages !== undefined) {
                    editMessages = alightresponseheader.editMessageGroupResponse.editMessages;
                    if (alightresponseheader.editMessageGroupResponse.hasOwnProperty("sourceSystem")) {
                        this.editHandlingInstructions["sourceSystem"] = alightresponseheader.editMessageGroupResponse.sourceSystem;
                    }
                }
            }
        }
        return editMessages;
    }


    getDeferParameters(saveResponse: any) {
        let alightresponseheader = saveResponse.headers.get("alightresponseheader");
        alightresponseheader = JSON.parse(alightresponseheader);
        if (alightresponseheader.transactionHeader !== undefined && alightresponseheader.transactionHeader.transactionInfo[0] !== undefined) {
            if (alightresponseheader.transactionHeader.transactionInfo[0].activityReferenceNumber !== undefined) {
                this.deferredSuccessfullyDSService.setConfNumber(alightresponseheader.transactionHeader.transactionInfo[0].activityReferenceNumber);
            }
            if (alightresponseheader.transactionHeader.transactionInfo[0].effectiveDate !== undefined) {
                this.deferredSuccessfullyDSService.setEffecDate(alightresponseheader.transactionHeader.transactionInfo[0].effectiveDate);
            }
        }
    }

    reviewPensionChoicesSaveServices(saveApiRequestBody: any, businessProcessReferenceId: any, buttonActionType, isSUAResultMode: boolean, isDbCashoutFlag: boolean, isNQFlag: boolean, hasTbaEdit: boolean): Observable<any> {
        if (isDbCashoutFlag) {
            let dbCashoutBusinessProcessReferenceId = Number(sessionStorage.getItem("dbCashoutBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "cashoutReviewYourPensionChoicesWidget/" + dbCashoutBusinessProcessReferenceId + "/paymentElections/continue?isSUAResultMode=" + isSUAResultMode;
            return this.handleResponseGenericallyWithBody(this.remoteService.request
            ("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                .pipe(map(
                    /* istanbul ignore next */
                    (res: any) => {
                        this.putSystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                        return res;
                    })), true, this.activatedRoute, isDbCashoutFlag, false);
            /* istanbul ignore next */
        } else if (isNQFlag) {
            let dbNqEnrollmentBusinessProcessReferenceId = Number(sessionStorage.getItem("dbNqEnrollmentBusinessProcessReferenceId"));
            this.endPoint = this.cashoutEndPointPrefix + "nonQualifiedReviewYourPensionChoicesWidget/" + dbNqEnrollmentBusinessProcessReferenceId + "/paymentElections/continue?isSUAResultMode=" + isSUAResultMode;
            return this.handleResponseGenericallyWithBody(
                this.remoteService.request("put", this.getRequestParamsWithCustomHeader("", this.getRequestHeaderWithOptionals(this.getDbNqeSystemTicketMap(), null)), JSON.stringify(saveApiRequestBody), null, null, true)
                    .pipe(map(
                        /* istanbul ignore next */
                        (res: any) => {
                            this.putSystemTicketInSessionStorageFromHeadersOfResponse(res, true);
                            return res;
                        })), true, this.activatedRoute, isDbCashoutFlag, isNQFlag);
        } else {
            if (hasTbaEdit) {
                this.overrideEdits();
            }
            let endPointActionType;
            const isDbRtrmSuaDisabled = this.domStorageFallbackService.getItem("isDbRtrmSuaDisabled");
            if (buttonActionType) {
                endPointActionType = "submit";
            } else {
                endPointActionType = "comeBackLater";
            }
            let endPoint;
            if (isSUAResultMode === null) {
                endPoint = "channel/dbretirementelectionwidgets/reviewYourPensionChoicesWidget/" + businessProcessReferenceId + "/paymentElections/" + endPointActionType;
            } else {
                endPoint = "channel/dbretirementelectionwidgets/reviewYourPensionChoicesWidget/" + businessProcessReferenceId + "/paymentElections/" + endPointActionType + "?isSUAResultMode=" + isSUAResultMode;
            }
            let IUrlOptions;
            if (isDbRtrmSuaDisabled) {
                IUrlOptions = this.getRequestParametersReviewSave(endPoint, true);
            } else {
                IUrlOptions = this.getRequestParametersReviewSave(endPoint, false);
            }
            return this.remoteService.request("put", IUrlOptions, JSON.stringify(saveApiRequestBody), "", "", true)
                .pipe(map((res: Response) => {
                    return res;
                }));
        }
    }

    /* reviewPensionChoicesSaveServices(saveApiRequestBody: any, businessProcessReferenceId: any, buttonActionType, isSUAResultMode: boolean, isDbCashoutFlag: boolean, hasTbaEdit: boolean): Observable<any> {
    let mockConfig = require('./al-assets/data/saveResponse.json');
     return of(mockConfig);
  } */
    setSystemTicketsDOM(domSystemTickets: any) {
        let alightRequestHeader = this.domStorageFallbackService.getItem("alightRequestHeader", "sessionStorage", true);
        alightRequestHeader = JSON.parse(alightRequestHeader);
        if (alightRequestHeader !== null && alightRequestHeader !== undefined) {
            if (domSystemTickets !== undefined && domSystemTickets !== null) {
                alightRequestHeader.systemTickets = domSystemTickets;
                this.domStorageFallbackService.setItem("alightRequestHeader", JSON.stringify(alightRequestHeader));
            }
        }
    }

    getNorSystemTickets() {
        let alightRequestHeader = this.domStorageFallbackService.getItem("alightRequestHeader", "sessionStorage", true);
        if (alightRequestHeader !== null && alightRequestHeader !== undefined) {
            if (alightRequestHeader.systemTickets) {
                let norStoreTickets = alightRequestHeader.systemTickets;
                return norStoreTickets;
            }
        }

    }

    getCustomHeader(): any {
        let customHeader = [];
        let isDbRtrmSuaDisabled = this.domStorageFallbackService.getItem("isDbRtrmSuaDisabled");
        if (isDbRtrmSuaDisabled) {
            customHeader.push(this.getItem("isDbRtrmSuaDisabled", isDbRtrmSuaDisabled.toString()));
        }
        return customHeader;
    }

    removeSystemTickets(): any {
        let alightRequestHeader = this.domStorageFallbackService.getItem("alightRequestHeader", "sessionStorage", true);
        alightRequestHeader = JSON.parse(alightRequestHeader);
        if (alightRequestHeader.hasOwnProperty("systemTickets")) {
            delete alightRequestHeader.systemTickets;
        }
        this.domStorageFallbackService.setItem("alightRequestHeader", JSON.stringify(alightRequestHeader));
    }


    /* istanbul ignore next */
    screenCaptureInit(pageTitle) {
        try {
            this.ngZone.runOutsideAngular(() => {
                const observer = new MutationObserver(() => {
                    /* istanbul ignore next */
                    let pageName = "";
                    let pathArray = window.location.hash.split("#");

                    if (pathArray && pathArray.length > 0) {
                        pageName = pathArray[pathArray.length - 1];
                        if (pageName === "") {
                            pathArray = window.location.pathname.split("/");
                            pageName = pathArray[pathArray.length - 1];
                            if (pageName.indexOf("?") > -1) {
                                pageName = pageName.split("?")[0];
                            }
                        }
                    }
                    this.loggingService._uxScreenCapture("Screen Capture", "Page - " + pageName + "/" + pageTitle, LoggingConstants.INFO, "angular-app", "BASE64-LZ-STRING", pageName + "/" + pageTitle, this.appUtility.compressPageHtml());
                    observer.disconnect();
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        } catch (error) {
            /* istanbul ignore next */
            this.loggingService._error("catch error screen capture : " + error + "/" + pageTitle, "RretirementElection NG8:RretirementElectionRestService", LoggingConstants.ERROR);
        }
    }

    /* istanbul ignore next */
    screenCapture(enable: boolean) {
        try {
            if (!enable) {
                this.domStorageFallbackService.setItem("enableScreenCapture", false, "sessionStorage", true);
            } else {
                this.domStorageFallbackService.setItem("enableScreenCapture", true, "sessionStorage", true);
            }
        } catch (error) {
            /* istanbul ignore next */
            this.loggingService._error("set screen capture flag value" + error, "RretirementElection NG8:RretirementElectionRestService", LoggingConstants.ERROR);
        }
    }

    // DB CASHOUT COMPONENT CUSTOM METHOD START
    /* istanbul ignore next */
    renderNextPage(path: string, activatedRoute: ActivatedRoute, queryParamsVar?: any) {
        // tech-debt: Handle routes that do not belong to retirement-electrion-wc.
        if(RouteChildHelper.isRouteExternal(path)) {
            RouteChildHelper.dispatchNavigateFromChildEvent(path, queryParamsVar);
            return;
        }

        if (activatedRoute != null) {
            this.router.navigate([path], { relativeTo: activatedRoute, queryParams: queryParamsVar });
        } else {
            this.router.navigate([path]);
        }
    }

    /* istanbul ignore next */
    handleResponseGenericallyWithBody(response: Observable<any>, shouldHandleErrorGenerically: boolean, activatedRoute: ActivatedRoute, isDbCashoutFlag: boolean, isDbNQFlag: boolean): Observable<any> {
        let commonMap = map((resp: any) => {
            if (LoggingService.uConsole) { }
            let responseBody = resp;
            if (responseBody != null) {
                return responseBody;
            } else {
                return resp;
            }
        });
        let commonCatchError = catchError(err => {
            if (LoggingService.uConsole) { }
            if (isDbCashoutFlag) {
                // Here Error Page of Cashout will render
                this.redirectToErrorPage();
            } else if (isDbNQFlag) {
                // Here Error Page of Enrollment will render
                this.redirectToNQErrorPage();
            }
            return new Observable(obs => { });
        });
        if (shouldHandleErrorGenerically) {
            return response.pipe(commonMap, commonCatchError);
        }
        return response.pipe(commonMap);
    }

    getRequestParamsWithCustomHeader(queryParam: string, customHeadersArray: any[]): IUrlOptions {

        let options: IUrlOptions = {
            restOfUrl: queryParam,
            endPoint: this.endPoint,
            isSecure: true,
            contentType: "application/json",
            customHeader: customHeadersArray
        };
        return options;
    }

    public getRequestHeaderWithOptionals(systemTicketsMapOptional: Object = {}, tbaEditsOverrideMapOptional: Object = {}): any[] {
        const requestArray = [];
        let testingInstruction = this.domStorageFallbackService.getItem("alightTestingInstructions");
        if (this.isDbNQFlag) {
            if (testingInstruction != null) {
                requestArray.push(this.getItem("alightTestingInstructions", testingInstruction.toString()));
            }
        }
        if (systemTicketsMapOptional != null) {
            requestArray.push(systemTicketsMapOptional);
        }
        if (tbaEditsOverrideMapOptional != null) {
            requestArray.push(tbaEditsOverrideMapOptional);
        }
        return requestArray;
    }


    /* istanbul ignore next */
    public getSystemTicketMap(): Object {
        let systemTicket = null;
        systemTicket = sessionStorage.getItem("dbCashoutSystemTickets");
        if (systemTicket == null || systemTicket.length === 0) {
            return null;
        }
        const maps = {};
        maps["key"] = "systemTickets";
        maps["value"] = JSON.parse(systemTicket);
        return maps;
    }
    /* istanbul ignore next */
    public getDbNqeSystemTicketMap(): Object {
        let systemTicket = null;
        systemTicket = sessionStorage.getItem("dbNqEnrollmentSystemTickets");
        if (systemTicket == null || systemTicket.length === 0) {
            return null;
        }
        const maps = {};
        maps["key"] = "systemTickets";
        maps["value"] = JSON.parse(systemTicket);
        return maps;
    }



    /* istanbul ignore next */
    private putSystemTicketInSessionStorageFromHeadersOfResponse(response: any, storeAlightResponseHeaderInSession?: boolean) {
        let arHeader = response.headers.get("alightResponseHeader");
        let responseHeader = JSON.parse(arHeader);
        if (responseHeader != null && responseHeader.systemTickets && responseHeader.transactionHeader.transactionInfo[0].activityReferenceNumber) {
            /* istanbul ignore next */
            sessionStorage.setItem("dbCashoutSystemTickets", JSON.stringify(responseHeader.systemTickets));
        }
    }

    /* istanbul ignore next */
    private putNQESystemTicketInSessionStorageFromHeadersOfResponse(response: any, storeAlightResponseHeaderInSession?: boolean) {
        let arHeader = response.headers.get("alightResponseHeader");
        let responseHeader = JSON.parse(arHeader);
        if (responseHeader != null && responseHeader.systemTickets && responseHeader.transactionHeader.transactionInfo[0].activityReferenceNumber) {
            /* istanbul ignore next */
            sessionStorage.setItem("dbNqEnrollmentSystemTickets", JSON.stringify(responseHeader.systemTickets));
        }
    }


    /* istanbul ignore next */
    redirectToErrorPage() {
        this.renderNextPage("../dbCashoutError", this.activatedRoute.children[0]);
    }


    /* istanbul ignore next */
    redirectToNQErrorPage() {
        this.renderNextPage("../dbNQEnrollmentError", this.activatedRoute.children[0]);
    }

    redirectToCancelPage() {
        this.renderNextPage("../dbCashoutCancelledSuccessfully", this.activatedRoute.children[0]);
    }
    /* istanbul ignore next */
    redirectToDBNQCancelPage() {
        this.renderNextPage("../dbNQEnrollmentCancelledSuccessfully", this.activatedRoute.children[0]);
    }

    setProgressbarData(pageTitle: any, activeIndex: any, label: any, stepDetail: any) {
        this.progressBarSaveDataSService.setPageTitle(pageTitle);
        this.progressBarSaveDataSService.setActiveIndex(activeIndex);
        this.progressBarSaveDataSService.setOfLabel(label);
        this.progressBarSaveDataSService.setStepDetail(stepDetail);
    }

    setRightRailData(iraChecklist: any, question: any, isQuestionTile: boolean, isIRATile: boolean, isNORLink: boolean) {
        this.rightRailSaveDataSService.setIraChecklist(iraChecklist);
        this.rightRailSaveDataSService.setQuestion(question);
        this.rightRailSaveDataSService.setIsQuestionTile(isQuestionTile);
        this.rightRailSaveDataSService.setIsIRATile(isIRATile);
        this.rightRailSaveDataSService.setIsNORLink(isNORLink);
    }

    setDocumentAndResourcesData(docAndRsrclist: any, docAndRsrcTitle: any, isNORLink: boolean) {
        this.rightRailSaveDataSService.setLinkList(docAndRsrclist);
        this.rightRailSaveDataSService.setTitle(docAndRsrcTitle);
        this.rightRailSaveDataSService.setIsNORLink(isNORLink);
    }

    /* istanbul ignore next */
    pageUrlFromCashoutRoot(href: string): string {
        if (href === null || href === undefined || href.length === 0) {
            return "";
        }
        let cashoutUrl = href.substr(href.lastIndexOf("/") + 0);
        let indexQ: number = cashoutUrl.indexOf("?");
        if (indexQ === -1) {
            indexQ = cashoutUrl.length;
        }
        return cashoutUrl.substr(0, indexQ);
    }

    /* GA - set url and title – function for page trackig */
    gaPageTracking(url: string) {
        const gaUrl = this.pageUrlFromCashoutRoot(url);
        this.gaService.postGACustomPageTracking(gaUrl);
    }
    // DB CASHOUT COMPONENT CUSTOM METHOD END
    overrideEdits() {
        let alightRequestHeader = this.domStorageFallbackService.getItem("alightRequestHeader", "sessionStorage", true);
        alightRequestHeader = JSON.parse(alightRequestHeader);
        alightRequestHeader["editHandlingInstructions"] = this.editHandlingInstructions;
        this.domStorageFallbackService.setItem("alightRequestHeader", JSON.stringify(alightRequestHeader));
    }

    removeEditHandlingInstructions(): any {
        let alightRequestHeader = this.domStorageFallbackService.getItem("alightRequestHeader", "sessionStorage", true);
        alightRequestHeader = JSON.parse(alightRequestHeader);
        if (alightRequestHeader.hasOwnProperty("editHandlingInstructions")) {
            delete alightRequestHeader.editHandlingInstructions;
        }
        this.domStorageFallbackService.setItem("alightRequestHeader", JSON.stringify(alightRequestHeader));
    }

    onRouteDBElec(path: string, queryParamsVar?: any) {
        let pathToRoute = "/web/" + this.orgName + "/retirement-election/" + path;
        if (queryParamsVar !== null && queryParamsVar !== undefined) {
            this.router.navigate([pathToRoute], { queryParams: queryParamsVar });
        } else {
            this.router.navigate([pathToRoute]);
        }
    }

    /**
     * checks if borwser back is allowed or not
     * @method isCallBackAllowed
     * checks for dbelec completion indicator session variable value and returns boolean
     */
    isCallBackAllowed(): boolean {
        let isDBEleclFlowComp = this.domStorageFallbackService.getItem("isDBEleclFlowComp", "sessionStorage", true);
        if (isDBEleclFlowComp !== undefined && isDBEleclFlowComp !== null && isDBEleclFlowComp === "true") {
            return false;
        }
        return true;
    }
    /* istanbul ignore next */
    clearIndexDBCache() {
        this.cacheService.removeItem("RtrmAction_Tiles", "tiles")
            .subscribe((succ) => {
                this.loggingService._debug(JSON.stringify(succ), "Getting CacheService details successfully - Removing the rtrmactiontiles from the tiles IDB", LoggingConstants.INFO, "Retirementelection Widget - Retirementelection CacheService");
            },
            err => {
                this.loggingService._error(JSON.stringify(err), "CacheService invocation failed with response - Removing the rtrmactiontiles from the tiles IDB failed", LoggingConstants.ERROR, "Retirementelection Widget - Retirementelection CacheService");
            });
    }

    /* ProgressBarPopoverDataCacheService(): Observable<any> {
     let mockConfig = require('./al-assets/data/popoverData.json');
     return of(mockConfig);
   } */

    /**
    * @method setRequestParamProgressBarPopver
    * @param mockUrl - Request params of endpoint
    * Frames the popoverStepIds and returns the created param
    */
    /* istanbul ignore next */
    setRequestParamProgressBarPopver(mockUrl) {
        let paramIndices = [];
        let popoverStepIds;
        let activeIndex = this.stepsActiveIndexService.getActiveIndexStepID();
        let queryStringParam;
        // data check in IDB should be added
        for (let i = 1; i <= activeIndex; i++) {
            if (!this.PBPopoverDataCacheService.checkProgressBarPopoverDataExistsInCache(this.PBPopoverDataCacheService.ProgressbarStepCodeArray[i - 1].stepCode)) {
                paramIndices.push(i);
            }
        }
        if (this.isPaymentCall === true) {
            if (paramIndices.indexOf(1) === -1) {
                paramIndices.push(1);
            }
        }
        // if (paramIndices.length > 0) {
        //   paramIndices.sort();
        //   popoverStepIds = String(paramIndices);
        // }
        if (paramIndices.length > 0) {
            paramIndices.sort();
            if (this.isMultiBeneSupported) {
                paramIndices = paramIndices.map(function (item) {
                    if (item >= 3) {
                        return item + 1;
                    } else {
                        return item;
                    }
                });
            }
            popoverStepIds = String(paramIndices);
        }
        if (popoverStepIds !== undefined) {
            if (mockUrl !== undefined && mockUrl !== "") {
                queryStringParam = "popoverStepIds=" + popoverStepIds + "&" + mockUrl;
            } else {
                queryStringParam = "popoverStepIds=" + popoverStepIds;
            }
        } else {
            queryStringParam = mockUrl;
        }
        return queryStringParam;
    }
    /**
   * @method getProgressBarPopoverContent
   * @param popOverData
   * fetches the popover data from each get call and calls IDB se method
   */
    getProgressBarPopoverContent(popOverData: any[]) {
        if (popOverData.length > 0) {
            popOverData.forEach(item => {
                this.PBPopoverDataCacheService.setProgressBarPopoverDataInCache(item.stepCode, item);
            });
        }
    }

    /* istanbul ignore next */
    setProgressBarPopoverRoute(event, stepId, index, data, changeModal, changeModalContent) {
        let currentPageName;
        let routedPageName;
        let currentActiveIndex = this.stepsActiveIndexService.getActiveIndexStepID();
        let reviewPageData = JSON.parse(this.domStorageFallbackService.getItem("reviewPageData", "sessionStorage", true));
        if (stepId === 6) {
            /** To handle destination page */
            if (reviewPageData && reviewPageData !== null && reviewPageData !== undefined && reviewPageData.hasOwnProperty("routePath") &&
                reviewPageData.routePath !== null && reviewPageData.routePath !== undefined) {
                if (reviewPageData.routePath === "RLVD") {
                    routedPageName = this.isCurrentStepRolloverDest ? this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingNameRollover : this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingNameRollover;
                } else {
                    routedPageName = this.isCurrentStepRolloverDest ? this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingNameRollover : this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingName;
                }
            } else {
                routedPageName = this.isCurrentStepRolloverDest ? this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingNameRollover : this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingName;
            }
        } else {
            routedPageName = this.PBPopoverDataCacheService.ProgressbarStepCodeArray[stepId - 1].gaTrackingName;
        }
        /** to handle multiple pages with same index */
        if (currentActiveIndex === 4 || currentActiveIndex === 5 || currentActiveIndex === 6) {
            currentPageName = this.PBPopoverDataCacheService.getCurrentPageName();
        } else {
            currentPageName = this.PBPopoverDataCacheService.ProgressbarStepCodeArray[currentActiveIndex].pageName;
        }
        this.gaService.postGACustomPageTracking("ActiveProgressBarPopOverClick-" + currentPageName + "-UPN_" + routedPageName);
        if (stepId <= 3) {
            changeModalContent.emit(data);
            changeModal.showDialog(event);
            this.loggingService._debug(JSON.stringify(data), "opening change modal", LoggingConstants.INFO, "RetirementElection NG8:RetirementElectionRestService");
        } else if (stepId === 5) {
            if (data.hasOwnProperty("stepCode") && data.stepCode !== null && data.stepCode !== undefined) {
                this.loggingService._debug(JSON.stringify(data), "redirecting to internal routes", LoggingConstants.INFO, "RetirementElection NG8:RetirementElectionRestService");
                this.onRouteDBElec(this.PBPopoverDataCacheService.ProgressbarStepDetailsArray[data.stepCode]["routePath"]);
            } else {
                this.loggingService._error(JSON.stringify(data), "Error in redirecting to internal routes", LoggingConstants.ERROR, "RetirementElection NG8:RetirementElectionRestService");
            }
        } else if (stepId === 6) {
            if (reviewPageData && reviewPageData !== null && reviewPageData !== undefined && reviewPageData.hasOwnProperty("routePath") &&
                reviewPageData.routePath !== null && reviewPageData.routePath !== undefined && data.hasOwnProperty("stepCode") && data.stepCode !== null
                && data.stepCode !== undefined) {
                this.loggingService._debug(JSON.stringify(data), "redirecting to internal routes", LoggingConstants.INFO, "RetirementElection NG8:RetirementElectionRestService");
                this.onRouteDBElec(this.PBPopoverDataCacheService.ProgressbarStepDetailsArray[data.stepCode][reviewPageData.routePath]["routePath"]);
            } else {
                this.loggingService._error(JSON.stringify(data), "Error in redirecting to internal routes", LoggingConstants.ERROR, "RetirementElection NG8:RetirementElectionRestService");
            }
        } else {
            try {
                const div = document.createElement("div");
                div.innerHTML = data.routeLink;
                const link = div.querySelector("a");
                if (link && link !== null && link !== undefined) {
                    link.click();
                    this.loggingService._debug(JSON.stringify(data), "Clicked link to open secondary window", LoggingConstants.INFO, "RetirementElection NG8:RetirementElectionRestService");
                }
            } catch (error) {
                this.loggingService._error("Error in clicking anchor link" + error, "RetirementElection NG8:RetirementElectionRestService", LoggingConstants.ERROR);
            }
        }
    }

    /* istanbul ignore next */
    checkPreActivityEdit() {
        const options: IUrlOptions = {
            restOfUrl: "",
            endPoint:
                "channel/definedbenefitsretirementwidgets/dbRetirementV2RetirementHubWidget/preActivity?preActivityForCancel=true",
            isSecure: true,
            contentType: "application/json"
        };
        return this.remoteService.request("get", options, null, "", "", true)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    /**
 * @method updateFormDataChange
 * method to indicate component value changes. will be used for future if dynamic popovers are implemented in DbElec */


    /* istanbul ignore next */
    updateFormDataChange() {
        if (this.isActivePBEnabled) {
            this.PBPopoverDataCacheService.setFormDataChanged(true);
        }
    }

    /* istanbul ignore next */
    getLocale() {
        let alightRequestHeader;
        let locale;
        if ((this.domStorageFallbackService.getItem("alightRequestHeader")) &&
            ((JSON.parse(this.domStorageFallbackService.getItem("alightRequestHeader"))).hasOwnProperty("locale"))) {
            alightRequestHeader = JSON.parse(this.domStorageFallbackService.getItem("alightRequestHeader"));
            locale = alightRequestHeader.locale;
        } else if ((this.domStorageFallbackService.getItem("lr_json_data", "", true)) &&
            ((JSON.parse(this.domStorageFallbackService.getItem("lr_json_data"))).hasOwnProperty("locale"))) {
            locale = JSON.parse(this.domStorageFallbackService.getItem("lr_json_data")).locale;
        } else {
            locale = "en_US";
            if (LoggingService.uConsole) {
                console.log("retirementelectioncomponent::getClientId : default en_US locale set since no locale Found either from alightRequestHeader and lr_json_data");
            }
        }
        if (LoggingService.uConsole) {
            console.log("retirementelectioncomponent::getClientId : locale is : " + locale);
        }
        return locale;
    }
    /* istanbul ignore next */
    isDefaultLocale(locale) {
        if (locale === this.formatTocheck) {
            return false;
        } else {
            return true;
        }
    }
    /* istanbul ignore next */
    getConfigurationData(): Observable<any> {
        let exprKeys = [
            {
                "name": "SHOW_LDW_YOUR_DATES_TABLE",
                "type": "regular"
            },
            {
                "name": "FEAT_SWITCH_UPN_DB_ELEC_HIDE_REL_VL",
                "type": "regular"

            }];
        let textKeys = [
            {
                "name": "PDF_POP_UP_PPS_LOADING_HEADER_TXT"
            },
            {
                "name": "PDF_POP_UP_PPS_LOADING_SUB_HEADER2_TXT"
            },
            {
                "name": "PDF_POP_UP_PPS_LOADING_SUB_HEADER1_TXT"
            },
            {
                "name": "PDF_POP_UP_UPLOADING_TXT"
            },
            {
                "name": "PDF_POP_UP_PPS_MAIL_BOX_HEADER_TXT"
            },
            {
                "name": "PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER1_TXT"
            },
            {
                "name": "PDF_POP_UP_PPS_MAIL_BOX_SUB_HEADER2_TXT"
            },
            {
                "name": "PDF_POP_UP_AUTH_REQ_LOADING_TXT"
            }
        ];

        let requestBody = {
            "operation": "configset",
            "exprKeys": exprKeys,
            "textKeys": textKeys
        };
        let urlOption: IUrlOptions = {
            restOfUrl: "",
            endPoint: "channel/widgetconfigurations/channel/configurationList/get",
            isSecure: true,
            contentType: "application/json"
        };
        return this.remoteService
            .request("post", urlOption, requestBody)
            .pipe(map(/* istanbul ignore next*/(res: any) => {
                return res;
            }));
    }
    /* istanbul ignore next */
    tagOnClick(linkTag: any) {
        if (linkTag !== null && linkTag !== undefined) {
            let dynamicLinkContainer = document.querySelector("#suadynamicredirecttag");
            if (dynamicLinkContainer) {
                dynamicLinkContainer.innerHTML = linkTag;
                let anchorElement = dynamicLinkContainer.firstElementChild as HTMLElement;
                if (anchorElement !== null) {
                    anchorElement.click();
                }
            }
        }
    }

    handleAfterPrint() {
        this.afterPrintHandlers.forEach(handler => handler());
        const accordiansymbol = document.querySelectorAll(".p-accordion-toggle-icon");
        const closeItem = document.querySelectorAll(".p-toggleable-content");
        if (closeItem) {
            closeItem.forEach((item: HTMLElement) => {
                item.setAttribute("aria-expanded", "false");
                item.setAttribute("style", "display:block");
                item.setAttribute("style", "visibility:hidden");
                (item as HTMLElement).style.height = "0px";
            });
        }
        accordiansymbol.forEach((item) => {
            item.classList.remove("pi-minus");
            item.classList.add("pi-plus");
        });
        this.afterPrintHandlers = [];
    }

    handleBeforePrint() {
        this.beforePrintHandlers.forEach(handler => handler());
        const accordiansymbol = document.querySelectorAll(".p-accordion-toggle-icon");
        const openItem = document.querySelectorAll(".p-toggleable-content");
        if (openItem) {
            openItem.forEach((item: HTMLElement) => {
                item.setAttribute("aria-expanded", "true");
                item.setAttribute("style", "display:block");
            });
        }
        accordiansymbol.forEach((item) => {
            item.classList.remove("pi-plus");
            item.classList.add("pi-minus");
        });
        this.beforePrintHandlers = [];
    }

    registerBeforePrintHandler(handler: () => void) {
        this.beforePrintHandlers.push(handler);
    }

    registerAfterPrintHandler(handler: () => void) {
        this.afterPrintHandlers.push(handler);
    }

    ngOnDestroy() {
        window.onafterprint = null;
        window.onbeforeprint = null;
    }
}
