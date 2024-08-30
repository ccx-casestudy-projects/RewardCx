public with sharing class salescreation {
    
    
    @AuraEnabled
    public static void creation(id customerid,id empid,integer gasamount,string billnumber){
        List<Pricing_Configuration__c > rangeList =[SELECT Id,Amount__c,Points__c 
                                                    from Pricing_Configuration__c WITH SECURITY_ENFORCED
                                                    order By Amount__c desc Limit 10000 ];
        Decimal earnedPoints = 0;

        Id storeid = [select id,User__c,Store__c from Assign_Store__c where User__c=:empid and Store__c!=''].Store__c;
        if (Schema.sObjectType.Sales__c.isCreateable()) {
        Sales__c sale = new Sales__c();
        sale.Amount__c = gasamount;
        sale.Customer__c = customerid;
        sale.Station__c=storeid;
        sale.Employees__c = empid;
        sale.Bill_Number__c=billnumber;
        insert sale;
        }
        System.debug(rangeList+'rangeList');
        for(Pricing_Configuration__c pc :rangeList){
            if(pc.Amount__c > gasamount) {
                earnedPoints = pc.Points__c;
            } else {
                break;
            }
        }
         System.debug(earnedPoints+'earnedPoints');
        if (customerid != null && earnedPoints > 0) {
            if (Schema.sObjectType.Customer__c.isUpdateable()) {
                Customer__c custData = [Select Id,Name__c,Phone__c,Total_Loyality_Points__c,Aadhaar_Number__c from Customer__c where Id =: customerid WITH SECURITY_ENFORCED];
               if( custData.Total_Loyality_Points__c==null)
              {
                   custData.Total_Loyality_Points__c=0;
                  custData.Total_Loyality_Points__c += earnedPoints;
                  System.debug(custData.Total_Loyality_Points__c+'custData.Total_Loyality_Points__c');
              }else{
                custData.Total_Loyality_Points__c += earnedPoints;
                  System.debug(custData.Total_Loyality_Points__c+'custData.Total_Loyality_Points__c else');
              }
                update custData;
            }
        }

    }
    
    @AuraEnabled
    public static Decimal getDailyRates(Decimal amt){
        Pricing_Configuration__c pricing = [SELECT Name,Amount__c,Points__c,Id from Pricing_Configuration__c where Amount__c =: amt WITH SECURITY_ENFORCED];
        return pricing.Amount__c;
    }


}