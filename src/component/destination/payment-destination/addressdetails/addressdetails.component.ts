import {  Component, Input, OnInit, AfterViewInit  } from "@angular/core";
import {  UntypedFormGroup  } from "@angular/forms";
import {  DomStorageFallbackService  } from "@alight/core-utilities-lib";
import {  RetirementElectionRestService  } from "../../../../services/retirement-election-rest.service";

@Component({
    selector: "al-addressdetails",
    templateUrl: "./addressdetails.component.html"
})
export class AddressDetailsComponent implements OnInit, AfterViewInit {

    @Input() addressDetails = [];
    @Input() controlName;
    @Input() parentForm: UntypedFormGroup;
    @Input() splitPayment;
    @Input() isCashoutFlag: boolean;
    addressDestinationDa: any;
    @Input() isNQFlag: boolean;


    constructor(private domFBService: DomStorageFallbackService,
        private retirementElectionRestService: RetirementElectionRestService ) { }

    ngOnInit() { }

    ngAfterViewInit() {
        sessionStorage.removeItem("dbCashoutRefreshDetails");
        sessionStorage.removeItem("dbNQEnrollmentRefreshAddress");
    }

    /* istanbul ignore next */
    updateAddress(controlName, addressText) {
        if (this.isCashoutFlag) {
            // sessionStorage.setItem("dbCashoutRefreshAddress", "RefreshAddress");
            this.domFBService.setItem("dbCashoutRefreshDetails", "REFR_ADDR", "sessionStorage", true);
        } else if (this.isNQFlag) {
            // sessionStorage.setItem("dbNQEnrollmentRefreshAddress", "RefreshAddress");
            this.domFBService.setItem("dbNQEnrollmentRefreshAddress", "RefreshAddress", "sessionStorage", true);
        }
        let id = "AFenabled_" + controlName + "_" + addressText;
        let spanElement = document.querySelector(`span[id=${id}]`) as HTMLElement;
        if (spanElement !== null) {
            let anchorElement = spanElement.firstElementChild as HTMLElement;
            if (anchorElement !== null) {
                this.retirementElectionRestService.removeSystemTickets();
                anchorElement.click();
            }
        }
    }
}
