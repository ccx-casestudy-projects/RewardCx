trigger CheckSameCityAndStreetTrigger on Station__c (before insert) {
  CheckSameCityAndStreetHandler.handleBeforeInsert(trigger.new);
}