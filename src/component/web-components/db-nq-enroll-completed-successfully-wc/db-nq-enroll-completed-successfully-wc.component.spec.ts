import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbNqEnrollCompletedSuccessfullyWcComponent } from "./db-nq-enroll-completed-successfully-wc.component";

describe("DbNqEnrollCompletedSuccessfullyComponent", () => {
    let component: DbNqEnrollCompletedSuccessfullyWcComponent;
    let fixture: ComponentFixture<DbNqEnrollCompletedSuccessfullyWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbNqEnrollCompletedSuccessfullyWcComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(DbNqEnrollCompletedSuccessfullyWcComponent);
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
