const ncm = require('../../ncm');
const router = new ncm().createRoute()
router.route.get('/',(req,res)=>{
    res.end('ok working')
})
module.exports = router.route