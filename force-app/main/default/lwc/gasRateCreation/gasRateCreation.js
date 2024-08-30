import { LightningElement, api, wire, track } from 'lwc';

import fetchGiftNames from '@salesforce/apex/customerdata.fetchGiftNames';
import updateGift from '@salesforce/apex/customerdata.updateGift';
import LightningConfirm from 'lightning/confirm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
let i=0;
var qty;
var selectedGift='';
export default class gasRateCreation extends NavigationMixin(LightningElement) {
    @track qty;
    @api recordId;
    @track error;
    @track items = [];
    @track value = '';
    @api giftId;
    @api empid='';

    @wire(fetchGiftNames, {empid:'$empid'})
    wiredGifts({ error, data }) {
        if (data) {
            for(i=0; i<data.length; i++) {
                this.items = [...this.items ,{value: data[i].RWD_CX__Gift__c , label: data[i].RWD_CX__Gift__r.RWD_CX__Gift_Name__c}];                                   
            }            
            console.log(JSON.stringify(this.items+'items'));    
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.gifts = undefined;
        }
    }
    get statusOptions() {
        console.log(JSON.stringify(this.items+'items'));
        return this.items;
    }

    handleChange(event) {
        selectedGift = event.detail.value;
        console.log('selectedGift=' + selectedGift);
        const filterChangeEvent = new CustomEvent('filterchange', {
            detail: { selectedGift },
        });
        this.dispatchEvent(filterChangeEvent);
    }
    handleQuantityChange(event){
        qty = event.target.value;  
        this.qty = qty;
    }
    async handleUpdateClick(event)
    {
        const result = await LightningConfirm.open({
            message: 'Are You Sure You Want to Update?',
            variant: 'header',
            label: 'Please Confirm',
            theme: 'error',
        });
        if(result==true){
            this.Updategift();
        }
       
    }
    Updategift(){
         updateGift({GiftId :selectedGift,qty:this.qty,empid:this.empid})
        .then(result => {
         let compDefinition = {
            componentDef: "RWD_CX:managerScreen",
             attributes:
                {
                   empid :this.empid,
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
        })
        .catch(error => {this.dispatchEvent(
	new ShowToastEvent({
	title : 'Error  record',
	message : 'Updation Failed',
	variant : 'Error',
	}),)
			})
    }
      handleBack(){
       
        let compDefinition =
        {
            componentDef: "RWD_CX:managerScreen",
             attributes:
                {
                   empid :this.empid
                }
           
        };
            let encodedCompDef = btoa(JSON.stringify(compDefinition));

            this[NavigationMixin.Navigate]({

            type: "standard__webPage",

            attributes:
            {
                url: "/one/one.app#" + encodedCompDef
            }
         });
    }
}