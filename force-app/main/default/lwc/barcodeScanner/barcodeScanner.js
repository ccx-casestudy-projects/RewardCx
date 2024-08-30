//  Javascript controller for the Barcode Scanner Lightning component.
//
//  This code is provided AS IS, with no warranty or guarantee of suitability for use.
//  Contact: john.meyer@salesforce.com

import { LightningElement, api, track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import empid from '@salesforce/user/Id';
import getrecords from '@salesforce/apex/genericDataTableController.getRecords';
import getCustomer from '@salesforce/apex/customerdata.getCustomerInfo';

import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import Name from '@salesforce/schema/User.Name';
import Phone from '@salesforce/schema/User.Phone';
import ProfileName from '@salesforce/schema/User.Profile.Name';
import LoginDateTime from '@salesforce/schema/User.LastLoginDate';

export default class BarcodeScanner extends NavigationMixin(LightningElement) {
	scanner;
	scannedBarcode = '';
	scanButtonDisabled = false;
	scanComplete = false;
	@api empid=empid?empid:'';
	@api emptype='';
	@api empname='';
	@api createddate='';
	@track Logindatetime='';
	@api openingreading='';
	@api customerid='';
	@track solddata=false;
	@track logouttime='';
	@track closingreading='';
	@track selectedRadioValue='';
	@track isModalOpen=false;
	@track phonenumber='';
	 @track fld=['Id','RWD_CX__Name__c','RWD_CX__Phone__c'];
    @track recordsList=[];


get options() {
     return [
         { label: 'Old Customer', value: 'OldCustomer' },
          { label: 'New Customer', value: 'NewCustomer' }
     ];
 }

	// get showComponent() {
	// 	return this.scanner.isAvailable && !this.hideComponentIfNoScanner;
	// }
	get showDebugWindow() {
		return this.debug && this.scanComplete;
	}
	
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
	

	@api hideComponentIfNoScanner = false;
	@api cardTitle = 'QRCode Scanner';
	@api buttonLabel = 'Scan QR code';
	@api instructions = 'Press the button below to open the camera. Position a barcode in the scanner window to scan it.';
	@api instructionsColor = '#888888';
	@api debug = false;
	@api actionType = 'Scan a URL';
	@api flowApiName = null;
	@api apexClassName = null;
	@api successMessage = 'Success!';
	@track liters='';
	@track value='';
	@track forNowDate;
	

	// Set by the page only if in a record context, like a Lightning record page.
	@api recordId;
	@track userName;
	@track userPhone;
	@track userProfileName;
	@track employeeId;
	@track customercreation=false;

	@wire(getRecord, { recordId: Id, fields: [Name, Phone, ProfileName,LoginDateTime] })
    userDetails({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
			if(data.fields.Profile.value.fields.Name.value == 'Standard User'){
				if (data.fields.Name.value != null) {
					this.userName = data.fields.Name.value;
				}
				if (data.fields.Profile.value != null) {
					this.userProfileName = data.fields.Profile.value.fields.Name.value;
				}
				if (data.fields.Phone.value != null) {
					this.userPhone = data.fields.Phone.value;
				}
				if(data.fields.LastLoginDate.value != null){
					const options = {year: 'numeric', month: 'numeric', day: 'numeric',hour: 'numeric', minute: 'numeric',
							hour12: false};
					let dt = new Date(data.fields.LastLoginDate.value );
					this.Logindatetime = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
				}
			}
            

        }
    }

	connectedCallback() {
		this.showComponent=true;
		
		/*const options = {year: 'numeric', month: 'numeric', day: 'numeric',hour: 'numeric', minute: 'numeric',
						hour12: false};
			
		if(this.createddate){
			let dt = new Date( this.createddate );
			this.Logindatetime = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
               
		}*/
		
	}
	renderedCallback(){
		 if(this.template.querySelector('.employeeCard')){
			const style1 = document.createElement('style');
			style1.innerText = '.employeeCard .card .slds-card .slds-card__header { background-color: #fad0b1;}';
			this.template.querySelector('.employeeCard').appendChild(style1); 

			const style2 = document.createElement('style');
			style2.innerText = '.employeeCard .card .slds-card .slds-card__body { background-color: #fad0b1; padding: 10px;}';
			this.template.querySelector('.employeeCard').appendChild(style2);    

			const style3 = document.createElement('style');
			style3.innerText = '.employeeCard .card .slds-card { background-color: #fad0b1;}';
			this.template.querySelector('.employeeCard').appendChild(style3);    
		}
	}

	

	/*
	handleBeginScanClick(event) {
		this.scannedBarcode = '';
		this.scanComplete = false;
		if (this.scanner != null && this.scanner.isAvailable()) {
			this.scanner
				.beginCapture({
					barcodeTypes: [
						this.scanner.barcodeTypes.CODE_128,
						this.scanner.barcodeTypes.CODE_39,
						this.scanner.barcodeTypes.CODE_93,
						this.scanner.barcodeTypes.DATA_MATRIX,
						this.scanner.barcodeTypes.EAN_13,
						this.scanner.barcodeTypes.EAN_8,
						this.scanner.barcodeTypes.ITF,
						this.scanner.barcodeTypes.PDF_417,
						this.scanner.barcodeTypes.QR,
						this.scanner.barcodeTypes.UPC_E
					]
				})
				.then((result) => {
					this.scannedBarcode = result.value;
					if(this.userProfileName=='Sales User Profile'){
						getcustomerid({qrid:this.scannedBarcode})
						.then((result) =>{
							let compDefinition = {
								componentDef: "c:salesmanScreen",
								 attributes:
							{
								empid: this.employeeId,
								emptype:this.emptype,
								empname:this.userName,
								customerid:result,
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
						.catch((error) => {
							this.dispatchEvent(
								new ShowToastEvent({
									title: 'Barcode Scan Error',
									message: 'QR is not assigned to any customer',
									variant: 'error',
									mode: 'sticky'
								})
							);
						})
						
				
					}//ifend
					
					else{
						assignqr ({qrid:this.scannedBarcode,customerid:this.customerid})
						.then((result) => {
						
							let compDefinition = {
								componentDef: "c:managerScreen"
								
							};
							let encodedCompDef = btoa(JSON.stringify(compDefinition));
							this[NavigationMixin.Navigate]({
								type: "standard__webPage",
								attributes: {
									url: "/one/one.app#" + encodedCompDef
								}
							});
						})
						.catch((error) => {
							this.dispatchEvent(
								new ShowToastEvent({
									title: 'Barcode Scan Error',
									message: 'QR is already Assigned to customer',
									variant: 'error',
									mode: 'sticky'
								})
							);
						})
						

					}
					
					 
				})
				.catch((error) => {
					this.dispatchEvent(
						new ShowToastEvent({
							title: 'Barcode Scan Error',
							message: JSON.stringify(error),
							variant: 'error',
							mode: 'sticky'
						})
					);
				})
				.finally(() => {
					this.scanner.endCapture();
					this.scanComplete = true;
				});
		}
	}*/
	checkOutClick(){

		this.solddata=true;
		this.closingreading=this.openingreading-this.liters;
		const d = new Date();
let time = d.toLocaleTimeString();
		this.logouttime=time;

	}
	hideModalBox(){
		this.solddata=false;

	}
	
	  handleBack() 
    {
        this.isModalOpen = false;
		this.selectedRadioValue=undefined;
    }
	handleKeyChange(event){
		this.phonenumber=event.target.value;
	}
    handlesearch(event)
    {
       this.searchKey=event.detail.selectedRecordId;
        if(this.searchKey){
        getCustomer({ customerPhone : this.searchKey})  
        .then((result) => 
        {  
            console.log('fields for customer claims :: '+this.fields);
            this.customerID=result.Id;
            let compDefinition = {
            componentDef: "RWD_CX:salesmanScreen",
            attributes:
            {
                customerid:  this.customerID,
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
       
        	this.isModalOpen = false;
      
        }) 
		.catch(error => {
			this.error = error;
			this.dispatchEvent(
						new ShowToastEvent({
							title: 'Customer Not Found Error',
							variant: 'error'
						})
					);
		}) 
		}
    } 

	handleRadioChange(event){
		 this.selectedRadioValue = event.detail.value;
		 
		 if(this.selectedRadioValue=='OldCustomer'){
		this.isModalOpen=true;
		
		 }
		 else{
			 this.customercreation=true;
			 this.objectapiname='RWD_CX__Customer__c';
       		 this.fields=['RWD_CX__Name__c', 'RWD_CX__Phone__c', 'RWD_CX__Aadhaar_Number__c'];
				 let compDefinition = {
            componentDef: "RWD_CX:genericCreation",
            attributes:
                {
                    objectapiname: this.objectapiname,
                fields: this.fields,
                empid :this.empid,
				customercreation:this.customercreation
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