import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbCashOutPaymentDestinationWcComponent } from "./db-cashout-payment-destination-wc.component";

describe("DbCashOutPaymentDestinationWcComponent", () => {
    let component: DbCashOutPaymentDestinationWcComponent;
    let fixture: ComponentFixture<DbCashOutPaymentDestinationWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbCashOutPaymentDestinationWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbCashOutPaymentDestinationWcComponent);
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
