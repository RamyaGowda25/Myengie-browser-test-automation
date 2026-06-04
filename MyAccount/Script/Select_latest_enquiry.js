function ClickLatestRequestFirstRow() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*"); // Matches your portal dashboard URL
   
    // 1. Precise XPath targeting the Enquiry Number cell (3rd Column) of the 1st row
    let enquiryNumArr = page.EvaluateXPath("//*[@id='showMyEnquiries']/tbody/tr[1]/td[3]");
    if (enquiryNumArr && enquiryNumArr.length > 0) {
        let enquiryCell = enquiryNumArr[0];
        // Extract the plain text (e.g., "CM-14933185")
        let fullEnquiryNumber = enquiryCell.textContent ? enquiryCell.textContent.trim() : "";
        
        if (fullEnquiryNumber !== "") {
            // FIX: Remove "CM-" or any non-numeric characters, leaving only digits
            let numericEnquiryNumber = fullEnquiryNumber.replace(/[^0-9]/g, "");
            Log.Checkpoint("PASSED: Successfully captured Numeric Enquiry Number: " + numericEnquiryNumber);
            // 2. Save the numeric output safely to your Project variable space
            Project.Variables.LatestEnquiryNumber = numericEnquiryNumber;
        } 
    } 
    // 3. Locate the primary click target (1st Column) to expand or open the record details
    let targetLinkArr = page.EvaluateXPath("//*[@id='showMyEnquiries']/tbody/tr[1]/td[1]"); 
    
    if (targetLinkArr && targetLinkArr.length > 0) {
        let targetLink = targetLinkArr[0]; 
        
        // Execute native browser click to ensure it triggers perfectly
        if (typeof targetLink.click === "function") {
            targetLink.click(); 
        } else {
            targetLink.Click(); 
        }
        Log.Checkpoint("PASSED: Successfully clicked on the latest request's primary row cell.");
        aqUtils.Delay(5000); 
    } 
}