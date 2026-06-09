import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbCashOutIncomeTaxWcComponent } from "./db-cashout-income-tax-wc.component";

describe("DbCashOutIncomeTaxWcComponent", () => {
    let component: DbCashOutIncomeTaxWcComponent;
    let fixture: ComponentFixture<DbCashOutIncomeTaxWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbCashOutIncomeTaxWcComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DbCashOutIncomeTaxWcComponent);
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
