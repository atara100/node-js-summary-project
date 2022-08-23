const mongoose = require('mongoose');
const _ = require('lodash');
const { date } = require('joi');

const bizCardSchema = mongoose.Schema({
    bizName: {type:String,
       required:true,
       minlength: 2,
       maxlength: 255},
    bizDescription:{type:String,
       required:true,
       minlength: 2,
       maxlength: 1050},
    bizAddress:{type:String,
       required:true,
       minlength: 2,
       maxlength: 255},
    bizPhone:{type:String,
       required:true,
       minlength: 9,
       maxlength: 10},
    bizImage:{type:String,
       required:true,
       minlength: 11,
       maxlength: 1025},
    creator_id:{type:String},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    bizNumber:{type:Number,
       required:true,
       minlength: 3,
       maxlength: 9999999999999,
      uniqe:true
    },
    createdAt:{type:Date},
    likes:Array
     });



const BizCard = mongoose.model('Business_Cards', bizCardSchema);


module.exports = BizCard;

  module.exports.randomBizNumber=async function (BizCard) {
 
  while (true) {
    let randomNumber = _.random(1000, 999999);
    let card = await BizCard.findOne({ bizNumber: randomNumber });
    if (!card) return String(randomNumber);
  }
 
}
