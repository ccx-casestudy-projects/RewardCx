public with sharing class CustomerDetails {
    
    @AuraEnabled(cacheable=true)
    public static List<Gift__c> getGiftsList() {
        return [SELECT Id, Name, Gift_Name__c,Points__c,Gift_Image__c,Gift_Image_Link__c
                FROM Gift__c WITH SECURITY_ENFORCED ORDER BY Points__c ASC Limit 10000];
    }
    
    @AuraEnabled(cacheable=true)
    public static Customer__c getCustomer(String customerPhone) 
    {
        Customer__c customerInfo = [
            SELECT Name__c, Aadhaar_Number__c, Phone__c, Total_Loyality_Points__c,  LastModifiedDate 
            FROM Customer__c 
            WHERE Phone__c LIKE : '%' + customerPhone + '%' WITH SECURITY_ENFORCED
        ];
        return customerInfo;
    }
    
}