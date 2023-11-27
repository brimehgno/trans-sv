const router = require("express").Router();
const bill = require("../model/bill")
const user = require('../model/user');

router.get('/getall', async(req,res)=>{
    try {
        const alldata = await bill.find();
        if(alldata){
            return res.status(200).json({
                success: true,
                allBill: alldata,
                msg:"get success"
            })
        }
        else {
            return res.status(200).json({
                success: false, 
                msg: "data not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "server has problem"
        })
    }
})
router.delete("/deleteBillByUserId/:id", async(req, res)=>{
    try {
        const data = await bill.findOneAndDelete({
            user: req.params.id
        });
        if(data){
            return res.status(200).json({
                success: true,
                msg: "delelte",
                data
            })
        }
        else return res.status(200).json({
            success: false, 
            msg: "res no data"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        })
    }
})
router.get("/getTotalMoney" , async(req, res)=>{
    try {
        const data = await bill.find();
        var totalCost  =0;
        for(let i =0 ; i<data.length; i++){
            totalCost += data[i].money;
        }
        return res.status(200).json({
            success: true, 
            totalCost,
            msg: "successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        })
    }
})

router.get('/getUserBill/:id', async(req, res)=>{
    try {
        const userBill = await bill.find({
            user: req.params.id
        });
        if(userBill){
            return res.status(200).json({
                success: true,
                userBill,
                msg: " get Data Successfully",
            });
        }
        else {
            return res.status(200).json({
                success: false,
                msg: "user bill not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false, 
            msg: "server has problem"
        })
    }
})
router.post("/create", async(req, res)=>{
    try {
        const newData = new bill(req.body);

        // minus money for user 
        const currUser = await user.findById(req.body.user);
        if(currUser){
            if(currUser.account >= req.body.money){
                const updatedUser = await user.findByIdAndUpdate(req.body.user, {
                    account: currUser.account-req.body.money
                });
                if(updatedUser){
                    await newData.save();
                    return res.status(200).json({
                        success: true,
                        msg: "Create bill Success"
                    });
                }
                else{
                    return res.status(200).json({
                        success: false, 
                        msg: "Cant update user account"
                    });
                }
            }
            else{
                return res.status(200).json({
                    success: false, 
                    msg: "User hasn't enough money"
                });
            }
        }
        else {
            return res.status(400).json({
                success: false, 
                msg: "user not found"
            })
        }
    } catch (error) {
        
    }
})

router.post("/createAdmin", async(req, res)=>{
    try {
        const newData = new bill(req.body);
        await newData.save();
        return res.status(200).json({
            success: true,
            msg: "Create bill Success"
        });
        
    } catch (error) {
        
    }
})

module.exports= router;