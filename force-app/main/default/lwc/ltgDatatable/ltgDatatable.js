import { LightningElement,api,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getrecords from '@salesforce/apex/genericDataTableController.getRecords1';

// import { loadStyle } from 'lightning/platformResourceLoader';
// import TableCSS from '@salesforce/resourceUrl/TableCSS';

export default class LtgDatatable extends NavigationMixin(LightningElement) {
    @api columns='';
    @api type='';
    @track customerpurchases=false;
         @api objectapiname='';
         @api fields='';
        @api layout;    
        @api issearchbar;   
        @api empid=''; 
        @api empname='';
       // @api iscreatebuttonenabled =true;    
        @track dataLoading = false;
        @track isSearch = false;    
        @api rowid;
        @track oldDate; 
        @track oldDate2; 
        @track newDate; 
        @track newDate2;
        @track data='';
        @api empstation='';
        @track customer
        
    
        @track buttonLabel = 'Delete';    
        @track isDeleteButtonEnabled = true;    
        @track recordsCount;    
        @api ischecked;
        @track ids = [];   
        @track rec;    
        @track columnNames = [];    
        @track sortBy;    
        @track sortDirection;    
        @api createdcolumn;    
        @api refresh;    
        @track groupcount;    
        @track createbuttondisabled ;  
        selectedRecords = [];   
        @track refreshTable = [];
        @track searchValue = '';   

        page = 1; //initialize 1st page   
        pageCountLabel = '';   
        @track items = []; //contains all the records.   
        startingRecord = 1; //start record position per page   
        endingRecord = 0; //end record position per page   
        pageSize = 15; //default value we are assigning    
        totalRecountCount = 0; //total record count received from all retrieved records    
        totalPage = 0; //total number of page is needed to display all records    
        @track selectedRowsMap = []; // Map to store selected rows for each datatable    
        dataId; // To store the data-id dynamically   
        @track isShowModal = false;    
        // Column Filter variables    
        @track columnFilterValues = [];    
        @track filteredDataArray = [];    
        @track combineFilter = new Map([]);    
        @track columnNumber;    
        @api baseLabel;    
        @api isFiltered;    
        @track columnFilterValue;   
        @track isOpenFilterInput = false;   
        @track inputLabel;   
        @track columnIndex;    
        filterdata;
        @api cid;
    
        @wire(getrecords, {type: '$type',cid: '$cid',objectapiname:'$objectapiname' })
    
        getrecss(result) {   
            console.log('customer claim :: '+JSON.stringify(result)) ;
            console.log('objName :: '+this.objectapiname);
            this.refreshTable = result;
            this.dataLoading = true;   
            if (result.data) {    
                this.items = this.refreshTable.data;
                 this.items = this.formatDataSet(this.items);
                this.searchCplirecords = this.items; 
                this.totalRecountCount = this.items.length;    
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);    
                this.data = this.items.slice(0, this.pageSize); 
                this.endingRecord = this.pageSize; 
                this.dataLoading = false;


            } else if (result.error) {   
                this.error = result.error;
           }
    
        }
    
        connectedCallback() {
          
               const filteredColumnNames = this.columns  
                .filter(column => column.fieldName)   
                .map(column => column.fieldName);   
            this.columnNames = filteredColumnNames;   
            this.columns = this.columns.map((column, index) => {   
                const columnWithNumber = {   
                    ...column,   
                   columnNumber: index,
                  };  
                return columnWithNumber;
    
            });
       }
        
       handleBack(){
       
        let compDefinition =
        {
            componentDef: "RWD_CX:managerScreen",
             attributes:
                {
                   empid :this.empid,
                   empstation:this.empstation,
                   empname:this.empname,
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
        
        get isPreviousDisable() {
    
            return this.page == 1;
    
        }
    
        get isNextDisable() {
    
            return this.page == this.totalPage;
    
        }
    
        previousHandler() {
    
            if (this.page > 1) {
    
                this.page = this.page - 1;
    
                this.displayRecordPerPage(this.page);
    
            }  
        }
    
        nextHandler() {
    
            if (this.page < this.totalPage) {
    
                this.page = this.page + 1;
    
                this.displayRecordPerPage(this.page);
    
            }
    
        }
    
        handleFilterAndDisplay(page) {
    
            // Apply filters
    
            let filteredData = [...this.items];
    
            this.columns.forEach(column => {
    
                const filterValue = this.columnFilterValues[column.fieldName];
    
                if (filterValue) {
                    /*
                    const regex = new RegExp(filterValue, 'i');
    
                    filteredData = filteredData.filter(row => regex.test(row[column.fieldName])); */
    
        filteredData = filteredData.filter(row => row[column.fieldName] == filterValue);
   
    
                }
    
            });
  
            // Update the totalPage based on the filtered records
    
            this.totalPage = Math.ceil(filteredData.length / this.pageSize);
          // Ensure current page is within valid range  
          if (page > this.totalPage) {
    
                this.page = this.totalPage;
    
            } else if (page < 1) {
    
                this.page = 1;
    
            } else {
    
                this.page = page;
    
            }
   
            // Calculate starting and ending records based on the page and pageSize
    
            const startingRecord = (this.page - 1) * this.pageSize;
    
            const endingRecord = Math.min(startingRecord + this.pageSize, filteredData.length);
    
            // Update the data to be displayed
    
            this.data = filteredData.slice(startingRecord, endingRecord);
    console.log('data',this.data);
           this.template.querySelector('[data-id="datatable"]').selectedRows = this.selectedRowsMap;
    
           console.log('selectedRowsMap==>next ' + this.selectedRowsMap);
    
        }
    
        getSelectedName(event) {
 
            const updatedItemsSet = new Set(event.detail.selectedRows.map(ele => ele.Id));
    
        const loadedItemsSet = new Set(this.data.map(ele => ele.Id));
  
        const selectedItemsSet = new Set(this.selectedRowsMap);
    
        updatedItemsSet.forEach(id => selectedItemsSet.add(id));
    
        loadedItemsSet.forEach(id => {
    
            if (selectedItemsSet.has(id) && !updatedItemsSet.has(id)) {
    
                selectedItemsSet.delete(id);
    
            }
    
        });
 
        this.selectedRowsMap = Array.from(selectedItemsSet);
    
        console.log('selectedRowsMap==> ' + this.selectedRowsMap);
 
        console.log('Array.from(selectedItemsSet) ' + Array.from(selectedItemsSet));
    
        console.log('selectedRows==> ' + this.selectedRowsMap);
    
        this.updateRecordsCountAndButtonState();
  
        }
 
        updateRecordsCountAndButtonState() {
    
            const totalCount = this.selectedRowsMap.length;
    
            this.recordsCount = totalCount;
    
            this.isDeleteButtonEnabled = totalCount > 0 ? false : true;
        
        }
    
        displayRecordPerPage(page) {
    
            this.handleFilterAndDisplay(page);
    
        }
    
        handleFilterRecords() {
    
            // Reset page to 1 when applying a new filter
    
            this.handleFilterAndDisplay(1);
    
        }
    
        handleRowAction(event) {
    
            this.rowid = event.detail.row.Id;
            this.customerpurchases=true;
            
        if (event.detail.action.name == 'edit') 
        {
            let compDefinition =  
                {   
                    componentDef: "RWD_CX:genericupdation",  
                     attributes:
                {
                  recordId:this.rowid,
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                   fields: this.fields,
                   empid :this.empid,
                   empname:this.empname,
                   customerpurchases:this.customerpurchases,
                    type:this.type
       
                
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
    
       
        handleSortAccountData(event) {
            this.sortBy = event.detail.fieldName;   
            this.sortDirection = event.detail.sortDirection;   
            this.sortAccountData(event.detail.fieldName, event.detail.sortDirection);
    
        }
       
        sortAccountData(fieldname, direction) {  
            let parseData = JSON.parse(JSON.stringify(this.data));  
            let keyValue = (a) => {    
                return a[fieldname];    
            };   
            let isReverse = direction === 'asc' ? 1 : -1;  
            parseData.sort((x, y) => {    
                x = keyValue(x) ? keyValue(x) : '';    
                y = keyValue(y) ? keyValue(y) : '';   
                return isReverse * ((x > y) - (y > x));    
            });   
           this.data = parseData;  
        }    
     
        handleOpenFilterInput() {   
            this.isOpenFilterInput = true;   
        }
    
        @track filterColumns;  
    
        closeModal() {
         this.isOpenFilterInput = false;
    
        }        
    
        handleHeaderAction(event) {
            // Handle Set Filter and Clear Filter
    
            const actionName = event.detail.action.name;
    
            console.log(actionName);
    
            if (actionName.search('filter') === -1 && actionName.search('clear') === -1) return;
    
            const colDef = event.detail.columnDefinition;
    
            //console.log('Column Type:', colDef.type);
    
            const columnName = colDef.fieldName; // Assuming you have a unique identifier for each column, you can use it here.
    
            // Custom function to find the index by handling the "__c" suffix in field names
    
            const findIndexByName = (name) => {
    
                const lowerCaseName = name.toLowerCase();
    
                return this.columns.findIndex(column =>
    
                    column.fieldName.toLowerCase() === lowerCaseName || column.fieldName.toLowerCase().endsWith(`${lowerCaseName}__c`)
    
                );
    
            };
    
            this.columnIndex = findIndexByName(columnName);
    
            if (this.columnIndex === -1) {    
                console.log('specified column is not found')    
            }
    
            const fieldNameWithC = this.columns[this.columnIndex].fieldName;    
            this.baseLabel = fieldNameWithC.endsWith('__c') ? fieldNameWithC.slice(0, -3) : fieldNameWithC;    
            console.log('Base Label:', this.baseLabel);    
            this.inputLabel = 'Column Filter: ' + this.baseLabel;   
            console.log('Input Label:', this.inputLabel);
    
            switch (actionName) {  
    
                case 'filter':      
                    this.handleOpenFilterInput();
                    break;    
    
                case 'clear':   
                    const filterColumnName = this.columns[this.columnIndex].fieldName;
                    delete this.columnFilterValues[filterColumnName];    
                    this.columns[this.columnIndex].label = this.baseLabel;   
                    this.columns = [...this.columns];        
                    this.handleFilterRecords();
                  this.columns[this.columnIndex].actions = this.columns[this.columnIndex].actions.map(action => {
    
                        if (action.name === 'clear') {           
                            return { ...action, disabled: true };  
                        }    
                        return action;   
                    });   
                    break;      
                default:   
            }   
        }     
    
        handleCommit() {
    
            // Handle the filter input when the user clicks out of the input dialog
            this.handleCloseFilterInput();
      
        }
       
        handleChange(event) {
    
            const filterColumnName = this.columns[this.columnIndex].fieldName;   
            this.columnFilterValues[filterColumnName] = event.target.value;  
        }
   
        handleCloseFilterInput() {
            const filterColumnName = this.columns[this.columnIndex].fieldName;
   
            this.isOpenFilterInput = false;
  
            this.columns[this.columnIndex].actions = this.columns[this.columnIndex].actions.map(action => {       
                if (action.name === 'clear') {    
                    return { ...action, disabled: false };    
                }    
                return action;    
            });

            // this.columns[this.columnIndex].label = `${this.columns[this.columnIndex].fieldName} [${updatedFilterValue}]`;
                this.columns[this.columnIndex].label = `${this.baseLabel} [${this.columnFilterValues[filterColumnName]}]`;   
            this.columns = [...this.columns];    
            this.handleFilterRecords();  
        }   

       updateSearch(event) {
    const searchValue = event.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Use filter to create an array of matching rows
    const filteredData = this.items.filter(row => {
        for (const key in row) {
            if (row.hasOwnProperty(key) && typeof row[key] === 'string') {
                const columnValue = row[key].toLowerCase(); // Convert to lowercase for case-insensitive search
                if (columnValue.includes(searchValue)) {
                    return true; // Include the row if a match is found in any column
                }
            }
        }
        return false;
    });

    this.data = filteredData;
}


    



      
       formatDataSet(data) {

        return data.map(audit => {

            const row = Object.assign({}, audit);

            this.columns.forEach(column => {

                if (!column.apiName) {

                    return;

                }

                const fieldName = column.fieldName;

                const apiFields = column.apiName.split('.');

                if (apiFields.length < 2) {

                    return;

                }

                const apiObject = apiFields[0];

                const apiField = apiFields[1];

                row[fieldName] = audit[apiObject] && audit[apiObject][apiField] ? audit[apiObject][apiField] : '';

            });

            return row;

        });

    }
    handleChangeAction(event){
            this.oldDate = event.target.value;  
           console.log('oldDate ##' + this.oldDate);
    }
    handleChangeAction2(event){
        this.oldDate2 = event.target.value;  
        console.log('oldDate2 ##' + this.oldDate2);
    }
    searchAction(){
 
         searchDate({dateStr1:this.oldDate,dateStr2:this.oldDate2})
        .then(result=>{
                this.data=result;                      
                console.log('result',result);
                })
        .catch(error =>{
           this.errorMsg=error.message;
           console.log(this.error);
        });
     }

     renderedCallback() {
        // Promise.all([
        //     loadStyle( this, TableCSS )
        //     ]).then(() => {
        //         console.log( 'Files loaded' );
        //     })
        //     .catch(error => {
        //         console.log( error.body.message );
        // });

    }
}