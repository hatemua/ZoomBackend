require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')
const KJUR = require('jsrsasign')
const axios = require("axios");
const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json(), cors())
app.options('*', cors())

const createBearer= async() => {

const uri = 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id='+process.env.ZOOM_ACCOUNT_ID;

  let buf = Buffer.from(process.env.ZOOM_CLIENT_ID+":"+process.env.ZOOM_SECRET_ID).toString('base64')
  console.log("Basic "+buf);
  let config={
    method:"post",
    url:uri,
    headers: {
      'Authorization' : "Basic "+buf
    }
  }
let response = await axios(config);
return response.data
}
app.get('/createMeating', async(req, res) => {
  let meeting = {
    "agenda": "My Meeting",
    "default_password": false,
    "duration": 60,
    "password": "123456",
    "pre_schedule": false,
    "recurrence": {
      "end_date_time": "2022-04-02T15:59:00Z",
      "end_times": 7,
      "monthly_day": 1,
      "monthly_week": 1,
      "monthly_week_day": 1,
      "repeat_interval": 1,
      "type": 1,
      "weekly_days": "1"
    },
    "schedule_for": "contact.elearning2020@gmail.com",
    "settings": {
      "additional_data_center_regions": [
        "TY"
      ],
      "allow_multiple_devices": true,
      "approval_type": 2,
      "approved_or_denied_countries_or_regions": {
        "approved_list": [
          "CX"
        ],
        "denied_list": [
          "CA"
        ],
        "enable": true,
        "method": "approve"
      },
      "audio": "telephony",
      "authentication_domains": "example.com",
      "authentication_exception": [
        {
          "email": "hatem@darblockchain.io",
          "name": "Jill Chill"
        }
      ],
      "authentication_option": "signIn_D8cJuqWVQ623CI4Q8yQK0Q",
      "auto_recording": "cloud",
      "breakout_room": {
        "enable": true,
        "rooms": [
          {
            "name": "room1",
            "participants": [
              "hatem@darblockchain.io",
              "hatemazaiez1@gmail.com"
            ]
          }
        ]
      },
      "calendar_type": 1,
      "close_registration": false,
      "contact_email": "hatemazaiez1@gmail.com",
      "contact_name": "Jill Chill",
      "email_notification": true,
      "encryption_type": "enhanced_encryption",
      "focus_mode": true,
      "host_video": true,
      "jbh_time": 0,
      "join_before_host": false,
    
      "meeting_authentication": false,
      "meeting_invitees": [
        {
          "email": "hatemazaiez1@gmail.com"
        }
      ],
      "mute_upon_entry": false,
      "participant_video": false,
      "private_meeting": false,
      "registrants_confirmation_email": true,
      "registrants_email_notification": true,
      "registration_type": 1,
      "show_share_button": true,
      "use_pmi": false,
      "waiting_room": false,
      "watermark": false,
      "host_save_video_order": true,
      "alternative_host_update_polls": true
    },
    "start_time": "2022-03-25T07:32:55Z",
    "template_id": "Dv4YdINdTk+Z5RToadh5ug==",
    "timezone": "America/Los_Angeles",
    "topic": "My Meeting",
    "tracking_fields": [
      {
        "field": "field1",
        "value": "value1"
      }
    ],
    "type": 2
  }
  let a=await createBearer();
  console.log(a);
  let uri = "https://api.zoom.us/v2/users/me/meetings"

  let Bearer = a.access_token
  let config={
    method:"post",
    url:uri,
    headers: { Authorization: `Bearer ${Bearer}` },
    data:meeting
  }
  let respon = await axios(config);
  console.log(respon.data)
  res.end(JSON.stringify(respon.data));
})

app.post('/', (req, res) => {

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2

  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: process.env.ZOOM_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_SDK_SECRET)

  res.json({
    signature: signature
  })
})

app.listen(port, () => console.log(`Zoom Meeting SDK Sample Signature Node.js on port ${port}!`))
