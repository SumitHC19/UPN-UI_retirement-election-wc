import "zone.js";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { environment } from "./environments/environment";
import { RetirementElectionModule } from "./index";

if (environment.production) {
    // enableProdMode();
}

platformBrowserDynamic().bootstrapModule(RetirementElectionModule, { ngZone: (window as any).ngZone })
    .catch(err => console.error(err));
