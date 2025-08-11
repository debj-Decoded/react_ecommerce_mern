const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderSchema = new Schema({
    products: { type : [Schema.Types.Mixed], required:true},
    totalAmount: { type : Number},
    quantity: { type : Number},
    Payment: { type : String, required: true},
    status: { type : String, default:'pending'},
    user:{type:Schema.Types.ObjectId, ref:'User',required:true},
    SelectedAddress:{type:[Schema.Types.Mixed], required:true}
     
})

const virtual= orderSchema.virtual('id');
virtual.get(function(){
    return this._id;
})

orderSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function (doc,ret){delete ret._id}
})
 
exports.Order = mongoose.model('Order', orderSchema)