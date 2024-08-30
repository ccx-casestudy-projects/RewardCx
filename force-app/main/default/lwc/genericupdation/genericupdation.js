import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Genericupdation extends NavigationMixin(LightningElement) {
@api recordId='';
 @api   fields='';
 @api objectapiname='';
    @api columns='';
    @api creation='';
    @track refresh;
    @api empid='';
    @api empname='';
    @track header='Review  Information';
 @api    empstation='';
 @api customerpurchases='';
 @api type='';
    connectedCallback() {
        if(this.objectapiname=='RWD_CX__Customer__c'){
            this.header='Review Customer Information';
        }
        else if(this.objectapiname=='RWD_CX__Station_Gifts__c'){
            this.header='Review Store Gifts Information';
        }
        else if(this.objectapiname=='RWD_CX__Gift__c'){
            this.header='Review Gift Information';
        }
        else if(this.objectapiname=='RWD_CX__Station__c'){
            this.header='Review Store Information';
        }
        else if(this.objectapiname=='RWD_CX__Sales__c'){
            this.header='Review Sales Information';
        }
         else if(this.objectapiname=='RWD_CX__Claim__c'){
            this.header='Review Claim Information';
        }
         else if(this.objectapiname=='RWD_CX__Assign_Store__c'){
            this.header='Review Assign Store Information';
        }
    }
   
    handleSaveCustomerInfo(event) {
        if(this.customerpurchases==true){
            
            if(this.type!='empolyee')
            {
             
            let compDefinition = {
            componentDef: "RWD_CX:customerPurchases",
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
        });}
        else{
           
            let compDefinition = {
                componentDef: "RWD_CX:salesManData",
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
       
       else if(this.creation==true){
            this.refresh=true;
              this.showToast('Success', ' Record Updated successfully', 'success');
        const updatedRecordId = event.detail.id;
        this.refresh=true;
        
         let compDefinition = {
            componentDef: "RWD_CX:genericDataTable",
             attributes:
            {
                objectapiname:this.objectapiname,
                fields:this.fields,
                columns:this.columns,
                refresh:this.refresh,
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
        else {
            
         this.showToast('Success', ' Record Updated successfully', 'success');
        const updatedRecordId = event.detail.id;
        this.refresh=true;
        
         let compDefinition = {
            componentDef: "RWD_CX:genericDataTable",
             attributes:
            {
                objectapiname:this.objectapiname,
                fields:this.fields,
                columns:this.columns,
                refresh:this.refresh,
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
    handleBack(){
        if(this.customerpurchases==true){
            if(this.type!='empolyee')
            {
            let compDefinition = {
            componentDef: "RWD_CX:customerPurchases",
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
        });}
        else{
            let compDefinition = {
                componentDef: "RWD_CX:salesManData",
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
    
    }else{
       this.refresh=true;
        let compDefinition = {
            componentDef: "RWD_CX:genericDataTable",
             attributes:
                {
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                   fields: this.fields,
                   empid:this.empid,
                   refresh:this.refresh,
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
handleCancel()
{
    if(this.customerpurchases==true){
        if(this.type!='empolyee')
        {
        let compDefinition = {
        componentDef: "RWD_CX:customerPurchases",
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
    });}
    else{
        let compDefinition = {
            componentDef: "RWD_CX:salesManData",
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

}else{
   this.refresh=true;
    let compDefinition = {
        componentDef: "RWD_CX:genericDataTable",
         attributes:
            {
                objectapiname: this.objectapiname,
                columns:this.columns,
               fields: this.fields,
               empid:this.empid,
               refresh:this.refresh,
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
 showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(toastEvent);
    }

}