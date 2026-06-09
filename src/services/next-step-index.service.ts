import {  Injectable  } from "@angular/core";
import {  Subject  } from "rxjs";
import {  RouterService  } from "../services/router.service";
import {  StepsActiveIndexService  } from "../services/steps-active-index-service";

@Injectable()
export class NextStepIndexService {
    public errorMessage = new Subject();

    constructor(private stepsActiveIndexService: StepsActiveIndexService, private routerService: RouterService) { }

    switchPage(pageContext: String) {
        switch (pageContext) {
            case "pension-payment-summary":
                this.stepsActiveIndexService.setStepIndex(4);
                this.renderNextPage("pension-payment-summary");
                break;
            case "rollover-amount":
                this.stepsActiveIndexService.setStepIndex(5);
                this.renderNextPage("rollover-amount");
                break;
        }
    }

    /* istanbul ignore next */
    renderNextPage(path: string) {
        this.routerService.onRouteLoaded(path);
    }

    getErrorMessage() {
        return this.errorMessage.asObservable();
    }
    setErrorMessage(err: string) {
        this.errorMessage.next(err);
    }
    clearErrorMessage() {
        this.errorMessage.next("");
    }
}
