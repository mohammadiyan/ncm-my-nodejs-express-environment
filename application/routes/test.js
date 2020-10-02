const ncm = require('../../ncm');
const router = new ncm().createRoute()
router.route.get('/',(req,res)=>{
    res.send('test working')
})

module.exports = router.route