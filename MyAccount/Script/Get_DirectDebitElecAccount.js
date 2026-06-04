function Get_DirectDebitElecAccount() 
{ 
  // 1. Lock onto Chrome and the active page tab directly
  let browser = Sys.Browser("chrome");
  let page = browser.Page("https://newdawnpreprod.myengie.engie.com.au/direct-debit"); 
  
  //De-Select all the accounts
  page.EvaluateXPath("//*[@id='cancel_btn']")[0].Click();

  //Select the Gas Account
    var elecCheckbox = page.FindChildByXPath("//tr[contains(., 'Electricity')]//input[@type='checkbox']");
    elecCheckbox.Click();  
     
  //Retreive the ELEC Account Number  
    var accountCell = page.FindChildByXPath("//td[contains(text(), 'Electricity')]/following-sibling::td", true);
    if (accountCell.Exists) { 
      var liveAccountNumber = accountCell.contentText.trim();
      Log.Message("Gas Account Number Retrieved: " + liveAccountNumber)
      // Save the output safely to your Project variable space
      Project.Variables.DirectDebitElecAccountNumber = liveAccountNumber; 
    } 
  }
 

