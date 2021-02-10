const config = require('config')
module.exports = {
    mailCredentials: () => {
        return {
            transport:{
                host: config.mailHost,
                port: config.mailPort,
                secure: false,
                auth: {
                    user: config.mailUser,
                    pass: config.mailPass
                }
            },
            mailInfo: {
                from: config.mailFrom,
                cc: config.mailCC
            }
        }
    },
    mailContent: (templateName,subject) => {
        let subjectObj = {
            registration: {
                'subject':'Welcome To nexGen.com | Customer Registered',
                'attachment': []
            },
            agent_registration: {
                'subject':'Welcome To Operations Of nexGen | Company Registered',
                'attachment':[]
            }
        }
        return subjectObj[templateName];
    }
    
};