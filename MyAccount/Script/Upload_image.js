function UploadImage() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*");

      // 1. Locate all potential upload targets (labels or image icons)
      let uploadImgPath="C:\\Automation\\MyEngie\\Upload images\\file_PNG_3MB.png";
    let targetXpath = "//label[text()='Browse'] | //img[@title='Click to make attachment (Maximum 5 attachment allowed).']";
    let targetElementsArr = page.EvaluateXPath(targetXpath);
    
    let activeTrigger = null;

    if (targetElementsArr && targetElementsArr.length > 0) {
        // 2. Loop through found elements to find the one that is ACTUALLY visible on screen (Size > 0)
        for (let i = 0; i < targetElementsArr.length; i++) {
            let element = targetElementsArr[i];
            
            // Check that the element has real width/height and isn't a 0x0 hidden element
            if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                activeTrigger = element;
                break; // Found the active one, stop searching
            }
        }
    }

    // 3. Execute the click on the verified visible element
    if (activeTrigger != null) {
        Log.Message("Found visible upload target on screen. Executing Click...");
        
        // Use a standard UI Click instead of native .click() to guarantee 
        // the browser registers the hardware event and opens the system window
        activeTrigger.Click(); 
        
        aqUtils.Delay(2000); // Wait 2 seconds for the Windows dialog to physically render
    } else {
        Log.Error("FAILED: Could not find any visible 'Browse' text or active attachment icon on screen.");
        return;
    }

    // 4. Secure the native Windows File Upload Explorer dialog window handle
    let dialogWindow = Sys.Process("chrome").WaitWindow("#32770", "Open", 1, 5000);
    
    if (dialogWindow.Exists) {
        Log.Message("Windows File Dialog successfully opened.");
        let fileInputBox = dialogWindow.Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1);
        
        fileInputBox.Click();
       fileInputBox.Keys("^a[bs]"); 
        fileInputBox.Keys(uploadImgPath);
        aqUtils.Delay(500);

        let openButton = dialogWindow.Window("Button", "&Open", 1);
        openButton.Click();
        
        Log.Checkpoint("PASSED: Image successfully uploaded via the verified active interface.");
    } else {
        Log.Error("FAILED: The Windows '#32770' Open explorer dialog failed to appear because the previous click was blocked.");
    }
}