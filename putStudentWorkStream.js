const AWS = require('aws-sdk')

const kinesis = new AWS.Kinesis({region:"us-east-1"})

const KINESIS_WORK_STREAM = "my-first-service-studentsWorkStream-dev"
var params = {
    Data: '{"key":"0", "connections":"0" , "level": 0}' /* Strings will be Base-64 encoded on your behalf */, /* required */
    PartitionKey: '0', /* required */
    StreamName: KINESIS_WORK_STREAM, /* required */
}

var request = kinesis.putRecord(params)
request.send()

request
    .on('error', (err, response) => {
        console.log(err, err.stack)
    })
    .on('success', (response) => {
        var shardId = response.data.ShardId
        scanRecordsInShard(shardId)    
    })

function scanRecordsInShard(shardId) {
    params = {
            ShardId: shardId,
            ShardIteratorType: 'TRIM_HORIZON',
            StreamName: KINESIS_WORK_STREAM,
        }
        request = kinesis.getShardIterator(params)
        request.send()
        request.on('error', (err, response) => {
            console.log(err, err.stack)
        })
        .on('success', (response) => {
            var shardIterator = response.data.ShardIterator
            iterateRecords(shardIterator)
        })

}

function iterateRecords(shardIterator) {
    params = {
        ShardIterator: shardIterator,
        Limit: '2'
    }
    
    request = kinesis.getRecords(params)
    request.send()
    request.on('error', (err, response) => {
        console.log(err, err.stack)
    })
    .on('success', (response) => {
        console.log(response.data)
        shardIterator = response.data.NextShardIterator
        if (typeof response.data.NextShardIterator !== 'undefined' 
            && typeof response.data.Records !== 'undefined' && response.data.Records.length > 0) {
            iterateRecords(shardIterator)
        }
    })
}