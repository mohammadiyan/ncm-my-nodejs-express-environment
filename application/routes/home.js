const ncm = require('../../ncm');
const router = new ncm().createRoute()
router.route.get('/',(req,res)=>{
    res.end('ok working')
})
router.route.get('/show',(req,res)=>{
    res.end('ok show to you')
})
module.exports = router.route