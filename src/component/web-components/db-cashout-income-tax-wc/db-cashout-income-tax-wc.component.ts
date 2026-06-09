import {
    Component,
    ElementRef,
    EventEmitter,
    inject,
    OnDestroy,
    OnInit,
    Output,
} from "@angular/core";
import { RouteChildHelper } from "../navigate-from-child-helper";

@Component({
    selector: "db-cashout-income-tax",
    template: `
    <div hidden [id]="childNavigationHelperId"></div>
    <al-income-tax [isDbCashoutFlag]="true" />
  `,
})
export class DbCashOutIncomeTaxWcComponent implements OnInit, OnDestroy {
    @Output() renderNextPage = new EventEmitter<{
        path: string;
        queryParams: object;
    }>();

    childNavigationHelperId = RouteChildHelper.CHILD_NAVIGATION_EL_ID;
    private el = inject(ElementRef);
    listener: EventListener;

    ngOnInit() {
        this.listener = this.addNavigateFromChildEventListener();
    }

    ngOnDestroy(): void {
        this.el?.nativeElement?.removeEventListener(
            "navigateFromChild",
            this.listener
        );
    }

    private addNavigateFromChildEventListener(): EventListener {
        return this.el.nativeElement.addEventListener(
            "navigateFromChild",
            (event: CustomEvent) => {
                const path = event.detail.path;
                const queryParams = event.detail.queryParams || {};
                this.renderNextPage.emit({ path, queryParams });
            }
        );
    }
}
