export class MockDomStorageFallbackService {
    private dom = "{\"locale\":\"en_US\",\"roleId\":\"19941_WDCDS_1.0-E:19941_1.0-E:@PPT@\",\"channelRequestData\":\"URL::retirement-election::MAS_CURRENT_REQUESTED_ACTIVE_ACCT_TYPE::HRBPO::IS_HIDE_PRIMARY_ACCOUNT_IN_MAS_DROP_DOWN::true::tgtSite::::csid::log-off::BPOWE::0, NA::BPOLoc::null,null::BPORel::T,F,F,F::BPOLE::0::WDDOWN::F,F,F,F::gblsId::e817fdbb-75e1-49b4-a1a6-f028eb5ed60e_2020-08-19-13.03.49.099000::uxPageRequestId::af224edb-667a-42ef-a534-01911115258b::pageName::retirement-election::deviceType::null::sessionCreatedTimestamp::2020-08-19-13.03.49.099000::widgetName::null::ds::2020-08-19::\",\"clientId\":\"19941\",\"systemTickets\":[{\"key\":\"D$9B\",\"value\":\"CT6C - 0004725 - 4733 - g6mWbUb7b0W - CT6C0004725\"}]}";
    getItem(name: any, storageType?: string, isCookieNeeded?: boolean): any {
        return this.dom;
    }
    setItem(name: any, storageType?: string, isCookieNeeded?: boolean): any {
        return this.dom;
    }
}

