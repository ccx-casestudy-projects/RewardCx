public with sharing class genericDataTableController {
    
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecords(String objectName,List<String> columns) {
        
        String query;
        List<SObject> records= new List<SObject>();
        if(objectName!=null)
        {     
            if(objectName=='User'){
                records =[Select Id,Name,Phone ,RWD_CX__Station__c,RWD_CX__Aadhar_Number__c,Profile.Name from User Where IsActive = true AND ( Profile.Name='System Administrator' OR Profile.Name= 'Standard User' )];
                //query = 'SELECT ' + String.join(columns, ',') + ' FROM ' + objectName + ' where IsActive='+true+' WITH SECURITY_ENFORCED ORDER BY CreatedDate  DESC ';
            	//query = String.escapeSingleQuotes(query);
            }else{
                query = 'SELECT ' + String.join(columns, ',') + ' FROM ' + objectName + '  WITH SECURITY_ENFORCED ORDER BY CreatedDate  DESC ';
                query = String.escapeSingleQuotes(query);
                records= Database.query(query);
            }
         }
        
        return records;
        
    }
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecords1( String type,Id cid,string objectapiname) {
        
        String query;
        List<SObject> records= new List<SObject>();
        if(type!='empolyee')
        {  
            if(objectapiname=='RWD_CX__Claim__c'){
                list<Claim__c> Customer = [select Id,Name,Station__r.Name,Customer__r.Name__c,Gift__r.Gift_Name__c,
                                           CreatedDate,Quantity_Claimed__c from Claim__c
                                           WHERE Customer__c =:cid WITH SECURITY_ENFORCED];
                
                records.addAll(Customer); 
            }
            else{
                list<Sales__c> Customer = [select Id,Name,Station__r.Name,Customer__r.Name__c,
                                           Employees__r.Name,CreatedDate,Amount__c from Sales__c
                                           WHERE Customer__c =:cid WITH SECURITY_ENFORCED];
                
                records.addAll(Customer); 
                
            }
        }
        else
        {   
            list<Sales__c> Customer = [select Id,Name,Station__r.Name,Customer__r.Name__c,Employees__r.Name,
                                       CreatedDate,Amount__c from Sales__c
                                       WHERE Employees__c =:cid WITH SECURITY_ENFORCED];
            records.addAll(Customer);          
        }          
        return records;
        
    }
    
    @AuraEnabled
    public static List<Sales__c> searchDate(DATE dateStr1, DATE dateStr2){
        
        List<Sales__c> salesObj = [SELECT Id, Name, Customer__c, Employees__c,  Amount__c, Station__c,
                                   CreatedDate FROM Sales__c WHERE CreatedDate >= :dateStr1 AND CreatedDate <= :dateStr2 WITH SECURITY_ENFORCED];
        
        RETURN salesObj;
    }
    
    @AuraEnabled
    public static void deleteSelectedRecords(List<Id> idList) {
        String objectApiName ='' ; 
        Boolean isDeletablecheck = false;
        if (idList == null || idList.isEmpty()) {
            return;
        }
        
        for (Id recordId : idList) {
            if (objectApiName == null || objectApiName == '') {
                objectApiName = recordId.getSObjectType().getDescribe().getName();
            }
            break;
        }
        if(objectApiName == 'RWD_CX__Sales__c'){
            List<Sales__c> objlst = [Select Id from Sales__c where Id IN : idList WITH SECURITY_ENFORCED];
            if(Schema.sObjectType.Sales__c.isDeletable()){
                delete objlst;
            }
           
        }
        if(objectApiName == 'RWD_CX__Station__c'){
            if(Schema.sObjectType.Station__c.isDeletable()){
                List<Station__c> objlst = [Select Id from Station__c where Id IN : idList WITH SECURITY_ENFORCED];
                delete objlst;
            }
        }
        if(objectApiName == 'User'){
            if(Schema.sObjectType.User.isUpdateable()){
                // delete objlst;
                List<User> objlst = [Select Id,IsActive from User where Id IN : idList WITH SECURITY_ENFORCED];
                for(User us : objlst){
                    us.IsActive = false;
                }
                update objlst;
            }
        }
        if(objectApiName == 'RWD_CX__Claim__c'){
            if(Schema.sObjectType.Claim__c.isDeletable()){
                List<Claim__c> objlst = [Select Id from Claim__c where Id IN : idList WITH SECURITY_ENFORCED];
                delete objlst;
            }
        }
        if(objectApiName == 'RWD_CX__Customer__c' ){
            if(Schema.sObjectType.Customer__c.isDeletable()){
                List<Customer__c> objlst = [Select Id from Customer__c where Id IN : idList WITH SECURITY_ENFORCED];
                delete objlst;
            }
        }
        if(objectApiName == 'RWD_CX__Gift__c'){
            if(Schema.sObjectType.Gift__c.isDeletable()){
                List<Gift__c> objlst = [Select Id from Gift__c where Id IN : idList WITH SECURITY_ENFORCED];
                delete objlst;
            }
        }
        if(objectApiName == 'RWD_CX__Station_Gifts__c'){
            if(Schema.sObjectType.Station_Gifts__c.isDeletable()){
                List<Station_Gifts__c> objlst = [Select Id from Station_Gifts__c where Id IN : idList WITH SECURITY_ENFORCED];
                delete objlst;
            }
        }
        if(objectApiName == 'RWD_CX__Assign_Store__c'){
            if(Schema.sObjectType.Assign_Store__c.isDeletable()){
                List<Assign_Store__c> objlst = [Select Id from Assign_Store__c where Id IN : idList WITH SECURITY_ENFORCED];
                delete objlst;
            }
        }
         /*Database.DeleteResult[] deleteResults = Database.delete(idList, false);
            system.debug('isDeletablecheck objectApiName '+objectApiName);
            for (Database.DeleteResult result : deleteResults) {
                if (!result.isSuccess()) {
                    for (Database.Error err : result.getErrors()) {
                        System.debug('Error deleting record: ' + err.getMessage());
                    }
                }
            }*/
        
    }
    
   
    
}