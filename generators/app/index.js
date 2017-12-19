'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the glorious ' + chalk.red('generator-tsc-library') + ' generator!'
      )
    );
  }

  writing() {
    this.writingUnexistFiles();
    this.writingArcconfig();
    this.writingPackage();
    this.writingTsConfig();
    this.writingTsLint();
  }

  install() {
    this.yarnInstall(['typescript', 'tslint', 'husky', 'tslint-language-service'], {
      dev: true
    });
  }

  writingUnexistFiles() {
    if (!this.fs.exists(this.destinationPath('.npmignore'))) {
      this.fs.copy(this.templatePath('npmignore'), this.destinationPath('.npmignore'));
    }

    if (!this.fs.exists(this.destinationPath('.gitignore'))) {
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    }

    if (!this.fs.exists(this.destinationPath('tslint.json'))) {
      this.fs.copy(this.templatePath('tslint.json'), this.destinationPath('tslint.json'));
    }
  }

  writingPackage() {
    const oldJson = this.fs.readJSON(this.destinationPath('package.json'), {});
    const newJson = require('./templates/package.json');
    _.mergeWith(oldJson, newJson, this.customizer);

    this.fs.writeJSON(this.destinationPath('package.json'), oldJson);
  }

  writingTsConfig() {
    const oldJson = this.fs.readJSON(this.destinationPath('tsconfig.json'), {});
    const newJson = require('./templates/tsconfig.json');
    _.mergeWith(oldJson, newJson, this.customizer);

    this.fs.writeJSON(this.destinationPath('tsconfig.json'), oldJson);
  }

  writingTsLint() {
    const config = this.fs.readJSON(this.destinationPath('tslint.json'), {});
    if (config !== undefined) {
      return;
    }
    this.fs.copy(this.templatePath('tslint.json'), this.destinationPath('tslint.json'));
  }

  end() {
    this.log(
      'If you are using Git, please add ' +
        chalk.green('/dist') +
        ' to your ' +
        chalk.blue('.gitignore')
    );
    this.log('Also should adjust your ' + chalk.blue('.npmignore!'));
  }

  customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
      return _.uniqWith(_.concat(objValue, srcValue), _.isEqual);
    }
  }
};
