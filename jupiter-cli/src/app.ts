import {Log}  from './utils/log';
import {Banner}  from './utils/banner';
import {NewProjectCli}  from './newproject/index';

Log.t(Banner.get(), Log.ERROR);

// TODO check if the project is a Jupiter one

// if not
var cli = new NewProjectCli()
cli.start();




