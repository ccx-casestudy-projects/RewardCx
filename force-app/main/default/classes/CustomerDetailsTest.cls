@isTest
public class CustomerDetailsTest {
    @isTest
    static void testGetGiftsList() {
        // Create test Gift__c records
        List<Gift__c> testGifts = new List<Gift__c>();
        testGifts.add(new Gift__c(Gift_Name__c = 'Gift 1', Points__c = 10));
        testGifts.add(new Gift__c(Gift_Name__c = 'Gift 2', Points__c = 20));
        testGifts.add(new Gift__c(Gift_Name__c = 'Gift 3', Points__c = 5));

        insert testGifts;

        // Call the getGiftsList method
        List<Gift__c> result = CustomerDetails.getGiftsList();

        // Assert that the result is not null and contains the expected number of records
        System.assertNotEquals(null, result);
        System.assertEquals(3, result.size());

        // Assert that the records are sorted by Points__c in ascending order
        System.assertEquals('Gift 3', result[0].Gift_Name__c);
        System.assertEquals('Gift 1', result[1].Gift_Name__c);
        System.assertEquals('Gift 2', result[2].Gift_Name__c);
    }

    @isTest
    static void testGetCustomer() {
        // Create a test Customer__c record
        Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer',Phone__c = '9876543218');
        insert testCustomer;

        // Call the getCustomer method
        Customer__c result = CustomerDetails.getCustomer('9876543218');

        // Assert that the result is not null and has the expected values
        System.assertNotEquals(null, result);
        System.assertEquals(testCustomer.Name__c, result.Name__c);
        System.assertEquals(testCustomer.Phone__c, result.Phone__c);
    }
}