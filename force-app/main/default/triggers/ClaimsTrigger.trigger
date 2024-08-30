trigger ClaimsTrigger on Claim__c (after insert) 
{
    if (Trigger.isAfter && (Trigger.isInsert)) 
    {
        ClaimHandler.updateGiftAndPoints(Trigger.New);
    }
}