const AdminUserSchema = require('../model/AdminUserDTO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = (req, resp) => {

    console.log(req.body);

    AdminUserSchema.findOne({email: req.body.email}, (error, result) => {

        if (error) {
            resp.status(500).json({message: error});
        } else {
            if (result != null) {
                resp.status(200).json({message: 'Already Exists!'});
            } else {

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (error, hash) {
                        const admin = new AdminUserSchema({
                            email: req.body.email,
                            password: hash
                        });

                        admin.save().then(finalResult => {
                            resp.status(200).json({message: 'Success!'});
                        }).catch(finalError => {
                            resp.status(500).json({message: finalError})
                        })

                    })
                });

            }
        }

    });
};

const loginUser = (req, resp) => {
  const email = req.headers.email;
  const password= req.headers.password;

  if (password!=null){

      const token = jwt.sign(
          {email:email,password:password},
          process.env.JWT_ACCOUNT,{expiresIn: '2h'}
      );

      AdminUserSchema.findOne({email:email}, (error,result)=>{
          if (result!=null){

              bcrypt.compare(password, result.password, function (err, finalResult){
                  if (finalResult){
                      console.log('ok');
                  }
              });

          }else{
              resp.status(200).json({message:'Please Register Your Email, or check your credentials'});
          }
      });


  }else{
      resp.status(200).json({message:'Failed!'});
  }

};

module.exports = {
    registerUser, loginUser
}
