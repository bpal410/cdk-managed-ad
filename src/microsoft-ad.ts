import { Stack } from 'aws-cdk-lib';
import { CfnMicrosoftAD } from 'aws-cdk-lib/aws-directoryservice';
import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as cr from 'aws-cdk-lib/custom-resources';
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

  /**
   * Enable Directory Data Service Access
   * @default false
   */
  readonly enableDirectoryDataAccess?: boolean;

  /**
   * Register AD with WorkSpaces
   * @default false
   */
  readonly registerWithWorkSpaces?: boolean;
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
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    // Create the Microsoft AD directory
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

    if (props.enableDirectoryDataAccess) {
      // Create IAM role for the Custom Resource
      const enableDataAccessRole = new iam.Role(this, 'EnableDataAccessRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
      });

      // Add required permissions for Directory Service
      enableDataAccessRole.addToPolicy(new iam.PolicyStatement({
        actions: ['ds:EnableDirectoryDataAccess', 'ds:DisableDirectoryDataAccess'],
        resources: [`arn:aws:ds:${Stack.of(this).region}:${Stack.of(this).account}:directory/${this.directoryId}`],
      }));

      // Create the Custom Resource
      new cr.AwsCustomResource(this, 'EnableDirectoryDataAccess', {
        installLatestAwsSdk: true,
        onCreate: {
          service: 'DirectoryService',
          action: 'enableDirectoryDataAccess',
          parameters: {
            DirectoryId: this.directory.ref,
          },
          physicalResourceId: cr.PhysicalResourceId.of(`${this.directory.ref}-data-access`),
        },
        onDelete: {
          service: 'DirectoryService',
          action: 'disableDirectoryDataAccess',
          parameters: {
            DirectoryId: this.directory.ref,
          },
          physicalResourceId: cr.PhysicalResourceId.of(`${this.directory.ref}-data-access`),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
        role: enableDataAccessRole,
      });
    }
    // Register with WorkSpaces custom resource
    if (props.registerWithWorkSpaces) {
      // Create workspaces_DefaultRole
      const workspacesDefaultRole = new iam.Role(this, 'WorkspacesDefaultRole', {
        roleName: 'workspaces_DefaultRole', // MUST BE workspaces_DefaultRole
        description: 'https://docs.aws.amazon.com/workspaces/latest/adminguide/workspaces-access-control.html#create-default-role',
        assumedBy: new iam.ServicePrincipal('workspaces.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonWorkSpacesServiceAccess'),
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonWorkSpacesSelfServiceAccess'),
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonWorkSpacesPoolServiceAccess'),
        ],
      });
      // Create IAM policies for Custom Resource
      const customResourceStatement = new iam.PolicyStatement({
        sid: 'AllowWorkspacesCustomResource',
        actions: [
          'ds:*',
          'workspaces:*',
          'application-autoscaling:DeleteScalingPolicy',
          'application-autoscaling:DeleteScheduledAction',
          'application-autoscaling:DeregisterScalableTarget',
          'application-autoscaling:DescribeScalableTargets',
          'application-autoscaling:DescribeScalingActivities',
          'application-autoscaling:DescribeScalingPolicies',
          'application-autoscaling:DescribeScheduledActions',
          'application-autoscaling:PutScalingPolicy',
          'application-autoscaling:PutScheduledAction',
          'application-autoscaling:RegisterScalableTarget',
          'cloudwatch:DeleteAlarms',
          'cloudwatch:DescribeAlarms',
          'cloudwatch:PutMetricAlarm',
          'ec2:AssociateRouteTable',
          'ec2:AttachInternetGateway',
          'ec2:AuthorizeSecurityGroupEgress',
          'ec2:AuthorizeSecurityGroupIngress',
          'ec2:CreateInternetGateway',
          'ec2:CreateNetworkInterface',
          'ec2:CreateRoute',
          'ec2:CreateRouteTable',
          'ec2:CreateSecurityGroup',
          'ec2:CreateSubnet',
          'ec2:CreateTags',
          'ec2:CreateVpc',
          'ec2:DeleteNetworkInterface',
          'ec2:DeleteSecurityGroup',
          'ec2:DescribeAvailabilityZones',
          'ec2:DescribeInternetGateways',
          'ec2:DescribeNetworkInterfaces',
          'ec2:DescribeRouteTables',
          'ec2:DescribeSecurityGroups',
          'ec2:DescribeSubnets',
          'ec2:DescribeVpcs',
          'ec2:RevokeSecurityGroupEgress',
          'ec2:RevokeSecurityGroupIngress',
          'iam:AttachRolePolicy',
          'iam:CreatePolicy',
          'iam:CreateRole',
          'iam:GetRole',
          'iam:ListRoles',
          'iam:PutRolePolicy',
          'kms:ListAliases',
          'kms:ListKeys',
          'secretsmanager:ListSecrets',
          'tag:GetResources',
          'workdocs:AddUserToGroup',
          'workdocs:DeregisterDirectory',
          'workdocs:RegisterDirectory',
          'sso-directory:SearchUsers',
          'sso:CreateApplication',
          'sso:DeleteApplication',
          'sso:DescribeApplication',
          'sso:DescribeInstance',
          'sso:GetApplicationGrant',
          'sso:ListInstances',
          'sso:PutApplicationAssignment',
          'sso:PutApplicationAssignmentConfiguration',
          'sso:PutApplicationAuthenticationMethod',
          'sso:PutApplicationGrant',
        ],
        resources: ['*'],
      });
      const passRoleStatement = new iam.PolicyStatement({
        sid: 'AllowPassRole',
        actions: ['iam:PassRole'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'iam:PassedToService': 'workspaces.amazonaws.com',
          },
        },
      });
      new cr.AwsCustomResource(this, 'WorkspacesRegisterDirectory', {
        installLatestAwsSdk: true,
        onCreate: {
          service: 'WorkSpaces',
          action: 'registerWorkspaceDirectory',
          parameters: {
            DirectoryId: this.directoryId,
            EnableSelfService: false,
            EnableWorkDocs: false,
            SubnetIds: subnets.slice(0, 2).map(subnet => subnet.subnetId),
            UserIdentityType: 'AWS_DIRECTORY_SERVICE',
            WorkspaceType: 'PERSONAL',
          },
          physicalResourceId: cr.PhysicalResourceId.of(`${this.directory.ref}-register-directory`),
        },
        onDelete: {
          service: 'WorkSpaces',
          action: 'deregisterWorkspaceDirectory',
          parameters: {
            DirectoryId: this.directoryId,
          },
          physicalResourceId: cr.PhysicalResourceId.of(`${this.directory.ref}-deregister-directory`),
        },
        policy: cr.AwsCustomResourcePolicy.fromStatements([
          customResourceStatement,
          passRoleStatement,
        ]),
        role: workspacesDefaultRole,
      },
      );
    // TODO: Add Custom Resource for custom security group usage
    // Look at `new-cdk-account` for example
    // @assignees: bpal410
    }
  }
}
