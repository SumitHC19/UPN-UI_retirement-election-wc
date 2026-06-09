import { EFlowId } from "./flow-id.enum";

export interface ITaxWithholdingWidgetConfiguration {
    dbPaymentId?: string;
    flowId: EFlowId;
    systemTicket?: any;
    businessProcessReferenceId?: any;
}
