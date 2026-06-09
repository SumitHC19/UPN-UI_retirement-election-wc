import {  Injectable  } from "@angular/core";
import {  Subject  } from "rxjs";

@Injectable()
export class StepsActiveIndexService {

    public activeIndex = new Subject();
    activeIndexStepID: number;
    getStepIndex() {
        return this.activeIndex.asObservable();
    }
    setStepIndex(activeInd: number) {
        this.activeIndexStepID = activeInd;
        this.activeIndex.next(activeInd);
    }
    getActiveIndexStepID() {
        return this.activeIndexStepID;
    }
}
