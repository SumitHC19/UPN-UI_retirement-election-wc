import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbNqEnrollIncomeTaxWcComponent } from "./db-nq-enroll-income-tax-wc.component";

describe("DbNqEnrollIncomeTaxWcComponent", () => {
    let component: DbNqEnrollIncomeTaxWcComponent;
    let fixture: ComponentFixture<DbNqEnrollIncomeTaxWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbNqEnrollIncomeTaxWcComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DbNqEnrollIncomeTaxWcComponent);
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
