function wait_for_pin_forgot_password()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();
  var element = page.WaitElement("//input[@name='verification_pin']",800000);
  
}
function wait_for_pin_page()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();
  var element = page.WaitAliasChild("passwordboxFvpin",800000); 
}

function wait_for_OTP_Screen()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();  
  var element=page.WaitElement("//span[.='Enter your 6-digit code']",500000); 
}

function wait_resend_code()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();
  var resend_code=page.WaitAliasChild("linkResendCode",1000000);
}

function wait_for_resetMobileScreen()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();
  var reset_mobile_link = page.WaitAliasChild("linkMaxresendreset",1000000);
}


function wait_for_signPage()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();
  var singIn_page=page.WaitAliasChild("buttonSessionexpiredbtn",2000000);
  singIn_page.ClickButton();
  
}

function wait_for_Link_Account()
{
  var page = Aliases.browser.MyEngieSignInPage;
  page.Wait();
  var link_Account=page.WaitElement("//button[.='Link an account']",2000000);
  link_Account.Click();
  
}
