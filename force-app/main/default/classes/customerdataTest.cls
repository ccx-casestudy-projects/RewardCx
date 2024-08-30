@isTest
public class customerdataTest {
    @isTest
    static void testGetCustomerInfo() 
    {
        // Create a test Customer__c record
        Customer__c testCustomer = new Customer__c(Phone__c = '9876543216');
        insert testCustomer;

        // Call the getCustomerInfo method
        Customer__c result = customerdata.getCustomerInfo('9876543216');

        // Assert that the result is not null and has the expected values
        System.assertNotEquals(null, result);
        System.assertEquals(testCustomer.Id, result.Id);
    }
    @isTest
    static void testGetCustomerInfo1() 
    {
        // Create a test Customer__c record
        Customer__c testCustomer = new Customer__c(Name__c='Test Customer',Aadhaar_Number__c='6534 9824 2573',Phone__c='9876543217');
        insert testCustomer;

        // Call the getCustomerInfo1 method
        Customer__c result = customerdata.getCustomerInfo1('9876543217');

        // Assert that the result is not null and has the expected values
        System.assertNotEquals(null, result);
        System.assertEquals(testCustomer.Id, result.Id);
        // Add more assertions for other fields if needed
    }
    
    @isTest
    static void testGetEmployeeInfo() {
        // Create a test Employee record
        Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
            // Create a test employee record
            user testEmployee = new user( ProfileId = profile.Id,
                Username = 'shruUsercc@example.com',
                Email = 'shcru@example.com',
                LastName = 'Process',
                Alias = 'trshcr',
                TimeZoneSidKey = 'America/New_York',
                LocaleSidKey = 'en_US',
                EmailEncodingKey = 'UTF-8',
                LanguageLocaleKey = 'en_US',
                                         phone='1234567890',
                Aadhar_Number__c='1234 5678 9012',Employee_Type__c='Sales');
            insert testEmployee;
    
        // Create a test Station record
        Station__c testStation = new Station__c(Name = 'Test Station');
        insert testStation;
            Assign_Store__c store= new Assign_Store__c();
            store.User__c=testEmployee.id;
            store.Store__c=testStation.id;
            insert store;
    
        // Create a test Customer record
        Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer', Aadhaar_Number__c = '1764 5678 9012', Phone__c = '9876543215');
        insert testCustomer;
    
        // Create a test Sales record related to the Employee
        Sales__c testSales = new Sales__c(Employees__c = testEmployee.Id, Station__c = testStation.Id, Customer__c = testCustomer.Id, Amount__c = 100, Bill_Number__c = 'WRFSDSGD');
        insert testSales;
    
        // Start Test
        Test.startTest();
    
        // Call the method to test
        user emp = [SELECT Id, Aadhar_Number__c, Name,LastName,  Phone, Station__c,
                           (SELECT Id, Name, Station__r.Name, Customer__r.Name__c, Employees__r.Name, CreatedDate, 
                            Amount__c FROM Sales__r)
                           FROM user
                           where id=:testEmployee.Id];
            customerdata.getEmpolyeeInfo(emp.Phone);
    
        // End Test
        Test.stopTest();
    
        // Assert the result
        System.assertNotEquals(null, emp, 'Employee record should be retrieved');
        System.assertEquals('Process', emp.LastName, 'Employee Name should match');
        System.assertEquals('1234 5678 9012', emp.Aadhar_Number__c, 'Aadhar Number should match');
        System.assertEquals('1234567890', emp.Phone, 'Phone should match');
    
        // Verify related Sales records
        System.assertNotEquals(null, emp.Sales__r, 'Sales records should be queried');
        System.assertEquals(1, emp.Sales__r.size(), 'There should be one related Sales record');
        Sales__c relatedSales = emp.Sales__r[0];
        System.assertEquals(100, relatedSales.Amount__c, 'Amount should match');
    }
    
    @isTest
    static void testGetGiftsList() {
         Station__c testStation = new Station__c(Name = 'Test Station');
        insert testStation;
        // Create a test Employee__c record
        Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
       user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'Test Employee',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
                                     phone='1234567890',
            Aadhar_Number__c='1234 5678 9012',Employee_Type__c='Sales');
        insert testEmployee;
        Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;
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

        // Call the getGiftsList method
        List<Gift__c> result = customerdata.getGiftsList(testEmployee.Id);

