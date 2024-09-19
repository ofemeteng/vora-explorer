# Aztec L2 Blockchain Indexer API

This README provides documentation for the Aztrack - Aztec L2 Blockchain Indexer API. The API allows you to retrieve information about blocks, transactions, and contracts on the Aztec L2 blockchain.

The relevant code for the indexer is in `src/indexer`.
The codebase is an extension of the code from [Vora Wallet](https://github.com/ofemeteng/vora-wallet)

## Swagger API Docs

The Swagger/OpenAPI docs for the Aztrack Indexer API can be accessed via the URL below:

```
http://localhost:3000/api
```

## Endpoints

### Blocks

#### Get Current Block Number

Retrieves the current block number on the Aztec L2 blockchain.

- **URL:** `/v1/get-current-block-number`
- **Method:** GET
- **Response:**
  ```json
  {
    "data": {
      "currentBlockNumber": number
    }
  }
  ```

#### Get Block by Number

Retrieves a specific block by its block number.

- **URL:** `/v1/get-block/:blockNumber`
- **Method:** GET
- **Parameters:**
  - `blockNumber`: The number of the block to retrieve
- **Response:**
  ```json
  {
    "data": {
      "block": object
    }
  }
  ```

#### Get Blocks in Range

Retrieves blocks within a specified range of block numbers.

- **URL:** `/v1/get-blocks/from/:fromBlock/to/:toBlock`
- **Method:** GET
- **Parameters:**
  - `fromBlock`: The starting block number
  - `toBlock`: The ending block number
- **Response:**
  ```json
  {
    "data": {
      "blocks": array
    }
  }
  ```

### Transactions

#### Get Transaction Receipt by Hash

Retrieves a transaction receipt for a given transaction hash.

- **URL:** `/v1/get-transaction-receipt-by-txhash/:txHash`
- **Method:** GET
- **Parameters:**
  - `txHash`: The hash of the transaction
- **Response:**
  ```json
  {
    "data": {
      "txReceipt": object
    }
  }
  ```

#### Get Transaction by Hash

Retrieves a transaction for a given transaction hash.

- **URL:** `/v1/get-transaction-by-txhash/:txHash`
- **Method:** GET
- **Parameters:**
  - `txHash`: The hash of the transaction
- **Response:**
  ```json
  {
    "data": {
      "transaction": object
    }
  }
  ```

#### Get Transactions in a Block

Retrieves all transactions in a specific block.

- **URL:** `/v1/get-transactions-in-block/:blockNumber`
- **Method:** GET
- **Parameters:**
  - `blockNumber`: The number of the block
- **Response:**
  ```json
  {
    "data": {
      "transactions": array
    }
  }
  ```

#### Get Transactions in Range

Retrieves transactions within a specified range of block numbers.

- **URL:** `/v1/get-transactions/from/:fromBlock/to/:toBlock`
- **Method:** GET
- **Parameters:**
  - `fromBlock`: The starting block number
  - `toBlock`: The ending block number
- **Response:**
  ```json
  {
    "data": {
      "transactions": array
    }
  }
  ```

### Contracts

#### Get Contract by Address

Retrieves a contract instance given its address.

- **URL:** `/v1/get-contract-by-address/:address`
- **Method:** GET
- **Parameters:**
  - `address`: The address of the contract
- **Response:**
  ```json
  {
    "data": {
      "contract": object
    }
  }
  ```

#### Get All Contracts

Retrieves the addresses of all contracts added to the PXE Service.

- **URL:** `/v1/get-contracts`
- **Method:** GET
- **Response:**
  ```json
  {
    "data": {
      "contracts": array
    }
  }
  ```

## Error Handling

If an error occurs, the API will return an appropriate HTTP status code along with an error message in the response body.

## Versioning

This API is versioned. The current version is v1, which is reflected in the base URL.

## Examples

Here are a few examples of how to use the API:

1. Get the current block number:
   ```
   GET http://localhost:3000/api/v1/get-current-block-number
   ```

2. Get a specific block:
   ```
   GET http://localhost:3000/api/v1/get-block/24
   ```

3. Get transactions in a block range:
   ```
   GET http://localhost:3000/api/v1/get-transactions/from/1000/to/1010
   ```

4. Get a contract by address:
   ```
   GET http://localhost:3000/api/v1/get-contract-by-address/0x1234567890123456789012345678901234567890
   ```
