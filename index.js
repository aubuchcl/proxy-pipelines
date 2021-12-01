const cycleapi = require("@cycleplatform/cycle-api")
const https = require("https")



const errors = [];

function errorCheck(notification){
    if (notification["topic"] === "pipeline.run.error"){
        errors.push(notification)
        let data = `{ "channel": "${process.env.TARGETCHAN}", "text": "${JSON.stringify(notification, null, 2)}" }`
        let req = https.request({
            hostname: process.env.RC_URL,
            port: 443,
            path: "/api/v1/chat.postMessage",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": process.env.RC_AUTH_TOKEN,
                "X-User-Id": process.env.RC_USER_ID,
            }
        }, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()

    }
}



const resp = cycleapi.Notifications.connectToHubChannel(
    {
        token: process.env.API_KEY,
        hubId: process.env.HUB_ID,
        settings:{
            url: process.env.API_URL
        },
        onMessage: m => {
            errorCheck(m)
        }
    }
)

resp.then((value) => console.log(JSON.stringify(value, null, 2)))
process.on("SIGINT", () => process.exit(0))
