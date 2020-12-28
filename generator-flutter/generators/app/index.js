'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const action_new = require('./src/action_new');
const enable_web = require('./src/enable_web');

module.exports = class extends Generator {
  prompting() {
    console.log(`
        ||                     ||    .                   
        ||  ... ...  ... ...  ...  .||.    ....  ... ..  
        ||   ||  ||   ||'  ||  ||   ||   .|...||  ||' '' 
        ||   ||  ||   ||    |  ||   ||   ||       ||     
    || .|'   '|..'|.  ||...'  .||.  '|.'  '|...' .||.    
    '''              ||                                 
                    ''''                                
    Code generator for Flutter
    `);
    // Have Yeoman greet the user.
    /*
    this.log(
      yosay(`Welcome to the sensational ${chalk.red('generator-flutter')} generator!`)
    );*/

      var choices = [
        { name: 'New Flutter project', value: 'new'},
        { name: 'Update Flutter', value: 'upgrade'},
        { name: 'Create Section', value: 'section'},
        { name: 'Create Swagger Datasource', value: 'datasource'},
        { name: 'Enable Web Feature', value: 'enable_web'},
      ];

    const prompts = [
      {
        type: 'list',
        name: 'action',
        message: 'Choose command',
        choices: choices
      }
    ];

    this.prompt(prompts).then( props => {
      console.log(props);
      switch(props.action) {
        case 'new': new action_new(this).do_action(); break;
        case 'enable_web': new enable_web(this).do_action(); break;
        case 'upgrade': break;
        case 'section': break;
        case 'datasource': break;
      }
    });

/*    return this.prompt(prompts).then(props => {
      this.log(props);
      this.props = props;
    });
*/
  }

  writing() {
    /*
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );*/
  }

  install() {
    //this.installDependencies();
  }
};
