const express = require('express');
const router = express.Router();
const checkToken=require('../middleware/checkToken');
 require('../models/user');
const cardSchema = require('../validators/card');
const BizCardModel = require('../models/bizCard');
const random=require('../models/bizCard');
const _ = require('lodash');
const chalk=require('chalk');
let likesArr=["gf","hsd"];


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
      const cardWithId=await BizCardModel.find({_id: req.params.id});
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


//section 10
 router.post("/createCard",checkToken,createCard)
  
  async function createCard(req,res){
    try{
             if(!req.biz){
            res.status(400).send("you are not biz😥");
            return;
         }
        
     const { error } = cardSchema.newCard.validate(req.body);;
       if (error){
        res.status(400).send(error)
       }

    let card = new BizCardModel(
        {
          bizName: req.body.bizName,
          bizDescription: req.body.bizDescription,
          bizAddress: req.body.bizAddress,
          bizPhone: req.body.bizPhone,
          bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
          bizNumber: await random.randomBizNumber(BizCardModel),
          user_id: req.userId,
          createdAt: new Date(),
          likes: likesArr
        }
      );
 
    post = await card.save();
    res.status(200).send(post);
     }
      catch(err){
        res.status(500).send(err);
     }
  }
//end section 10


//section 11
   router.put("/editCard/:cardId",checkToken,editCard)
 
   async function editCard(req,res){

    try{
         if(!req.biz){
           res.status(400).send("you are not biz😥");
           return;
         }

     const { error } = cardSchema.newCard.validate(req.body);;
       if (error){
        res.status(400).send(error)
        console.log(error);
       }

         let editCard = await BizCardModel.findOneAndUpdate({ _id: req.params.cardId, user_id: req.userId }, req.body);
         if (!editCard) return res.status(404).send('The card with the given ID was not found.');

         const filter={
          _id: req.params.cardId,
          user_id: req.userId
         };

         let cardByFilter=await BizCardModel.find(filter);
         if(!cardByFilter) return res.status(400).send('The card with the given filter was not found.');
         res.send(cardByFilter);

      }
    catch(err){
       res.status(500).send(err);
    }

   }
//end section 11


//section 12
   router.delete("/deleteCard/:cardId",checkToken,deleteCard)

  async function deleteCard(req,res){
   try{
         if( !req.biz || !req.admin){
           res.status(400).send("you are not biz or admin😥");
           return;
         }
      const deletecard = await BizCardModel.findOneAndRemove({ _id: req.params.cardId, user_id: req.userId });
      if (!deletecard) return res.status(404).send('The card with the given ID was not found.');
      res.send(deletecard);
    }
    catch(err){
         res.status(500).send(err);
    }
 }
//end section 12


   module.exports = router;