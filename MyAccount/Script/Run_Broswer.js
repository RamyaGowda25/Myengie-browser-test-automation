function run_myengie_browser()
{

  var UserName = "myengie_preprod";
  // Raw: Z4@mN8#qV7!xR3$h -> Encoded: Z4%40mN8%23qV7%21xR3%24h
  var Password = "Z4%40mN8%23qV7%21xR3%24h"; 
  var URL = "newdawnpreprod.myengie.engie.com.au";
  var authUrl = "https://" + UserName + ":" + Password + "@" + URL;
   // 1. Ensure no existing instances are hanging in the background
  Sys.OleObject("WScript.Shell").Run("taskkill /f /im chrome.exe", 0, true);
 var browser = "--disable-web-security --user-data-dir=\"C:\\Temp\\Automation\" --disable-site-isolation-trials";
Browsers.Item(btChrome).RunOptions = browser;
  Browsers.Item(btChrome).Run(authUrl);
  var pChrome = Sys.WaitBrowser("chrome", 60000);
  
  if (pChrome.Exists) {
    Log.Message("Browser launched successfully.");
  } else {
    Log.Error("Browser failed to launch or load within 60 seconds.");
  }
  Browsers.Item(btChrome).Navigate("https://newdawnpreprod.myengie.engie.com.au/");
} 