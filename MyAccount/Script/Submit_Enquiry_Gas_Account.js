function SelectDynamicAccount(utilityType = "Gas") {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*");

  // 1. Standardise the input term safely
    let targetTerm = "Gas";
    if (utilityType && utilityType.toLowerCase().startsWith("elec")) {
        targetTerm = "Electricity";
    }

    Log.Message("Starting selection routine for utility type: " + targetTerm);

     let dropdownButtonArr = page.EvaluateXPath("//button[@data-id='edit-account-number']");
    
    if (dropdownButtonArr && dropdownButtonArr.length > 0) {
        let dropdownButton = dropdownButtonArr[0];
        dropdownButton.Click();
        Log.Message("Account dropdown menu expanded successfully.");
        aqUtils.Delay(1000); // Wait for animation
    } else {
        Log.Error("FAILED: Could not find or open the dropdown button container.");
        return;
    }

    // 3. Extract the text data first using our working array search
    let xpathQuery = "//*[contains(@class, 'dropdown-menu')]//*[contains(text(), '(" + targetTerm + ")')] | //ul[contains(@class, 'dropdown')]//li[contains(., '(" + targetTerm + ")')] | //div[contains(., '(" + targetTerm + ")')]";
    let optionRowArr = page.EvaluateXPath(xpathQuery);
    
    if (optionRowArr && optionRowArr.length > 0) {
        let optionRow = optionRowArr;
        let fullTextString = optionRow.textContent ? optionRow.textContent.trim() : "";
        Log.Message("Found target text layout: " + fullTextString);

        // 4. Parse out the dynamic 8-digit account number sequence
        let regexPattern = new RegExp("(\\d+)\\s*\\(" + targetTerm + "\\)");
        let parsedNumberMatch = fullTextString.match(regexPattern);
        
        if (parsedNumberMatch && parsedNumberMatch.length > 1) {
            liveAccountNumber = parsedNumberMatch; // FIX: Assigning to the scoped variable
            Log.Checkpoint("PASSED: Parsed dynamic " + targetTerm + " Account Number: " + liveAccountNumber);
            
    
             // 6. Dynamically assign to the matching project variable slot
            if (targetTerm === "Gas") {
                Project.Variables.Submitted_SelfRead_Account = liveAccountNumber;
            } else {
                Project.Variables.Submitted_EnquirywithoutAttachment_GasAccount = liveAccountNumber;
            }
        }
      // 5. Convert the native array object to a true TestComplete UI object using a safe text search
        // It looks for any visible row element inside the dropdown area containing our target word
        let specificXpath = "//*[contains(@class, 'dropdown-menu')]//*[contains(text(), '(" + targetTerm + ")')] | //ul[contains(@class, 'dropdown')]//li[contains(., '(" + targetTerm + ")')]";
        let testCompleteObject = page.FindElement(specificXpath);

        if (testCompleteObject.Exists && testCompleteObject.VisibleOnScreen) {
            // Forces a real mouse interaction tap on the middle of the element box
            testCompleteObject.Click(); 
            Log.Checkpoint("PASSED: Successfully forced selection switch to the " + targetTerm + " account via hardware click.");
        } 
        aqUtils.Delay(1500); // Wait for the dropdown menu to collapse back up safely
    } 
}
function TestGasAccountSelection() {
    SelectDynamicAccount("Gas");
}
