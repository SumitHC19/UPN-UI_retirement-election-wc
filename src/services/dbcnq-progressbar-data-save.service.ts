import {  Injectable  } from "@angular/core";

@Injectable()
export class ProgressBarSaveDataSService {
    private pageTitle: any;
    private activeIndex: any;
    private ofLabel: any;
    private stepDetail: any;

    constructor() {}

    public setPageTitle(val: any): void {
        this.pageTitle = val;
    }
    public getPageTitle(): any {
        return this.pageTitle;
    }

    public setActiveIndex(val: any): void {
        this.activeIndex = val;
    }
    public getActiveIndex(): any {
        return this.activeIndex;
    }

    public setOfLabel(val: any): void {
        this.ofLabel = val;
    }
    public getOfLabel(): any {
        return this.ofLabel;
    }

    public setStepDetail(val: any): void {
        this.stepDetail = val;
    }
    public getStepDetail(): any {
        return this.stepDetail;
    }
}
