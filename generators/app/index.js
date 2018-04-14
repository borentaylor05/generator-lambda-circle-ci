('use strict');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the striking ${chalk.red('generator-lambda-circle-ci')} generator!`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your function?',
        default: this.appname.split(' ').join('-')
      },
      {
        type: 'input',
        name: 'region',
        message: 'What AWS region should the function be deployed to?',
        default: 'us-east-1'
      },
      {
        type: 'input',
        name: 'arn',
        message: 'What is the AWS ARN for the IAM role this function will use?'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(this.templatePath('base/.*'), this.destinationRoot());

    this.fs.copy(this.templatePath('base/.**/*'), this.destinationRoot());

    this.fs.copy(this.templatePath('base/dev/**/*'), this.destinationPath('./dev'));

    this.fs.copy(this.templatePath('base/lib/**/*'), this.destinationPath('./lib'));

    this.fs.copy(this.templatePath('base/tests/**/*'), this.destinationPath('./tests'));

    this.fs.copy(
      this.templatePath('base/scripts/**/*'),
      this.destinationPath('./scripts')
    );

    this.fs.copy(this.templatePath('base/index.js'), this.destinationPath('./index.js'));

    this.fs.copyTpl(
      this.templatePath('base/README.md'),
      this.destinationPath('./README.md'),
      {
        name: this.props.name
      }
    );

    this.fs.copyTpl(
      this.templatePath('base/package.json'),
      this.destinationPath('./package.json'),
      {
        name: this.props.name
      }
    );

    this.fs.copyTpl(
      this.templatePath('base/config.js'),
      this.destinationPath('./config.js'),
      {
        arn: this.props.arn,
        name: this.props.name,
        region: this.props.region
      }
    );
  }
};
