function OneOffPayment_ELEC_validation_HUBCX() {
    let browser = Sys.Browser("chrome");
    let hubCxPage = browser.Page("*/EnergyPortal/*"); 

    // Retrieve the dynamic account number saved from your project variables
    let targetAccountNumber = Project.Variables.ElectricityAccountNumber; 
    
     // Entering the dynamic Account Number
    let exactInputField = hubCxPage.FindElement("//*[@id='searchCustomer:frmGenericMDForm:genericMDDynaFormComp:_ACCTNO']");
      if (exactInputField.Exists) {
            exactInputField.Click();
            // Inject text value instantly into the field
            exactInputField.wText = targetAccountNumber; 
            aqUtils.Delay(300);
        } 

      //Click on Search Button
        let searchButton = hubCxPage.FindElement("//button[contains(normalize-space(.), 'Search')] | //*[contains(@class, 'btn-success') and contains(., 'Search')]");
        if (searchButton.Exists) {
            searchButton.Click();
            aqUtils.Delay(3000);
        } 
        //Click on Go to Customer Button
        let goToCustomerBtnQuery = "//button[contains(normalize-space(.), 'Go to Customer')] " +
                                   "| //input[@value='Go to Customer'] " +
                                   "| //*[contains(@class, 'btn') and contains(text(), 'Go to Customer')]";
        let goToCustomerBtn = hubCxPage.WaitElement(goToCustomerBtnQuery, 4000);
        if (goToCustomerBtn.Exists && goToCustomerBtn.VisibleOnScreen) {
            goToCustomerBtn.ScrollIntoView();
            aqUtils.Delay(300);
            goToCustomerBtn.Click();
            aqUtils.Delay(20000);
        }
        //Click on Financial Tab 
        let financialTab="//*[@id='tabViewId']/ul/li[2]/a";
        let clickFinancialTab = hubCxPage.WaitElement(financialTab, 4000);
        if(clickFinancialTab.Exists && clickFinancialTab.VisibleOnScreen){
          clickFinancialTab.ScrollIntoView();
            aqUtils.Delay(300);
            clickFinancialTab.Click();
            aqUtils.Delay(10000);
        }

        // 1. FIXED XPATH: Targets the 3-dots button on the first row using your exact verified ID string path
    let exactThreeDotsXpath = "//*[@id='tabViewId:financialSummary:mdTableForm:mdlDynaTable:UIFINTRANS_mdTable:0:_btn_OPTIONLINK']";
    let threeDotsButton = hubCxPage.WaitElement(exactThreeDotsXpath + " | " + exactThreeDotsXpath + "/span[1]", 5000);
    if (threeDotsButton.Exists && threeDotsButton.VisibleOnScreen) {
        threeDotsButton.ScrollIntoView();
        aqUtils.Delay(500);
        threeDotsButton.Click();  
        aqUtils.Delay(1500);  
    } 

    // 2. DROPDOWN SELECTION: Locate and click the 'Item Details' text option inside the popup menu list panel container
    let itemDetailsQuery = "//ul[contains(@class, 'dropdown')]//*[text()='Item Details'] " +
                         "| //span[text()='Item Details'] " +
                         "| //a[contains(normalize-space(.), 'Item Details')] " +
                         "| //*[contains(@class, 'menu')]//*[contains(text(), 'Item Details')]";
                         
    let itemDetailsOption = hubCxPage.WaitElement(itemDetailsQuery, 4000);
    if (itemDetailsOption.Exists && itemDetailsOption.VisibleOnScreen) {
        itemDetailsOption.Click();
        aqUtils.Delay(5000); 
    } 
    
    // 1. Define the collection of approved payment types for the validation checkpoint
    let validPaymentMethods = ["Paypal", "VISA", "Mastercard", "American Express Payment"];

    // 2. TARGETED XPATH: Locate the dynamic text element value under the 'Receipt Payment Method' column layout section
    // It targets any span or cell located near the descriptive heading row block
    let paymentMethodQuery = "//*[contains(text(), 'Receipt Payment Method')]/following::span[1] " +
                             "| //*[text()='Receipt Payment Method']/../following-sibling::div " +
                             "| //*[text()='Receipt Payment Method']/following-sibling::*";
                             
    let paymentMethodElement = hubCxPage.WaitElement(paymentMethodQuery, 5000);

    if (paymentMethodElement.Exists) {
        // 3. Extract and sanitize the text string from the screen layout canvas
        let capturedMethodText = paymentMethodElement.textContent;
        capturedMethodText = capturedMethodText ? capturedMethodText.trim() : "";
        if (capturedMethodText !== "") {
            
            // 4. CHECKPOINT MATCHING LOGIC: Evaluate if the text exists within our authorized array list
            let isValid = false;
            for (let i = 0; i < validPaymentMethods.length; i++) {
                // Performs a case-insensitive check to protect against format shifts (e.g., 'Paypal' vs 'PayPal')
                if (capturedMethodText.toLowerCase() === validPaymentMethods[i].toLowerCase()) {
                    isValid = true;
                    break;
                }
            }

            // 5. Output the structured validation results directly into your TestComplete log summary panel
            if (isValid) {
                Log.Checkpoint("PASSED: Receipt Payment Method validation successful." + capturedMethodText);
            } else {
                Log.Error("FAILED: Checkpoint boundary mismatch. The captured method '" + capturedMethodText + "' does not belong to the allowed list: [Paypal, VISA, MASTER, American Express Payment]");
            }

        } 
    } 
     
     // 1. Target the Home icon button using your exact verified ID string path
    let exactHomeXpath = "//*[@id='sm_leftmenu_0']/a/i";
    
    // Fallback broad lookup matching the parent anchor link if the inner icon tag blocks the event
    let homeButton = hubCxPage.WaitElement(exactHomeXpath, 4000);

    if (homeButton.Exists) {
        homeButton.ScrollIntoView();
       
        homeButton.Click();
         aqUtils.Delay(1000);
       // 3-second wait for the main application landing dashboard view to load completely
    } 
    
    let clrearBtn=hubCxPage.WaitElement("//*[@id='searchCustomer:frmGenericMDForm:mdSearchClear']/span",4000);
    if(clrearBtn.Exists)
    {
      clrearBtn.Click();
      aqUtils.Delay(1000);
    }   
} 

