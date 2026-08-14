function Get_DirectDebitElecAccount() 
{ 
  // 2. Lock onto Chrome and the active page tab directly
  let browser = Sys.Browser("chrome");
  let page = browser.Page("https://newdawnpreprod.myengie.engie.com.au/direct-debit"); 
  
  // 3. De-Select all the accounts
  var deselectElements = page.EvaluateXPath("//*[@id='cancel_btn']");
  if (deselectElements !== null && deselectElements.length > 0) {
      deselectElements[0].Click();
      Log.Message("Deselect button clicked successfully.");
  }
  
  aqUtils.Delay(500); // Small pause to let UI clear out safely
  
  // 4. Select the Gas Account Row Checkbox
  // FIX: EvaluateXPath finds the element natively inside Chrome instantly, completely ignoring depth limitations.
  var elecCheckboxElements = page.EvaluateXPath("//tr[descendant::*[text()='Electricity' or contains(text(), 'Electricity')]]//input[@type='checkbox'] | //tr[contains(., 'Electricity')]//input[@type='checkbox']");
  if (elecCheckboxElements !== null && elecCheckboxElements.length > 0) {
      elecCheckboxElements[0].Click();  
      Log.Message("Elec row checkbox selected successfully.");
  } else {
      Log.Error("Fail: Unable to locate the checkbox inside the Gas account table row.");
  }
  
  // 5. Retrieve the Gas Account Number  
  // Directly targets the 8-digit cell starting with '611' inside the row containing 'Gas'
  var accountCellElements = page.EvaluateXPath("//tr[descendant::*[text()='Electricity' or contains(text(), 'Electricity')]]//td[contains(text(), '611')] | //td[text()='Electricity']/following-sibling::td");
  
  if (accountCellElements !== null && accountCellElements.length > 0) { 
      var liveAccountNumber = accountCellElements[0].contentText.trim();
      Log.Message("Elec Account Number Retrieved: " + liveAccountNumber);
      
      // Save the output safely to your Project variable space
      Project.Variables.DirectDebitElecAccountNumber = liveAccountNumber; 
      Log.Checkpoint("PASSED: Global Project variable updated dynamically.");
  } else {
      Log.Error("Fail: Unable to extract the Account Number string from the Gas table row wrapper.");
  }
  

  
  }
 

