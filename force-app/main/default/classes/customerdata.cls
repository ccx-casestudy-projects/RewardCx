public with sharing class customerdata {
    //Get Customer__c Details
    //   public Boolean isCreateable{get;set;}
    @AuraEnabled
    public static Customer__c getCustomerInfo(string customerPhone) 
    {
        Customer__c Customer = [SELECT Id,Aadhaar_Number__c,Name,Name__c,Phone__c,Total_Loyality_Points__c
                             FROM Customer__c 
                             WHERE Id=:customerPhone  WITH SECURITY_ENFORCED];
        return Customer;  
    }
    @AuraEnabled
    public static Customer__c getCustomerInfo1(string phone) 
    {
        Customer__c Customer = [SELECT Id,Aadhaar_Number__c,Name,Name__c,Phone__c,Total_Loyality_Points__c,(select Id,Name,Station__r.Name,Customer__r.Name__c,Employees__r.Name,CreatedDate,Amount__c from Sales__r) 
                             FROM Customer__c 
                             WHERE Id=:phone WITH SECURITY_ENFORCED];
        return Customer;  
    }
     @AuraEnabled
    public static user getEmpolyeeInfo(string empid) 
    {
        user emp = [SELECT Id,Name,Phone,Station__c,LastName,Aadhar_Number__c,(select Id,Name,Station__r.Name,Customer__r.Name__c,Employees__r.Name,CreatedDate,Amount__c from Sales__r) 
                             FROM user 
                             WHERE Id =:empid WITH SECURITY_ENFORCED];
        return emp;  
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<Gift__c> getGiftsList(Id empid) 
    {
        user emp=[SELECT Id,Name,Station__c FROM user WHERE Id=:empid];
        id storeid=[select id,User__c,Store__c from Assign_Store__c where User__c=:empid and Store__c!=''].Store__c;
        list<Station_Gifts__c> stationGifts=[select id,name,Quantity_InStock__c, Gift__c,Station__c 
                                             from Station_Gifts__C where Quantity_InStock__c >=1 AND Station__c =:storeid WITH SECURITY_ENFORCED];
        list<id> giftsids=new list<id>();
        for(Station_Gifts__c gifts:stationGifts){
            giftsids.add(gifts.Gift__c);
        }
        return [SELECT Id, Name, Gift_Name__c,Points__c,Gift_Image__c,Gift_Image_Link__c
                FROM Gift__c where id In : giftsids WITH SECURITY_ENFORCED order by RWD_CX__Points__c Asc];
    }
    
    //Claim Record Creation    
    @AuraEnabled
    public static void insertClaim(id CustomerName, id GiftName, id empid,Integer quantity) 
    {
        user emp= [select Station__c from user where id=:empid];
         id storeid=[select id,User__c,Store__c from Assign_Store__c where User__c=:empid and Store__c!=''].Store__c;
       if (Schema.sObjectType.Claim__c.isCreateable()) {
            Claim__c claim=new Claim__c();
            claim.Customer__c=CustomerName;
            claim.Gift__c=GiftName;
            claim.Station__c=storeid;
            claim.Quantity_Claimed__c=quantity;
            insert claim;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Station_Gifts__c> fetchGiftNames(Id empid) {
        List<Station_Gifts__c> giftNames = new List<Station_Gifts__c>();
        
        user emp=[SELECT Id,Name,Station__c FROM user WHERE Id=:empid];
        id storeid=[select id,User__c,Store__c from Assign_Store__c where User__c=:empid and Store__c!=''].Store__c;
          system.debug(storeid+'storeid');
        List<Station_Gifts__c> sgift = [SELECT Id,Name,Gift__r.Gift_Name__c,Quantity_InStock__c,Restock_Level__c FROM Station_Gifts__c where Station__c=:storeid WITH SECURITY_ENFORCED];
        system.debug(sgift+'sgift');
        for(Station_Gifts__c gifts:sgift){
                giftNames.add(gifts);
            
        }
        system.debug(giftNames+'giftNames');
        return giftNames;
    }
    
    //Update Gift Record When it Reaches to Restock Level    
    @AuraEnabled
    public static void updateGift(id GiftId,integer qty,id empid) 
    {
        user emp=[SELECT Id,Name,Station__c FROM user WHERE Id=:empid];
        id storeid=[select id,User__c,Store__c from Assign_Store__c where User__c=:empid and Store__c!=''].Store__c;
        if (Schema.sObjectType.Station_Gifts__c.isUpdateable()) {
            Station_Gifts__c gift=[select id,name,Quantity_Added__c, Gift__c,Station__c 
                                   from Station_Gifts__C where Gift__c=:GiftId   AND Station__c =:storeid WITH SECURITY_ENFORCED];
            
            gift.Quantity_Added__c+=qty;
            update gift;
        }
    }
    
    @AuraEnabled
    public static Integer getClaimRecordCount(String customerId) 
    {
		Integer count = 0;
        List<RWD_CX__Customer__c> lst =[SELECT Id,RWD_CX__Aadhaar_Number__c,Name,RWD_CX__Name__c,RWD_CX__Phone__c,RWD_CX__Total_Loyality_Points__c,(Select Id from RWD_CX__Claim__r) FROM RWD_CX__Customer__c where Id =:customerId];
        for(RWD_CX__Customer__c ls :lst){
            count = ls.RWD_CX__Claim__r.size();
        }
       
        return count;
    }
    
}