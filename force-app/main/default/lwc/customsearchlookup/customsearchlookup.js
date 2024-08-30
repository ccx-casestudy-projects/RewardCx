import { LightningElement,api,wire,track } from 'lwc';
//import findRecords from "@salesforce/apex/genericDataTableController.getSearchRecords"; 

export default class Customsearchlookup extends LightningElement {

    @track recordsList;  
     @api recordsLst=[];  
    @track searchKey = "";  
    @api selectedValue;  
    @api selectedRecordId;  
    //@api objectApiName;  
    @api iconName;  
    @api lookupLabel;  
    @track message;  
      
    // onLeave(event) {  
    //  setTimeout(() => {  
    //   this.searchKey = "";  
    //  this.recordsList = null;  
    //  }, 300);  
    // }  
      
    onRecordSelection(event) {  
     this.selectedRecordId = event.target.dataset.key;  
     this.selectedValue = event.target.dataset.name;  
     this.searchKey = "";  
     this.onSeletedRecordUpdate();  
    }  
     
    handleKeyChange(event) { 
         console.log('Salesdata lookup lst :: '+ JSON.stringify(this.recordsLst)); 
         
     const searchKey = event.target.value;  
     console.log('searchKey :: '+searchKey); 
     this.searchKey = searchKey;  
   if (this.searchKey.length >= 3) {
    let searchRecords = [];
    let lowerSearchKey = this.searchKey.toLowerCase();

    for (let record of this.recordsLst) {
        console.log('record: ' + JSON.stringify(record));
        
        // Extract only the 'name' and 'phone' fields from the record
        let name = record.Name ? String(record.Name).toLowerCase() : '';
        let phone = record.Phone ? String(record.Phone).toLowerCase() : '';

        console.log('name: ' + name);
        console.log('phone: ' + phone);

        if (name.includes(lowerSearchKey) || phone.includes(lowerSearchKey)) {
            searchRecords.push(record);
        }
    }

    this.recordsList = searchRecords;
    console.log('Salesdata searchRecords list: ' + JSON.stringify(searchRecords));
    console.log('Salesdata recordsList: ' + JSON.stringify(this.recordsList));
}


     
     //this.getLookupResult();  
    }  
     
    removeRecordOnLookup(event) {  
     this.searchKey = "";  
     this.selectedValue = null;  
     this.selectedRecordId = null;  
    this.recordsList = null;  
     this.onSeletedRecordUpdate();  
   }  
   getLookupResult() {  


    //   findRecords({ searchKey: this.searchKey, objectName : this.objectApiName })  
    //    .then((result) => {  
    //     if (result.length===0) {  
    //       this.recordsList = [];  
    //       this.message = "No Records Found";  
    //      } else {  
    //       this.recordsList = result;  
    //       this.message = "";  
    //      }  
    //      this.error = undefined;  
    //    })  
    //    .catch((error) => {  
    //     this.error = error;  
    //     this.recordsList = undefined;  
    //    });  
     }  
      
     onSeletedRecordUpdate(){  
      const passEventr = new CustomEvent('recordselection', {  
        detail: { selectedRecordId: this.selectedRecordId, selectedValue: this.selectedValue }  
       });  
       this.dispatchEvent(passEventr);  
     }
}