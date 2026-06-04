function selectGasAndStoreNumber() {
  let browser = Sys.Browser("*");
  let page = browser.Page("*engie.com.au*");

  // 1. Expand the dropdown
  let toggle = page.WaitElement("//*[contains(@class, 'drop-down hand')]", 10000);
  if (toggle.Exists) {
    toggle.Click();
    aqUtils.Delay(1200); 
  }

  // 2. Find the Gas Number by looking AFTER the word "Gas"
  // This XPath: Finds "Gas", then finds the first element after it containing "#"
  let gasNumberXPath = "(//span[text()='Gas'] | //div[text()='Gas'])/following::*[contains(text(), '#')][1]";
  let gasNumberObj = page.WaitElement(gasNumberXPath, 10000);

  if (gasNumberObj.Exists) {
    // 3. Extract and clean the number
    let rawText = gasNumberObj.contentText;
    let match = rawText.match(/\d+/);

    if (match) {
      let gasNumber = match[0];
      Project.Variables.GasAccountNumber = gasNumber;
      Log.Checkpoint("SUCCESS: Stored Gas Number: " + gasNumber);
      
      // 4. Click the row to select
      gasNumberObj.Click();
    } else {
      Log.Warning("Found Gas area, but no digits in: " + rawText);
    }
  } else {
    // FINAL FALLBACK: If standard search fails, search for the second '#' on the page
    Log.Warning("Relative search failed, trying index fallback...");
    let secondAccount = page.WaitElement("(//span[contains(text(), '#')] | //div[contains(text(), '#')])[2]", 5000);
    
    if (secondAccount.Exists) {
      let gasNumber = secondAccount.contentText.match(/\d+/)[0];
      Project.Variables.StoredGasNumber = gasNumber;
      Log.Checkpoint("SUCCESS (Index): Stored Gas Number: " + gasNumber);
      secondAccount.Click();
    } 
  }
}