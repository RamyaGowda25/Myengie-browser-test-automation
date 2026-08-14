function Account_Balance_Validation() {
    Runner.CallMethod("Get_Elec_Account_Number.selectElectricityAndStoreNumber");
    aqUtils.Delay(10000);
    
    // Reference the updated, stable alias mapped in your object repository
    var balanceNode = Aliases.browser.MyEngieSignInPage.articleLinkAdditionalAccount.textnode2;
    
    if (balanceNode.Exists) {
        // Read whatever text value is dynamically generated on screen
        var rawText = balanceNode.contentText;
        Log.Message("Captured dynamic screen value: " + rawText);
        
        // Strip out non-numeric characters except minus sign and decimal point
        var cleanedAmount = rawText.replace(/[^0-9.-]/g, "");
        Log.Message("Parsed balance for verification: " + cleanedAmount);
        
        // Save to project variables for your second application checkpoint
        Project.Variables.StoreAccountBalance = cleanedAmount;
    } else {
        Log.Error("Could not locate the balance container element on the page.");
    }

    // === INSERTED: SWITCH TO NEXT BROWSER TAB HERE ===
    Log.Message("Switching to the HubCX browser tab...");
    let browser = Sys.Browser("chrome");
    LLPlayer.KeyDown(17, 0); // 17 is the Virtual Key Code for CTRL
    LLPlayer.KeyDown(9, 0);  // 9 is the Virtual Key Code for TAB
    aqUtils.Delay(100);
    LLPlayer.KeyUp(9, 0);
    LLPlayer.KeyUp(17, 0);

    aqUtils.Delay(2000); // Wait 2 seconds for the target tab to gain active focus

    // original script call continues below
    Runner.CallMethod("Account_Balance_Validation_HUB.Account_Balance_validation_HUB");
}
