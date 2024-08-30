import { LightningElement,track,api,wire } from 'lwc';
import getCustomer from '@salesforce/apex/customerdata.getCustomerInfo';
import getGiftsList from '@salesforce/apex/customerdata.getGiftsList';
import insertClaim from '@salesforce/apex/customerdata.insertClaim';

import getrecords from '@salesforce/apex/genericDataTableController.getRecords';
import LightningConfirm from 'lightning/confirm';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class CustomerClaims extends NavigationMixin(LightningElement) {
    @track isModalOpen = true;
    @track isUpdateBox = false;
    @track searchKey; 
    @api objectapiname='';
    @api columns='';
    @api fields='';
    @api empname='';
    gifts;
    @track records=false;
    @api empid='';
    @track custData='';
    @track loyaltyPointsValue;
    @track customerID='';
    @track filteredGifts=[];
    @api giftId;
    @track minRec='';
    @track points='';
    @api empstation='';
    @track quantity='';
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

    closeModal(){
        this.isModalOpen = false;
    }

    handlesearch(event){
            this.searchKey=event.detail.selectedRecordId;
            if(this.searchKey){
        getGiftsList({ empid:this.empid})  
        .then((result) => {  
            this.gifts = result;    
            const minValue = Math.min(...this.gifts.map(gift => gift.RWD_CX__Points__c));    
            this.minRec= this.gifts.filter(gift => gift.RWD_CX__Points__c === minValue); 
            
        getCustomer({ customerPhone: this.searchKey})  
        .then((result) => {  
            this.customerID=result.Id;
            this.custData = result;  
            this.loyaltyPointsValue  = result.RWD_CX__Total_Loyality_Points__c;
            // this.filteredGifts = this.gifts
            // .filter(record => record.RWD_CX__Points__c <= this.loyaltyPointsValue)
            // .map(record => ({ ...record, quantity: 1,disable:false }));

            console.log('this.loyaltyPointsValue:', JSON.stringify(this.loyaltyPointsValue));
             this.filteredGifts = this.gifts.map(gift => {
                console.log('Processing gift:', JSON.stringify(gift));
                
                if (gift.RWD_CX__Points__c >= this.loyaltyPointsValue) {
                    return { ...gift, disable: true, quantity: 0 };
                } else {
                    return { ...gift, disable: false, quantity: 1 };
                }
            });
            // this.gifts.forEach(gift => {
            //     console.log('Processing gift:', JSON.stringify(gift));

            //     // if (gift.RWD_CX__Points__c >= this.loyaltyPointsValue) {
            //     //     gift.disable = true;
            //     //     gift.quantity = 0;
            //     // } else {
            //     //     gift.disable = false;
            //     //     gift.quantity = 1;
            //     // }

            //     this.filteredGifts.push(gift);
            //     console.log('Updated gift:', JSON.stringify(gift));
            // });


console.log('Final filtered gifts:', JSON.stringify(this.filteredGifts));


console.log(JSON.stringify(this.filteredGifts) + ' filtergifts');

            
            if(this.filteredGifts.length>0){
                this.records=true;
            }
            else{
                this.records=false;
            this.points = minValue-this.loyaltyPointsValue;
            }
             this.isModalOpen = false;
        this.isUpdateBox=true;
        }).catch(error => {
            this.showToast('Error', 'Error Customer Not Found ','error');
        });  
       
      })  
            }
    }
    
   
async handleRedeemClick(event){
        this.giftId=event.target.value;
          var gift = this.filteredGifts.filter(record => record.Id === this.giftId);
    
   
     var points;
    gift.forEach(record => {
        this.quantity=record.quantity;
     points = record.quantity * record.RWD_CX__Points__c;
    
});
    console.log(this.quantity + ' this.quantity');
    console.log(this.loyaltyPointsValue + ' this.loyaltyPointsValue');
                console.log(points + ' points');

            if(this.loyaltyPointsValue>=points){
        const result = await LightningConfirm.open({
            message: 'Are you sure you want to claim this Gift?',
            variant: 'header',
            label: 'Please Confirm',
            theme: 'default',
        });
        if (result === true) {
            this.claim();
        }
            }
            else{
                 this.showToast('Loyality Points are not enough!', 'ERROR');
            }
         
    }

    claim(){
         console.log(this.quantity + ' this.quantity');
        insertClaim({CustomerName :this.customerID,GiftName:this.giftId,empid:this.empid,quantity:this.quantity})
        .then((result) => { 
            //this.handleexit();
            this.showToast('Gift Claim!', 'Gift claimed successfully!', 'success');
            let compDefinition = {
            componentDef: "RWD_CX:managerScreen",
            attributes: {
                    empid:this.empid,
                    empname:this.empname,
                    empstation:this.empstation,
                }
            };
            let encodedCompDef = btoa(JSON.stringify(compDefinition));
            this[NavigationMixin.Navigate]({
                type: "standard__webPage",
                attributes: {
                    url: "/one/one.app#" + encodedCompDef
                }
            });
        })
        .catch(error => {
            this.showToast('Error', 'Error claiming gift: ' + error.body.message, 'error');
        });
    }


    quantitychange(event){
                console.log(event.target.name + ' event.target.name');
                console.log(event.target.value + ' event.target.value');

                var key = event.target.name;
                var qty = event.target.value;

                console.log(key + ' key');
                console.log(qty + ' qty');

                this.filteredGifts = this.filteredGifts.map(gift => {
                    if (gift.Id === key) { 
                        return { ...gift, quantity: qty };
                    } else {
                        return gift;
                    }
                });
                console.log(JSON.stringify(this.filteredGifts) + ' this.filteredGifts');

       
    }

    async handleexit(event){
        const result = await LightningConfirm.open({
            message: 'Are you sure you want to Continue Transaction?',
            variant: 'header',
            label: 'Please Confirm',
            theme: 'error',
        });
        if (result === true) {
            let compDefinition = {
            componentDef: "RWD_CX:managerScreen",
            attributes: {
                    empid:this.empid,
                    empname:this.empname,
                    empstation:this.empstation,
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
        else{
             this.exit();
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

    exit(){
        this.handlesearch();
    }
    
     handleBack(){
       
        let compDefinition = {
            componentDef: "RWD_CX:managerScreen",
             attributes:
                {
                   empid:this.empid,
                   empname:this.empname,
                    empstation:this.empstation,
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
    renderedCallback(){
         if(this.template.querySelector('.slds-scope')){
            const style1 = document.createElement('style');
            style1.innerText = '.slds-scope .slds-modal .slds-modal__container .slds-theme_default { background-color: #0059a5 !important;}';
            this.template.querySelector('.slds-scope').appendChild(style1);
         }
    }

}