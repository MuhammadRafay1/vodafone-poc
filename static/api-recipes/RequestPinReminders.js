async function RequestPinReminders(workflowCtx, portal) {
  return {
    "Step 1": {
      name: "Pre-Usage Checklist",
      stepCallback: async (stepState) => {
        return workflowCtx.showContent(` ## Pre-Usage Data Checklist

#### Essential Data Requirements for Using Card-Related APIs


Before using any of the card-related APIs, users need to have specific data points such as payer, account, Colco, card type, and purchase category details. The following APIs provide these necessary details:

1. **[Logged-in User API]($e/Customer/LoggedinUser)**: This API provides user access level details, including payer, account, and Colco information. For more details, [check out our API specification]($e/Customer/LoggedinUser).

2. **[Customer Accounts API]($e/Customer/Accounts)**: This API offers customer-specific account-related information. For more details, [refer to the API specification]($e/Customer/Accounts).

3. **[Customer CardType API]($e/Customer/CardType)**: This API provides information about the customer's allowed card types and purchase category details, which are needed when ordering new cards through the API. For more details, [check the API specification]($e/Customer/CardType).

        `);
      },
    },
    "Step 2": {
      name: "Authentication",
      stepCallback: async (stepState) => {
        return workflowCtx.showContent(`## Authentication


To access the Shell Card Management API, you need to obtain an access token using the client credentials grant type.
Follow the following steps to get an access token:

1. Navigate to Step 3
2. Expand the ‘Authentication’ section.
3. Provide the ‘OAuthClientId’ and ‘OAuthClientSecret’.
4. Click ‘Get Token’ Button to add the generated Authentication token to this Portal so you can make API calls.

**Note**: If you have already done this step and have an access token, you can skip this step.

![Auth GIF](./static/images/auth.gif)
        `);
      },
    },
    "Step 3": {
      name: "PIN Reminder Request",
      stepCallback: async (stepState) => {
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });
        let cardId = localStorage.getItem("card_id");
        let cardexp = localStorage.getItem("card_exp")?.split(" ")[0];
        let cardpan = localStorage.getItem("card_pan");
        if (!cardId) {
          cardId = "470825";
        }
        return workflowCtx.showEndpoint({
          description:
            "Make a request to PIN Reminder  API",
          endpointPermalink: "$e/Card/CardPinReminder",
          args:{
            "RequestId": Math.floor(Math.random() * 10000000),
            body: {
              "AccountNumber": "CZ00000927",
              "ColCoCode": 32,
              "PayerNumber": "CZ00000927",
              "PINReminderCardDetails": [
                  {
                      "CardId": cardId,
                      "PAN": cardpan,
                      "CardExpiryDate": cardexp,
                      "PINAdviceType": 1,
                      "PINContactType": 4,
                      "PINDeliverTo": {
                          "ContactName": "Alex",
                          "ContactTitle": "Mr",
                          "CompanyName": "Test",
                          "AddressLine": "Address1",
                          "ZipCode": "938373",
                          "City": "City1",
                          "RegionID": 0,
                          "CountryID": 0,
                          "PhoneNumber": null,
                          "EmailAddress": "abctest@gmail.com",
                          "SavePINReminder": false
                      }
                  }
              ]
            }
          },
          verify: (response, setError) => {
            if (response.StatusCode == 200 || response.StatusCode == 201) {
              return true;
            } else {
              setError(
                "API Call wasn't able to get a valid repsonse. Please try again."
              );
              return false;
            }
          },
        });
      },
    },
    "Step 4": {
      name: "Check PIN Reminder Status",
      stepCallback: async (stepState) => {
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description:
            "This operation allows users to fetch audit data of account or card operations performed by users of a given customer.",
          endpointPermalink: "$e/Customer/AuditReport",
          args:{
            "RequestId": Math.floor(Math.random() * 10000000),
            "apiKey": "APIKEY",
            body: {
              "AccountNumber": "CZ00000927",
              "ColCoCode": 32,
              "PayerNumber": "CZ00000927",
              "Status": "All",
              "RequestedOperation": "PINReminder",
              "SortOrder": "1",
              "SearchText": null,
              "CurrentPage": 1,
              "FromDate": "20250601",
              "ToDate": "20250704" 
            }
          },
          verify: (response, setError) => {
            if (response.StatusCode == 200 || response.StatusCode == 201) {
              return true;
            } else {
              setError(
                "API Call wasn't able to get a valid repsonse. Please try again."
              );
              return false;
            }
          },
        });
      },
    }
  };
}
