var express = require('express');
var http = require('http');
var httpApp = express();
var httpRouter = express.Router();
httpApp.use('*', httpRouter);
httpRouter.get('*', function(req, res){
    var host = req.get('Host');
    // replace the port in the host
    host = host.replace(/:\d+$/, ":"+app.get('port'));
    // determine the redirect destination
    var destination = ['https://', host, req.url].join('');
    console.log('Redirecting to https...')
    return res.redirect(destination);
});
var httpServer = http.createServer(httpApp);
httpServer.listen(8080);
