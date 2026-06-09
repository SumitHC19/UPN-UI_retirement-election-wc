import {  of , Observable  } from "rxjs";
import {  Injectable  } from "@angular/core";

@Injectable()
export class SavePpsDataService {

    private ppsData: any;

    setPpsData(data: any) {
        this.ppsData = data;
    }

    getPpsData() {
        /* istanbul ignore next */
        if (this.ppsData) {
            return of(this.ppsData);
        }
    }
}
