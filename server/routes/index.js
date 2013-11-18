/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index');
};

exports.views = function (req, res) {
    var name = req.params.name;
    res.render('views/' + name);
};