        // Assert that the result is not null and has the expected values
        System.assertNotEquals(null, result);
    }
    
     @isTest
    static void testInsertClaim() {
        Station__c testStation = new Station__c(Name = 'Test Station');
        insert testStation;
        // Create a test Employee__c record
        Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'Test Employee',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            Station__c=testStation.Id,
            phone='1234567890',
            Aadhar_Number__c='1234 5678 9012',Employee_Type__c='Sales');
        insert testEmployee;
        Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;

        // Create a test Customer__c record
        Customer__c testCustomer = new Customer__c(Name__c = 'Test Customer',Phone__c='9876543244');
        insert testCustomer;

        // Create a test Gift__c record
        Gift__c testGift = new Gift__c(Gift_Name__c = 'Test Gift');
        insert testGift;
        Station_Gifts__c testStationGift = new Station_Gifts__c(Quantity_Added__c = 10, Gift__c = testGift.Id,Station__c = testStation.Id);
        insert testStationGift;
        // Call the insertClaim method
        Test.startTest();
        customerdata.insertClaim(testCustomer.Id, testGift.Id, testEmployee.Id,10);
        List<Claim__c> claims = [SELECT Id, Customer__c, Gift__c, Quantity_Claimed__c
                             FROM Claim__c 
                             WHERE Customer__c = :testCustomer.Id 
                             AND Gift__c = :testGift.Id AND Quantity_Claimed__c = 10];
        System.assertEquals(1, claims.size(), 'There should be exactly one Claim__c record.');
        Test.stopTest();
	}
    
  @isTest
    static void testFetchGiftNames() {
        // Create a test Station
        Station__c testStation = new Station__c(Name = 'Test Station');
        insert testStation;

        // Create a test Employee
       Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'Test Employee',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
                                     Station__c=testStation.Id,
                                     phone='1234567890',
            Aadhar_Number__c='1234 5678 9012',Employee_Type__c='Sales');
        insert testEmployee;
		Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;
        // Create some test Gifts with Station_Gifts records
        Gift__c gift1 = new Gift__c(Gift_Name__c = 'Gift 1');
        insert gift1;

        Station_Gifts__c stationGift1 = new Station_Gifts__c(Gift__c = gift1.Id, Station__c = testStation.Id);
        insert stationGift1;

        Gift__c gift2 = new Gift__c(Gift_Name__c = 'Gift 2');
        insert gift2;

        Station_Gifts__c stationGift2 = new Station_Gifts__c(Gift__c = gift2.Id, Station__c = testStation.Id);
        insert stationGift2;

        // Call the fetchGiftNames method
        Test.startTest();
        List<Gift__c> result = customerdata.fetchGiftNames(testEmployee.Id);
        Test.stopTest();

        // Assert that the expected gifts are in the result
        System.assertEquals(2, result.size(), 'Two gifts should be returned');
        System.assertEquals('Gift 1', result[0].Gift_Name__c, 'First gift name should match');
        System.assertEquals('Gift 2', result[1].Gift_Name__c, 'Second gift name should match');
    }
    
    @isTest
    static void testUpdateGift() {
        // Create a test Station
        Station__c testStation = new Station__c(Name = 'Test Station');
        insert testStation;

        Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        user testEmployee = new user( ProfileId = profile.Id,
            Username = 'shruUsercc@example.com',
            Email = 'shcru@example.com',
            LastName = 'Test Employee',
            Alias = 'trshcr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
                                     phone='1234567890',
                                Station__c=testStation.Id,     
            Aadhar_Number__c='1234 5678 9012',Employee_Type__c='Sales');
        insert testEmployee;
           Assign_Store__c store= new Assign_Store__c();
        store.User__c=testEmployee.id;
        store.Store__c=testStation.id;
        insert store;
        // Create a test Gift
        Gift__c testGift = new Gift__c(Gift_Name__c = 'Test Gift');
        insert testGift;

        // Create a Station_Gifts record
        Station_Gifts__c testStationGift = new Station_Gifts__c(Quantity_Added__c = 10, Gift__c = testGift.Id,Station__c = testStation.Id);
        insert testStationGift;

        // Call the updateGift method
        Test.startTest();
        customerdata.updateGift(testGift.Id, 5, testEmployee.Id);
        Test.stopTest();

        // Query the updated Station_Gifts record
        Station_Gifts__c updatedStationGift = [SELECT Quantity_Added__c FROM Station_Gifts__c WHERE Id = :testStationGift.Id];

        // Assert that the quantity has been updated
        System.assertEquals(15, updatedStationGift.Quantity_Added__c, 'Gift quantity should be updated');
    }
}