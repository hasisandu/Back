const AdminUserSchema = require('../model/AdminUserDTO');

const registerUser=(req,resp)=>{

    AdminUserSchema.findOne({email:req.body.email}, (error,result)=>{

        if (error){
            resp.status(500).json({message:error});
        }else{
            if (result!=null){
                resp.status(200).json({message:'Already Exists!'});
            }else{
                // save new user
            }
        }

    });

};
