"use strict";
const AWS = require("aws-sdk");


const kinesis = new AWS.Kinesis()
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports = process

function process(event, context, callback) {
    event.Records.forEach(record => {
        console.log("record", convert(record))
    })
}

function convert(record) {
    var jsonStr = Buffer.from(record.kinesis.data, 'base64').toString()
    var data = JSON.parse(jsonStr)
    return data
}