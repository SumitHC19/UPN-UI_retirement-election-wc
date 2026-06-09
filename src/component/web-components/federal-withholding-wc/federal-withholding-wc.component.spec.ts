import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FederalWithholdingWcComponent } from "./federal-withholding-wc.component";

describe("FederalWithholdingWcComponent", () => {
    let component: FederalWithholdingWcComponent;
    let fixture: ComponentFixture<FederalWithholdingWcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FederalWithholdingWcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FederalWithholdingWcComponent);
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
