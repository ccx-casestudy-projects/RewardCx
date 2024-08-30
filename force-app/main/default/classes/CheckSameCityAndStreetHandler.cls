public with sharing class CheckSameCityAndStreetHandler {
    public static void handleBeforeInsert(List<Station__c> newStation) {
        Set<String> uniqueCityStreetSet = new Set<String>();

        for (Station__c existingStation : [SELECT City__c, Street__c FROM Station__c WHERE City__c != null AND Street__c != null WITH SECURITY_ENFORCED]) {
            String cityStreet = existingStation.City__c + existingStation.Street__c;
            uniqueCityStreetSet.add(cityStreet);
        }

        for (Station__c Station : newStation) {
            String cityStreet = Station.City__c + Station.Street__c;
            if (uniqueCityStreetSet.contains(cityStreet)) {
                Station.addError('Records with the same City and Street are not allowed.');
            }
        }
    }
}