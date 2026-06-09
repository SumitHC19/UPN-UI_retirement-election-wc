import { GenericService } from "@alight/core-utilities-lib";
import {  Injectable  } from "@angular/core";
import {  ActivatedRoute, Router  } from "@angular/router";
import { RouteChildHelper } from "src/components/web-components/navigate-from-child-helper";

@Injectable()
export class RouterService {

    constructor(private router: Router, private genericService: GenericService) { }

    onRouteLoaded(path: string) {
        let pathToRoute = "/web/" + this.orgName + "/retirement-election/" + path;
        this.router.navigate([pathToRoute]);
    }

    /* istanbul ignore next */
    renderNextPage(path: string, activatedRoute?: ActivatedRoute, queryParams?: Object) {
        // tech-debt: Handle routes that do not belong to retirement-electrion-wc.
        if(RouteChildHelper.isRouteExternal(path)) {
            RouteChildHelper.dispatchNavigateFromChildEvent(path, queryParams);
            return;
        }
        const commands = [path];
        const relativeTo = activatedRoute;
        const extras = queryParams ? { relativeTo, queryParams } : { relativeTo };
        // activatedRoute ? this.router.navigate(commands, extras) : this.router.navigate(commands);
        if(activatedRoute){
            this.router.navigate(commands, extras);
        }else{
            this.router.navigate(commands);
        }
    }

    private get orgName(): string {
        return this.genericService.getOrgName();
    }
}
