import {  Component, Input, OnInit  } from "@angular/core";
import {  RetirementElectionRestService  } from "../../../../../services/retirement-election-rest.service";
import {  finalize  } from "rxjs";
import {  Router  } from "@angular/router";
import {  LoggingService, LoggingConstants  } from "@alight/core-utilities-lib";
import {  EditMessagesService  } from "../../../../../services/edit-messages.service";

@Component({
    selector: "al-choose-payment-option-hypothetical-panel-section",
    templateUrl: "./hypothetical-panel-section.component.html"
})
export class HypotheticalPanelSectionComponent implements OnInit {
    data: any;
    nameABeneficiaryText = [];
    nameABeneficiaryLink = [];
    hypotheticalPanelID = 0;
    @Input() optionalFormGroupId;
    display: any;
    responseData: any;
    showError = false;

    /**
   * Standard constructor code to do
   * the dependency injection.
   */
    constructor(private retirementElectionRestService: RetirementElectionRestService, private router: Router,
        private logger: LoggingService, private editMessagesService: EditMessagesService) {
    }

    /**
   * Standard code to subscribe for servce data
   * which in turn give call to mircroservice.
   */
    ngOnInit() {
        this.getDataFromService();
        // this.data = this.choosePaymentOptionCommonService.getData();
        this.splitNameABeneFiciary(this.data.choosePaymentOptionTable.paymentOptionGroupDetailList);
    }

    /**
   * Standard code to handle errors.
   * @param error details of the error.
   */
    handleError(error) {
    }

    getDataFromService() {
        this.retirementElectionRestService.getChoosePaymentOptionData()
            .subscribe(
                (data) => {
                    this.data = data;
                    this.logger._debug(JSON.stringify(data), "Getting Hypothetical details successfully", LoggingConstants.INFO, "RetirementElection - Hypothetical - Get Service");
                },
                /* istanbul ignore next */
                (error) => {
                    this.handleError(error);
                    this.logger._error(JSON.stringify(error), "Error in Hypothetical component response", LoggingConstants.ERROR, "RetirementElection - Hypothetical - Get Service");
                }
            );
    }
    splitNameABeneFiciary (paymentList: any[]) {
        let hypoList = [];

        for (let i = 0; i < paymentList.length; i++) {
            hypoList.push(paymentList[i].hypotheticalOptionalFormPanel.hypotheticalOptionalFormPanelSurvivorText);
        }
        for (let j = 0; j < hypoList.length; j++) {
            /* istanbul ignore next */
            if (hypoList[j] !== undefined) {
                let index = hypoList[j].indexOf("<a");
                let text = hypoList[j].substring(0, index);
                let link = hypoList[j].substring(index, hypoList[j].length);
                this.nameABeneficiaryText.push(text);
                this.nameABeneficiaryLink.push(link);
            } else {
                this.nameABeneficiaryText.push(null);
                this.nameABeneficiaryLink.push("");
            }
        }
    }

    checkPreActivityEdit() {
        let headers: any;
        let response: any;
        this.retirementElectionRestService.checkPreActivityEdit()
            .pipe(
                finalize(() => {
                    /* istanbul ignore next */
                    if (response.hasOwnProperty("statusCode") && response.statusCode && response.statusCode !== null &&
          response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.hasOwnProperty("preActivityEdit") && response.preActivityEdit && response.preActivityEdit !== null
            && response.preActivityEdit !== undefined && response.preActivityEdit.hasEdit) {
                            let saveEditList = this.retirementElectionRestService.extractEditMessages(headers);
                            let editButtonList = this.editMessagesService.getEditButtonList(response);
                            if (editButtonList.length !== 0) {
                                this.editMessagesService.editButtonListSubject.next(editButtonList);
                            }
                            if (saveEditList !== undefined) {
                                this.editMessagesService.pageNameSubject.next("cancelFromHypothetical");
                                this.editMessagesService.saveEditArray(saveEditList);
                                this.editMessagesService.editMessageFlagSubject.next(true);
                                window.scrollTo(0, 0);
                            }
                        } else {
                            this.onCancel();
                        }
                    }
                }))
            .subscribe(
                (data) => {
                    if (data && data !== null && data !== undefined) {
                        headers = data;
                        if (data.hasOwnProperty("_body")) {
                            response = data["_body"];
                            /* istanbul ignore next */
                            if (response && response !== null && response !== undefined &&
                response.hasOwnProperty("data") && response.data && response.data !== null && response.data !== undefined) {
                                response = response.data;
                                this.logger._debug(JSON.stringify(data), "Getting Retirement Election details successfully", LoggingConstants.INFO, "RetirementElection - checkPreActivityEdit for cancel Service");
                            }
                        }
                    }
                }
            );
    }

    onCancel() {
        let response;
        let requestBody = {};
        let businessProcessId = 123;
        this.retirementElectionRestService.onCancelService(requestBody, businessProcessId)
            .pipe(
                finalize(() => {
                    if (response && response.statusCode) {
                        this.responseData = response.statusCode;
                        /* istanbul ignore next */
                        if (this.responseData !== 200) {
                            this.showError = true;
                        } else {
                            this.showError = false;
                            this.retirementElectionRestService.onRouteDBElec("cancelled");
                        }
                    }
                })
            )
            .subscribe(
                (data) => {
                    response = data.body;
                    this.logger._debug(JSON.stringify(data), "Getting Hypothetical details successfully", LoggingConstants.INFO, "RetirementElection - Hypothetical - cancel Service");
                }
            );
    }

}
