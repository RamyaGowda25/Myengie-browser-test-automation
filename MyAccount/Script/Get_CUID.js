function CaptureDynamicCustomerId() {
    let browser = Sys.Browser("chrome");
    // Target the profile page directly
    let page = browser.Page("*engie.com.au*"); 

    // 1. XPath targets the element containing the text 'CUSTOMER ID #'
    let xpathQuery = "//*[contains(text(), 'CUSTOMER ID #')]";
    let idElementArr = page.EvaluateXPath(xpathQuery);
    
    // 2. Validate the element exists on screen
    if (idElementArr && idElementArr.length > 0) {
        let idElement = idElementArr[0];
        
        // 3. Extract the text (e.g., "CUSTOMER ID #30661025")
        let fullText = idElement.textContent.trim();
        Log.Message("Full string captured: " + fullText);
        
        // 4. Clean the string using regular expression to extract only the digits
        let customerIdMatch = fullText.match(/\d+/);
        if (customerIdMatch) {
            let liveCustomerId = customerIdMatch[0];
            Log.Checkpoint("PASSED: Successfully captured Customer ID: " + liveCustomerId);
            
            // 5. Save the dynamic output safely to your Project variable space
            Project.Variables.CustomerNumber = liveCustomerId;
        } 
    } 
}
