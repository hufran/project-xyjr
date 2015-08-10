
require 'coffee-script/register'

path = require 'path'
express = require 'express'
bodyParser = require 'body-parser'

api = require './api'
router = api express.Router()

static_path = path.join __dirname, '../source'


app = express()

try
    require('./router').call app, '

        /ajaxLogin
        /logout

        GET/register/ajax/smsCaptcha

        GET/mobile/regist

        GET/payment/account/open
        GET/payment/bindCard
           /payment/tender
           /payment/netSave
           /payment/netSaveExpress
           /payment/withdraw

        /upayment/withdraw
        /upayment/bindCard
        /upayment/bindAgreement
    '
catch
    app.use require('cookie-parser')()
    app.use bodyParser.json()
    app.use bodyParser.urlencoded extended: true
    app.use router

app.use express.static static_path

app.get '/*', (req, res) ->
    res.sendFile 'index.html', root: static_path


server = app.listen 4000, ->
    console.log "Listening on port #{ server.address().port }"
