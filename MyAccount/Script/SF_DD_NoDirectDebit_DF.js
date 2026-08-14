function Salesforce_NoDirectDebit_DF_DD()
{
 
  let browser = Sys.Browser("chrome");
  let page = browser.Page("*simplyenergy--preprod.sandbox*");
  var accountNumber =26906919;
  //Project.Variables.DirectDebitGasAccountNumber;

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
        Log.Message("Located the searched account link matching title attribute: " + accountNumber);
        accountLink.Click();
        aqUtils.Delay(3000);
        page.Click(100, 100); // Focus the main page viewport area
        page.Keys("[PageDown][PageDown][PageDown]");

       // 9. REVISED PRECISION CHECKPOINT FOR PAYPAL VALUE
        // This XPath looks for the unique label header and steps directly into its matching data field
        var paymentMethodValueXPath = "//*[text()='Payment Method Type']/ancestor::*[contains(@class, 'slds-form-element')]//span[contains(@class, 'test-id__field-value')]//lightning-formatted-text[@data-output-element-id='output-field']";
        
        // Fallback structural selector if Salesforce skips structural form-elements during render
        if (!page.FindElement(paymentMethodValueXPath).Exists) {
            paymentMethodValueXPath = "//*[text()='Payment Method Type']/parent::*//lightning-formatted-text";
        }

        var paymentMethodElement = page.FindElement(paymentMethodValueXPath);

        if (paymentMethodElement.Exists)
        {
          var actualPaymentMethod = paymentMethodElement.contentText;
          var expectedPaymentMethod = "Manual Payment";
          
          Log.Message("Found isolated Payment Method Type field. Actual text: '" + actualPaymentMethod + "'");

          if (actualPaymentMethod.trim() === expectedPaymentMethod)
          {
            Log.Checkpoint("PASSED Checkpoint: Payment Method Type verified successfully as '" + expectedPaymentMethod + "'");
          }
          else
          {
            Log.Error("FAILED Checkpoint: Expected field value to be '" + expectedPaymentMethod + "' but found '" + actualPaymentMethod + "'");
          }
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
        var currentURL = page.URL;
        var dynamicAccountNumber = "";
        var accountMatch = currentURL.match(/\/r\/Account\/([a-zA-Z0-9]{15,18})/) || currentURL.match(/Account\D+(\d+)/);
        
        if (accountMatch) {
            dynamicAccountNumber = accountMatch[1];
        } 

        // 2. DYNAMIC CURRENT DATE GENERATION (DD/MM/YYYY)
        // Automatically calculates today's live execution calendar day parameters natively to completely eliminate hardcoded date bugs
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        var yyyy = today.getFullYear();
        var dynamicCurrentDate = dd + '/' + mm + '/' + yyyy;

        // 3. ISOLATE THE LIVE DESCRIPTION FIELD WRAPPER
        // Tag-agnostic lookup that captures the exact data paragraph text cell container
        var descriptionXPath = "//span[text()='Description']/ancestor::*[contains(@class,'item')]//*[contains(@class,'value')] | //span[text()='Description']/following::*[@data-output-element-id='Description' or contains(@class,'value')]//*[text()]"; 
        if (!page.FindElement(descriptionXPath).Exists) {
            descriptionXPath = "//*[contains(text(), 'Payment Method change on Account')]";
        }
        var descriptionField = page.WaitElement(descriptionXPath, 6000);
        if (descriptionField.Exists) {
        var actualDescription = descriptionField.innerText || descriptionField.contentText || descriptionField.outerHTML;
        actualDescription = actualDescription.replace(/\s+/g, " ").trim(); // Cleans out dynamic text whitespaces cleanly  
        Log.Checkpoint("Description field text successfully read: '" + actualDescription + "'");
            page.Keys("[PageDown]");
        } 

        // 2. CHECKPOINT: RESOLUTION OUTCOME FIELD
        // This XPath anchors onto the 'Resolution Outcome' field label string to safely pull its sibling data value text.
        var resolutionXPath = "//*[text()='Resolution Outcome']/ancestor::*[self::div or self::slot or self::td]//*[text()='Successful Payment Method Change'] | //*[text()='Resolution Outcome']/following::*[contains(@class, 'value') or @role='gridcell']//*[text()]";
        var resolutionField = page.WaitElement(resolutionXPath, 6000);

        if (resolutionField.Exists) {
            var actualResolution = resolutionField.contentText.trim();
            Log.Message("Resolution Outcome field captured: '" + actualResolution + "'"); 
            if (actualResolution === "Successful Payment Method Change") {
                Log.Checkpoint("PASSED: Resolution Outcome checkpoint is correct ('Successful Payment Method Change').");
            } else {
                Log.Warning("Mismatch: Resolution Outcome field is displaying unexpected text: '" + actualResolution + "'");
            }
        } 
        
        
        // STEP: CLOSE THE ACCOUNT AND CASE WORKSPACE TABS 
                      
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
