import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class GenericCreation extends NavigationMixin(LightningElement) {
    @api objectapiname='';
    @api fields='';
    @api columns='';
    @track creation=false;
    @api empid='';
    @track header='Creation';
    @api empstation='';
    @api empname='';
    @api customercreation='';
 
    connectedCallback() {
        if(this.objectapiname=='RWD_CX__Customer__c'){
            this.header='Customer Registration Form';
        }
        else if(this.objectapiname=='RWD_CX__Station_Gifts__c'){
            this.header='Store Gifts Entry Form';
        }
        else if(this.objectapiname=='RWD_CX__Gift__c'){
            this.header='Gift Entry Form';
        }
        else if(this.objectapiname=='User'){
            this.header='Employee Entry Form';
        }
        else if(this.objectapiname=='RWD_CX__Station__c'){
            this.header='Store  Entry Form';
        }
        else if(this.objectapiname=='RWD_CX__Sales__c'){
            this.header='Sales Entry Form';
        }
         else if(this.objectapiname=='RWD_CX__Claim__c'){
            this.header='Claim Entry Form';
        }
         else if(this.objectapiname=='RWD_CX__Assign_Store__c'){
            this.header='Assign Store Entry Form';
        }
    }
     handleSuccess(event) {
         
         if(this.objectapiname=='RWD_CX__Customer__c'){
        this.creation=true;
         }
        const recordId = event.detail.id;
        if(this.customercreation && this.objectapiname=='RWD_CX__Customer__c'){
              let compDefinition = {
            componentDef: "RWD_CX:salesmanScreen",
            attributes:
            {
                customerid: event.detail.id,
                objectapiname:this.objectapiname,
                fields:this.fields,
                columns:this.columns,
                creation:this.creation,
                empid : this.empid,
                empstation:this.empstation,
                empname:this.empname,
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
       else if(recordId){   
        let compDefinition = {
            componentDef: "RWD_CX:genericupdation",
            attributes:
            {
                recordId: event.detail.id,
                objectapiname:this.objectapiname,
                fields:this.fields,
                columns:this.columns,
                creation:this.creation,
                empid : this.empid,
                empstation:this.empstation,
                empname:this.empname,
            }
        };
        let encodedCompDef = btoa(JSON.stringify(compDefinition));
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: "/one/one.app#" + encodedCompDef
            }
        });
    
      //  this.showToast('Success', ' Record created successfully', 'success');
    }
    }

    // showToast(title, message, variant) {
    //     const toastEvent = new ShowToastEvent({
    //         title: title,
    //         message: message,
    //         variant: variant,
    //     });
    //     this.dispatchEvent(toastEvent);
    // }
    handleBack(){
       if(this.customercreation){
              let compDefinition = {
            componentDef: "RWD_CX:barcodeScanner",
                    
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
        let compDefinition = {
            componentDef: "RWD_CX:genericDataTable",
             attributes:
                {
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                   fields: this.fields,
                   empid:this.empid,
                    empstation:this.empstation,
                    empname:this.empname,
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
    
    handleCancel() {
        if(this.customercreation){
            let compDefinition = {
            componentDef: "RWD_CX:barcodeScanner",
                    
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
        // Navigate to managerScreen component
        let compDefinition = {
            componentDef: "RWD_CX:genericDataTable",
             attributes:
                {
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                   fields: this.fields,
                   empid:this.empid,
                    empstation:this.empstation,
                    empname:this.empname,
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


    

}