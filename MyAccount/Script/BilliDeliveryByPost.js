function SwitchBillingToByPost() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*"); 

    page.Refresh();
    aqUtils.Delay(2000);

    // 1. Scrape page text to extract the dynamic gas account number safely
    let fullPageText = "";
    if (page.contentDocument && page.contentDocument.body) {
        fullPageText = page.contentDocument.body.innerText.trim();
    }

    let parsedNumberMatch = fullPageText.match(/GAS\s*#\s*(\d+)/i);
    
    if (parsedNumberMatch && parsedNumberMatch.length > 1) {
        let liveGasAccountNumber = parsedNumberMatch[1].trim(); 
        Log.Checkpoint("PASSED: Parsed dynamic Gas Account Number: " + liveGasAccountNumber);
        Project.Variables.SelectedGasAccountNumber = liveGasAccountNumber;
        
        // 2. Open the side details panel drawer
        let fallbackTextObj = page.FindElement("//*[contains(text(), '" + liveGasAccountNumber + "')]");
        if (fallbackTextObj.Exists) {
            fallbackTextObj.ScrollIntoView();
            aqUtils.Delay(500);
            fallbackTextObj.Click();
            Log.Checkpoint("PASSED: Successfully clicked on the Gas account");
        } 
        
        // 3. Wait for the off-canvas details panel animation to finish sliding open
        Log.Message("Waiting for the Gas details");
        aqUtils.Delay(2500); 

        let activePage = browser.Page("*my-energy-accounts*");

        // 4. Locate and click the initial Billing delivery 'UPDATE' button explicitly
        let exactButtonXpath = "//*[@id='offcanvasWithBackdrop" + liveGasAccountNumber + "']//button[normalize-space(text())='UPDATE'] | //*[@id='offcanvasWithBackdrop" + liveGasAccountNumber + "']//button[contains(., 'UPDATE')]";
        let updateButton = activePage.FindElement(exactButtonXpath);

        if (updateButton.Exists) {
            updateButton.Focus();
            aqUtils.Delay(200);
            updateButton.Click();
            Log.Checkpoint("PASSED: Successfully clicked the Billing Delivery UPDATE button.");
            aqUtils.Delay(2000); 
        } 
        
        let exactEmailLabelXpath = "//label[@for='deliveryTypeEP_" + liveGasAccountNumber + "']";
        let emailRadio = activePage.FindElement(exactEmailLabelXpath);
      let exactPostLabelXpath = "//label[@for='deliveryTypeP_" + liveGasAccountNumber + "']";
        let postRadio = activePage.FindElement(exactPostLabelXpath);
        
  // Verify the objects exist before reading the '.checked' property
  if (!emailRadio.Exists || !postRadio.Exists) {
    Log.Error("Validation Failed: One or both radio buttons could not be found in the UI.");
    return;
  }
  
  // Evaluate the native 'checked' property safely
  if (emailRadio.checked) {
    Log.Message("Verification Passed: 'By email' delivery method is currently selected.");
  } 
  else if (postRadio.checked) {
    Log.Message("Verification Passed: 'By post' delivery method is currently selected.");
  } 
  else {
    Log.Warning("Validation Failed: Neither 'By email' nor 'By post' radio button is selected.");
  }


   }}