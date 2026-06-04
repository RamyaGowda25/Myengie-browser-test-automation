function VerifyAllAccountsNoDirectDebitSetup() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*"); 
    // Define the utility accounts you want to verify on the page
    let utilities = ["Electricity", "Gas"];
    let targetStatus = "No direct debit setup";

    // Loop through each utility row dynamically
    for (let i = 0; i < utilities.length; i++) {
        let utilityName = utilities[i];
        
        // Target the specific row and matching payment cell status
        let xpathQuery = "//tr[contains(., '" + utilityName + "')]//td[contains(normalize-space(.), '" + targetStatus + "')]";
        let paymentCellArr = page.EvaluateXPath(xpathQuery);
        
        // 1. Check if the expected payment status cell matches
        if (paymentCellArr && paymentCellArr.length > 0) {
            Log.Checkpoint("PASSED: " + utilityName + " account is confirmed with '" + targetStatus + "' status.");
        } else {
            // 2. Fallback Error Handler: Capture the row text to trace discrepancies
            let rowQuery = "//tr[contains(., '" + utilityName + "')]";
            let utilityRowArr = page.EvaluateXPath(rowQuery);
            
            if (utilityRowArr && utilityRowArr.length > 0) {
                let rawText = utilityRowArr[0].textContent;
                let actualRowText = rawText ? rawText.trim() : "Empty text content";
                
                Log.Error("FAILED: '" + targetStatus + "' not found for " + utilityName + ". Actual row content: '" + actualRowText + "'");
            } else {
                Log.Error("FAILED: Could not find the table row for utility: " + utilityName);
            }
        }
    }
}