trigger GiftRestockNotificationTrigger on Station_Gifts__c (after insert,after update)
{
    if (Trigger.isAfter && Trigger.isUpdate)
    {
        GiftRestockNotificationHandler.sendNotification(Trigger.new);
    }
}