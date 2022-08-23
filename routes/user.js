const express = require('express');
const router = express.Router();
const userSchema = require('../validators/user');
const UserModel = require('../models/user');
const BizCardModel = require('../models/bizCard');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const _ = require('lodash');
const chalk=require('chalk');
const jwt=require('jsonwebtoken');
const usersKeys=['name','email','_id'];
const checkToken=require('./../middleware/checkToken');



//section 4
router.post("/create" ,createRequest);

async function createRequest(req, res) {

        const { error, value } = userSchema.newUser.validate(req.body);
        const user = value;
        if (error) {
            console.log(chalk.red(error));
            res.status(400).send("Password must contain 9 charters, at least 1 capital letter and at least 1 lower-case letter, at least special charter and at least 4 numbers")
        }
        else {
            try {
                const result = await UserModel.find({email:user.email});
                if (result.length > 0) {
                    res.status(400).send("User already exists...🙄")
                }
                else {
                    try {
                     const savedUser = await saveUser(user);
                     res.status(200).send(savedUser);
                    }
                    catch (err) {
                        res.status(400).send(err);
                    }
                    
                }
            } catch (err) {
                res.status(400).send(err)
            }
        
        }
    }
    
 function saveUser(user){
    return new Promise(async (resolve, reject) => {
        try {
            user.password = await bcrypt.hash(user.password, saltRounds);
            const savedUser = await new UserModel(user).save();
            resolve(_.pick(savedUser,usersKeys));
       } catch (err) {
           reject (err);
       }
    })
    }

    //end section 4


    //section 5
    router.post("/auth" ,login);

    async function login(req,res){
        const { error, value } = userSchema.auth.validate(req.body);
        const user = value;
        if (error) {
            console.log(chalk.red(error));
            res.status(400).send(error)
        }
        else{
            try{
                const userModel = await UserModel.findOne({email:user.email});
                if (!userModel) { 
                    res.status(400).send("Username or password wrong 👿");
                    return;
                }
                const isAuth = await userModel.checkPassword(user.password);
                if(!isAuth){
                    res.status(400).send("Username or password wrong 👿");
                    return;
                }
                res.status(200).send(userModel.getToken());
            } catch (err) {
                res.status(400).send(err)
            }
        }
    }
     //end section 5


    //section 6
    router.get("/myDetails",checkToken,me)

    async function me(req,res){
      const userId=req.userId;
      try{
       const user=await UserModel.findOne({_id:userId});
        res.status(200).send(_.pick(user,['name','email','biz','createdAt','_id']));
      }catch(err){
        res.status(400).send('usre not exists, try login again');
      }
    }
    //end section 6

    //section 7
    router.get("/getAllBizCards",getBizCards)

    async function getBizCards(req,res){
        try{
      const allCards=await BizCardModel.find();
      res.status(200).send(allCards);
        }catch(err){
            res.status(400).send(err);
        }
    }
   //end section 7

    //section 8
    router.get("/getAllBizCards/:id",getBizCardsWithId)

    async function getBizCardsWithId(req,res){
        try{
      const cardWithId=await BizCardModel.find({creator_id: req.params.id});
      res.status(200).send(cardWithId);
        }catch(err){
            res.status(400).send(err);
        }
    }
   //end section 8

       //section 9
    router.get("/getBizCardUid",checkToken,getArrCards)

    async function getArrCards(req,res){
        const user_Id=req.userId;
        
       try{
      const cardWithUId=await BizCardModel.find({user_id: user_Id});
              
         if(!req.biz){
            res.status(400).send("you are not biz😥");
            return;
         }
      res.status(200).send(cardWithUId);
        }catch(err){
            res.status(400).send(err);
        }
    }
   //end section 9

module.exports = router;