import { DynamicComponentService, LoggingService, IDBService } from "@alight/core-utilities-lib";
import {  Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
    selector: "al-retirement-election-lazy",
    templateUrl: "./retirement-election-lazy.component.html",
    styleUrls: ["./retirement-election-lazy.component.css"]
})
export class RetirementElectionLazyComponent implements OnInit, OnDestroy {

    @ViewChildren("content", { read: ViewContainerRef })
        templateContent: QueryList<ViewContainerRef>;

    constructor(
        private router: Router,
        private location: Location,
        private idbService: IDBService
    ) { }

    ngOnInit() {
        this.router.navigateByUrl(this.location.path(true));
        this.setUpLocationChangeListener();
    }

    setUpLocationChangeListener() {
        let routeArray = ["retirement-election"];
        this.location.subscribe(data => {
            let url = data.url;
            routeArray.forEach(element => {
                if (url.includes(element)) {
                    if (LoggingService.uConsole) {
                        console.log("checked router in RetirementElectionPage" + data.url);
                    }
                    this.router.navigateByUrl(data.url);
                    return;
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.clearIndexDBStorage("promotionsHomePageCache");
        this.clearIndexDBStorage("WorklifeRecommended");
        this.clearCacheKeyFromIndexDBStorage("thriveheaderwidget", "thriveheaderwidgetCache");
        this.clearCacheKeyFromIndexDBStorage("leftrail", "quickActions");
        this.clearCacheKeyFromIndexDBStorage("todoTask", "todoTaskCache");
    }


    private clearIndexDBStorage(keyName: String) {
        try {
            this.idbService.deleteRecordAsync("upointpromotionswidget", keyName.trim())
                .toPromise()
                .then(value => { });
        } catch (error) {

        }
    }


    private clearCacheKeyFromIndexDBStorage(dbStorageName: String, keyName: String) {
        try {
            this.idbService.deleteRecordAsync(dbStorageName.trim(), keyName.trim())
                .toPromise()
                .then(value => { });
        } catch (error) { }
    }
}
