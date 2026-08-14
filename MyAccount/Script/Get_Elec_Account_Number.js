function selectElectricityAndStoreNumber() {
  let browser = Sys.Browser("*");
  let page = browser.Page("*engie.com.au*");

  // 1. Click the 'drop-down hand' toggle
  let addressToggle = page.WaitElement("//*[contains(@class, 'drop-down hand')]", 10000);
  if (addressToggle.Exists) {
    addressToggle.Click();
    // Allow a full second for the list to animate and render
    aqUtils.Delay(1000); 
  } else {
    Log.Error("Account toggle not found.");
    return;
  }

  // 2. Find the row that contains the word 'Electricity'
  // Then, find the first text element within that row that contains a '#'
  let electricityRow = page.WaitElement("//div[contains(., 'Electricity')]", 20000);

  if (electricityRow.Exists) {
    // 3. Extract the account number text from within that row
    // We search for any child of the electricity row that has '#'
    let accountNumberObj = electricityRow.WaitElement(".//span[contains(text(), '#')] | .//div[contains(text(), '#')]", 5000);

    if (accountNumberObj.Exists) {
      let rawText = accountNumberObj.contentText;
      
      // Use regex to find only the digits
      let match = rawText.match(/\d+/);
      
      if (match) {
        let cleanNumber = match[0];
        Project.Variables.ElectricityAccountNumber = cleanNumber;
        Log.Checkpoint(+ cleanNumber);
        // 4. Click to select
        accountNumberObj.Click();
      } 
    } 
  } 
}