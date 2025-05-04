# Cryptocurrency Price Email Service & Search History API

## Project Overview

This project implements two serverless microservices using Node.js on AWS:

1. **Microservice 1: Email Cryptocurrency Current Price**
   Allows an investor to query the current price of a specific cryptocurrency and receive a email with the result.

2. **Microservice 2: Search History**
   Enables the retrieval of search history, including the timestamps and queried cryptocurrency details, from Microservice 1.

## Technology Stack

* **Node.js**: Backend runtime for implementing the microservices.
* **AWS Lambda**: For deploying the serverless microservices.
* **AWS API Gateway**: To expose the APIs for interaction.
* **AWS DynamoDB**: For persisting the search history data.
* **AWS SES (Simple Email Service)**: For sending email notifications with cryptocurrency prices. (Since it's using the sandbox mode, the recipient should first verify their email in AWS SES. Also, please note that the email may be sent to the spam folder.)
* **GitHub Actions**: For Continuous Integration and Continuous Deployment (CI/CD). The deployment is fully automated using AWS SAM, ensuring reproducibility and simplicity in managing the infrastructure.
* **AWS SAM (Serverless Application Model)**: For infrastructure as code to deploy and manage the serverless resources (Lambda functions, DynamoDB， API Gateway， Lambda Layers, and IAM Policies).

## Architecture Overview

Lambda Layers to centralize and share reusable configurations and libraries across multiple functions, simplifying maintenance and reducing code duplication.

1. **Microservice 1 (Email Cryptocurrency Price to User)**:

   * API Gateway routes the requests to a Lambda function that queries the CoinGecko API to retrieve the current cryptocurrency price.
   * After obtaining the data, the Lambda function sends an email via AWS SES to the user with the price details of the requested cryptocurrency.
   * The query is also stored in DynamoDB for later retrieval.

2. **Microservice 2 (Fetch User Search History)**:

   * An API endpoint exposes a GET request to fetch all search history from DynamoDB, including the timestamps and cryptocurrency names.

### Flow:

1. The user sends a request to get the current cryptocurrency price.
2. Microservice 1 retrieves the price from CoinGecko, sends an email with the result, and returns a formatted JSON response notifying the user whether the email was successfully sent.
3. The search request is recorded in DynamoDB.
4. The user can request their search history via Microservice 2, The data is listed in descending order by date to show the newest records first.

## Testing

The project includes some unit tests using vitest to verify the functionality of the Lambda functions and their integration with external services.

### Run Tests Locally:

Navigate to the `email-price-service` folder.

```bash
npx vitest run
```

### Test Endpoints:

1. **Microservice 1: Get Cryptocurrency Price**

    * **Endpoint**:

    ```
    POST https://scocaw1d7b.execute-api.ap-southeast-2.amazonaws.com/Prod/price
    ```

    * **Headers**:

    ```
    Content-Type: application/json
    ```

    * **Request Body**:

    ```json
    {
        "symbol": "bitcoin",
        "email": "youremailaddress@gmail.com"
    }
    ```

    * **Example Request**:

    ```json
    POST https://scocaw1d7b.execute-api.ap-southeast-2.amazonaws.com/Prod/price
    Headers:
        Content-Type: application/json
    Body:
        {
        "symbol": "bitcoin",
        "email": "youremailaddress@gmail.com"
        }
    ```

    * **Example Response**:

    ```json
    {
        "success": true,
        "message": "Email sent to youremailaddress@gmail.com successfully with current price of BITCOIN. If you did not receive the email, please check spam box.",
        "data": {}
    }
    ```

    ### **Important Notes**:

    1. **Email Delivery**: 
      - The email with the cryptocurrency price will be sent to the provided email address (Since this is using sandbox mode, the recipient should first verify their email in AWS SES). 
      
      - Also, please note that because I applied for my personal email to be in production mode but it has not yet passed AWS's review, the email may be sent to the spam folder.

    2. **Symbol Case Sensitivity**: The cryptocurrency symbol (e.g., `bitcoin`, `ethereum`, etc.) is case-sensitive. Please ensure that you use the correct case when specifying the symbol.

2. **Microservice 2: Retrieve Search History**

    * **Endpoint**:

    ```
    GET https://scocaw1d7b.execute-api.ap-southeast-2.amazonaws.com/Prod/history
    ```

    * **Example Request**:

    ```
    GET https://scocaw1d7b.execute-api.ap-southeast-2.amazonaws.com/Prod/history
    ```

### Manual Testing:

You can also test the deployed APIs using Postman or curl to verify the email functionality and data persistence.
### 1. **Microservice 1: Get Cryptocurrency Price**

To get the cryptocurrency price, you need to use the **POST** method, passing the symbol and email in the request body.

```bash
curl -X POST https://scocaw1d7b.execute-api.ap-southeast-2.amazonaws.com/Prod/price \
     -H "Content-Type: application/json" \
     -d '{"symbol": "bitcoin", "email": "youremailaddress@gmail.com"}'
```

### 2. **Microservice 2: Retrieve Search History**

To retrieve the search history, you use the **GET** method.

```bash
curl https://scocaw1d7b.execute-api.ap-southeast-2.amazonaws.com/Prod/history
```

In both cases:

* For **Microservice 1**, the request uses the `POST` method and sends a JSON payload in the body containing the `symbol` and `email`.
* For **Microservice 2**, the request is a simple `GET` request with no body.

You can replace `youremailaddress@gmail.com` with your actual email address to test the first API.

## Important Considerations

* **Email Configuration**: Ensure that the SES configuration is correctly set up and email addresses are verified in the AWS SES console before sending emails.
* **CoinGecko API Rate Limits**: The CoinGecko API has rate limits that should be adhered to avoid being blocked or throttled.