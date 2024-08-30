@isTest
public class salescreationTest
{
   
    @isTest
    static void testCreation() {
        // Create a test Station record
        Station__c testStation = new Station__c(Name = 'Test Station');
        insert testStation;
        
        // Create a test Gas Rate record
        Pricing_Configuration__c price=new Pricing_Configuration__c();
        price.Name='110-220';
        price.Points__c=10;
        price.Amount__c=100;
        insert price;
        
         Pricing_Configuration__c price1=new Pricing_Configuration__c();
        price1.Name='110-220';
        price1.Points__c=10;
        price1.Amount__c=25;
        insert price1;
        // Create a test Employee record
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
        Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;

        // Create a test Customer record
        Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer', Total_Loyality_Points__c=0,Aadhaar_Number__c = '6574 5566 8545',Phone__c='9123067888');
        insert testCustomer;


        // Call the method to test
        // You need to ensure that the SalesCreation class is accessible and exists
        // and that it defines the creation method with the correct signature.
        SalesCreation.creation(testCustomer.Id, testEmployee.Id, 50, 'ADSDS');

        // Query for the Sales__c record that should have been inserted
        Sales__c insertedSale = [SELECT Amount__c, Customer__c, Employees__c,  Station__c FROM Sales__c LIMIT 1];

        // Assert the inserted Sale__c record
        System.assertEquals(50, insertedSale.Amount__c, 'The Amount should be 50');
        System.assertEquals(testCustomer.Id, insertedSale.Customer__c, 'The Customer should match the testCustomer Id');
        System.assertEquals(testEmployee.Id, insertedSale.Employees__c, 'The Employee should match the testEmployee Id');
        System.assertEquals(testStation.Id, insertedSale.Station__c, 'The Station should match the testStation Id');
    }
    
    
    @isTest
    static void GetDailyRates()
    {
       Pricing_Configuration__c price=new Pricing_Configuration__c();
        price.Name='110-220';
        price.Points__c=10;
        price.Amount__c=20;
        insert price;
        
         decimal result = salescreation.getDailyRates(20);

        // Assert that the method returns the expected value
        System.assertEquals(20, result);
    }

}