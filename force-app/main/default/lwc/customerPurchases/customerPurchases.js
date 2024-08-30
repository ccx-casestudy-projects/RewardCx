import { LightningElement,track,api,wire } from 'lwc';
import getCustomer from '@salesforce/apex/customerdata.getCustomerInfo1';

import getrecords from '@salesforce/apex/genericDataTableController.getRecords';
import getClaimRecordCount from '@salesforce/apex/customerdata.getClaimRecordCount';
import { NavigationMixin } from 'lightning/navigation';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CustomerPurchases extends NavigationMixin(LightningElement) {

    @track isModalOpen = true;
    @track isUpdateBox = false;
    @track searchKey; 
    @api objectapiname='';
    @api columns='';
    @api fields='';
 
    @api empid='';
    @api empname='';
   
    @api  empstation='';
    @track custData=[];
    @track loyaltyPointsValue;
    @track customerID='';
    @track table=false;
    @track claimRecordCount=0;
     @track fld=['Id','RWD_CX__Name__c','RWD_CX__Phone__c'];
    @track recordsList=[];

   
 @wire(getrecords, { objectName: 'RWD_CX__Customer__c', columns: '$fld', empid: '$empid' })
getrecss(result) {
    console.log('Salesdata list result: ' + JSON.stringify(result));
    
    if (result.data) {                  
        this.recordsList = result.data.map(record => ({
            Id: record.Id,
            Name: record.RWD_CX__Name__c,
            Phone: record.RWD_CX__Phone__c
        }));
        console.log('Salesdata list: ' + JSON.stringify(this.recordsList));
    } else if (result.error) {   
        this.error = result.error;
        console.error('Error fetching records:', JSON.stringify(result.error));
    }
}

    handleKeyChange(event){
        const searchKey = event.target.value;  
        this.searchKey = searchKey;  
        console.log(this.searchKey);
    }
    closeModal() 
    {
        this.isModalOpen = false;
    }
    handlesearch(event)
    {
            this.searchKey=event.detail.selectedRecordId;
            if(this.searchKey){
        getCustomer({ phone : this.searchKey})  
        .then((result) => 
        {  
            console.log('fields for customer claims :: '+this.fields);
            this.customerID=result.Id;
             console.log('Customer Id :: '+this.customerID);
            this.custData = result;  
            console.log('CustData :: '+ JSON.stringify(this.custData) );
            this.loyaltyPointsValue  = result.RWD_CX__Total_Loyality_Points__c;
            getClaimRecordCount({customerId :this.searchKey})
            .then((result) => {
                console.log('count claims :: '+result);
                this.claimRecordCount = result;
            })
        this.isModalOpen = false;
        this.isUpdateBox=true;
        this.table=true;
        })  .catch(error => {
            this.showToast('Error', 'Error Customer Not Found ','error');
        }); 
            }
    } 
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
    handleBack(){
       
        let compDefinition = {
            componentDef: "RWD_CX:managerScreen",
             attributes:
                {
                    
                   empid:this.empid,
                   empname:this.empname,
                   empstation:this.empstation
                }

            
        };
        let encodedCompDef = btoa(JSON.stringify(compDefinition));
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: "/one/one.app#" + encodedCompDef
            }
        });

    }
}