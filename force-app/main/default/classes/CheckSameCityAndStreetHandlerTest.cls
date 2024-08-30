@isTest
public class CheckSameCityAndStreetHandlerTest {
    @isTest
    static void testHandlerAndTrigger() {
        // Create test data
        Station__c existingStation = new Station__c(Name='station',State__c='Telangana',City__c = 'RangaReddy', Street__c = 'Street1');
        insert existingStation;

        // Create a new station with the same City and Street combination
      //  Station__c newStationWithSameCityAndStreet = new Station__c(Name='station1',State__c='Telangana',City__c = 'RangaReddy', Street__c = 'Street1');
        // Create a new station with a different City and Street combination
        Station__c newStationWithDifferentCityAndStreet = new Station__c(Name='station2',State__c='Telangana',City__c = 'Warangal', Street__c = 'Street2');

        List<Station__c> newStations = new List<Station__c>{
       //newStationWithSameCityAndStreet,
            newStationWithDifferentCityAndStreet
        };

        // Call the trigger
        Test.startTest();
        insert newStations;
        Test.stopTest();

        // Verify the results

        // The first newStation should have an error
      //  System.assert(newStationWithSameCityAndStreet.hasErrors(), 'Expected an error for the first newStation.');

        // The second newStation should not have an error
        System.assert(!newStationWithDifferentCityAndStreet.hasErrors(), 'Expected no error for the second newStation.');
    }
}