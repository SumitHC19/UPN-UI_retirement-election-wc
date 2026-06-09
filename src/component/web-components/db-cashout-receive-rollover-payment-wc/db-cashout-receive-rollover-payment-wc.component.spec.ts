import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbCashOutWhereToReceiveRolloverPaymentWcComponent } from "./db-cashout-receive-rollover-payment-wc.component";

describe("DbCashOutWhereToReceiveRolloverPaymentWcComponent", () => {
    let component: DbCashOutWhereToReceiveRolloverPaymentWcComponent;
    let fixture: ComponentFixture<DbCashOutWhereToReceiveRolloverPaymentWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbCashOutWhereToReceiveRolloverPaymentWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbCashOutWhereToReceiveRolloverPaymentWcComponent);
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
