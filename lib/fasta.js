var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
/**
 *
 * @type {{read: Function, write: Function}}
 */
var Fasta = {
    /**
     *
     * @param path - path to fasta file
     * @param onReference - function to run on each reference
     * @param onEnd - function to run on completion
     */
    read: function read(path, onReference, onEnd) {
        var count = 0;
        var seqName;
        var seq;

        var instream = fs.createReadStream(path);
        var outstream = new stream();
        var rl = readline.createInterface(instream, outstream);

        rl.on('line', function (line) {

            if (line.indexOf('>') == 0) {
                //finish prev seq
                if (seqName && seq) {
                    var ref = {name: seqName, seq: seq};
                    onReference(ref);
                }

                //start new seq
                count++;
                seqName = line.split(">")[1].split(" ")[0];
                seq = '';
            } else if (line.toLowerCase().match(/^[a-z]/)) {
                seq += line;
            }
        });

        if (onEnd) {
            rl.on('close', function () {
                onEnd();
            });
        }
    },
    /**
     *
     * @param path - path to new fasta file
     */
    write: function (path) {
      console.log(path);
      //TODO
    }
};
module.exports = Fasta;
