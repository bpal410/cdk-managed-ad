# cdk-managed-ad

This is a level 2 cdk construct library forked from the repo for *DOP215 - Next-generation CDK development with Amazon Q Developer* from AWS reInvent 2024.

## Prerequisities

Prepare your markdown documents under `doc/`. Make sure to add the alias names on the top of each document.

install the latest npm packages

```bash
yarn install
yarn upgrade --latest
```

check your cdk version

```bash
npx cdk --version
```

## Prompts for Amazon Q Developer

Generaet the constructs:

```
@workspace follow DESIGNGUIDELINES and MYPATTERNS, build a directoryservice.MicrosoftAD for me as a L2 construct for directoryservice.CfnMicrosoftAD.
```

Generate the README and tests:

```
/dev update the README.md and generate unit tests for the MicrosoftAD construct class.
```

Make sure to adjust the prompts for your own generation purposes.


## Usage

The `MicrosoftAD` construct creates an AWS Managed Microsoft AD directory in your VPC. Here's how to use it:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';
import { MicrosoftAD } from './microsoft-ad';

const stack = new cdk.Stack();

// Create a VPC (or use an existing one)
const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

// Existing Secret ARN of string type (not JSON)
const EXISTING_SECRET_ARN = string "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT_ID:secret:YOUR_EXISTING_SECRET_ARN"

// Create the Microsoft AD
const ad = new MicrosoftAD(stack, 'CorporateAD', {
  domainName: 'corp.example.com',
  password: sm.Secret.fromSecretCompleteArn(self, "ExistingSecret", EXISTING_SECRET_ARN)
  vpc: vpc,
  edition: 'Standard', // or 'Enterprise'
  shortName: 'CORP', // optional. This would be your NetBIOS name.
});

// The directory ID and DNS IPs are available as properties
console.log('Directory ID:', ad.directoryId);
console.log('DNS IPs:', ad.dnsIps);
console.log('Admin Password Secret ARN:', ad.secretArn);
```

### Properties

- `domainName` (required): The fully qualified domain name for the AD directory (e.g., corp.example.com)
- `password` (optional): The an AWS Secrets Manager ARN for the directory administrator (if not provided, a secure random password will be generated)
- `vpc` (required): VPC where the Microsoft AD will be created (must have at least 2 subnets in different AZs)
- `edition` (optional): Edition of Microsoft AD ('Standard' or 'Enterprise', defaults to 'Standard')
- `shortName` (optional): Short name for the directory (e.g., CORP)
- `vpcSubnets` (optional): Specific subnet selection for the AD (defaults to two subnets from different AZs)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
