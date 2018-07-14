const PROTO_PATH = __dirname + "/protos/helloworld.proto";
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const raspberrywallet = protoDescriptor.raspberrywallet;
// Suggested options for similarity to existing grpc.load behavior

let client = new raspberrywallet.RaspberryWalletServer('localhost:8081', grpc.credentials.createInsecure());

client.ping({}, (err, response) => {
    console.log('Response:', response.response);
});

client.getModules({}, (err, response) => {
    response.modules.forEach((module) => {

        console.log('Module:', module.id);
        let call = client.getModuleState(module.id);
        call.on('data', (state) => {
            console.log(`data for module ${module.name} ${JSON.stringify(state)}`)
        });
        call.on('end', () => {
            console.log("The server has finished serving");
        });
        call.on('error', (err) => {
            console.error("An error has occured and stream has been closed");
            console.error(err)
        });
        call.on('status', (status) => {
            console.log(`Process status ${JSON.stringify(status)}`);
        })
    });
});
