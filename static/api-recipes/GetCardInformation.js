async function GetCardInformation(workflowCtx, portal) {
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
      name: "Get Card Information",
      stepCallback: async (stepState) => {
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description:
            "Retrieve a list of all Shell cards associated with your account.\n Make a request to card Search API using the generated Token passing in Authorization Header prefix with Bearer.",
          endpointPermalink: "$e/Card/SearchCard",
          args:{
            "RequestId": Math.floor(Math.random() * 10000000),
            body: {
              "Filters": {
                  "PayerNumber": "CZ00000927",
                  "AccountNumber": "CZ00000927",
                  "ColCoCode": 32,
                  "CardStatus": [
                      "All"
                  ]                  
              },
              "Page": 1,
              "PageSize": 100
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
