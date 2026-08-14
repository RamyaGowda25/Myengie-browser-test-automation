function SelectGasAccountNumber() 
{ 
  Log.Message("Initializing high-speed account processing sequence...");
  
  // 1. Lock onto Chrome and the active page tab directly
  let browser = Sys.Browser("chrome");
  let page = browser.Page("https://newdawnpreprod.myengie.engie.com.au/direct-debit"); 
  
  // 2. RAPID DE-SELECT ALL ACCOUNTS
 page.EvaluateXPath("//*[@id='cancel_btn']")[0].Click();
    
  // Short 400ms pause to let browser check-states physically release
  aqUtils.Delay(400);
  
  // 3. FIX: HIGH-SPEED DIRECT INDEX GAS CHECKBOX SELECTION
  // Using EvaluateXPath bypasses TestComplete's slow search loop completely to find the box in milliseconds!
  var gasCheckboxXPath = "//tr[descendant::*[text()='Gas' or contains(text(), 'Gas')]]//input[@type='checkbox'] | //tr[contains(., 'Gas')]//input[@type='checkbox']";
  var gasCheckboxElements = page.EvaluateXPath(gasCheckboxXPath);
  
      let targetCheckbox = gasCheckboxElements[0]; // Unwrap the first element in the array match
      
 // Forces immediate physical alignment to prevent rendering lags
      targetCheckbox.ScrollIntoView(true);
      aqUtils.Delay(200);
      Log.Message("Clicking Gas row checkbox natively...");
      targetCheckbox.Click();  
  
     
  // 4. HIGH-SPEED GAS ACCOUNT NUMBER EXTRACTION  
  var accountCellXPath = "//tr[descendant::*[text()='Gas']]//td[string-length(normalize-space(text()))=8] | //td[contains(text(), 'Gas')]/following-sibling::td";
  var accountCellElements = page.EvaluateXPath(accountCellXPath);
  
  if (accountCellElements !== null && accountCellElements.length > 0) { 
      var liveAccountNumber = accountCellElements[0].contentText.trim();
      Log.Message("Gas Account Number Retrieved: " + liveAccountNumber);
      
      // Save output safely to global project variable
      Project.Variables.DirectDebitGasAccountNumber = liveAccountNumber; 
  } 

  // 5. RAPID CLICK "BUTTON UPDATE ACCOUNT"
  var updateAccountButton = page.FindChildByXPath("//*[@id='update_account']", true);
  
  if (updateAccountButton && updateAccountButton.Exists) {
      Log.Message("Update Account button isolated instantly via ID. Executing rapid click...");
      updateAccountButton.Click();
  } else {
      Log.Warning("Update Account button ID not resolved. Attempting snippet class fallback...");
      // Secondary fallback matching the explicit drupal selector attribute from your snippet
      var fallbackBtn = page.FindChildByXPath("//button[@data-drupal-selector='edit-update-account']", true);
      if (fallbackBtn && fallbackBtn.Exists) {
          fallbackBtn.Click();
      } 
      }
  // 6. PAGE STABILIZATION TIMEOUT
  aqUtils.Delay(3000); 
//  Log.Message("Next form layout view initialized successfully.");
}
