//GENOME

function GeeFuTuReferenceSource(source) {
    //this.actg = ['A', 'C', 'T', 'G'];
    this.source = source;
    this.uri = source.uri;
}

GeeFuTuReferenceSource.prototype.fetch = function (chr, min, max, pool, callback) {

    var thisB = this;
    var url = this.uri + '?chr=' + chr + '&min=' + min + '&max=' + max;
    console.log(url);
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            thisB.busy--;
            //thisB.notifyActivity();
            if (req.status >= 300) {
                callback('Error code ' + req.status, null);
            } else {
                var resp = req.response;
                var sequence = new DASSequence(chr, min, max, 'DNA', resp);
                return callback(null, sequence);
            }
        }

    };

    thisB.busy++;
    req.open('GET', url, true);
    req.responseType = 'text';
    req.send('');
};

GeeFuTuReferenceSource.prototype.getSeqInfo = function (chr, callback) {
    return callback({length: 200000000});
};

dalliance_registerSourceAdapterFactory('geefutuGenome', function (source) {
    return {sequence: new GeeFuTuReferenceSource(source)};
});


//EXPERIMENT


function GeeFuTuFeatureSource(source) {
    this.source = source;
    this.uri = source.uri;
    this.refs = [];

    this.activityListeners = [];
    this.busy = 0;

    this.changeListeners = [];
}

GeeFuTuFeatureSource.prototype.setRef = function (ref) {
    this.refs = [ref];
    this.notifyChange();
};

GeeFuTuFeatureSource.prototype.addRef = function (ref) {
    this.refs.push(ref);
    this.notifyChange();
};

GeeFuTuFeatureSource.prototype.addChangeListener = function (listener) {
    this.changeListeners.push(listener);
};

GeeFuTuFeatureSource.prototype.notifyChange = function () {
    for (var li = 0; li < this.changeListeners.length; ++li) {
        try {
            this.changeListeners[li](this.busy);
        } catch (e) {
            console.log(e);
        }
    }
};

GeeFuTuFeatureSource.prototype.addActivityListener = function (listener) {
    this.activityListeners.push(listener);
};

GeeFuTuFeatureSource.prototype.notifyActivity = function () {
    for (var li = 0; li < this.activityListeners.length; ++li) {
        try {
            this.activityListeners[li](this.busy);
        } catch (e) {
            console.log(e);
        }
    }
};

GeeFuTuFeatureSource.prototype.getScales = function () {
    return [];
};

GeeFuTuFeatureSource.prototype.fetch = function (chr, min, max, scale, types, pool, callback) {
    var thisB = this;
    var url = this.uri + '?chr=' + chr + '&min=' + min + '&max=' + max;
    if (this.refs) {
        for (var ri = 0; ri < this.refs.length; ++ri)
            url += '&ref=' + this.refs[ri];
    }

    if (this.refs.length > 1)
        url += '&color=true';

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            thisB.busy--;
            thisB.notifyActivity();
            if (req.status >= 300) {
                callback('Error code ' + req.status, null);
            } else {
                var jf = JSON.parse(req.response);
                var features = [];
                for (fi = 0; fi < jf.length; ++fi) {
                    var j = jf[fi];

                    var f = new DASFeature();
                    f.segment = chr;
                    f.min = j.start | 0;
                    f.max = j.end | 0;
                    f.id = j._id;
                    f.type = j.type;

                    f.score = j.score || j.score2;

                    features.push(f);
                }
                //console.log(features);
                callback(null, features);
            }
        }

    };

    thisB.busy++;
    thisB.notifyActivity();

    req.open('GET', url, true);
    req.responseType = 'text';
    req.send('');
};

dalliance_registerSourceAdapterFactory('geefutuExperiment', function (source) {
    return {features: new GeeFuTuFeatureSource(source)};
});


function getSnpSource(source) {
    if (source.setRef) {
        return source;
    } else if (source.source) {
        return getSnpSource(source.source);
    } else if (source.sources) {
        for (var si = 0; si < source.sources.length; ++si) {
            var ss = getSnpSource(source.sources[si]);
            if (ss)
                return ss;
        }
    }
}

//function ldserv_controllerPlugin(f, info) {
//    var ss = getSnpSource(info.tier.featureSource);
//    if (ss && f.id) {
//        var button = makeElement('input', '', {type: 'button', value: 'Make ref.'});
//        button.addEventListener('click', function(ev) {
//            ss.setRef(f.id);
//        }, false);
//        var b2 = makeElement('input', '', {type: 'button', value: 'Add ref.'});
//        b2.addEventListener('click', function(ev) {
//            ss.addRef(f.id);
//        }, false);
//        info.add('LD Calculation', makeElement("span", [button, b2]));
//    }
//}
