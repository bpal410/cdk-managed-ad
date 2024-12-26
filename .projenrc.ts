import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'bpal410',
  authorAddress: '46696804+bpal410@users.noreply.github.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.7.0',
  name: 'cdk-managed-ad',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/bpal410/cdk-managed-ad.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();