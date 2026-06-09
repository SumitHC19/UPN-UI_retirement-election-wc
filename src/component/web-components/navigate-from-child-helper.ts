/**
 * Tech-debt:
 * This file should be removed when all responsibilities of routing are
 * passed to the proper parent web components.
 *
 **/

import { Params } from "@angular/router";

// id of the element that will dispatching the 'navigateFromChild' event
const CHILD_NAVIGATION_EL_ID = "child-navigation-helper";

/**
 * List of db nq routes that belong to db-nqenrollment-wc but are referenced in this repo
 *  This is not a scalable solution, but it is a temporary solution until we refactor the routing
 *  to be handled by the web components themselves.
 * Risk: two web components sharing the same route will cause issues if the same route exists in this repo.
 */
const DB_NQ_ENROLL = {
    PAYMENT_DESTINATION: "dbNQEnrollmentWhrToRcvPayment",
    REVIEW: "dbNQEnrollmentReview",
    FEDERAL_WITHHOLDING: "federal-withholding",
    COMPLETE: "dbNQEnrollmentComplete",
    INCOME_TAX_WTHL: "dbNQEnrollmentIncomeTaxWthl",
    CANCEL_SUCCESSFULLY: "dbNQEnrollmentCancelledSuccessfully",
    ERROR: "dbNQEnrollmentError",
};
const DB_CASH_OUT = {
    PAYMENT_DESTINATION: "dbCashoutWhrToRcvPayment",
    WHERE_TO_ROLLOVER: "dbCashoutWhrToRcvRolloverPayment",
    HOW_MUCH_TO_ONETIME_ROLLOVER: "dbCashoutHowMuchToRollover",
    REVIEW: "dbCashoutReview",
    FEDERAL_WITHHOLDING: "federal-withholding",
    COMPLETE: "dbCashoutComplete",
    INCOME_TAX_WTHL: "dbCashoutIncomeTaxWthl",
    CANCEL_SUCCESSFULLY: "dbCashoutCancelledSuccessfully",
    ERROR: "dbCashoutError",
};

function isCashoutPath(path: string): boolean {
    return Object.values(DB_CASH_OUT).some((value) => {
        const isIncluded = path.includes(value);
        console.log(value, path, isIncluded);
        return isIncluded;
    });
}

function isDbNQEnrollPath(path: string): boolean {
    return Object.values(DB_NQ_ENROLL).some((value) => {
        const isIncluded = path.includes(value);
        console.log(value, path, isIncluded);
        return isIncluded;
    });
}

function getParamsFromLocationHash(): Params {
    const afterHash = window.location.hash;
    const paramsStartIndex = afterHash.indexOf("?");
    if(paramsStartIndex !== -1) {
        const paramsString = afterHash.slice(paramsStartIndex + 1);
        const paramsArray = paramsString.split("&");
        const paramsMap = new Map<string, string>();
        paramsArray.forEach(param => {
            const [paramKey, paramValue] = param.split("=");
            const key = decodeURIComponent(paramKey || "");
            const value = decodeURIComponent(paramValue || "");
            if (key) {
                paramsMap.set(key, value);
            }
        });
        const params: { [key: string]: string} = {};
        for(const [key, value] of paramsMap.entries()){
            params[key] = value;
        }
        return params;
    } else {
        return {};
    }
}

function isCurrentLocationExternal(): boolean {
    const validPaths = ["retirement-election","db-notice-of-rights","db-election-review"];
    const currPath = window.location.hash.split("/")?.[3];
    const isRetirementElectionBaseRoute =
  validPaths.includes(currPath);
    return !isRetirementElectionBaseRoute;
}

function isRouteExternal(path: string): boolean {
    return isCurrentLocationExternal() &&
    (isDbNQEnrollPath(path) || isCashoutPath(path));
}

/**
 * This method is used to trigger an event to notify parent a route change is needed
 *   When using Web Components it is recommended to use a single angular router,
 *   This triggers the router of parent app, so parent's router can navigate
 * @param path - path to navigate
 * @param queryParams - query parameters to pass
 * @param triggerElement - optional element to dispatch the event from, if none provided a default
 *                         element with id @CHILD_NAVIGATION_EL_ID will be used.
 */
function dispatchNavigateFromChildEvent(
    path: string,
    queryParams: any = {},
    triggerElement?: HTMLElement
) {
    const event = new CustomEvent("navigateFromChild", {
        detail: { path, queryParams },
        bubbles: true,
        composed: true,
    });
    if (triggerElement) {
        triggerElement.dispatchEvent(event);
    } else {
        const el = document.querySelector(
            `#${CHILD_NAVIGATION_EL_ID}`
        ) as HTMLElement;
        el?.dispatchEvent(event);
    }
}

export const RouteChildHelper = {
    dispatchNavigateFromChildEvent,
    isCurrentLocationExternal,
    getParamsFromLocationHash,
    isRouteExternal,
    CHILD_NAVIGATION_EL_ID
};
