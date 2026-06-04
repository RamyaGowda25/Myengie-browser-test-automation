function PaymentPlan_ELEC_HUBCX() {
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
            aqUtils.Delay(10000);
        }
        let exactTabXpath = "//*[@id='tabViewId']/ul/li[4]/a";
     // Fallback broad lookup matching the inner text block if framework layers mask the link wrapper
      let paymentPlansTab = hubCxPage.WaitElement(exactTabXpath + " | " + exactTabXpath + "//*[text()='PAYMENT PLANS']", 5000);
      if (paymentPlansTab.Exists && paymentPlansTab.VisibleOnScreen) {
      paymentPlansTab.ScrollIntoView();
      aqUtils.Delay(300);
        paymentPlansTab.Click();
        aqUtils.Delay(3000); // 2.5-second pause to let the sub-dashboard grid load completely
    } 
     // 1. Retrieve the dynamic account number dynamically saved from your project variables
    let targetAccountNumber2 = Project.Variables.ElectricityAccountNumber; 
    if (!targetAccountNumber2 || targetAccountNumber2 === "") {
        targetAccountNumber2 = Project.Variables.ElectricityAccountNumber;
    }

    if (targetAccountNumber2 && targetAccountNumber2 !== "") {
        let filterInputQuery = "//*[@id='tabViewId:instalmentPlanDetail:frmGenericMDForm:genericMDDynaFormComp:_ACCNBRSRCH']";
        let accountInputField = hubCxPage.WaitElement(filterInputQuery, 5000);
        if (accountInputField.Exists) {
            accountInputField.Click();
            // Clear out any lingering default characters safely
            accountInputField.Keys("^a[bs]"); 
            // Direct property binding populates the exact 8-digits cleanly
            accountInputField.wText = targetAccountNumber2; 
            aqUtils.Delay(300);
        } 
        // 3. TARGETED XPATH: Locate the green 'Search' button belonging strictly to this payment plan filter card grid block.
        let searchBtnQuery = "//*[@id='tabViewId:financialSummary:paymentPlanTableForm:btn_search'] " +
                             "| //button[contains(normalize-space(.), 'Search')] " +
                             "| //input[@value='Search']";                  
        let searchButton = hubCxPage.WaitElement(searchBtnQuery, 4000);
        if (searchButton.Exists) {
            searchButton.Click(); 
            aqUtils.Delay(10000); // 3-second wait for the loader loop to reveal results rows below
        } 
    } 
      let locators = {
        "Plan ID": "//*[text()='Plan ID']/following::div[1] | //div[contains(text(), 'Plan ID')]/following-sibling::div",
        "Plan Type": "//*[text()='Plan Type']/following::div[1] | //div[contains(text(), 'Plan Type')]/following-sibling::div",
        "Start Date": "//*[text()='Start Date']/following::div[1] | //div[contains(text(), 'Start Date')]/following-sibling::div",
        "End Date": "//*[text()='End Date']/following::div[1] | //div[contains(text(), 'End Date')]/following-sibling::div"
    };

    // 2. DATA EXTRACTION LOOP: Cycles through the locators to parse the raw text values from the screen layout canvas
    let results = {};
    for (let currentKey in locators) {
        let element = hubCxPage.WaitElement(locators[currentKey], 3000);
        
        if (element.Exists && element.VisibleOnScreen) {
            let extractedText = element.textContent ? element.textContent.trim() : "";
            results[currentKey] = extractedText;
            Log.Message("Captured data field -> " + currentKey + ": " + extractedText);
        } else {
            Log.Warning("Could not resolve specific UI element node layer for field: " + currentKey);
            results[currentKey] = "";
        }
    }
    // 3. PROJECT VARIABLE STORAGE & VERIFICATION CHECKPOINTS: Save the captured data for downline verification steps
    if (results["Plan ID"] !== "") {
        Project.Variables.HubCxPlanID = results["Plan ID"];
        Log.Checkpoint("PASSED: Successfully recorded Plan ID '" + results["Plan ID"] + "' to Project variable pool.");
    }
    if (results["Plan Type"] !== "") {
        Project.Variables.HubCxPlanType = results["Plan Type"];
    }
    let screenImage = hubCxPage.Picture();
    Log.Picture(screenImage, "PASSED: Payment Plan Summary screen snapshot captured successfully.");
    // 1. Locate and click the 'BILLS' navigation sub-tab
    let billsTabQuery = "//*[@id='tabViewId:instalmentPlanDetail:frmGenericMDInsertForm:instalment-tabview']/ul/li[2]/a/div";
    let billsTab = hubCxPage.WaitElement(billsTabQuery, 5000);
    if (billsTab.Exists && billsTab.VisibleOnScreen) {
        billsTab.ScrollIntoView();
        aqUtils.Delay(300);
        billsTab.Click();
        aqUtils.Delay(3000);
    }
    let billsScreenSnapshot = hubCxPage.Picture();
    // 4. Post the visual image directly into your TestComplete Log dashboard panel
    Log.Picture(billsScreenSnapshot, "Bills data grid screen snapshot captured successfully.");
    
    // 1. Locate and click the 'installmentsTab' navigation sub-tab
    let installmentsTabQuery = "//*[@id='tabViewId:instalmentPlanDetail:frmGenericMDInsertForm:instalment-tabview']/ul/li[3]/a/div";
    let installmentsTab = hubCxPage.WaitElement(installmentsTabQuery, 5000);
    if (installmentsTab.Exists && installmentsTab.VisibleOnScreen) {
        installmentsTab.ScrollIntoView();
        aqUtils.Delay(300);
        installmentsTab.Click();
        aqUtils.Delay(3000);
    }
    let installmentsTabScreenSnapshot = hubCxPage.Picture();
    // 4. Post the visual image directly into your TestComplete Log dashboard panel
    Log.Picture(installmentsTabScreenSnapshot, "Installments Tab data grid screen snapshot captured successfully.");

    // 1. Locate and click the 'installmentsTab' navigation sub-tab
    let paymentMethodTabQuery = "//*[@id='tabViewId:instalmentPlanDetail:frmGenericMDInsertForm:instalment-tabview']/ul/li[4]/a/div";
    let paymentMethodTab = hubCxPage.WaitElement(paymentMethodTabQuery, 5000);
    if (paymentMethodTab.Exists && paymentMethodTab.VisibleOnScreen) {
        paymentMethodTab.ScrollIntoView();
        aqUtils.Delay(300);
        paymentMethodTab.Click();
        aqUtils.Delay(3000);
    }
    let paymentMethodTabTabScreenSnapshot = hubCxPage.Picture();
    // 4. Post the visual image directly into your TestComplete Log dashboard panel
    Log.Picture(paymentMethodTabTabScreenSnapshot, "Payment Method data grid screen snapshot captured successfully.");
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

