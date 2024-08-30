@isTest
public class FetchObjectRecordsTest
{
 
	@isTest
    static void testGetCustomerGiftsList() 
    {
        // Create a test Gift__c record
        Gift__c testGift = new Gift__c(Gift_Name__c = 'Test Gift', Points__c = 50);
        insert testGift;

        // Call the getCustomerGiftsList method
        List<Gift__c> result = FetchObjectRecords.getCustomerGiftsList();

        // Assert that the result is not null and contains the expected values
        System.assertNotEquals(null, result);
        System.assertEquals(1, result.size());
        System.assertEquals(testGift.Id, result[0].Id);
    }
     @isTest
    static void testInsertGift() {
        // Call the insertGift method with valid data
        Test.startTest();
        FetchObjectRecords.insertGift('New Gift', 100, 5, 'https://example.com/image.png');
        Test.stopTest();

        // Query the inserted Gift__c record
        List<Gift__c> insertedGifts = [SELECT Id, Gift_Name__c, Points__c, Gift_Image_Link__c FROM Gift__c WHERE Gift_Name__c = 'New Gift'];

        // Assert that the Gift__c record has been inserted with the correct values
        System.assertNotEquals(null, insertedGifts);
        System.assertEquals(1, insertedGifts.size());
        System.assertEquals('New Gift', insertedGifts[0].Gift_Name__c);
        System.assertEquals(100, insertedGifts[0].Points__c);
    }
}