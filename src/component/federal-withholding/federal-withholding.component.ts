import { AfterContentInit, Component, OnInit } from "@angular/core";
import { EFlowId } from "../../models/flow-id.enum";
import { ActivatedRoute } from "@angular/router";
import { AlLoaderComponent, DomStorageFallbackService, DynamicComponentService } from "@alight/core-utilities-lib";
import { ITaxWithholdingWidgetConfiguration } from "../../models/tax-withholding-widget-configuration.interface";
import { RetirementElectionRestService } from "../../services/retirement-election-rest.service";
import { RouterService } from "../../services/router.service";
import { StepsActiveIndexService } from "../../services/steps-active-index-service";
import { RouteChildHelper } from "../web-components/navigate-from-child-helper";

@Component({
    selector: "al-federal-withholding",
    templateUrl: "./federal-withholding.component.html",
    providers: [AlLoaderComponent]
})
export class FederalWithholdingComponent implements OnInit, AfterContentInit {
    public widgetData: ITaxWithholdingWidgetConfiguration;
    public queryParams: any;
    public loaded: boolean = null;
    constructor(private stepsActiveIndexService: StepsActiveIndexService,
        private retirementElectionRestService: RetirementElectionRestService,
        private routerService: RouterService,
        private activatedRoute: ActivatedRoute,
        private dynamicComponentService: DynamicComponentService,
        private domFBService: DomStorageFallbackService) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.setStepIndex();
        this.setQueryParams();
        this.dynamicComponentService.initializePageComponents();
    }

    ngAfterContentInit() {
        try {
            this.dynamicComponentService.loadMFScript("income-tax-withholding-wc", "income-tax-withholding-wc");
        } catch (e) {
            console.log(e);
        }
    }

    public save(): void {
        this.routeToReview();
    }

    public back(): void {
        this.routeToReview();
    }

    private setQueryParams(): void {
        const initParams = (params) => {
            if(RouteChildHelper.isCurrentLocationExternal()) {
                this.queryParams = RouteChildHelper.getParamsFromLocationHash();
            } else {
                this.queryParams = params;
            }
            this.setSystemTickets();
            this.setWidgetData();

        };
        this.activatedRoute.queryParams.subscribe(params => initParams(params));
    }

    private setStepIndex(): void {
        // this.stepsActiveIndexService.setStepIndex(6);
        if (this.retirementElectionRestService.isMultiBeneSupported) {
            this.stepsActiveIndexService.setStepIndex(5);
        } else {
            this.stepsActiveIndexService.setStepIndex(6);
        }
    }
    private setSystemTickets(): void {
        const setAlightRequestHeader = () => {
            const alightRequestHeader = this.alightRequestHeader;
            alightRequestHeader["systemTickets"] = this.getSystemTickets(this.flowId);
            this.alightRequestHeader = alightRequestHeader;
        };
        const systemTickets = this.getSystemTickets(this.flowId);
        if (systemTickets) {
            setAlightRequestHeader();
        }
    }

    private getSystemTickets(flowId: EFlowId): Object {
        return flowId === EFlowId.DB_RETIREMENT ? this.electionsSystemTicket
            : flowId === EFlowId.DB_CASH_OUT ? this.cashOutSystemTicket
                : flowId === EFlowId.DB_NON_QUALIFIED_RETIREMENT ? this.nonQualifiedSystemTicket
                    : null;
    }

    private setWidgetData(): void {
        const { dbPaymentId = "", flowId = null, businessProcessReferenceId = "0" } = this.queryParams;
        this.widgetData = {
            dbPaymentId,
            flowId,
            systemTicket: this.getSystemTickets(flowId),
            businessProcessReferenceId
        };
    }

    private routeToReview(): void {
        const getPath = () => {
            return this.flowId === EFlowId.DB_RETIREMENT ? "../review-choices"
                : this.flowId === EFlowId.DB_NON_QUALIFIED_RETIREMENT ? "../dbNQEnrollmentReview"
                    : this.flowId === EFlowId.DB_CASH_OUT ? "../dbCashoutReview"
                        : null;
        };
        const path = getPath();
        this.routeToPath(path);
    }

    public onLoaded(loaded: boolean): void {
        this.loaded = loaded;
    }

    private routeToPath(path: string) {
        this.routerService.renderNextPage(path, this.activatedRoute);
    }

    public get paymentWithholdingFormType(): string {
        return this.queryParams?.paymentWithholdingFormType ?? "";
    }

    private get flowId(): EFlowId {
        return this.queryParams?.flowId ?? null;
    }

    private get electionsSystemTicket(): any {
        const alightRequestHeader: any = this.alightRequestHeader;
        const systemTickets = alightRequestHeader?.systemTickets;
        return systemTickets ?? null;
    }

    private get cashOutSystemTicket(): any {
        const systemTicketMap: any = this.retirementElectionRestService.getSystemTicketMap();
        return systemTicketMap.value;
    }

    private get nonQualifiedSystemTicket(): any {
        const nqSystemTicket: any = this.retirementElectionRestService.getDbNqeSystemTicketMap();
        return nqSystemTicket.value;
    }

    private get alightRequestHeader(): Object {
        const requestHeader = this.domFBService.getItem("alightRequestHeader", "sessionStorage", true);
        const alightRequestHeader: Object = JSON.parse(requestHeader);
        return alightRequestHeader;
    }

    private set alightRequestHeader(value: Object) {
        const alightRequestHeader = JSON.stringify(value);
        this.domFBService.setItem("alightRequestHeader", alightRequestHeader);
    }

}
