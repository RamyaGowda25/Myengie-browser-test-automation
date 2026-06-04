function VerifyGasPayPalMethod() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*"); 

    // 1. Target the text using an uppercase-safe match strategy for PAYPAL
    let xpathQuery = "//tr[contains(., 'Gas')]//td[contains(translate(normalize-space(.), 'paypal', 'PAYPAL'), 'PAYPAL')]";
    let paymentCellArr = page.EvaluateXPath(xpathQuery);
    
    // 2. Validate the element exists
    if (paymentCellArr && paymentCellArr.length > 0) {
        Log.Checkpoint("PASSED: Gas account is confirmed with 'PAYPAL' payment method.");
    } else {
        // 3. Fallback: Safely print the row content if the check fails
        let gasRowArr = page.EvaluateXPath("//tr[contains(., 'Gas')]");
        if (gasRowArr && gasRowArr.length > 0) {
            
            // Access index 0 and use browser native .textContent property
            let rawText = gasRowArr[0].textContent;
            let actualRowText = rawText ? rawText.trim() : "Empty text content";
            
            Log.Error("FAILED: 'PAYPAL' text not found in Gas row. Actual row content: '" + actualRowText + "'");
        } else {
            Log.Error("FAILED: Gas account row could not be found on the page.");
        }
    }
}
