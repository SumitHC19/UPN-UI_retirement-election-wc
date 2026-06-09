import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbCashOutReviewPensionChoicesWcComponent } from "./db-cashout-review-pension-choices-wc.component";

describe("DbCashOutReviewPensionChoicesWcComponent", () => {
    let component: DbCashOutReviewPensionChoicesWcComponent;
    let fixture: ComponentFixture<DbCashOutReviewPensionChoicesWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbCashOutReviewPensionChoicesWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbCashOutReviewPensionChoicesWcComponent);
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
