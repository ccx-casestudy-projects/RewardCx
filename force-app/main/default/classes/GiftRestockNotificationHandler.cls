public with sharing class GiftRestockNotificationHandler
{
    public static void sendNotification(List<Station_Gifts__c> giftList)
    {
        CustomNotificationType restockNotification = [SELECT Id, DeveloperName
                                                     FROM CustomNotificationType 
                                                     WHERE DeveloperName = 'Notification_For_Manager' WITH SECURITY_ENFORCED
                                                     LIMIT 1];

        List<Messaging.CustomNotification> customNotificationsToSend = new List<Messaging.CustomNotification>();
        List<Messaging.SingleEmailMessage> emailNotificationsToSend = new List<Messaging.SingleEmailMessage>();

        set<Id> stationIds = new set<Id>();
        set<Id> giftIds = new set<Id>();
        for (Station_Gifts__c gift : giftList) {
            if(gift.Station__c != null){
                stationIds.add(gift.Station__c);
            }
            if(gift.Gift__c != null){
                giftIds.add(gift.Gift__c);
            }
        }
        
        User loggedInUser = [select id,Email from User where Id =: UserInfo.getUserId()];
        
        map<Id,Station__c> mapStation = new map<Id,Station__c>([SELECT Name from Station__c where Id IN:stationIds  WITH SECURITY_ENFORCED]);
        map<Id,Gift__c> mapGift = new map<Id,Gift__c>([SELECT Gift_Name__c FROM Gift__c WHERE Id IN :giftIds  WITH SECURITY_ENFORCED]);
        
        for (Station_Gifts__c gift : giftList) 
        {
            if (gift.Quantity_InStock__c <= gift.Restock_Level__c) 
            {
                // Query for the related gift's name
                String storeName = mapStation.get(gift.Station__c).Name;
                Gift__c relatedGift = mapGift.get(gift.Gift__c);
                String body = 'Gift ' + relatedGift.Gift_Name__c + ' has fallen to or below the restock level for Station: ' + storeName;

                // Create and send custom notification
                Messaging.CustomNotification customNotification = new Messaging.CustomNotification();
                customNotification.setNotificationTypeId(restockNotification.Id);
                customNotification.setSenderId(Userinfo.getUserId());
                customNotification.setBody(body);
                customNotification.setTitle('Gift Restock Needed');
                customNotification.setTargetId(gift.Id);
                customNotification.send(new Set<String> {gift.CreatedById});
                customNotificationsToSend.add(customNotification);

                // Create and send email notification
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setSubject('Gift Needed To Be Restocked for Station: ' + storeName);
                email.setPlainTextBody(body);
                email.setToAddresses(new List<String>{loggedInUser.Email});
                emailNotificationsToSend.add(email);
            }
        }

        // Send email notifications
        if (!emailNotificationsToSend.isEmpty()) {
            Messaging.sendEmail(emailNotificationsToSend);
        }
    }
}