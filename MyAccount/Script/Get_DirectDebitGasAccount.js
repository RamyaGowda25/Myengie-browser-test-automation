function SelectGasAccountNumber() 
{ 
  // 1. Lock onto Chrome and the active page tab directly
  let browser = Sys.Browser("chrome");
  let page = browser.Page("https://newdawnpreprod.myengie.engie.com.au/direct-debit"); 
  
  //De-Select all the accounts
  page.EvaluateXPath("//*[@id='cancel_btn']")[0].Click();
//    var deselectBtn = page.FindChildByXPath("//*[@id='cancel_btn']");
//    deselectBtn.Click(); 
    
  //Select the Gas Account
    var gasCheckbox = page.FindChildByXPath("//tr[contains(., 'Gas')]//input[@type='checkbox']");
    gasCheckbox.Click();  
     
  //Retreive the Gas Account Number  
    var accountCell = page.FindChildByXPath("//td[contains(text(), 'Gas')]/following-sibling::td", true);
    if (accountCell.Exists) { 
      var liveAccountNumber = accountCell.contentText.trim();
      Log.Message("Gas Account Number Retrieved: " + liveAccountNumber)
      // Save the output safely to your Project variable space
      Project.Variables.DirectDebitGasAccountNumber = liveAccountNumber; 
    } 
 // 5. CLICK "BUTTON UPDATE ACCOUNT" INSTANTLY
  // Replaces the slow Keyword line 'buttonUpdateAccount -> ClickButton'
  var updateBtnXPath = "//button[contains(., 'UPDATE') or contains(text(), 'Update')] | //*[@id='update_btn']";
  var updateAccountButton = page.FindChildByXPath(updateBtnXPath, true);
  
  if (updateAccountButton && updateAccountButton.Exists) {
      Log.Message("Isolating Update Account button. Clicking component...");
      updateAccountButton.Click();
  } else {
      Log.Warning("Update Account button not resolved via path. Sending native backup click...");
      // Fast fallback using your Keyword test alias reference if mapped locally
      Aliases.browser.MyEngieSignInPage.buttonUpdateAccount.ClickButton();
  }
 
  }
 

