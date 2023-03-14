## Installation

Packages that are needed

| Packages |
| :-------- |
| `jsonwebtoken` |
| `http2` |


## Usage 

Declare:

```javascript
const isSandBox = true 

const pushNotifi = new PushNotification("Path/to/.p8file", "p8KeyId", "TeamId", "bundleId", isSandBox)

```

Send push notification:

```javascript

const body = {
            "aps" : {
                "alert" : {
                    "title" : "Game Request",
                    "subtitle" : "Five Card Draw",
                    "body" : "Bob wants to play poker"
                }
            }
        }

const devices = ["DeviceId"]

pushNotifi.SendPushNotification(body, devices)


```