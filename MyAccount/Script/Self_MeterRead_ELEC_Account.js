function SelectSelfMeterReadAccount() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*");

    // 1. Locate the dropdown toggle button using the exact data-id attribute from your HTML capture
    let dropdownButtonArr = page.EvaluateXPath("//button[@data-id='edit-account-number']");
    // Click the button to expand the selection choices list
    if (dropdownButtonArr && dropdownButtonArr.length > 0) {
        let dropdownButton = dropdownButtonArr[0];
        dropdownButton.Click();
        aqUtils.Delay(1000); // 1-second pause to let the dropdown menu render completely
    } 

  // 2. Locate the specific dropdown option containing '(Electricity)'
    let elecRowArr = page.EvaluateXPath("//div[contains(@class, 'dropdown-menu')]//*[contains(text(), '(Electricity)')] | //li[contains(., '(Electricity)')]");
    if (elecRowArr && elecRowArr.length > 0) {
        let elecRow = elecRowArr[0];
        // 3. Extract the text string via native browser textContent
        let fullTextString = elecRow.textContent;
        fullTextString = fullTextString ? fullTextString.trim() : "";
        // 4. Parse and save the account number right before '(Electricity)'
        let parsedNumberMatch = fullTextString.match(/(\d+)\s*\(Electricity\)/);
        if (parsedNumberMatch && parsedNumberMatch.length > 1) {
            let liveElectricityAccountNumber = parsedNumberMatch[1];
            Log.Checkpoint("PASSED: Parsed dynamic Electricity Account Number: " + liveElectricityAccountNumber);
    
            // Save the extracted account number into your Project variable space
            Project.Variables.Submitted_SelfRead_Account = liveElectricityAccountNumber;
        }

        // 5. FIX: Use the standard browser native click invocation
        // This bypasses the TestComplete UI framework abstraction layout layer entirely
        if (typeof elecRow.click === "function") {
            elecRow.click(); // Lowecase 'c' executes natively within Chrome
        } else if (typeof elecRow.Click === "function") {
            elecRow.Click();
        } else {
            // Ultimate fallback: perform a physical mouse click at the element's coordinate center
            let pageX = elecRow.offsetLeft + (elecRow.offsetWidth / 2);
            let pageY = elecRow.offsetTop + (elecRow.offsetHeight / 2);
            elecRow.Click(pageX, pageY);
        }
        
        Log.Checkpoint("PASSED: Clicked the Electricity account option from the dropdown menu list.");
    } else {
        Log.Error("FAILED: Could not locate the expanded dropdown row option containing the '(Electricity)' profile flag.");
    }
}