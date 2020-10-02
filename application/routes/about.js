const ncm = require('../../ncm');
const router = new ncm().createRoute()
router.route.get('/',(req,res)=>{
    res.end('about working')
})

module.exports = router.route