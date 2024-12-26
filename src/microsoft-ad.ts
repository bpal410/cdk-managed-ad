import { CfnMicrosoftAD } from 'aws-cdk-lib/aws-directoryservice';
import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

/**
 * Properties for MicrosoftAD
 */
export interface MicrosoftADProps {
  /**
   * The fully qualified domain name for the AD directory (e.g. corp.example.com)
   */
  readonly domainName: string;

  /**
   * The password for the directory administrator
   */
  /**
   * The password for the directory administrator.
   * If not provided, a secure random password will be generated.
   *
   * @default - A secure random password is generated
   */
  readonly password?: Secret;

  /**
   * VPC where the Microsoft AD will be created
   */
  readonly vpc: IVpc;

  /**
   * Edition of Microsoft AD (Standard or Enterprise)
   * @default Standard
   */
  readonly edition?: 'Standard' | 'Enterprise';

  /**
   * Short name for the directory (e.g. CORP)
   * @default - derived from domain name
   */
  readonly shortName?: string;

  /**
   * @default - Two subnets will be selected from different AZs
   */
  readonly vpcSubnets?: SubnetSelection;
}

/**
 * L2 Construct for AWS Managed Microsoft AD
 */
export class MicrosoftAD extends Construct {
  /**
   * The underlying CfnMicrosoftAD resource
   */
  public readonly directory: CfnMicrosoftAD;

  /**
   * The ID of the directory
   */
  public readonly directoryId: string;

  /**
   * The DNS addresses of the directory
   */
  public readonly dnsIps: string[];

  /**
   * The secret containing the directory administrator password
   */
  public readonly secretArn: string;


  constructor(scope: Construct, id: string, props: MicrosoftADProps) {
    super(scope, id);

    // Validate VPC has at least 2 subnets in different AZs
    const subnets = props.vpc.selectSubnets(props.vpcSubnets).subnets;
    if (subnets.length < 2) {
      throw new Error('VPC must have at least 2 subnets in different AZs for Microsoft AD');
    }

    // If password secret is provided, use it, otherwise create a new one
    const adSecret = props.password ?? new Secret(this, 'AdSecret', {
      generateSecretString: {
        passwordLength: 32,
        excludePunctuation: true,
      },
    });

    this.directory = new CfnMicrosoftAD(this, 'Resource', {
      name: props.domainName,
      password: adSecret.secretValue.unsafeUnwrap(),
      vpcSettings: {
        vpcId: props.vpc.vpcId,
        subnetIds: subnets.slice(0, 2).map(subnet => subnet.subnetId),
      },
      edition: props.edition ?? 'Standard',
      shortName: props.shortName,
    });


    this.directoryId = this.directory.ref;
    this.dnsIps = this.directory.attrDnsIpAddresses;
    this.secretArn = adSecret.secretArn;
  }
}
