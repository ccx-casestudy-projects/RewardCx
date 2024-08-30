public with sharing class FetchObjectRecords {
   
    //Customer Gifts
    @AuraEnabled(cacheable=true)
    public static List<Gift__c> getCustomerGiftsList() {
        List<Gift__c> gifts= [SELECT Id, Name, Gift_Name__c,Points__c,Gift_Image__c,Gift_Image_Link__c
                FROM Gift__c WITH SECURITY_ENFORCED  Limit 10000];
        return gifts;
    }
   
    //Create Gift Record
    @AuraEnabled
    public static void insertGift(String Name,Integer Points, Integer Qty, String ImageUrl)
    {
           if (Schema.sObjectType.Gift__c.isCreateable()) {
            Gift__c gift=new Gift__c();
            gift.Gift_Name__c=Name;
            gift.Points__c=Points;
            gift.Gift_Image_Link__c=ImageUrl;
            insert gift;
        
        }
    }
}