import {  Injectable  } from "@angular/core";

@Injectable()
export class DeferredSuccessfullyDSService {
    planDescriptionList: any[];
    confNumber: any;
    effecDate: any;
    setPlanList(val: any[]) {
        if (val !== undefined) {
            this.planDescriptionList = val.map(plan => {
                return plan.planDescription;
            }
            );
        }
    }
    getPlanDescriptionList() {
        return this.planDescriptionList;
    }
    setConfNumber(val: any) {
        this.confNumber = val;
    }
    getConfNumber() {
        return this.confNumber;
    }
    setEffecDate(val: any) {
        this.effecDate = val;
    }
    getEffecDate() {
        return this.effecDate;
    }
}
