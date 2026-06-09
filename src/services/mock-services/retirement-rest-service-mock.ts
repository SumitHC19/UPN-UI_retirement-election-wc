export class RetirementElectionRestServiceMock {
    orgName;
    constructor() {
        this.orgName = "retirement3x";
    }

    renderNextPage() {}

    getSystemTicketMap() {
        return this.getDbNqeSystemTicketMap();
    }

    getDbNqeSystemTicketMap() {
        return {
            "key": "systemTickets",
            "value": [
                {
                    "key": "D$9B",
                    "value": "CT6C - 0004725 - 4733 - g6mWbUb7b0W - CT6C0004725"
                }
            ]
        };
    }
}


