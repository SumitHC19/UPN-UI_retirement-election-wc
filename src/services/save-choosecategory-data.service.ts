import {  of , Observable  } from "rxjs";
import {  Injectable  } from "@angular/core";

@Injectable()
export class SaveChooseCategoryDataService {

    private ccData: any;
    private ccPlanElecData: any;
    public planArr = [];

    setCCData(data: any) {
        /* istanbul ignore next */
        this.ccData = data;
    }

    getCCData() {
        /* istanbul ignore next */
        if (this.ccData) {
            return of(this.ccData);
        }
    }

    setCCPlanElecData(data: any) {
        /* istanbul ignore next */
        this.ccPlanElecData = data;
    }
    getCCPlanElecData() {
        /* istanbul ignore next */
        if (this.ccPlanElecData) {
            return this.ccPlanElecData;
        }
    }
    decideGetCallOrCache(currentplanId, currentelecGrpId) {
        /* istanbul ignore next */
        if (this.ccPlanElecData) {
            for(let i = 0; i < this.ccPlanElecData.length; i++) {
                if (currentplanId === this.ccPlanElecData[i].planId && currentelecGrpId === this.ccPlanElecData[i].electionGroupId) {
                    return false;
                }
            }
        }
        return true;
    }
}
