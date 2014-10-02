var Organism = require('../models/Organism');
module.exports.controller = function (app) {

    app.get('/organisms', function (req, res) {
        Organism.findAll(function (err, orgs) {
            if (err) return res.send(err);
            return res.render('organisms/index', {
                organisms: orgs
            });
        });
    });

    app.get('/organisms/new', function (req, res) {
        return res.render('organisms/new');
    });

    app.post('/organisms/add', function (req, res) {

        var localName = req.body.localname;
        var description = req.body.description;
        var genus = req.body.genus;
        var species = req.body.species;
        var strain = req.body.strain;
        var pathovar = req.body.pathovar;
        var ncbi = req.body.ncbi;

        var org = new Organism({
            localName: localName,
            description: description,
            genus: genus,
            species: species,
            strain: strain,
            pathovar: pathovar,
            ncbi: ncbi
        });
        org.save(function (err, organism) {
            if (err) return res.send(err);
            return res.redirect('/organisms');
        });

    });

    app.get('/organisms/show', function (req, res) {
        return res.render('organisms/show');
    });

};