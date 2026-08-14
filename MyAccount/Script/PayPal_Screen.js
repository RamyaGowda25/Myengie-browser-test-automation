function makePayPalPayment() {
    let browser = Sys.Browser("chrome");
    let page = browser.Page("https://newdawnpreprod.myengie.engie.com.au/*");

   // --- AUTOMATE PAYPAL (LOGIN OR REVIEW) --- 
    let paypalPage = browser.WaitPage("*://*paypal.com*", 40000); 
    if (paypalPage.Exists) { 
    
    let emailField = paypalPage.WaitElement("//input[@id='email']", 30000); 
    let reviewScreenBtnXPath = "//button[contains(., 'Complete Purchase')] | //button[contains(., 'Agree & Pay Now')] | //button[contains(., 'Agree and Continue')]";
    let agreeBtn = paypalPage.WaitElement(reviewScreenBtnXPath, 10000); 

    if (emailField.Exists) { 
      // CASE 1: Login required 
      Log.Checkpoint("PayPal login screen detected."); 
      
      // 1. Enter Email safely
      emailField.Click(); 
      emailField.Keys("^a[BS]"); 
      emailField.Keys("sb-xukre18556916@personal.example.com"); 

      // 2. Handle the conditional "Next" button if it exists on older layouts
      let nextBtn = paypalPage.WaitElement("//button[@id='btnNext']", 2000); 
      if (nextBtn.Exists && nextBtn.VisibleOnScreen) {
        nextBtn.Click(); 
        aqUtils.Delay(10000);
      }

      // 3. Enter Password
      let passwordField = paypalPage.WaitElement("//input[@id='password']", 10000); 
      if (passwordField.Exists) { 
        passwordField.Click(); 
        passwordField.Keys("^a[BS]"); // Clear out pre-filled markers if any
        passwordField.wText = "c)>!EDU5"; 
        passwordField.Keys("[Right]"); 
        aqUtils.Delay(2000);
        // 4. Locate and Force Click the Log In button explicitly (highlighted in your red box)
        let loginBtn = paypalPage.WaitElement("//button[@id='btnLogin'] | //button[contains(., 'Log In')]", 10000);
        if (loginBtn.Exists) {
          loginBtn.Click();
          Log.Checkpoint("PayPal log in button clicked.");
          aqUtils.Delay(10000); // Wait for authorization redirect to process
        } else {
          Log.Error("Could not locate the 'Log In' submit button.");
        }
      } 
      
    } 

    // CASE 2: Click Complete Purchase once visible
    if (agreeBtn.Exists && agreeBtn.VisibleOnScreen) { 
      agreeBtn.Click(); 
    } 
  } 
}