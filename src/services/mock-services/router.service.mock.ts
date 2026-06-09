import { ActivatedRoute } from "@angular/router";

export class MockRouterService {
    onRouteLoaded(path: string): void {}
    renderNextPage(path: string, activatedRoute?: ActivatedRoute, queryParams?: Object) {}
}
