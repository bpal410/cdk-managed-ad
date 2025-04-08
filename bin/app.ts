#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MicrosoftAD } from '../lib/microsoft-ad';

const app = new cdk.App();

const stack = new cdk.Stack(app)

const vpc = new cdk.aws_ec2.Vpc(stack, 'VPC', {
    cidr: '10.0.0.0/16',
    maxAzs: 2,
    subnetConfiguration: [
        {
            cidrMask: 24,
            name: 'public',
            subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
        {
            cidrMask: 24,
            name: 'private',
            subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
    ],
});

new MicrosoftAD(stack, 'MicrosoftADStack', {
    domainName: 'example.com',
    edition: 'Standard',
    vpc: vpc,
    vpcSubnets: vpc.selectSubnets({
        subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS
    }),
    enableDirectoryDataAccess: true,
    registerWithWorkSpaces: true
});

app.synth();
