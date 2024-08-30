import { LightningElement,track,api,wire } from 'lwc';
import getEmpolyeeInfo from '@salesforce/apex/customerdata.getEmpolyeeInfo';

import getrecords from '@salesforce/apex/genericDataTableController.getRecords';
//import getClaimRecordCount from '@salesforce/apex/customerdata.getClaimRecordCount';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class SalesManData extends NavigationMixin(LightningElement) {

    @track isModalOpen = true;
    @track isUpdateBox = false;
    @track searchKey; 
    @api objectapiname;
    @api columns;
    @api fields='';
    @api empid='';
    @api empname='';
    @api empstation='';
    @track empolyeedata='';
    @track type='empolyee';
    @track empolyeeid='';
    @track table=false;
    @track recordsList=[];
    @track userfld=['Id','Name','Phone'];

    @wire(getrecords, { objectName: 'User', columns: '$userfld',empid: '$empid' })
    getrecss(result) {
        console.log('Salesdata list resl :: '+ JSON.stringify(result));
         console.log('Salesdata list resl data :: '+ JSON.stringify(result.data));      
        if (result) {                  
             this.recordsList=result.data;
             console.log('Salesdata list :: '+ JSON.stringify(this.recordsList));

            } else {   
                this.error = result.error;
           }
    
        }
    
    handleKeyChange(event){
        const searchKey = event.target.value;  
        this.searchKey = searchKey;      
    }
    
    closeModal() {
        this.isModalOpen = false;
    }

    handlesearch(event){
        this.searchKey=event.detail.selectedRecordId;
        console.log(JSON.stringify(event.detail)+'event');
        console.log(        this.searchKey+'        this.searchKey');
        if(this.searchKey){
        getEmpolyeeInfo({ empid: this.searchKey})  
        .then((result) => {  
            this.empolyeedata=result;
            this.empolyeeid=result.Id;
            this.isModalOpen = false;
            this.isUpdateBox=true;
            this.table=true;
        }) 
        .catch(error => {
            this.showToast('Error', 'Error Empolyee Not Found ','ERROR');
        }); 
        }
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
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}