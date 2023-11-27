const router= require('express').Router();
const detailvideo = require('../model/detailvideo')

router.get('/getall', async(req, res)=>{
    try {
        const allData = await detailvideo.find();
        if(allData){
            return res.status(200).json({
                success: true, 
                total: allData.length, 
                allData,
                msg: 'get data successfully'
            })
        }
        else{
            return res.status(200).json({
                success: false, 
                msg: "data not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false, 
            msg: 'server has problem'
        });
    }
});

router.get('/getById/:id', async(req, res)=>{
    try {
        const data = await detailvideo.findById(req.params.id);
        if(data){
            return res.status(200).json({
                success: true, 
                data,
                msg: "fetch data successfully"
            })
        }
        else return res.status(200).json({
            success: false, 
            msg: "no data found"
        })
    } catch (error) {
        return res.status(500).json({
            success: false, 
            msg: 'server has problem'
        })
    }
})

module.exports = router;