const { User } = require("../model/User");
const crypto=require('crypto');
const { sanitizeUser } = require("../services/common");
const jwt = require('jsonwebtoken');
const SecretKey = 'secret_key'

exports.createUser=async(req,res)=>{
    
    try{ 
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword){
        const user=new User({...req.body,password:hashedPassword,salt})
        const doc= await user.save();
        req.login(sanitizeUser(doc), function(err){
            if (err) { res.status(400).json(err); }
            else{
            const token = jwt.sign(sanitizeUser(doc), SecretKey);
            res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
            res.status(201).json(token);}             
          });        
        })
        // req.login({id:doc.id,role:doc.role}, function(err){
        //     if (err) { res.status(400).json(err); }
        //     else{res.status(201).json({id:doc.id,role:doc.role});}             
        //   });        
        // })
    }
    catch(err){
        res.status(400).json(doc);        
    }
};

exports.loginUser=async (req,res)=>{
    res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
res.json(req.user.token)
};

exports.checkAuth=async (req,res)=>{
    if(req.user){
        res.json(req.user);
    }
    else{
        res.sendStauts(401)
    }
};


// exports.checkUser=async (req,res)=>{
//     res.json({'status':'success',user:req.user})
// };

// exports.createUser=async(req,res)=>{
//     const user=new User(req.body)    
//     try{ 
//         const doc= await user.save();
//         res.status(201).json({id:doc.id,role:doc.role});
//     }
//     catch(err){
//         res.status(400).json(err);
        
//     }
// };

// exports.loginUser=async (req,res)=>{
    
//     try {
//         const user=await User.findOne(
//             {email:req.body.email},).exec();
//             // console.log({user})
//         if(!user){
//             res.status(401).json({message:'Have not registered'});
//         }
//         else if(user.password===req.body.password){
//             res.status(200).json({id:user.id,name:user.name,email:user.email,role:user.role})
//             // res.status(200).json({id:user.id,name:user.name,email:user.email})
//         }
//         else{
//             res.status(401).json({message:'invalid credentials'})
//         }
//     } catch (error) {
//         res.status(400).json(error);
//     }
// };