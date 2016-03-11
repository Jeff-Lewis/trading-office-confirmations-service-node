exports.StartServer = function() {
    var restify = require('restify'),
        Datastore = require('nedb'),
        db = new Datastore({filename: 'confirmations.db', autoload: true}),
        server = restify.createServer();

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    function getConfirmation(req, res, next) {

        db.find({allocationId: req.params.id}, function (err, docs) {
            res.send(docs[0]);
            return next();
        });
    }

    function addConfirmation(req, res, next) {

        var confirmation = req.body;
        db.insert(confirmation);
        res.send(201, confirmation);
        return next();
    }

    function getConfirmationIds(_, res, next) {

        db.find({}, function (err, docs) {
            res.send(docs.map(function (x) {
                return x._id;
            }));
            return next();
        });
    }

    server.post('/api/confirmation', addConfirmation);
    server.get('/api/confirmation/ids', getConfirmationIds);
    server.get('/api/confirmation/:id', getConfirmation);

    var port = process.env.PORT || 8080;
    server.listen(port, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
};