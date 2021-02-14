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
    const password = req.headers.password;

    if (password != null) {

        const token = jwt.sign(
            {email: email, password: password},
            process.env.JWT_ACCOUNT, {expiresIn: '2h'}
        );

        AdminUserSchema.findOne({email: email}, (error, result) => {
            if (result != null) {

                bcrypt.compare(password, result.password, function (err, finalResult) {
                    if (finalResult) {
                        resp.status(200).json({message: 'success', token: token});
                    } else {
                        resp.status(200).json({message: 'Failed!'});
                    }
                });

            } else {
                resp.status(200).json({message: 'Please Register Your Email, or check your credentials'});
            }
        });


    } else {
        resp.status(200).json({message: 'Failed!'});
    }

};

const verifyToken = (req, resp) => {
    try {

        const token = req.headers.token ? req.headers.token : 'empty';
        if (token === 'empty') {
            resp.status(401).json({message: 'UnAuthorized Request Detected!'});
            return;
        }

        const isValid = new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_ACCOUNT, function (error, decoded) {
               if (error){
                   reject(false);
               }
               if (decoded){
                   resolve(true);
               }
            })
        });

        isValid.then(r=>{
            resp.status(200).json({state:true, message:'success'});
        }).catch(er=>{
            resp.status(200).json({state:true, message:' UnAuthorized Request Detected!'});
        })



    } catch (e) {
        resp.status(500).json({message: e});
    }
};


module.exports = {
    registerUser, loginUser, verifyToken
}
