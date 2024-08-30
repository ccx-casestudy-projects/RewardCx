@isTest
public class ClaimHandlerTest {
    @isTest
    static void testUpdateGiftAndPoints() {
        // Create test data for Claims, Gifts, Stations, and Customers
        
        // Create a test Customer__c record
        Customer__c testCustomer = new Customer__c();
        testCustomer.Name__c = 'Test Customer';
        testCustomer.Phone__c = '9876543219';
        testCustomer.Aadhaar_Number__c = '1234 5678 9078';
        testCustomer.Total_Loyality_Points__c = 500;
        insert testCustomer;
        
        system.debug('testCustomer'+testCustomer);
        
        // Create a test Gift__c record
        Gift__c testGift = new Gift__c();
        testGift.Gift_Name__c = 'Gift 1';
        testGift.Points__c = 20; 
        insert testGift;
        
        system.debug('testGift'+testGift);
        
        // Create a test Station__c record
        Station__c testStation = new Station__c();
        testStation.Name = 'Test Station';
        insert testStation;
        
        system.debug('testStation'+testStation);
        
        // Create a test Station_Gifts__c record
        Station_Gifts__c testGiftRecord = new Station_Gifts__c();
        testGiftRecord.Quantity_Used__c = 1;
        testGiftRecord.Gift__c = testGift.Id;
        testGiftRecord.Station__c = testStation.Id;
        insert testGiftRecord;
        
        system.debug('testGiftRecord'+testGiftRecord);
        
        testCustomer = [SELECT Id FROM Customer__c WHERE Name__c = 'Test Customer' LIMIT 1];
        testGift = [SELECT Id FROM Gift__c WHERE Gift_Name__c = 'Gift 1' LIMIT 1];
        testStation = [SELECT Id FROM Station__c WHERE Name = 'Test Station' LIMIT 1];
        testGiftRecord = [SELECT Id FROM Station_Gifts__c WHERE Quantity_Used__c = 1 LIMIT 1];
        
        // Create a test Claim__c record
        Claim__c testClaim = new Claim__c();
        testClaim.Customer__c = testCustomer.Id; 
        testClaim.Gift__c = testGift.Id;
        testClaim.Station__c = testStation.Id;
        testClaim.Quantity_Claimed__c = 5;
        insert testClaim;
        
        system.debug('testClaim'+testClaim);
        
        // Start the test
        Test.startTest();

        // Call the method under test
        List<Claim__c> claimsToUpdate = new List<Claim__c>{ testClaim };
        ClaimHandler.updateGiftAndPoints(claimsToUpdate);
        
        system.debug('claimsToUpdate'+claimsToUpdate);

        // Query the updated records
        List<Customer__c> updatedCustomers = [SELECT Total_Loyality_Points__c FROM Customer__c WHERE Id = :testCustomer.Id];
        List<Station_Gifts__c> updatedStationGifts = [SELECT Quantity_Used__c FROM Station_Gifts__c WHERE Id = :testGiftRecord.Id];

        // Assert that the Customer's Total_Loyalty_Points__c and Station_Gifts__c's Quantity_Used__c are updated as expected
        System.assertEquals(300, updatedCustomers[0].Total_Loyality_Points__c, 'Customer loyalty points not updated correctly');
        System.assertEquals(11, updatedStationGifts[0].Quantity_Used__c, 'Station gift quantity used not updated correctly');

        // End the test
        Test.stopTest();
    }
}