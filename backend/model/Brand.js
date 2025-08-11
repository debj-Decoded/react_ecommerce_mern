const mongoose = require('mongoose')
const { Schema } = mongoose;

const BrandSchema = new Schema({
    value: { type : String, required: true},
    label: { type : String, required: true},
     
})

const virtual= BrandSchema.virtual('id');
virtual.get(function(){
    return this._id;
})

BrandSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function (doc,ret){delete ret._id}
})
 
exports.Brand = mongoose.model('Brand', BrandSchema)