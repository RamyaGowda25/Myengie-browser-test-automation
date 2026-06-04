function PaymentMethod_DF_HUBCX() {
    let browser = Sys.Browser("chrome");
    let hubCxPage = browser.Page("*/EnergyPortal/*"); 

    // Retrieve the dynamic account number saved from your project variables
    let targetAccountNumber = Project.Variables.DirectDebitGasAccountNumber; 
    
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
        let paymentMethodRowQuery = "//*[contains(text(), 'Payment Method')] | //span[text()='Payment Method']";
    let paymentMethodRow = hubCxPage.WaitElement(paymentMethodRowQuery, 5000);
    if (paymentMethodRow.Exists) {
        Log.Message("Found the 'Payment Method' text node block. Bringing into view...");
        paymentMethodRow.ScrollIntoView();
        aqUtils.Delay(500);
        let toggleIcon = paymentMethodRow.FindChildByXPath("./preceding-sibling::* | ./following-sibling::* | ../*[contains(@class, 'icon') or contains(@class, 'toggle') or contains(@class, 'arrow')]", false);
        if (toggleIcon && toggleIcon.Exists) {
            Log.Message("Clicking the specific interactive arrow toggle button icon.");
            toggleIcon.Click();
        } else {
            if (typeof paymentMethodRow.click === "function") {
                paymentMethodRow.click();
            } else {
                paymentMethodRow.Click();
            }
        }
        aqUtils.Delay(2000); 
    } 
    
     // 1. Define lists of approved methods for the checkpoints
    let allowedPaymentMethods = ["Direct Debit", "Direct Credit", "PayPal", "Manual Payment"];
    let allowedCardTypes = ["MASTERCARD", "VISA", "AMEX"];

    // 2. TARGETED XPATH: Locate the active value text block directly under the "Current Payment Method" section header
    // This looks for the value field directly adjacent to or below the inner 'Payment Method' text label
    let paymentMethodValueQuery = "//*[text()='Current Payment Method']/following::div[contains(., 'Payment Method')]//div[following-sibling::div[contains(., 'Credit Card Type')]] " +
                                  "| //div[text()='Payment Method']/following-sibling::div " +
                                  "| //*[contains(@class, 'panel')]//*[text()='Payment Method']/following-sibling::*";
                                  
    let paymentMethodElement = hubCxPage.WaitElement(paymentMethodValueQuery, 5000);
    let capturedPaymentMethod = "";

    // 3. Extract and sanitize the main Payment Method text from screen layout
    if (paymentMethodElement.Exists && paymentMethodElement.VisibleOnScreen) {
        capturedPaymentMethod = paymentMethodElement.textContent ? paymentMethodElement.textContent.trim() : "";
    } else {
        // Fallback: Scrape the localized sub-grid text if classes are highly dynamic
        let bodyText = hubCxPage.contentDocument && hubCxPage.contentDocument.body ? hubCxPage.contentDocument.body.innerText : "";
        let match = bodyText.match(/Current Payment Method[\s\S]*?Payment Method\s+([\w\s]+)/i);
        if (match) capturedPaymentMethod = match[1].trim();
    }

    Log.Message("Step 1: Captured active Payment Method from HubCX: '" + capturedPaymentMethod + "'");

    if (capturedPaymentMethod === "") {
        Log.Error("FAILED: Unable to parse any text value for the main Payment Method label field.");
        return;
    }

    // 4. CHECKPOINT 1: Verify the captured Payment Method belongs to your allowed list
    let isPaymentMethodValid = false;
    for (let i = 0; i < allowedPaymentMethods.length; i++) {
        if (capturedPaymentMethod.toLowerCase() === allowedPaymentMethods[i].toLowerCase()) {
            isPaymentMethodValid = true;
            break;
        }
    }

    if (isPaymentMethodValid) {
        Log.Checkpoint("Validation successful. Found approved Payment Method " + capturedPaymentMethod);
    } 

    // 5. CONDITIONAL STEP 2: If the method is exactly 'Direct Credit', verify the Credit Card Type details
    if (capturedPaymentMethod.toLowerCase() === "direct credit") {
        Log.Message("Detected 'Direct Credit' transaction wrapper. Executing conditional Credit Card Type check...");

        // TARGETED XPATH: Locate the text cell value right below or next to the 'Credit Card Type' label node
        let cardTypeQuery = "//*[text()='Credit Card Type']/following-sibling::div | //div[text()='Credit Card Type']/../div[last()] | //*[contains(text(), 'Credit Card Type')]/following::span";
        let cardTypeElement = hubCxPage.WaitElement(cardTypeQuery, 3000);
        let capturedCardType = "";

        if (cardTypeElement.Exists && cardTypeElement.VisibleOnScreen) {
            capturedCardType = cardTypeElement.textContent ? cardTypeElement.textContent.trim() : "";
        } else {
            // Fallback text engine scrape pattern matching for the card layout row segment
            let bodyText = hubCxPage.contentDocument && hubCxPage.contentDocument.body ? hubCxPage.contentDocument.body.innerText : "";
            let cardMatch = bodyText.match(/Credit Card Type\s+([\w]+)/i);
            if (cardMatch) capturedCardType = cardMatch[1].trim();
        }

        Log.Message("Step 2: Captured active Credit Card Type text: '" + capturedCardType + "'");

        // 6. CHECKPOINT 2: Verify Card Type belongs to your approved card list (MASTERCARD, VISA, AMEX)
        let isCardTypeValid = false;
        for (let j = 0; j < allowedCardTypes.length; j++) {
            if (capturedCardType.toLowerCase() === allowedCardTypes[j].toLowerCase()) {
                isCardTypeValid = true;
                break;
            }
        }

        if (isCardTypeValid) {
            Log.Checkpoint("Credit Card Type verification successful. Found approved Payment Method " + capturedCardType);
        } else {
            Log.Error("FAILED: Credit Card Type mismatch. Found '" + capturedCardType + "', expected one of: [MASTERCARD, VISA, AMEX]");
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
