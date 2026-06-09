import {  Injectable  } from "@angular/core";

@Injectable()
export class AuthorizationCommonService {
    private nextStepsContent: any;
    private summaryRequestContent: any;

    constructor() {
    }

    public setNextStepContent(data: any) {
        this.nextStepsContent = data;
    }

    public setSummaryRequestContent(data: any) {
        this.summaryRequestContent = data;
    }

    public getNextStepContent() {
        return this.nextStepsContent;
    }

    public getSummaryRequestContent() {
        return this.summaryRequestContent;
    }
}
