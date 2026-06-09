import {  Injectable  } from "@angular/core";

@Injectable()
export class AlPanelSectionService {
    private paymentChoicePanelList: any;
    constructor() {
    }
    public setPanelList(val: any): void {
        this.paymentChoicePanelList = val;
    }
    public getPanelList(): any {
        return this.paymentChoicePanelList;
    }
}
