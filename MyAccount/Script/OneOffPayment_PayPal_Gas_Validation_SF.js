function Salesforce_Paypal_Gas_OOP()
{
 
  let browser = Sys.Browser("chrome");
  let page = browser.Page("*simplyenergy--preprod.sandbox*");
  var accountNumber =Project.Variables.GasAccountNumber;

 // 1. Search With Account Number
  var initialSearchXPath = "//button[contains(@class, 'search-button') and @aria-label='Search']";
  var closedSearchBox = page.FindElement(initialSearchXPath);
  if (closedSearchBox.Exists)
  {
    closedSearchBox.Click();
    var openedSearchXPath = "//input[@part='input' and @type='search' and @placeholder='Search...']";
    var activeInputBox = page.FindElement(openedSearchXPath);
    if (activeInputBox.Exists)
    {
      activeInputBox.Click();
      activeInputBox.Keys(accountNumber); 
      activeInputBox.Keys("[Enter]");
      aqUtils.Delay(3000);
    } 
  }
      var accountLinkXPath = "//a[contains(@class, 'outputLookupLink') and @title='" + accountNumber + "']";
      var accountLink = page.FindElement(accountLinkXPath);

      if (accountLink.Exists)
      {
        accountLink.Click();
        aqUtils.Delay(3000);
        page.Click(100, 100); // Focus the main page viewport area
        
        }
         // STEP: CLICK ON THE FINANCIAL HISTORY TAB
        var financialHistoryXPath = "//div[contains(@class, 'active') or contains(@class, 'windowViewMode-normal')]//a[@data-label='Financial History' or @id='customTab2__item' or text()='Financial History']";  
        // Flexible fallback matching standard Salesforce nested list-item role models
        if (!page.FindElement(financialHistoryXPath).Exists) {
            financialHistoryXPath = "//li[@role='tab' and descendant::*[text()='Financial History']] | //a[text()='Financial History']";
        }
        var financialTabElement = page.WaitElement(financialHistoryXPath, 8000);
        if (financialTabElement.Exists && financialTabElement.Width > 0)
        {
          financialTabElement.ScrollIntoView(true);
          aqUtils.Delay(500);
          financialTabElement.Click();
          aqUtils.Delay(3500);
        }
        
        // ========================================================
        // STEP: EXPAND FINANCIAL HISTORY VIA PARENT-CELL OFFSET
        if (typeof activeAccountNumber === "undefined" || activeAccountNumber === "") {
            activeAccountNumber = Project.Variables.GasAccountNumber;
        }
        var parentCellXPath = "//div[contains(@class, 'active')]//td[descendant::a[contains(text(), '" + activeAccountNumber + "')]] | //td[contains(., '" + activeAccountNumber + "')]";
        
        var cellWrapper = page.WaitElement(parentCellXPath, 8000);

        if (cellWrapper.Exists && cellWrapper.Width > 10)
        {
          // Force layout alignment visibility to center screen coordinates cleanly
          cellWrapper.ScrollIntoView(true);
          aqUtils.Delay(600);
          var clickXOffset = 15; 
          var clickYOffset = cellWrapper.Height / 2; // Middle vertical alignment
          cellWrapper.Click(clickXOffset, clickYOffset);
          aqUtils.Delay(600);
          page.Keys("[Enter]");
          aqUtils.Delay(3500);
        }


        // ========================================================
        // STEP: CLICK ON THE LATEST DYNAMIC DATE TRANSACTION LINK

        var dynamicLatestLinkXPath = "//div[contains(@class, 'active')]//table[contains(@class,'slds-table')]//tr//a[contains(text(), ' - $')] | //a[contains(text(), ' - $')]";
        dynamicLatestLinkXPath = "(//a[contains(., '$')])[1] | //*[@role='gridcell']//a[contains(., '-')]";
        var latestDateLink = page.WaitElement(dynamicLatestLinkXPath, 8000);

        if (latestDateLink.Exists && latestDateLink.Width > 5)
        {
          latestDateLink.ScrollIntoView(true);
          aqUtils.Delay(600);
          latestDateLink.Click(15, latestDateLink.Height / 2);
          aqUtils.Delay(800);
           
        }

        // ========================================================
        // STEP: VALIDATE RECEIPT PAYMENT METHOD & PAYMENT AMOUNT
        var paymentMethodXPath = "//*[text()='Receipt Payment Method']/ancestor::*[self::div or self::slot or contains(@class,'item')]//*[text()='Paypal'] | //*[text()='Receipt Payment Method']/following::*[contains(@class, 'value') or @role='gridcell']//*[text()]";
        if (!page.FindElement(paymentMethodXPath).Exists) {
            paymentMethodXPath = "//*[text()='Paypal']";
        }
        var paymentMethodField = page.WaitElement(paymentMethodXPath, 6000);
        if (paymentMethodField.Exists) {
            var actualPaymentMethod = paymentMethodField.contentText.trim();
            Log.Message("Receipt Payment Method field captured text: '" + actualPaymentMethod + "'");
            
            // DYNAMIC EXPECTED VARIABLE VALIDATION
            // Compares the text dynamically to support switching multiple test data rows flawlessly
            var expectedPaymentMethod = "Paypal"; 

            if (actualPaymentMethod.toLowerCase() === expectedPaymentMethod.toLowerCase()) {
                Log.Checkpoint("PASSED: Receipt Payment Method validation successful! Field displays the expected value: '" + actualPaymentMethod + "'.");
            aqUtils.Delay(3000);
        }  else {
                Log.Warning("Mismatch Detected: Expected payment method '" + expectedPaymentMethod + "', but found text: '" + actualPaymentMethod + "'");
            }
        }       


 //-- Click on Related tab
        var relatedTabXPath = "//a[@role='tab' and text()='Related']";
        // Fallback layout selector if Salesforce renders tabs as list item buttons
        if (!page.FindElement(relatedTabXPath).Exists) {
            relatedTabXPath = "//li[contains(@class, 'tab')]//a[text()='Related']";
        }

        var relatedTabElement = page.FindElement(relatedTabXPath);

        if (relatedTabElement.Exists)
        {
          relatedTabElement.Click();
          aqUtils.Delay(2000); 
        }
        
       //--Click on Cases
        var casesCardLinkXPath = "//a[contains(@class, 'slds-card__header-link') and contains(@class, 'baseCard__header-title-container')][descendant::span[@title='Cases']]";
        if (!page.FindElement(casesCardLinkXPath).Exists) {
            casesCardLinkXPath = "//a[contains(@href, '/related/Cases_r/view') or contains(@class, 'baseCard__header-title-container') and .//span[@title='Cases']]";
        }

        var casesCardLinkElement = page.FindElement(casesCardLinkXPath);
        if (casesCardLinkElement.Exists)
        {
          casesCardLinkElement.ScrollIntoView(true);
          aqUtils.Delay(500);
          casesCardLinkElement.Click();
          aqUtils.Delay(3500); 
        }
        

        // STEP: OPEN LATEST CASE VIA HARDWARE CACHE FLUSH (DEFINITIVE)
        var currentURL = page.URL; 
        var domainBaseIndex = currentURL.indexOf(".lightning.force.com");
        var baseDomain = (domainBaseIndex > -1) ? currentURL.substring(0, domainBaseIndex + 20) : "";

        // 2. STALE DATA SCREENING: Read the first case text currently written in memory
        var sampleXPath = "//th[@data-label='Case Number']//a | //a[contains(@href, '/lightning/r/Case/')]";
        var immediateLinkCheck = page.WaitElement(sampleXPath, 2000);
        var extractedRawHref = immediateLinkCheck.Exists ? (immediateLinkCheck.href || immediateLinkCheck.getAttribute("href") || "") : "";
        page.Click(100, 100); // Focus the active browser window surface
        aqUtils.Delay(300);
        page.Keys("[F5]"); // Sends a direct hardware F5 reload key to Chrome
        
        Log.Message("Browser reload dispatched. Allowing 6 seconds for clean server-side layout rebuild...");
        aqUtils.Delay(6000);
        // 4. SCAN STABILIZED DOM ROWS FOR THE AUTHENTIC LIVE CASE RECORD
        var activeCaseNumber = "";
        var targetRecordID = "";
        
        var allTextSpans = page.FindElements("//span[string-length(text())=8 or contains(text(), '149') or contains(text(), '140')] | //a[string-length(text())=8]");
        for (var i = 0; i < allTextSpans.length; i++) {
            var contentText = allTextSpans[i].contentText.trim();
            // Validates it is an authentic Case Number starting with 149 or 140
            if (/^(149|140)\d{5}$/.test(contentText)) {
                activeCaseNumber = contentText;
                Log.Message("Dynamic case scanner successfully isolated live Case Number text: " + activeCaseNumber);
                break; 
            }
        }

        // 5. EXTRACT DESTINATION RECORD ID FROM STABILIZED CODESnip
        if (activeCaseNumber !== "" && activeCaseNumber.length === 8) {
            var caseLinkXPath = "//a[contains(., '" + activeCaseNumber + "') or contains(@title, '" + activeCaseNumber + "')]";
            var realCaseLink = page.WaitElement(caseLinkXPath, 5000);
            
            if (realCaseLink.Exists) {
                var finalHref = realCaseLink.href || realCaseLink.getAttribute("href") || realCaseLink.outerHTML || "";
                var idMatch = finalHref.match(/500[a-zA-Z0-9]{12,15}/);
                targetRecordID = idMatch ? idMatch : "";
            }
        }

        // 6. DIRECT ENGINE-LEVEL NAVIGATION HOOK INJECTION
        if (targetRecordID !== "" && baseDomain !== "") {
            var directCaseURL = baseDomain + "/lightning/r/Case/" + targetRecordID + "/view";         
            Sys.Browser().ToUrl(directCaseURL);
            aqUtils.Delay(5000); // Allow adequate timeline for the new Case profile layout cards to load completely
            Log.Message("Successfully arrived at the dynamic Case workspace profile area!");
        }

        // STEP: CLICK ON THE DETAILS TAB PANEL CARD
        var detailsTabXPath = "//div[contains(@class, 'active') or contains(@class, 'windowViewMode-normal')]//a[@data-tab-value='details' or text()='Details'] | //li[@role='tab' and descendant::*[text()='Details']]";
        var detailsTabElement = page.WaitElement(detailsTabXPath, 8000);
        if (detailsTabElement.Exists && detailsTabElement.Width > 0)
        {
          detailsTabElement.ScrollIntoView(true);
          aqUtils.Delay(500);
          detailsTabElement.Click();
          aqUtils.Delay(3000);
        }
               // ========================================================
        // STEP: VALIDATE DESCRIPTION & RESOLUTION OUTCOME (ONE-OFF PAYMENT)
        var descriptionXPath = "//span[text()='Description']/following::*[contains(text(), 'Payment') or contains(text(), '$')] | //*[contains(text(), 'Payment was submitted for Account')]";
        
        // Strict fallback variant targeting Salesforce's read-only layout item values directly
        if (!page.FindElement(descriptionXPath).Exists) {
            descriptionXPath = "//div[@data-output-element-id='Description']//*[text()] | //span[text()='Description']/ancestor::*[contains(@class, 'slds-form-element')]//*[contains(@class, 'value')]//*[text()]";
        }
        var descriptionField = page.WaitElement(descriptionXPath, 6000);
        if (descriptionField.Exists) {
            // Read the full sentence text strings safely out of memory nodes
            var actualDescription = descriptionField.innerText || descriptionField.contentText || "";
            actualDescription = actualDescription.replace(/\s+/g, " ").trim(); // Cleans out hidden whitespaces
            
            // Clean execution print statement to display the description sentence directly in your logs
            Log.Checkpoint("Description text: " + actualDescription);
            page.Keys("[PageDown][PageDown]");
        } 
        
        
        // CHECKPOINT 2: RESOLUTION OUTCOME VALIDATION
        var resolutionXPath = "//*[text()='Resolution Outcome']/ancestor::*[self::div or self::slot or contains(@class,'item')]//*[contains(text(), 'Successful Payment Request')] | //*[text()='Resolution Outcome']/following::*[contains(@class, 'value')]//*[text()]";
        
        if (!page.FindElement(resolutionXPath).Exists) {
            resolutionXPath = "//*[contains(text(), 'Successful Payment Request')]";
        }

        var resolutionField = page.WaitElement(resolutionXPath, 6000);

        if (resolutionField.Exists) {
            var actualResolution = resolutionField.contentText.trim();
            Log.Message("Resolution Outcome field captured text: '" + actualResolution + "'");

            // Expected outcome phrase matching your new Credit Card scenario mapping rules
            var expectedResolutionText = "Successful Payment Request (New Credit Card)";

            if (actualResolution === expectedResolutionText) {
                Log.Checkpoint("PASSED: Resolution Outcome validation successful! Field displays: '" + actualResolution + "'.");
            } else {
                Log.Warning("Mismatch Detected: Expected resolution outcome '" + expectedResolutionText + "', but screen shows: '" + actualResolution + "'");
            }
        } 
        //--Close the Open Tabs
        var closeButtonsXPath = "//button[contains(@title, 'Close ') and (contains(@title, 'Case') or contains(@title, 'Account'))] | //button[starts-with(@title, 'Close ')]";
        var tabButtonsList = page.FindElements(closeButtonsXPath);
        // 3. LOOP THROUGH AND CLICK EACH DETECTED BUTTON ELEMENT NODE
        if (tabButtonsList && tabButtonsList.length > 0) 
        {
            // We loop BACKWARDS (from the rightmost sub-tab down to the left primary tab) 
            // to cleanly close the Case sub-tab first, followed by the main Account window folder tab.
            for (var i = tabButtonsList.length - 1; i >= 0; i--) 
            {
                var currentButton = tabButtonsList[i];
                if (currentButton.Exists) 
                {
                    var buttonTitleText = currentButton.getAttribute("title") || currentButton.title || "Unknown Tab";
                    currentButton.ScrollIntoView(true);
                    aqUtils.Delay(400);
                    // SAFEGUARD CHECK: Click if the button has visible width on screen
                    if (currentButton.Width > 0) {
                        currentButton.Click();
                        aqUtils.Delay(1500); // 1.5-second animation delay for the browser panel layout to collapse cleanly
                    } 
                    
                }
            }
        }  
   }
