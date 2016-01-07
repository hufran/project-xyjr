'use strict';
module.exports = function (router) {
    router.get('/loans', async function (req, res, next) {
        
        var loans = await req.uest.get('/api/v2/loans/summary').get('body');
        
        for (let i = 0; i < loans.open.length; i++) {
            var proofs = (await req.uest.get(
                '/api/v2/loan/'+loans.open[i].id+'/detail')
                ).body.data.proofs;
            loans.open[i].coverImg = (proofs[0] || {}).uri;
        }
        for (let i = 0; i < loans.scheduled.length; i++) {
            var proofs = (await req.uest.get(
                '/api/v2/loan/'+loans.scheduled[i].id+'/detail')
                ).body.data.proofs;
            loans.scheduled[i].coverImg = (proofs[0] || {}).uri;
        }
        for (let i = 0; i < loans.settled.length; i++) {
            var proofs = (await req.uest.get(
                '/api/v2/loan/'+loans.settled[i].id+'/detail')
                ).body.data.proofs;
            loans.settled[i].coverImg = (proofs[0] || {}).uri;
        }
        for (let i = 0; i < loans.finished.length; i++) {
            var proofs = (await req.uest.get(
                '/api/v2/loan/'+loans.finished[i].id+'/detail')
                ).body.data.proofs;
            loans.finished[i].coverImg = (proofs[0] || {}).uri;
        }   
        res.json(loans)
    });
};