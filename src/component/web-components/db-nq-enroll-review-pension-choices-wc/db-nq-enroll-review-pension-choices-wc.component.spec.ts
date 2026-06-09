import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbNqEnrollReviewPensionChoicesWcComponent } from "./db-nq-enroll-review-pension-choices-wc.component";

describe("DbNqEnrollReviewPensionChoicesWcComponent", () => {
    let component: DbNqEnrollReviewPensionChoicesWcComponent;
    let fixture: ComponentFixture<DbNqEnrollReviewPensionChoicesWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbNqEnrollReviewPensionChoicesWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbNqEnrollReviewPensionChoicesWcComponent);
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
