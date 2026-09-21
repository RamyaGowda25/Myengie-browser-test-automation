function Get_DirectDebitDFAccounts() 
{ 
  // 1. Lock onto Chrome and the active page tab directly
  let browser = Sys.Browser("chrome");
  let page = browser.Page("https://newdawnpreprod.myengie.engie.com.au/direct-debit"); 
  
     
  //Retreive the ELEC Account Numbers  
    var accountCell = page.FindChildByXPath("//td[contains(text(), 'Electricity')]/following-sibling::td", true);
    if (accountCell.Exists) { 
      var liveAccountNumber = accountCell.contentText.trim();
      Log.Message("ELEC Account Number Retrieved: " + liveAccountNumber)
      // Save the output safely to your Project variable space
      Project.Variables.DirectDebitElecAccountNumber = liveAccountNumber; 
    } 
 //Retreive the Gas Account Number  
    var accountCell = page.FindChildByXPath("//td[contains(text(), 'Gas')]/following-sibling::td", true);
    if (accountCell.Exists) { 
      var liveAccountNumber = accountCell.contentText.trim();
      Log.Message("Gas Account Number Retrieved: " + liveAccountNumber)
      // Save the output safely to your Project variable space
      Project.Variables.DirectDebitGasAccountNumber = liveAccountNumber; 
    } 
 
  }
 

