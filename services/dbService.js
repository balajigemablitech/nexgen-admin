'use strict';

/**
 * @description DB operation services
 * @author madhavi
 */

const config = require('config'),
      helper= require("./helper.js")

module.exports = {
        save: (args, n) => {
            let persReq = {
                model: args.model,
                data: args.data
            }
            helper.requestPostUrl({ url: config.db + 'save', data: persReq }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
                
            })
            
        },
       
        mSave: (args, n) => {
            let persReq = {
                model: args.model,
                data: args.data
            }
            helper.requestPostUrl({ url: config.db + 'saveMany', data: persReq }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
               
            })
        },
        fetchRecords: (args, n) => {
            helper.requestPostUrl({ url: config.db + 'fetchRecords', data: args }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
            })
            
        },
        fetchAll: (args, n) => {
            helper.requestPostUrl({ url: config.db + 'fetchAll', data: args }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
            })
            
        },
        update: (args, n) => {
            helper.requestPostUrl({ url: config.db + 'update', data: args }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
            })
            
        },
        updateOnly: (args, n) => {
            helper.requestPostUrl({ url: config.db + 'updateOnly', data: args }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
            })
            
        },
        deleteMany: (args, n) => {
            helper.requestPostUrl({ url: config.db + 'deleteMany', data: args }, (error, data) => {
                if(error){
                    return n(error,null)
                }
                else{
                    return n(null,data)
                }
            })
            
        }
      
    }