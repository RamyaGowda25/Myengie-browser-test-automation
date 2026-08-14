function Account_Balance_validation_HUB() {
    let browser = Sys.Browser("chrome");
    let hubCxPage = browser.Page("*/EnergyPortal/*"); 
    let myEngieBalance=Project.Variables.StoreAccountBalance;
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
          // 3. Dynamically build the XPath targeting the balance cell of that specific account row
    let dynamicRowXPath = `//tr[contains(., '${targetAccountNumber}')]/td[last()]`;
    
    // Wait up to 10 seconds for the dynamic table element to load completely
    let hubCxElement = hubCxPage.WaitElement(dynamicRowXPath, 10000);

    // 4. Extract and check the text from HubCX
    if (hubCxElement.Exists) {
        let hubCxRawText = hubCxElement.contentText;
        Log.Message(`Raw MyEngie Balance: ${myEngieBalance}`);
        Log.Message(`Raw HubCX Dynamic Balance: ${hubCxRawText}`);

        // Clean both balance strings to isolate numeric characters, minus signs, and decimals
        let cleanMyEngie = myEngieBalance.replace(/[^0-9.-]/g, "");
        let cleanHubCx = hubCxRawText.replace(/[^0-9.-]/g, "");

        // 5. Run the comparison checkpoint assertion
        if (aqString.Compare(cleanMyEngie, cleanHubCx, false) === 0) {
            Log.Checkpoint(`SUCCESS: Account balances match! Account ${targetAccountNumber} displays ${cleanHubCx} on both systems.`);
        } else {
            Log.Error(`FAILURE: Balance mismatch for Account ${targetAccountNumber}! MyEngie: (${cleanMyEngie}) vs HubCX: (${cleanHubCx})`);
        }
    } else {
        Log.Error(`Failed to locate the account row for Account Number: ${targetAccountNumber} on the HubCX interface.`);
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