async function OrderNewCards(workflowCtx, portal) {
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
      name: "Order Card Request",
      stepCallback: async (stepState) => {
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description:
            "Make a request to Order Card  API",
          endpointPermalink: "$e/Card/OrderCard",
          args:{
            "RequestId": Math.floor(Math.random() * 10000000),
            body: {
              "CardDetails": [
                  {
                      "PayerNumber": "CZ00000927",
                      "AccountNumber": "CZ00000927",
                      "ColCoCode": 32,
                      "CardTypeId": 106,
                      "TokenTypeId": 108,
                      "EmbossText": "DOMINICA1",
                      "VRN": "TEST",
                      "DriverName": "TEST",
                      "OdometerInputRequired": false,
                      "FleetIdInputRequired": false,
                      "PurchaseCategoryId": 101,
                      "SelfSelectedEncryptedPIN": null,
                      "SelfSelectedPINKeyID": null,
                      "SelfSelectedPINSessionKey": null,
                      "IsNewCardGroup": false,
                      "EmbossCardGroup": false,
                      "CardDeliveryType": 1,
                      "PINDeliveryAddressType": 1,
                      "PINAdviceType": 1
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
      name: "Check OrderCard Status",
      stepCallback: async (stepState) => {
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });

        return workflowCtx.showEndpoint({
          description:
            "Check the status of the card order whether it's success or fail through Order Card Enquiry API.",
          endpointPermalink: "$e/Card/OrderCardEnquiry",
          args: {
            RequestId: Math.floor(Math.random() * 10000000),
            body: {
              Filters: {
                AccountNumber: stepState?.["Step 3"]?.requestData?.args?.body?.CardDetails[0]?.AccountNumber,
                PayerNumber: stepState?.["Step 3"]?.requestData?.args?.body?.CardDetails[0]?.PayerNumber,
                ReferenceNumber: stepState?.["Step 3"]?.data?.MainReference,
                ReferenceType: 1,
                OrderRequestId: stepState?.["Step 3"]?.data?.RequestId
              }
            }
          },
          verify: (response, setError) => {
            console.log("Step 4 response Data", response);
            console.log("Step 4 response Data", response?.data?.Data[0]?.CardId);
            if (response?.data?.Data[0]?.CardId !== null) {
              localStorage.setItem("card_id", response?.data?.Data[0]?.CardId);
              localStorage.setItem("card_exp", response?.data?.Data[0]?.ExpiryDate);
              localStorage.setItem("card_pan", response?.data?.Data[0]?.CardPAN);
              return true;
            } else {
              setError("Status still pending. Run request again until approved.");
              return false;
            }
          },
        });
      },
    },

    "Step 5": {
  name: "Explore More Recipes",
  stepCallback: async () => {
    return workflowCtx.showContent(`## After successfully executing Order new cards recipe and fetching Card ID, here are some useful recipes you can explore which utilize the Card ID:

| Recipe Name         | Link                                                        |
|---------------------|-------------------------------------------------------------|
| Auto Renew Card     | [Start](page:api-recipes/auto-renewal)                        |
| Update Card Status  | [Start](page:api-recipes/block-unblock-cards)                   |
| Get Cards Info      | [Start](page:api-recipes/get-card-information)                     |
| Move cards group    | [Start](page:api-recipes/move-cards-between-groups)                     |
| Request PIN reminders| [Start](page:api-recipes/request-pin-reminders)                     |
| Schedule Card Block | [Start](page:api-recipes/schedule-card-block)                     |
`
   );
  }
}
  };
}
