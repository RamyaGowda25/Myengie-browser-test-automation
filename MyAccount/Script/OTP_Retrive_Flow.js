function getTouchSmsOtp() {
  
   // Use 'inbound' for received messages
  var apiUrl = "https://app.touchsms.com.au/api/v2/inbounds";
   var auth = "Basic " + dotNET.System.Convert.ToBase64String(
    dotNET.System_Text.Encoding.UTF8.GetBytes_2("19391-blBSBt22m6McBJ84mPu:mVP0gSnN7wLyGUthjxP0")
  );
  // Poll every 1 second for 30 seconds total
  for (var i = 0; i < 30; i++) {
    var request = aqHttp.CreateGetRequest(apiUrl);
    request.SetHeader("Authorization", auth);
    request.SetHeader("Accept", "application/json");
    
    var response = request.Send();
    if (response != null && response.StatusCode == 200) {
      var data = JSON.parse(response.Text).data;
      if (data && data.length > 0) {
        var match = data[0].content.match(/\d{6}/);
        if (match) return match[0]; 
      }
    }
    aqUtils.Delay(1000); // 1 second refresh
  }
  return null;
   
}


function Instant_OTP_Entry(myOtp) {
if (!myOtp) return;
  
  var page = Sys.Browser("chrome").Page("*engie.com.au*");
  Log.Message("Starting Instant Entry: " + myOtp);

  // Array to map the index to words for the Forgot Password flow
  var words = ["one", "two", "three", "four", "five", "six"];

  for (var i = 0; i < 6; i++) {
    // This XPath checks for BOTH types of IDs: 'otp0' OR 'edit-code-one'
    var xpath = "//input[@id='otp" + i + "' or @id='edit-code-" + words[i] + "']";
    
    var box = page.WaitElement(xpath, 500);
    
    if (box.Exists) {
      box.SetText(myOtp.charAt(i));
    } else {
      Log.Warning("OTP box at index " + i + " not found. Retrying with page refresh...");
      page.Refresh();
      // Retry the search after refresh
      box = page.WaitElement(xpath, 1000);
      if (box.Exists) {
        box.SetText(myOtp.charAt(i));
      } else {
        Log.Error("Could not find OTP box at index " + i);
      }
    }
  }
  
  Log.Checkpoint("All digits entered successfully.");
}
function Click_SignIn() {
  //let browser = Sys.Browser("chrome");
  var page = Sys.Browser("chrome").Page("*engie.com.au*");
  
   // 1. Target the 'Continue' button specifically by its ID
  var continueBtn = page.WaitElement("//*[@id='edit-next']", 2000);
  
  // 2. Target the 'Sign In' button (usually has a different ID or text)
  var signInBtn = page.WaitElement("//button[contains(., 'sign in')]", 2000);

  // 3. Registration / Verify Flow
  var sendCodeBtn = page.WaitElement("//*[@id='send_code_reg']", 1000);
  
  //4.Registartion Interrupt flow(Re-Enter Mobile numberto complete the process)
  var continueBtn2=page.WaitElement("//*[@id='continuetwofauth']", 2000);
  
  //5.Update Password
  var updatePsw=page.WaitElement("//a[@href='/update-password']",2000);
  
  
  if (continueBtn.Exists && continueBtn.VisibleOnScreen) {
    Log.Message("Triggering OTP via 'Continue' button (ID: edit-next).");
    continueBtn.Click();
  } 
  else if (continueBtn2.Exists && continueBtn2.VisibleOnScreen) {
    Log.Message("Triggering OTP via 'SContinue' button (ID:continuetwofauth).");
    continueBtn2.Click();
  }
  
  else if (signInBtn.Exists && signInBtn.VisibleOnScreen) {
    Log.Message("Triggering OTP via 'Sign In' button.");
    signInBtn.Click();
  } 
   else if (sendCodeBtn.Exists && sendCodeBtn.VisibleOnScreen) {
    Log.Message("Triggering OTP via 'Send Code' button.");
    sendCodeBtn.Click();
  }
  else if(updatePsw.Exists && updatePsw.VisibleOnScreen)
  {
    Log.Message("Triggering OTP via 'Update Password' link.");
    updatePsw.Click();
  }
  else {
    Log.Error("Failed to find any OTP trigger button. Check if the ID 'edit-next' has changed.");
  }
}


function Automated_Login_With_OTP() {
  Click_SignIn();
  
  aqUtils.Delay(20000);
  var liveOtp = getTouchSmsOtp(); 
  
  if (liveOtp) {
    Instant_OTP_Entry(liveOtp);
  }
}
