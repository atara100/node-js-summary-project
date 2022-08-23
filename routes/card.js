const express = require('express');
const router = express.Router();
const checkToken=require('../middleware/checkToken');
 const User=require('../models/user');
const cardSchema = require('../validators/card');
const BizCardModel = require('../models/bizCard');
const random=require('../models/bizCard');
const _ = require('lodash');
const cardValidate=require('../validators/card');


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
        
     const { error } = cardSchema.newCard.validate(req.body);
       if (error){
        res.status(400).send(error)
        return;
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
          likes: req.body.likes ? req.body.likes : []
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
        console.log(error);
        res.status(400).send(error)
        return;
       }

         let editCard = await BizCardModel.findOneAndUpdate({ _id: req.params.cardId, user_id: req.userId }, req.body);
         if (!editCard) return res.status(404).send('The card with the given ID was not found.');
         res.status(200).send("The card id update");

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


//section 13  
      router.patch("/likes/:cardId",checkToken,likes)

      async function likes(req,res){
        try{
          const { error } = cardValidate.validateCards(req.body);
         if (error){
         res.status(400).send(error.details[0].message);
         return;
         } 

    //test if the arr from the user contaun only users id
        const idArr=req.body.likes;
        try{
          for (let i = 0; i < idArr.length; i++) {
           let usid= await BizCardModel.find({user_id: idArr[i] })
             if(usid) console.log("ok");                         
          };
        }catch(err){
           res.status(400).send("Arr must contain only users id");
           return;
        }
        
         const findCard=await BizCardModel.findOne({_id: req.params.cardId})
         if(!findCard){
          console.log("Id number don't match");
          res.status(400).send("Id number don't match");
          return;
         }
         findCard.likes=req.body.likes;
         await findCard.save();
         res.status(200).send(findCard);
         
        } catch(err){
           res.status(400).send(err);
           return;
        }  
      }
//end dection 13


//bonus
      router.patch("/numCardByAdmin/:cardNum",checkToken,numCardByAdmin)

      async function numCardByAdmin(req,res){
        try{
         if(!req.admin){
           res.status(400).send("you are not admin😥");
           return;
         }
         const findnumcard=await BizCardModel.find({bizNumber: req.body.bizNumber});
         if(findnumcard.length==1){
          res.status(400).send("The number in use🤦🏻‍♀️");
          return;
         }
         const editNumCard=await BizCardModel.findOne({_id: req.params.cardNum})
         editNumCard.bizNumber=req.body.bizNumber;
         editNumCard.save();
         res.status(200).send (editNumCard);
        }catch(err){
          res.status(400).send(err);
        }
      }
//end bonus


   module.exports = router;