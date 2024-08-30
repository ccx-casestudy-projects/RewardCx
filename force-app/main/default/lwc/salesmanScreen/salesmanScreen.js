import { LightningElement,api,track,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import creation from '@salesforce/apex/salescreation.creation';
import LightningConfirm from 'lightning/confirm';

export default class SalesmanScreen extends NavigationMixin(LightningElement) {  
// @api empid='a005j00000QWKalAAH';
@api empid='';
@api emptype='';
@api empname='';
@api customerid='';
// @api customerid='a025j00000iWYl1AAG';
 @track isInputDisabled = false;
 @track inputValue = '';
 @track inputBillValue='';
 @track selectedRadioValue = '';
 @track liters='';
 @track amount='';
 @api createddate='';
 @track gasamount='';
 @api openingreading='';


 get options() {
     return [
         { label: 'Amount', value: 'Amount' }
        //  { label: 'Litres', value: 'Litres' },
     ];
 }

 get inputLabel() {
    return `Enter the ${this.selectedRadioValue}`;
 }

 handleRadioChange(event) {
     this.isInputDisabled = 'true';
      this.selectedRadioValue = event.detail.value;

 }

    handleInputChange(event) {
        this.inputValue = event.target.value;
        let nameCmp = this.template.querySelector('.empText');
        if(!nameCmp.value){
            nameCmp.setCustomValidity('Please provide the amount value');
        }
        
    }
    handleBillInputChange(event) {
        this.inputBillValue = event.target.value;
        
    }
    handleCancel(){
         let compDefinition = {
            componentDef: "RWD_CX:barcodeScanner",
            attributes:{   }    
        };
        let encodedCompDef = btoa(JSON.stringify(compDefinition));
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: "/one/one.app#" + encodedCompDef
            }
        });
    }
    async handleClick(){   
        const result = await LightningConfirm.open({
            message: 'Are you sure Amount '+this.inputValue+'?' ,
            variant: 'header',
            label: 'Please Confirm',
            theme: 'error',
        });
        if (result === true) {
            this.Records();
        }
    }
 
 Records(){

        // if(this.selectedRadioValue=='Amount'){
        //     this.amount=this.inputValue;
        //     getDailyRates({amt : this.amount})
        //     .then((result) => {

        //     })

        // }
         creation({customerid:this.customerid,empid:this.empid,gasamount:this.inputValue,billnumber:this.inputBillValue})
            .then((result) => {
                let compDefinition = {
                componentDef: "RWD_CX:barcodeScanner",
                attributes: {
                        empid: this.empid,
                        emptype:this.emptype,
                        empname:this.empname,
                        createddate:this.createddate,
                        openingreading:this.openingreading
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

       /* gasrate({})
        .then((result) => {
            this.gasamount=result.Price__c;
            if(this.selectedRadioValue=='Amount'){
                this.amount=this.inputValue;
                this.liters=this.inputValue/this.gasamount;     
            }else{
                this.amount=this.inputValue*this.gasamount;
                this.liters=this.inputValue; 
            }
   
    alert('gasrate ' + this.gasamount);
     creation({customerid:this.customerid,empid:this.empid,gasamount:this.amount,gasliter:this.liters})
     .then((result) => {
         let compDefinition = {
					componentDef: "c:barcodeScanner",
					 attributes:
                {
                    empid: this.empid,
					emptype:this.emptype,
                    empname:this.empname,
                    createddate:this.createddate,
					openingreading:this.openingreading
                    
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
     })*/
 }

  renderedCallback(){
         if(this.template.querySelector('.boxclass')){
            const style1 = document.createElement('style');
            style1.innerText = '.boxclass .slds-card  { background-color: #fcf0ed;}';
            this.template.querySelector('.boxclass').appendChild(style1);
         }
    }
}