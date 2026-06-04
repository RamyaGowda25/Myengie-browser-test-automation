function GetDynamicElectricityAccount() {
  let page = Aliases.browser.MyEngieSignInPage;
  page.Refresh();

  // 1. Find the 'Customer ID' label as our anchor (this label is constant)
  let customerIdLabel = page.FindChild(["contentText", "VisibleOnScreen"], ["Customer ID", true], 100);

  if (customerIdLabel.Exists) {
    // 2. Access the main panel containing all the data
    let mainPanel = customerIdLabel.Parent.Parent.Parent; 
    let panelText = mainPanel.contentText;
    
    // 3. Extract the Electricity Account Number using the '#' prefix
    // This looks for 'ELECTRICITY #' followed by any digits
    let electricityRegex = /ELECTRICITY\s*#(\d+)/i;
    let electricityMatch = electricityRegex.exec(panelText);

    if (electricityMatch && electricityMatch[1]) {
      Project.Variables.my_energy_Account_number = electricityMatch[1];
      Log.Checkpoint(Project.Variables.my_energy_Account_number);
      return Project.Variables.my_energy_Account_number;
    } 
    
    // 4. Emergency Fallback: Find the 8-digit number that ISN'T the Customer ID
    let allEightDigitNumbers = panelText.match(/\d{8}/g);
    if (allEightDigitNumbers && allEightDigitNumbers.length >= 2) {
       // Usually, the first 8-digit num is Electricity, the second is Customer ID
       // We'll return the one that doesn't match the bottom 'Customer ID' field
       let customerIdVal = customerIdLabel.Parent.contentText.match(/\d+/);
       for (let num of allEightDigitNumbers) {
         if (num != customerIdVal) {
           Log.Checkpoint("Captured via exclusion: " + num);
           return num;
         }
       }
    }
  }

  Log.Error("Failed to capture account number. Ensure the account details popup is open.");
}
