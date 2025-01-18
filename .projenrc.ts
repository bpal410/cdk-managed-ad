import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'bpal410',
  authorAddress: '46696804+bpal410@users.noreply.github.com',
  cdkVersion: '2.173.2',
  defaultReleaseBranch: 'main',
  projenrcTs: true,
  name: 'cdk-managed-ad',
  description: 'AWS CDK constructs for Directory Service Managed AD',
  repositoryUrl: 'https://github.com/bpal410/cdk-managed-ad.git',
  keywords: ['awscdk', 'directoryservice'],
  publishToPypi: {
    distName: 'bpal410.cdk-managed-ad',
    module: 'bpal410.cdk_managed_ad',
  }
  // deps: [],                /* Runtime dependencies of this module. */
  // devDeps: [],             /* Build dependencies for this module. */
});
project
project.synth();