import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbCashOutOneTimeRolloverPaymentWcComponent } from "./db-cashout-onetime-rollover-payment-wc.component";

describe("DbCashOutOneTimeRolloverPaymentWcComponent", () => {
    let component: DbCashOutOneTimeRolloverPaymentWcComponent;
    let fixture: ComponentFixture<DbCashOutOneTimeRolloverPaymentWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbCashOutOneTimeRolloverPaymentWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbCashOutOneTimeRolloverPaymentWcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should trigger an output event", () => {
        let renderNextPageSpy = spyOn(
            component.renderNextPage,
            "emit"
        ).and.callFake(() => {});

        fixture.elementRef.nativeElement.dispatchEvent(
            new CustomEvent("navigateFromChild", {
                detail: { path: "some-path" },
                bubbles: true,
                composed: true,
            })
        );

        expect(renderNextPageSpy).toHaveBeenCalled();
    });
});
