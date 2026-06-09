import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbCashOutCompletedSuccessfullyWcComponent } from "./db-cashout-completed-successfully-wc.component";

describe("DbCashOutCompletedSuccessfullyWcComponent", () => {
    let component: DbCashOutCompletedSuccessfullyWcComponent;
    let fixture: ComponentFixture<DbCashOutCompletedSuccessfullyWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbCashOutCompletedSuccessfullyWcComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbCashOutCompletedSuccessfullyWcComponent);
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
