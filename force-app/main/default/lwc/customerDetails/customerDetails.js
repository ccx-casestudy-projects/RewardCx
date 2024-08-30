import { LightningElement,track ,wire,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
//import getCustomerDetails from '@salesforce/apex/CustomerDetails.getCustomerDetails';
import getGiftsList from '@salesforce/apex/CustomerDetails.getGiftsList';
import getCustomer from '@salesforce/apex/CustomerDetails.getCustomer';
//import imageUrl from '@salesforce/resourceUrl/Premier_Lpg_Gas_Logo';

export default class CustomerDetails extends NavigationMixin(LightningElement) 
{
  //  @track imageUrl1=imageUrl;
    @track isModalOpen = true;
    @track isUpdateBox = false;
    @track searchKey;
    // @track custName;  
    // @track cusRecordId;
    //  @track customerData;  
     @track custData;
   // @api customerID;
     @api gifts;
   
     get formattedLastModifiedDate() {
        if (this.custData && this.custData.LastModifiedDate) {
            const lastModifiedDate = new Date(this.custData.LastModifiedDate);
            return `${lastModifiedDate.getDate()}/${lastModifiedDate.getMonth() + 1}/${lastModifiedDate.getFullYear()}`;
        }
        return '';
    }
     @wire(getGiftsList)
     wiredGiftItems( result ) {
         this.wiredGiftsResult=result;
         if (result.data) {
             this.gifts = result.data;
         } else if (result.error) {
             this.error = result.error;
         }
     }
     handleKeyChange(event){
        this.searchKey  = event.target.value;  
     }
    //  onAccountSelection(event){  
    //     this.custName = event.detail.selectedValue;  
    //     this.cusRecordId = event.detail.selectedRecordId;  
    //     }  


//    @wire(getCustomerDetails, { customerID: '$cusRecordId' })
//    customerDetail(result) {
//        this.customerData = result;
//        if (result.data) {
//            this.custData = this.customerData.data;
//        }
//    }
   closeModal() {
    this.isModalOpen = false;
    }

    handlesearch(){

        getCustomer({ customerPhone: this.searchKey})  
       .then((result) => {  
            this.custData = result;  
        })  
       .catch((error) => {  
        this.error = error;  
        }); 
        this.isModalOpen = false;
        this.isUpdateBox=true;
  
    }
  
}