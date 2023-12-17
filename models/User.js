const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Roles = require('../../common/enums/Roles')

const userSchema = new mongoose.Schema(
    {
        provider_id: {
            type: String,
        },
        provider: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        picture: {
            type: String,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.ARTIST,
        },
        password: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
    }
    next();
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id,email:this.email,role:this.role},process.env.JWT_SECRET,{expiresIn:'10d'});
        return token;
    }
    catch(err){
        console.error(err)
    }
}

const Users = mongoose.model('users',userSchema)

module.exports = Users