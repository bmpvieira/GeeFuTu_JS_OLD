var chalk = require('chalk');


this.logSuccess = function(text){
  console.log(chalk.green(text));
};

this.logInfo = function(text){
  console.log(chalk.blue(text));
};

this.logWarning = function(text){
  console.log(chalk.yellow(text));
}

this.logError = function(text){
  console.log(chalk.red(text));
};

this.renderError = function (res, err) {
  if (err) {
    return res.status(404).render('error', {message: err});
  }
};

module.exports = this;
