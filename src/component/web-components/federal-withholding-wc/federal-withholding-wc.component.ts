import {
    Component,
    EventEmitter,
    OnInit,
    OnDestroy,
    inject,
    Output,
    ElementRef,
} from "@angular/core";
import { RouteChildHelper } from "../navigate-from-child-helper";

@Component({
    selector: "federal-withholding-wc",
    template: `
    <div hidden [id]="childNavigationHelperId"></div>
    <al-federal-withholding />
  `,
})
export class FederalWithholdingWcComponent implements OnInit, OnDestroy {
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
