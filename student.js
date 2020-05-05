"use strict";
const AWS = require("aws-sdk");

module.exports = {
  create : async (event, context)  => {
    var bodyObj = {}
    try {
      bodyObj = JSON.parse(event.body)
    } catch (error) {
      console.log('json body parse failed!', error)
      return {
        statusCode: 400
      }
    }

    if (typeof bodyObj.name === 'undefined' || typeof bodyObj.gender === 'undefined') {
      console.log('invalid input format!')
      return {
        statusCode: 400
      }
    }

    var putParams = {
      TableName: process.env.DYNAMDB_STUDENT_TABLE,
      Item: {
        name: bodyObj.name,
        gender: bodyObj.gender
      }
    }
    var putResult = {}
    try {
      var dynamoDb = new AWS.DynamoDB.DocumentClient()
      putResult = await dynamoDb.put(putParams).promise()
    } catch (error) {
      console.log('saving student data failed!')
      console.log('putParams', putParams)
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 201
    }
  },
  list : async (event, context)  => {
      var scanParams = {
        TableName: process.env.DYNAMDB_STUDENT_TABLE
      }

      var scanResult = {}
      try {
        var dynamoDb = new AWS.DynamoDB.DocumentClient()
        scanResult = await dynamoDb.scan(scanParams).promise()
      } catch (error) {
        console.log('failed to list students!')
        console.log('scanError', error)
        return {
          statusCode: 500
        }
      }

      if (scanResult.Items === null || !Array.isArray(scanResult.Items) || scanResult.Items.length === 0) {
          return {
            statusCode: 404
          }
      }

      return {
        statusCode: 200,
        body: JSON.stringify(scanResult.Items.map(student => {
          return {
            name: student.name,
            gender: student.gender
          }
        }))
      }
  },
  delete : async (event, context)  => {
    var deleteParams = {
      TableName: process.env.DYNAMDB_STUDENT_TABLE,
      Key: {
        name: event.pathParameters.name
      }
    }
    var deleteResult = {}
    try {
      var dynamoDb = new AWS.DynamoDB.DocumentClient()
      deleteResult = await dynamoDb.delete(deleteParams).promise()
    } catch (error) {
      console.log('failed to delete student!')
      console.log('deleteError', error)
      return {
        statusCode: 500
      }

    }

    return {
      statusCode: 200
    }
  } 
}