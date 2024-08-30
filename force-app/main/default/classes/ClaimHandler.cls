public with sharing class ClaimHandler {
    public static void updateGiftAndPoints(List<Claim__c> newClaims) 
    {
        List<id> claimId = new List<id>();
        list<id> gifts= new list<id>();
        list<id>  station=new list<id>();
        for (Claim__c cm : newClaims)
        {
            claimId.add(cm.Id);
            gifts.add(cm.Gift__c);
            station.add(cm.Station__c);
        }
        List<Customer__c> cusList = new List<Customer__c>();
        List<Claim__c> cmList = [SELECT Id, Customer__r.Id,Quantity_Claimed__c,Station__c, Customer__r.Total_Loyality_Points__c, 
                                 Gift__r.Points__c FROM Claim__c WHERE Id IN :claimId WITH SECURITY_ENFORCED];
        Map<id, Station_Gifts__c> mapName = new Map<id, Station_Gifts__c>();
        List<Station_Gifts__c> giftsToUpdate = new List<Station_Gifts__c>();
        Map<String, Station_Gifts__c> stationGiftsMap = new Map<String, Station_Gifts__c>();
        for (Station_Gifts__c gift : [SELECT Id, Quantity_Used__c, Gift__c, Station__c 
                                      FROM Station_Gifts__c 
                                      WHERE Gift__c IN :gifts AND Station__c IN :station WITH SECURITY_ENFORCED]) {
            stationGiftsMap.put(gift.Gift__c + '-' + gift.Station__c, gift);
        }
               
        for (Claim__c cu : cmList) {
            Decimal GiftPoints = cu.Gift__r.Points__c;
            if (cu.Gift__c != null) 
            {
                system.debug('cu.Gift__c'+cu.Gift__c);
                system.debug('cu.Station__c'+cu.Station__c);
                String key = cu.Gift__c + '-' + cu.Station__c;
                if (Schema.sObjectType.Station_Gifts__c.isUpdateable()) {
                    Station_Gifts__c gift = stationGiftsMap.get(key);
                    gift.Quantity_Used__c += cu.Quantity_Claimed__c;
                    giftsToUpdate.add(gift);
                }
            }
            if(cu.Customer__r.Total_Loyality_Points__c>=GiftPoints)
            {
                if (Schema.sObjectType.Customer__c.isUpdateable()) {
                    Customer__c cus = new Customer__c();
                    cus.Id = cu.Customer__r.Id;
                    GiftPoints=GiftPoints*cu.Quantity_Claimed__c;
                    cus.Total_Loyality_Points__c = cu.Customer__r.Total_Loyality_Points__c - GiftPoints;
                    cusList.add(cus); //Add the customer record to the list for update
                }
             }   
        }
        if (Schema.sObjectType.Station_Gifts__c.isUpdateable()) {
            if (!giftsToUpdate.isEmpty()){
                update giftsToUpdate;//Update Gift Data
            } 
        }  
        if (Schema.sObjectType.Customer__c.isUpdateable()) {
            if (!cusList.isEmpty()){
                update cusList; // Update the customer records
            }
        }
    }
}