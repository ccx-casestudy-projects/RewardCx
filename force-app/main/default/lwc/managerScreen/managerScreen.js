import { LightningElement,track,api,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import Name from '@salesforce/schema/User.Name';
import Phone from '@salesforce/schema/User.Phone';
import ProfileName from '@salesforce/schema/User.Profile.Name';
import LoginDateTime from '@salesforce/schema/User.LastLoginDate';

export default class ManagerScreen extends NavigationMixin(LightningElement) {
@track objectapiname='';
@track columns='';
@track fields='';
@api empid=Id;
@api empstation='';
@api empname='';
@track Logindatetime;
@track employeeId;
@track greetingMessage ='';
@track empName;
@track Message="Welcome To RewardCx";
    @wire(getRecord, { recordId: Id, fields: [Name, Phone, ProfileName,LoginDateTime] })
    userDetails({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
                if(data.fields.LastLoginDate.value != null){
					let dt = new Date(data.fields.LastLoginDate.value );
                    this.Logindatetime=dt.getHours();
				}
                if (data.fields.Name.value != null) {
                    const managerName = data.fields.Name.value;
                    this.empName = data.fields.Name.value;
                    this.employeeId = Id;
                    this.greetingMessage = this.getGreetingMessage(managerName);
                }
        }
            
    }

    getGreetingMessage(managerName) {
         const currentHour = this.Logindatetime;
        let greeting = '';
        if (currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour < 17) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        return `${greeting} ${managerName}!`;
    }

    renderedCallback() {
        if(this.template.querySelector('.buttoncss')){
            const style1 = document.createElement('style');
            style1.innerText = '.buttoncss .slds-button { box-sizing: border-box; appearance: none; background-color: #fad0b1; border: 2px solid black; border-radius: 0.6em; color: black; cursor: pointer; display: grid; width: 170px; height: 100px; align-self: center; font-size: 15px; font-weight: normal; line-height: normal; margin: 20px; padding: 1.2em 1.8em; text-decoration: none; text-align: center; text-transform: uppercase; font-family: Montserrat, sans-serif; font-weight: bolder; transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;}';
            this.template.querySelector('.buttoncss').appendChild(style1);        
        }

    }

    salesmanagementClick(event){
        this.objectapiname='RWD_CX__Sales__c';
        this.columns=[
            {
                label: 'ID', fieldName: 'Name', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
                label: 'Customer', fieldName: 'RWD_CX__Customer__r.RWD_CX__Name__c', apiName: 'RWD_CX__Customer__r.RWD_CX__Name__c', type: 'text', hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
                label: 'Employee', fieldName: 'RWD_CX__Employees__r.Name', apiName: 'RWD_CX__Employees__r.Name', type: 'text', hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            {
                label: 'Bill Number', fieldName: 'RWD_CX__Bill_Number__c', type: '', hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
        { label: 'Amount',fieldName: 'RWD_CX__Amount__c',type: '',hideDefaultActions: true,
                cellAttributes: row => {
                    if (row.Amount__c <= 500) {
                        return { class: 'custom-text-color' };
                    } else {
                        return {class: 'custom-textcolors'};
                    }
                },
                actions: [
                    {
                        label: 'Set Filter',
                        disabled: false,
                        name: 'filter',
                        iconName: 'utility:filter'
                    },
                    {
                        label: 'Clear Filter',
                        disabled: true,
                        name: 'clear',
                        iconName: 'utility:clear'
                    }
                ],
            },
            { 
                label: 'Store', fieldName: 'RWD_CX__Station__r.Name', apiName: 'RWD_CX__Station__r.Name', type: 'text', hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
                label: 'Transaction Date', fieldName: 'CreatedDate', type: 'date',
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
           
        ];
        this.fields=['RWD_CX__Customer__c', 'RWD_CX__Employees__c', 'RWD_CX__Bill_Number__c','RWD_CX__Amount__c', 'RWD_CX__Station__c'];
        this.navigationevent();
    }


    customermanagementClick(event){
        this.objectapiname='RWD_CX__Customer__c';

        this.columns=[
           { label: 'Customer Id',fieldName: 'Name', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
        label: 'Name',fieldName: 'RWD_CX__Name__c', type: 'text',hideDefaultActions: true,
        typeAttributes: {
            label: { fieldName: 'RWD_CX__Name__c' },
                variant:'base'
        },
        cellAttributes: {
            class: 'slds-theme_default slds-text-link',
        },
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        
        { 
        label: 'Aadhaar Number',fieldName: 'RWD_CX__Aadhaar_Number__c',type: 'text',hideDefaultActions: true,wrapText:true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
        label: 'Loyality Points',fieldName: 'RWD_CX__Total_Loyality_Points__c', type: 'Loyality Points',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
        label: 'Phone',fieldName: 'RWD_CX__Phone__c', type: 'Phone',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
            type: 'button-icon',
            typeAttributes:
            {
            iconName: 'utility:edit',
            name: 'edit',
            }
            },
        ];
        this.fields=['RWD_CX__Name__c', 'RWD_CX__Phone__c', 'RWD_CX__Aadhaar_Number__c'];
        this.navigationevent();
    }

    stationmanagementClick(){
        this.objectapiname='RWD_CX__Station__c';
        this.columns=[
        {
        label: 'Name',fieldName: 'Name', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Street',fieldName: 'RWD_CX__Street__c',type: 'text',wrapText:true,hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
        label: 'City',fieldName: 'RWD_CX__City__c', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },	
        { 
        label: 'State',fieldName: 'RWD_CX__State__c', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },{
            type: 'button-icon',
            typeAttributes:
            {
            iconName: 'utility:edit',
            name: 'edit',
            }
            },
        ]
        ;
        this.fields=['Name', 'RWD_CX__State__c', 'RWD_CX__City__c', 'RWD_CX__Street__c'];
        this.navigationevent(); 

    }

    SalesData(){
        this.objectapiname='RWD_CX__Sales__c';
        this.columns=[
            {
                label: 'ID', fieldName: 'Name', type: 'text',  hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
                label: 'Customer', fieldName: 'RWD_CX__Customer__r.RWD_CX__Name__c', apiName: 'RWD_CX__Customer__r.RWD_CX__Name__c', type: 'text', hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
                label: 'Employee', fieldName: 'RWD_CX__Employees__r.Name', apiName: 'RWD_CX__Employees__r.Name', type: 'text', hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            {
                label: 'Amount',fieldName: 'RWD_CX__Amount__c',type: '',hideDefaultActions: true,
                cellAttributes: row => {
                    if (row.Amount__c <= 500) {
                        return { class: 'custom-text-color' };
                    } else {
                        return {class: 'custom-textcolors'};
                    }
                },
                actions: [{
                        label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                    },
                    { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear'
                    }]
            },
            { 
                label: 'Station', fieldName: 'RWD_CX__Station__r.Name', apiName: 'RWD_CX__Station__r.Name', type: 'text', hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
                label: 'Transaction Date', fieldName: 'CreatedDate', type: 'date',
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            {
                type: 'button-icon',
                typeAttributes:
                {
                    iconName: 'utility:edit',
                    name: 'edit',
                },
            },
        ];
        this.fields=['RWD_CX__Customer__c','RWD_CX__Employees__r.Name','RWD_CX__Employees__c','RWD_CX__Bill_Number__c',  'RWD_CX__Amount__c', 'RWD_CX__Station__c', 'CreatedDate'];
    
        let compDefinition = {
            componentDef: "RWD_CX:salesManData",
            attributes:
                {
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                    fields: this.fields,
                    empid :this.empid,
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

    employeemanagementClick(event){
        this.objectapiname='User';
        this.columns=[
        {label: 'Name',fieldName: 'Name', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { label: 'Aadhaar Number',fieldName: 'RWD_CX__Aadhar_Number__c',type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        // { label: 'Employee Type',fieldName: 'Employee_Type__c', type: 'picklist',hideDefaultActions: true,
        //     actions: [{
        //         label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
        //     },
        //     { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        // },
        { label: 'Phone',fieldName: 'Phone',type: 'phone',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
            type: 'button-icon',
            typeAttributes:
            {
            iconName: 'utility:edit',
            name: 'edit',
            }
            },
    ];
        this.fields=['Name','RWD_CX__Aadhar_Number__c', 'Phone', 'RWD_CX__Station__c'];
    this.navigationevent();

    }

    ClaimsNowClick(){
        let compDefinition =  
        {   
            componentDef: "RWD_CX:customerClaims",  
                attributes:
        {
            
            empid :this.employeeId,
            empstation:this.empstation,
            empname:this.empName,
        
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

    claimsmanagementClick(event) {
        this.objectapiname='RWD_CX__Claim__c';
        this.columns=[
        {
        label: 'ID',fieldName: 'Name', type: 'text',
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Qty Used',fieldName: 'RWD_CX__Quantity_Claimed__c', type: '',wrapText:true,hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Gift',fieldName: 'RWD_CX__Gift__r.RWD_CX__Gift_Name__c',apiName:'RWD_CX__Gift__r.RWD_CX__Gift_Name__c',type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Customer',fieldName: 'RWD_CX__Customer__r.RWD_CX__Name__c',apiName:'RWD_CX__Customer__r.RWD_CX__Name__c', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Store',fieldName: 'RWD_CX__Station__r.Name',apiName:'RWD_CX__Station__r.Name',type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Claimed Date', fieldName: 'CreatedDate', type: 'date', wrapText:true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
            type: 'button-icon',
            typeAttributes:
            {
            iconName: 'utility:edit',
            name: 'edit',
            }
            },
        ];
        this.fields=['Name', 'RWD_CX__Customer__c', 'RWD_CX__Quantity_Claimed__c','CreatedDate']; 
        this.navigationevent();
    }

        
    CustomerClaimsClick(){
        this.objectapiname='RWD_CX__Claim__c';
        this.columns=[
        {
        label: 'ID',fieldName: 'Name', type: 'text',
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Qty Used',fieldName: 'RWD_CX__Quantity_Claimed__c', type: '',wrapText:true,hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Gift',fieldName: 'RWD_CX__Gift__c',apiName:'RWD_CX__Gift__r.RWD_CX__Gift_Name__c',type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Customer',fieldName: 'RWD_CX__Customer__c',apiName:'RWD_CX__Customer__r.RWD_CX__Name__c', type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Store',fieldName: 'RWD_CX__Station__r.Name',apiName:'RWD_CX__Station__r.Name',type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
        label: 'Claimed Date', fieldName: 'CreatedDate', type: 'date', wrapText:true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
            type: 'button-icon',
            typeAttributes:
            {
            iconName: 'utility:edit',
            name: 'edit',
            }
            },
        ];
        this.fields=['Name', 'RWD_CX__Customer__c','RWD_CX__Gift__c', 'RWD_CX__Quantity_Claimed__c','CreatedDate']; 
        let compDefinition = {
            componentDef: "RWD_CX:customerPurchases",
            attributes:
                {
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                    fields: this.fields,
                    empid :this.empid,
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

    giftsmanagementClick(event){
        this.objectapiname='RWD_CX__Gift__c';
        this.columns=[
            {
            label: 'Name',fieldName: 'Name', type: 'text',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
            label: 'Gift Name',fieldName: 'RWD_CX__Gift_Name__c', type: 'text',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            {
            label: 'Points',fieldName: 'RWD_CX__Points__c', type: '',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
            label: 'Offer Start Date',fieldName: 'RWD_CX__Offer_Start_Date__c',type: 'date',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            }
            ,
            { 
            label: 'Offer End Date',fieldName: 'RWD_CX__Offer_End_Date__c',type: 'date',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            }
            ,{
                type: 'button-icon',
                typeAttributes:
                {
                iconName: 'utility:edit',
                name: 'edit',
                }
                },
            ];
            this.fields=['RWD_CX__Gift_Name__c', 'RWD_CX__Points__c','RWD_CX__Gift_Image_Link__c', 'RWD_CX__Offer_Start_Date__c','RWD_CX__Offer_End_Date__c'];
            this.navigationevent();
    }

    stationgiftmanagementClick(){
        this.objectapiname='RWD_CX__Station_Gifts__c';
        this.columns=[
        {
            label: 'Name',fieldName: 'Name', type: 'text',hideDefaultActions: true,
            typeAttributes: {
                label: { fieldName: 'Name' },
                    variant:'base'
            },
            cellAttributes: {
                class: 'slds-theme_default slds-text-link',
            },
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
            label: 'Gift',fieldName: 'RWD_CX__Gift__r.RWD_CX__Gift_Name__c',apiName:'RWD_CX__Gift__r.RWD_CX__Gift_Name__c',type: 'text',hideDefaultActions: true,wrapText:true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
            label: 'Store',fieldName: 'RWD_CX__Station__r.Name',apiName:'RWD_CX__Station__r.Name',type: 'text',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
            label: 'Restock Level',fieldName: 'RWD_CX__Restock_Level__c', type: 'Number',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
            label: 'Quantity Added',fieldName: 'RWD_CX__Quantity_Added__c',type: 'Number',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        { 
            label: 'Quantity Used',fieldName: 'RWD_CX__Quantity_Used__c',type: 'Number',hideDefaultActions: true,
            actions: [{
                label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
            },
            { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
        },
        {
            type: 'button-icon',
            typeAttributes:
            {
            iconName: 'utility:edit',
            name: 'edit',
            }
            },
        ];
        this.fields=['Name', 'RWD_CX__Gift__c', 'RWD_CX__Station__c', 'RWD_CX__Restock_Level__c','RWD_CX__Quantity_Added__c'];
        this.navigationevent();
    }

    GiftstockClick(){
        let compDefinition = {
            componentDef: "RWD_CX:gasRateCreation",
            attributes:
                {
                empid :this.empid,
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

    storeAssignmentClick(){
         this.objectapiname='RWD_CX__Assign_Store__c';
        this.columns=[
            {
            label: 'Assign Store',fieldName: 'Name', type: 'text',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            { 
            label: 'Store Name',fieldName: 'RWD_CX__Store__r.Name', apiName: 'RWD_CX__Store__r.Name', type: 'text',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            {
            label: 'Employee',fieldName: 'RWD_CX__User__r.Name',apiName: 'RWD_CX__User__r.Name', type: 'text',hideDefaultActions: true,
                actions: [{
                    label: 'Set Filter', disabled: false, name: 'filter', iconName: 'utility:filter'
                },
                { label: 'Clear Filter', disabled: true, name: 'clear', iconName: 'utility:clear' }]
            },
            {
                type: 'button-icon',
                typeAttributes:
                {
                iconName: 'utility:edit',
                name: 'edit',
                }
                },
            ];
            this.fields=[ 'RWD_CX__User__c','RWD_CX__Store__c'];
            this.navigationevent();
    
    }

        
    navigationevent(){
        this.employeemanagementClick = event.target.label;
        let compDefinition = {
            componentDef: "RWD_CX:genericDataTable",
            attributes:
                {
                    objectapiname: this.objectapiname,
                    columns:this.columns,
                    fields: this.fields,
                    empid :this.empid,
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


 
  
}