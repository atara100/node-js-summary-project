const Joi = require('joi');

module.exports.newCard = Joi.object({
    bizName: Joi.string().required().min(2).max(255),
    bizDescription: Joi.string().required().min(2).max(1050),
    bizAddress: Joi.string().required().min(2).max(255),
    bizPhone: Joi.string().required().min(9).max(10).regex(/^0[2-9]\d{7,8}$/),
    bizImage:Joi.string().required().min(11).max(1025)
  });

    module.exports.validateCards=function (data) {
    const schema = Joi.object({
    likes: Joi.array().min(1).required()
     });

 return schema.validate(data);
}
 