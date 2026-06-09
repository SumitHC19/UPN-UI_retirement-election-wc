import {  Injectable  } from "@angular/core";
import {  Observable  } from "rxjs";

//

@Injectable()
export class FootnoteService {
    private footnoteResponse: any;

    getFootnoteData() {
        if (this.footnoteResponse !== undefined && this.footnoteResponse !== null && this.footnoteResponse !== "") {
            return this.footnoteResponse;
        }
    }

    setFootnoteData(response) {
        this.footnoteResponse = "";
        if (response !== undefined && response !== null && response.hasOwnProperty("footnoteLocations") &&  response.footnoteLocations[0] !== undefined  && response.footnoteLocations[0] !== null  &&  response.footnoteLocations[0].hasOwnProperty("footnotes")) {
            if (response.footnoteLocations[0].footnotes.length > 0) {
                this.footnoteResponse = response;
            }
        }
    }
}
