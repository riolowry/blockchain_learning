# Project #3. RESTful Web API with Node.js Framework

This is Project 3, RESTful Web API with Node.js Framework, in this project I extended my blockchain from project 2 with a RESTful Web API using Express.js. Notes from Project 2 can be found in __./SimpleChainTesting.md__

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __npm start__ in the root directory, this will start the server running at http://localhost:8000.
4. Test via GET and POST requests per testing instructions below

## Framework
Express.js

## API

*Core Endpoints:*

GET `/api/blockheight/` 
  - returns the total height of the chain.

POST `/api/block/` 
  - requires parameter "body" containing a string of the data to be added to the block
  - will error if body parameter is missing or the value is an empty string.
  - returns a block object in JSON format

GET `/api/block/:height` 
  - will return an error if the requested block does not exist.
  - returns a block object in JSON format for the block at the given height

GET `/api/validate/:height`
  - returns true if the block at the given height is valid.

GET `/api/validate/`
  - returns a object showing if the chain is valid or not. 

*Helper endpoints (for testing only):*

GET `/api/block/` 
  - *For testing purposes only* 
  - returns a list of all blocks in the chain 

POST `/api/createTestData/` 
  - *For testing purposes only* 
  - creates 10 test blocks

POST `/api/createTestData/` 
  - *For testing purposes only* 
  - invalidates two blocks in the chain

## Testing the project

The api has all the endpoints needed to be able to test the project. To test start the server running at http://localhost:8000 by running the __npm start__ command in the root directory, then follow these instructions:

1. Generate a single block

   POST to `/api/block/` with a body parameter of the form:

   ```
   {
      "body": "Testing block with test string data"
   }
   ```

   This function will create a block with the given data, add it to the chain and return the block object in JSON format.

   Example call using curl:

	```
	curl -X POST \
	http://localhost:8000/api/block \
	-H 'Cache-Control: no-cache' \
	-H 'Content-Type: application/json' \
	-d '{
		"body":"Some data example"
	}'
	```

	Format of returned data:

	```
	{
	"hash":"556155ce12a12dd334b4d03eeef0cd4d0b36b64b0cbfdf3eb633222704a470f1",
	"height":1,
	"body":"Some data example",
	"timeStamp":"1554343766",
	"previousBlockHash":"e216b63be44f3e4219a82763ae2c24bfb71791ed94af917399d4d2b9fc95a8b8"
	}
	```

2. Request a single block

   GET to `/api/block/0` 

   This will return the genisis block object in JSON format.

   Example call using curl:

	```
	curl http://localhost:8000/api/block/0
	```
	
	Format of returned data:
	```
	{
	"hash":"debfa571fd45f8044c9a5e8164b11696fc565521c770714daf6131dc89c393d4",
	"height":0,
	"body":"First block in the chain - Genesis block",
	"timeStamp":"1554271998",
	"previousBlockHash":""
	}
	```
3. Validate a single block

   GET to `/api/validate/1` 

   This will return if the block is valid

   Example call using curl:

	```
	curl http://localhost:8000/api/validate/1
	```

	Block should be valid

4. Generate test blocks:

   POST to `/api/createTestData/` with no parameters.

   This will create 10 test blocks in the chain.

   Example call using curl:

   ```
   curl -X POST \
     http://localhost:8000/api/createTestData/ \
     -H 'Cache-Control: no-cache' \
     -H 'Content-Type: application/json'
   ```

5. Validate the chain

   GET to `/api/validate/` 

   This will return if the chain is valid.

   Example call using curl:

	```
	curl http://localhost:8000/api/validate
	```
   The chain should be valid

6. Tamper with the chain

   POST to `/api/createInvalidBlocks/` 

   This will tamper with 2 blocks on the chain

   Example call using curl:

	```
   curl -X POST \
     http://localhost:8000/api/createInvalidBlocks/ \
     -H 'Cache-Control: no-cache' \
     -H 'Content-Type: application/json'
	```
	

7. Re-validate the chain

   GET to `/api/validate/` 

   This will return if the chain is valid.

   Example call using curl:

	```
	curl http://localhost:8000/api/validate
	```
   The chain should be invalid

## What did I learn with this Project

* I was able to create and manage a web API with a Node.js framework to interact with my private blockchain application.
* I was able to generate API endpoints and configure the endpoints response so that my private blockchain's functions can be consumable via web clients.
