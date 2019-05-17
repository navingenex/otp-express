const express = require('express');
const bodyParser = require('body-parser')
var path = require('path');

var accountSid = ''; // Your Account SID from www.twilio.com/console
var authToken = '';   // Your Auth Token from www.twilio.com/console
const mongoose = require('mongoose');
mongoose.connect('')
var otpSchema = mongoose.Schema({
    otp: Number,
    messageId: String,
    time: Date
});
var OTP = mongoose.model("otp", otpSchema);
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
const Otp = [];
app.get('/', (req, res) => {
    res.render('addNo');
});
app.post('/sms', (req, res) => {
    var val = Math.floor(1000 + Math.random() * 9000);
    client.messages.create({
        body: `Your otp is ${val}`,
        to: '+918384049581',  // Text this number
        from: '+13342922094' // From a valid Twilio number
    }).then(message => {
        console.log(message.sid)
        var otp = new OTP({
            otp: val,
            messageId: message.sid,
            time: Date.now()
        })
        otp.save(function (err, otp) {
            if (err)
                console.log(err)
            else {
                console.log(otp)
                Otp = otp;
            }
        })
        res.json(Otp)
    }).catch(err => {
        console.log(err)
        res.end()
    });
});

app.post('/verify', (req, res) => {

});


app.listen(3000);