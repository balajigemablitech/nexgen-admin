'use strict'

const ejs = require("ejs"),
      nodemailer = require('nodemailer'),
      config=require("config"),
      moment=require("moment"),
      mailConfig=require("../utils/mailConfig.js"),
      path = require('path'),
      _=require("lodash")

module.exports = {

    sendMail: (reqObj,next) => {
        let mailObj = mailConfig.mailCredentials();
        let mailSubject = (reqObj && reqObj.subject ? reqObj.subject : 'Welcome to gembali.tech')
        let mailContentObj = mailConfig.mailContent(reqObj.template, mailSubject);
        let transporter = nodemailer.createTransport({
            host: "mail.gembali.tech",
            port: 465,
            secure: true,
            auth: {
                user: 'no-reply@gembali.tech',
                pass: '@gembali.tech'
            },
            ignoreTLS: true
        })
        let cc = mailObj.mailInfo.cc
        if (reqObj && reqObj.cc) {
            cc = reqObj.cc
        }
        let mailOptions = {
            from: mailObj.mailInfo.from,
            to: reqObj.to,
            cc: cc,
            subject: reqObj.subject,
            template: reqObj.template,
            context:reqObj.context
        }
        ejs.renderFile(path.join(_rootPath, "/views/emailTemplates/" + mailOptions.template + ".ejs"), mailOptions.context, function (err, data) {
            if (err) {
                console.log('error after rendering file', err);
            } else {
                let mailParams = {
                    from: '"nexGen.com" ' + mailOptions.from,
                    to: mailOptions.to,
                    cc: mailOptions.cc,
                    subject: mailOptions.subject,
                    html: data
                };
                transporter.sendMail(mailParams, function (error, info) {
                    if (error) {
                        console.log("-----------------",error)

                        next()                              
                    } else {
                        console.log('Email sent: ' + info.response);
                        next()   
                    }
                })
            }
        })
      
    
    }
}