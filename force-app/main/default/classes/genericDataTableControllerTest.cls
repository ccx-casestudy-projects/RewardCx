@isTest
public class genericDataTableControllerTest
{
    @isTest
    static void testGetRecords() {
        // Create test data and insert SObjects (replace with your object and fields)
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        // Call the getRecords method
        List<SObject> records = genericDataTableController.getRecords('Account', new List<String>{'Name'});
        
        // Assert that the records were retrieved
        System.assertEquals(1, records.size());
        System.assertEquals(testAccount.Id, records[0].get('Id'));
        System.assertEquals(testAccount.Name, records[0].get('Name'));
        
        // Clean up test data
        delete testAccount;
    }

    @isTest
    static void testGetRecords1() {
        // Test getRecords1 method for 'employee' branch
       Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        // Create a test employee record
        user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'shcru',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            Aadhar_Number__c='6554 5566 8545',Employee_Type__c='Sales');
        insert testEmployee;
        List<SObject> recordsEmployee = genericDataTableController.getRecords1('employee', testEmployee.Id,'');
        System.assertNotEquals(null, recordsEmployee);
        
        // Test getRecords1 method for 'customer' branch
        Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer',Aadhaar_Number__c='5643 6423 4588',Phone__c = '9876543266');
        insert testCustomer;
        List<SObject> recordsCustomer = genericDataTableController.getRecords1('customer', testCustomer.Id,'');
        System.assertNotEquals(null, recordsCustomer);
    }
    
      @isTest
    static void testGetRecords2() {
        // Test getRecords1 method for 'employee' branch
       Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        // Create a test employee record
        user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'shcru',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            Aadhar_Number__c='6554 5566 8545',Employee_Type__c='Sales');
        insert testEmployee;
        Station__c testStation = new Station__c(Name = 'Test Station');
    insert testStation;
        Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;
         Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer',Aadhaar_Number__c='5643 6423 4588',Phone__c = '9876543266');
        insert testCustomer;
        
        // Test getRecords1 method for 'customer' branch
       
            Sales__c testSales = new Sales__c(Employees__c = testEmployee.Id, Station__c = testStation.Id, Customer__c = testCustomer.Id, Amount__c = 100, Bill_Number__c = 'WRFSDSGD');
    insert testSales;
        List<SObject> recordsCustomer = genericDataTableController.getRecords1('empolyee', testEmployee.Id,'Sales__c');
        System.assertNotEquals(null, recordsCustomer);
    }

     @isTest
    static void testGetRecords3() {
        // Test getRecords1 method for 'employee' branch
       Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        // Create a test employee record
        user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'shcru',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            Aadhar_Number__c='6554 5566 8545',Employee_Type__c='Sales');
        insert testEmployee;
        Station__c testStation = new Station__c(Name = 'Test Station');
    insert testStation;
        Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;
         Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer',Aadhaar_Number__c='5643 6423 4588',Phone__c = '9876543266',Total_Loyality_Points__c=100);
        insert testCustomer;
        
        // Test getRecords1 method for 'customer' branch
       
            Sales__c testSales = new Sales__c(Employees__c = testEmployee.Id, Station__c = testStation.Id, Customer__c = testCustomer.Id, Amount__c = 100, Bill_Number__c = 'WRFSDSGD');
    insert testSales;
         Gift__c gf=new Gift__c();
        gf.Gift_Name__c='bottle';
        gf.Points__c=10;
        insert gf;
        
        Station_Gifts__c gifts = new Station_Gifts__c();
        gifts.Gift__c=gf.Id;
        gifts.Quantity_Added__c=100;
        gifts.Station__c=testStation.Id;
        gifts.Restock_Level__c=10;
        insert gifts;
        Claim__c claim=new Claim__c();
        claim.Station__c=testStation.Id;
        claim.Quantity_Claimed__c=2;
        claim.Gift__c=gf.Id;
        claim.Customer__c=testCustomer.Id;
         List<SObject> recordsCustomer = genericDataTableController.getRecords1('customer', testCustomer.Id,'Claim__c');
        System.assertEquals(1, recordsCustomer.size());
    }  
    @isTest
    static void testSearchDate() {
        // Test searchDate method
        Date startDate = Date.today().addDays(-5);
        Date endDate = Date.today();
        List<Sales__c> salesList = genericDataTableController.searchDate(startDate, endDate);
        System.assertNotEquals(null, salesList);
    }

    @isTest
    static void testDeleteSelectedRecords() {
        // Create a test record to delete
        Customer__c testSales = new Customer__c(Name__c='Test Customer',Aadhaar_Number__c='5643 6423 4588',Phone__c = '9876549916');
        insert testSales;
        
        // Test deleteSelectedRecords method
        List<Id> idList = new List<Id>{testSales.Id};
        Test.startTest();
        genericDataTableController.deleteSelectedRecords(idList);
        Test.stopTest();
        
        // Verify that the record has been deleted
        List<Customer__c> salesList = [SELECT Id FROM Customer__c WHERE Id = :testSales.Id];
        System.assertEquals(0, salesList.size());
    }
     @isTest
    static void testDeleteemptyRecords() {
        
        // Test deleteSelectedRecords method
        List<Id> idList = new List<Id>();
        Test.startTest();
        genericDataTableController.deleteSelectedRecords(idList);
        Test.stopTest();
        
        // Verify that the record has been deleted
        List<Customer__c> salesList = [SELECT Id FROM Customer__c WHERE Id IN :idList];
        System.assertEquals(0, salesList.size());
    }

}