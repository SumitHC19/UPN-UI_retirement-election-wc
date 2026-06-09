import {provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {   AlCoreModuleLibrary, DomStorageFallbackService   } from "@alight/core-utilities-lib";
import {   CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA   } from "@angular/core";
import {   provideHttpClientTesting   } from "@angular/common/http/testing";
import {   waitForAsync, ComponentFixture, inject, TestBed   } from "@angular/core/testing";
import {   UntypedFormBuilder, FormsModule, ReactiveFormsModule   } from "@angular/forms";
import {   BrowserAnimationsModule   } from "@angular/platform-browser/animations";
import {   RouterTestingModule   } from "@angular/router/testing";
import {   AddressDetailsComponent   } from "./addressdetails.component";
import {   RetirementElectionRestService   } from "../../../../services/retirement-election-rest.service";

export class RetirementElectionRestServiceMock {
    systemTickets: any;
    constructor() {}
    setItem(name,value,storage,cookie) {
    }
}
describe("AddressDetailsComponent", () => {
    let component: AddressDetailsComponent;
    let fixture: ComponentFixture<AddressDetailsComponent>;
    const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {
                declarations:
                    [
                        AddressDetailsComponent
                    ],
                providers:
                    [
                        provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting(),
                        {
                            provide: RetirementElectionRestService, useClass: RetirementElectionRestServiceMock
                        },
                        {
                            provide: DomStorageFallbackService, useClass: RetirementElectionRestServiceMock
                        }
                    ],
                imports:
                    [
                        RouterTestingModule,
                        BrowserAnimationsModule,
                        AlCoreModuleLibrary.forRoot(),
                        FormsModule,
                        ReactiveFormsModule,
                    ],
                schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement]
            }).compileComponents();
    }));

    beforeEach(inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
        fixture = TestBed.createComponent(AddressDetailsComponent);
        component = fixture.componentInstance;

        /* This is where we can simulate / test our component
           and pass in a value for formGroup where it would've otherwise
           required it from the parent
        */
        component.addressDetails = [];
        component.controlName = "";
        component.splitPayment = false;
        component.parentForm = formBuilder.group({});
        fixture.detectChanges();
    }));


    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should able to call updateAddress", () => {
        fixture.whenStable().then(() => {
            component.updateAddress("","");
        });
    });
});
