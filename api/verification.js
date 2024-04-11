require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();

const User = require("./../models/user")

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

async function sendVerificationCode(email) {
    return new Promise((resolve, reject) => {
        User.find({email: email}).then(async data => {
            if(data[0]){
                const info = await transporter.sendMail({
                    from: {
                    name: "Ano",
                    address: process.env.GMAIL_USER
                    },
                    to: email,
                    subject: "AnoAsked confirmation ✔",
                    text: `Your confirmation code is: ${data[0].code}`,
                });
                console.log("Email sent: %s", info.messageId);
                resolve()
            }else{
                reject("User with provided email does not exists.")
            }
        }).catch(() => {
            reject("An error occured while sending the confirmation email.") 
        })
    })
}

router.post('/verify', async (req, res) => {
    const { username, email } = req.body;

    User.find({email: email}).then(result => {
        if(result.length){
            res.status(200).json({
                status: "FAILED",
                message: "User with provided email already exists."
            })
        }else{
            let user = new User({
                email: email,
                username: username,
                verified: false,
                code: `${Math.floor(1000 + Math.random() * 9000)}`
            })
            user.save().then(() => {
                    sendVerificationCode(email).then(() => {
                        res.status(201).json({
                            status: "PENDING",
                            message: "Verification email has been sent."
                        })
                    }).catch(err => {
                        console.error(err)
                        res.status(200).json({
                            status: "FAILED",
                            message: err
                        })
                    })
                }
            ).catch(err => {
                console.error(err);
                res.status(200).json({
                    status: "FAILED",
                    message: "An error occured while crating new verified user."
                })
            })
        }
    }).catch(err => {
        console.error(err);
        res.status(200).json({
            status: "FAILED",
            message: "An error occured while checking for existing user."
        })
    })
})

router.post('/confirm', async (req, res) => {
    const { email, code } = req.body;

    // Compare send verification code in db with current
    User.find({email: email}).then(user => {
        if(user[0]){
            if(user[0].verified){
                res.status(200).json({
                    status: "FAILED",
                    message: "Email has already been confirmed."
                })
            }
            else{
                if(user[0].code == code){
                    User.findOneAndUpdate({email: email}, {verified: true}).then(() => {
                        res.status(200).json({
                            status: "VERIFIED",
                            message: "Email has been confirmed."
                        })
                    }).catch(err => {
                        res.status(200).json({
                            status: "FAILED",
                            message: "An error occured while confirming the email."
                        })
                    })
                }else{
                    res.status(200).json({
                        status: "PENDING",
                        message: "Provided confirmation code does not match."
                    })
                }
            }
        }else{
            res.status(200).json({
                status: "FAILED",
                message: "Provided email was not found."
            })
        }
    }).catch(err => {
        console.error(err)
        res.status(200).json({
            status: "FAILED",
            message: "An error occured while searching for the email."
        })
    })
})

router.post('/resend', async (req, res) => {
    const { username, email } = req.body;

    User.find({username: username}).then(async user => {
        if(user[0]){
            if(user[0].email != email){
                User.updateOne({username: username}, {email: email}).then(() => {
                    sendVerificationCode(email).then(() => {
                        res.status(200).json({
                            status: "PENDING",
                            message: "Verification email has been resent."
                        })
                    }).catch(err => {
                        res.status(200).json({
                            status: "FAILED",
                            message: err
                        })
                    })
                }).catch(() => {
                    res.status(200).json({
                        status: "PENDING",
                        message: "An error occured while updating users email."
                    })
                })
            }
        }else{
            res.status(200).json({
                status: "PENDING",
                message: "Provided user was not found."
            })
        }
    }).catch(() => {
        res.status(200).json({
            status: "FAILED",
            message: "An error occured while searching for the user."
        })
    })
})

router.post('/check', async (req, res) => {
    const { username } = req.body;

    // Check in db if user is verified
    User.find({username: username}).then(data => {
        if(data[0]){
            if(data[0].verified){
                res.status(200).json({
                    status: "VERIFIED",
                    message: "User is verified."
                })
            }
            else{
                res.status(200).json({
                    status: "PENDING",
                    message: "User has not yet been verified."
                })
            }
        }else{
            res.status(200).json({
                status: "UNVERIFIED",
                message: "User is not verified."
            })
        }
    }).catch(err => {
        console.error(err)
        res.status(200).json({
            status: "FAILED",
            message: "An error occured while searching for the user."
        })
    })
})

module.exports = router;