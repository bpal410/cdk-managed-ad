import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions'; // Removed `Match`
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { MicrosoftAD } from '../src/microsoft-ad';

describe('MicrosoftAD', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'TestVPC', {
      maxAzs: 2,
    });
  });

  test('creates a Microsoft AD with default configuration', () => {
    // WHEN
    new MicrosoftAD(stack, 'TestAD', {
      domainName: 'example.com',
      vpc,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DirectoryService::MicrosoftAD', {
      Name: 'example.com',
      Edition: 'Standard',
    });
  });

  test('creates a Microsoft AD with enterprise edition', () => {
    // WHEN
    new MicrosoftAD(stack, 'TestAD', {
      domainName: 'example.com',
      vpc,
      edition: 'Enterprise',
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DirectoryService::MicrosoftAD', {
      Edition: 'Enterprise',
    });
  });

  test('creates a Microsoft AD with custom short name', () => {
    // WHEN
    new MicrosoftAD(stack, 'TestAD', {
      domainName: 'example.com',
      vpc,
      shortName: 'EXAMPLE',
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DirectoryService::MicrosoftAD', {
      ShortName: 'EXAMPLE',
    });
  });

  test('throws error when VPC has less than 2 subnets', () => {
    // WHEN
    const vpcWithOneSubnet = new ec2.Vpc(stack, 'SingleSubnetVPC', {
      maxAzs: 1,
    });

    // THEN
    expect(() => {
      new MicrosoftAD(stack, 'TestAD', {
        domainName: 'example.com',
        vpc: vpcWithOneSubnet,
      });
    }).toThrow('VPC must have at least 2 subnets in different AZs for Microsoft AD');
  });
});
