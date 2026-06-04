function VerifyDirectDebitMethod() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*"); 

// 1. Target the text using an uppercase-safe match strategy
    let xpathQuery = "//tr[contains(., 'Gas')]//td[contains(translate(normalize-space(.), 'directb', 'DIRECTB'), 'DIRECT DEBIT')]";
    let paymentCellArr = page.EvaluateXPath(xpathQuery);
    
    // 2. Validate the element exists
    if (paymentCellArr && paymentCellArr.length > 0) {
        Log.Checkpoint("PASSED: Gas account is confirmed with 'DIRECT DEBIT' payment method.");
    } else {
        // 3. Safe Fallback: Handle array item and read browser text content
        let gasRowArr = page.EvaluateXPath("//tr[contains(., 'Gas')]");
        if (gasRowArr && gasRowArr.length > 0) {
            
            // FIX: Access index [0] and use browser native .textContent property
            let rawText = gasRowArr[0].textContent;
            let actualRowText = rawText ? rawText.trim() : "Empty text content";
            
            Log.Error("FAILED: 'DIRECT DEBIT' text not found in Gas row. Actual row content: '" + actualRowText + "'");
        } else {
            Log.Error("FAILED: Gas account row could not be found on the page.");
        }
    }
}