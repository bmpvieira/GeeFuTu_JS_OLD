var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
/**
 *
 * @type {{read: Function}}
 */
var GFF3 = {
    /**
     *
     * @param path
     * @param onFeature
     * @param onEnd
     */
    read: function (path, onFeature, onEnd) {

        var instream = fs.createReadStream(path);
        var outstream = new stream();
        var rl = readline.createInterface(instream, outstream);
        /**
         *
         */
        rl.on('line', function (line) {
            if (line.indexOf('#') != 0) {
                //not a comment
                var parts = line.split('\t');

                if (parts.length == 9) {
                    //ITS GOOD!
                    var attParts = parts[8].split(';');

                    var feature = {
                        seqid: parts[0],
                        source: parts[1],
                        type: parts[2],
                        start: parts[3],
                        end: parts[4],
                        score: parts[5],
                        strand: parts[6],
                        phase: parts[7],
                        attributes: attParts
                    };
                    onFeature(feature);
                } else {
                }
            }
        });
        /**
         *
         */
        rl.on('close', function () {
            onEnd();
        });
    }
};

module.exports = GFF3;
