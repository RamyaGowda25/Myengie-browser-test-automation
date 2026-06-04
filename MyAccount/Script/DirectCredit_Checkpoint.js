function VerifyDirectCreditMethod() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*"); 

// 1. Target the text using an uppercase-safe match strategy
    let xpathQuery = "//tr[contains(., 'Electricity')]//td[contains(translate(normalize-space(.), 'directc', 'DIRECTC'), 'DIRECT CREDIT')]";
    let paymentCellArr = page.EvaluateXPath(xpathQuery);
    
    // 2. Validate the element exists
    if (paymentCellArr && paymentCellArr.length > 0) {
        Log.Checkpoint("PASSED: Electricity account is confirmed with 'DIRECT CREDIT' payment method.");
    } else {
        // 3. Safe Fallback: Handle array item and read browser text content
        let ElectricityRowArr = page.EvaluateXPath("//tr[contains(., 'Electricity')]");
        if (ElectricityRowArr && ElectricityRowArr.length > 0) {
            
            // FIX: Access index [0] and use browser native .textContent property
            let rawText = ElectricityRowArr[0].textContent;
            let actualRowText = rawText ? rawText.trim() : "Empty text content";
            
            Log.Error("FAILED: 'DIRECT DEBIT' text not found in Electricity row. Actual row content: '" + actualRowText + "'");
        } else {
            Log.Error("FAILED: Electricity account row could not be found on the page.");
        }
    }
}