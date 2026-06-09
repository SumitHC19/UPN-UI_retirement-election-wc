import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbNqEnrollPaymentDestinationWcComponent } from "./db-nq-enroll-payment-destination-wc.component";

describe("DbNqEnrollPaymentDestinationWcComponent", () => {
    let component: DbNqEnrollPaymentDestinationWcComponent;
    let fixture: ComponentFixture<DbNqEnrollPaymentDestinationWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbNqEnrollPaymentDestinationWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbNqEnrollPaymentDestinationWcComponent);
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
