const AdminUserSchema = require('../model/AdminUserDTO');
const bcrypt = require('bcrypt');

const registerUser=(req,resp)=>{

    AdminUserSchema.findOne({email:req.body.email}, (error,result)=>{

        if (error){
            resp.status(500).json({message:error});
        }else{
            if (result!=null){
                resp.status(200).json({message:'Already Exists!'});
            }else{

                bcrypt.genSalt(10, function (err, salt){
                    bcrypt.hash(req.body.password, salt, function (error, hash){
                        const admin= new AdminUserSchema({
                           email:req.body.email,
                           password:hash
                        });

                        admin.save().then(finalResult=>{
                            resp.status(200).json({message:'Success!'});
                        }).catch(finalError=>{
                            resp.status(500).json({message:finalError})
                        })

                    })
                });

            }
        }

    });
};

module.exports = {
    registerUser
}
