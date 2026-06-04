function verifyBillingDeliveryMethod() {
   let browser = Sys.Browser("chrome");
    let page = browser.Page("*engie.com.au*");
  
  // 1. Strict lookup matching 'EP' for Email and 'P' for Post only on the visible screen panel
  var propNames = ["value", "VisibleOnScreen"];
  var emailValues = ["EP", true]; 
  var postValues = ["P", true];
var emailAddress="ramya@gmail.com"
  // 2. Find the visible elements down to 100 hierarchy levels
  var emailRadioInput = page.FindChild(propNames, emailValues, 100);
  var postRadioInput = page.FindChild(propNames, postValues, 100);
  // Fallback to ID wildcards if value matching fails
  
  if (!emailRadioInput.Exists || !postRadioInput.Exists) {
    emailRadioInput = page.FindChild(["idStr", "VisibleOnScreen"], ["deliveryTypeEP_*", true], 100);
    postRadioInput = page.FindChild(["idStr", "VisibleOnScreen"], ["deliveryTypeP_*", true], 100);
  }

  if (!emailRadioInput.Exists || !postRadioInput.Exists) {
    Log.Error("Action Failed: Cannot toggle selection. Radio buttons not found on screen.");
    return;
  }

  // 2. Read current states
  var isEmailChecked = emailRadioInput.checked || emailRadioInput.wChecked;
  var isPostChecked = postRadioInput.checked || postRadioInput.wChecked;

  // 3. Conditional Toggle Logic
  if (isPostChecked) {
    Log.Message("Current state is 'By Post'. Switching selection to 'By Email'...");
    emailRadioInput.Click(); 
  } 
  else if (isEmailChecked) {
    Log.Message("Current state is 'By Email'. Switching selection to 'By Post'...");
    postRadioInput.Click();
  } 
  
  // Check if the 'By email' option exists and is selected
  if (emailRadioInput.Exists && emailRadioInput.Checked) {
    Log.Message("'By email' is selected. Proceeding with email entry.");
    
    // Define the XPaths
    var emailXPath = "//input[contains(@class, 'deliveryemail')]";
    var confirmXPath = "//input[contains(@class, 'confirmdeliveryemail')]";
    
    // Execute XPath evaluation on the page object
    var emailResult = page.EvaluateXPath(emailXPath);
    var confirmResult = page.EvaluateXPath(confirmXPath);
    
    // Handle Email Input
    if (emailResult !== null && emailResult.length > 0) {
      var emailInput = emailResult[0]; // Extract object array element
      emailInput.Click();
      mailInput.Keys("^a");   // Ctrl + A to select all
      emailInput.Keys("[BS]");  // Capitalized BS or Backspace to delete
      emailInput.Keys(emailAddress); 
      emailInput.Keys(emailAddress);
      Log.Message("Main Email entered via XPath successfully.");
    } 
    
    // Handle Confirm Email Input
    if (confirmResult !== null && confirmResult.length > 0) {
      var confirmEmailInput = confirmResult[0]; // Extract object array element
      confirmEmailInput.Click();
      confirmEmailInput.Keys(emailAddress);
      Log.Message("Confirmation Email entered via XPath successfully.");
    }  
  } 
 }
  