const jwt = require('jsonwebtoken');
const http2 = require('http2');
const fs = require('fs');

class PushNotification {

    constructor(p8FileName, p8KeyID, TeamID, BundleID, Sandbox = Boolean) {
        this.p8N = p8FileName
        this.kid = p8KeyID
        this.iss = TeamID
        this.BID = BundleID
        this.Sandbox = Sandbox

        this.reddy = false

        if (fs.existsSync(p8FileName)) {
            this.reddy = true
            console.log(`Found ${p8FileName}`)
        } else {
            console.log(`Did not find ${p8FileName}`)
        }

    }


    async SendPushNotification(Body, DiviceId = Array) {

        const key = fs.readFileSync(this.p8N, 'utf8')

        var IAT = Math.floor(new Date() / 1000)
        
        const token = jwt.sign(
            {
                "iss": this.iss,
                "iat": IAT 
            },
            key,
            {
                "header": {
                    "alg": "ES256",
                    "kid": this.kid, 
                }
            }
        )


        if (this.Sandbox){
            var host = 'https://api.sandbox.push.apple.com'
        } else {
            var host = 'https://api.push.apple.com'
        }
       
        //const path = `/3/device/${DiviceId}`

        const path = DiviceId.map(id => {

            return `/3/device/${id}`

        })

        const client = http2.connect(host);

        client.on('error', (err) => console.error(err));

        var body = {
            "aps" : {
                "alert" : {
                    "title" : "Game Request",
                    "subtitle" : "Five Card Draw",
                    "body" : "Bob wants to play poker"
                }
            }
        }



        var headers = {
            ':method': 'POST',
            'apns-topic': this.BID, //your application bundle ID
            ':scheme': 'https',
            ':path': path,
            'authorization': `bearer ${token}`
        }

        const request = client.request(headers);

        request.on('response', (headers, flags) => {
            for (const name in headers) {
                console.log(`${name}: ${headers[name]}`);
            }
        });

        request.setEncoding('utf8');
        let data = ''
        request.on('data', (chunk) => { data += chunk; });
        request.write(JSON.stringify(Body))
        request.on('end', () => {
            console.log(`\n${data}`);
            client.close();
        });
        request.end();

    }

}


module.exports = PushNotification

