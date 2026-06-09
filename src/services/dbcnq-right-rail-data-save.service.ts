import {  Injectable  } from "@angular/core";
import {  IraChecklist } from "../components/shared/models/dbcnq-ira-checklist-model";
import {  Question } from "../components/shared/models/dbcnq-question-model";

@Injectable()
export class RightRailSaveDataService {
    private iraChecklist: IraChecklist;
    private question: Question;
    private title: any;
    private linkList: any;
    isQuestionTile: boolean;
    isIRATile: boolean;
    isNORLink: boolean;

    constructor() {}

    public setIraChecklist(val: any): void {
        this.iraChecklist = val;
    }
    public getIraChecklist(): any {
        return this.iraChecklist;
    }

    public setQuestion(val: any): void {
        this.question = val;
    }
    public getQuestion(): any {
        return this.question;
    }

    public setIsQuestionTile(val: boolean): void {
        this.isQuestionTile = val;
    }
    public getIsQuestionTile(): boolean {
        return this.isQuestionTile;
    }

    public setIsIRATile(val: boolean): void {
        this.isIRATile = val;
    }
    public getIsIRATile(): boolean {
        return this.isIRATile;
    }

    public setIsNORLink(val: boolean): void {
        this.isNORLink = val;
    }
    public getIsNORLink(): boolean {
        return this.isNORLink;
    }

    public setTitle(val: any): void {
        this.title = val;
    }
    /* istanbul ignore next */
    public getTitle(): any {
        return this.title;
    }

    public setLinkList(val: any): void {
        this.linkList = val;
    }

    /* istanbul ignore next */
    public getLinkList(): any {
        return this.linkList;
    }
}
