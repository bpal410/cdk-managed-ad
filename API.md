# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### MicrosoftAD <a name="MicrosoftAD" id="cdk-managed-ad.MicrosoftAD"></a>

L2 Construct for AWS Managed Microsoft AD.

#### Initializers <a name="Initializers" id="cdk-managed-ad.MicrosoftAD.Initializer"></a>

```typescript
import { MicrosoftAD } from 'cdk-managed-ad'

new MicrosoftAD(scope: Construct, id: string, props: MicrosoftADProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-managed-ad.MicrosoftAD.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-managed-ad.MicrosoftAD.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-managed-ad.MicrosoftAD.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-managed-ad.MicrosoftADProps">MicrosoftADProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-managed-ad.MicrosoftAD.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-managed-ad.MicrosoftAD.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-managed-ad.MicrosoftAD.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-managed-ad.MicrosoftADProps">MicrosoftADProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-managed-ad.MicrosoftAD.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-managed-ad.MicrosoftAD.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-managed-ad.MicrosoftAD.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-managed-ad.MicrosoftAD.isConstruct"></a>

```typescript
import { MicrosoftAD } from 'cdk-managed-ad'

MicrosoftAD.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-managed-ad.MicrosoftAD.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-managed-ad.MicrosoftAD.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-managed-ad.MicrosoftAD.property.directory">directory</a></code> | <code>aws-cdk-lib.aws_directoryservice.CfnMicrosoftAD</code> | The underlying CfnMicrosoftAD resource. |
| <code><a href="#cdk-managed-ad.MicrosoftAD.property.directoryId">directoryId</a></code> | <code>string</code> | The ID of the directory. |
| <code><a href="#cdk-managed-ad.MicrosoftAD.property.dnsIps">dnsIps</a></code> | <code>string[]</code> | The DNS addresses of the directory. |
| <code><a href="#cdk-managed-ad.MicrosoftAD.property.secretArn">secretArn</a></code> | <code>string</code> | The secret containing the directory administrator password. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-managed-ad.MicrosoftAD.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `directory`<sup>Required</sup> <a name="directory" id="cdk-managed-ad.MicrosoftAD.property.directory"></a>

```typescript
public readonly directory: CfnMicrosoftAD;
```

- *Type:* aws-cdk-lib.aws_directoryservice.CfnMicrosoftAD

The underlying CfnMicrosoftAD resource.

---

##### `directoryId`<sup>Required</sup> <a name="directoryId" id="cdk-managed-ad.MicrosoftAD.property.directoryId"></a>

```typescript
public readonly directoryId: string;
```

- *Type:* string

The ID of the directory.

---

##### `dnsIps`<sup>Required</sup> <a name="dnsIps" id="cdk-managed-ad.MicrosoftAD.property.dnsIps"></a>

```typescript
public readonly dnsIps: string[];
```

- *Type:* string[]

The DNS addresses of the directory.

---

##### `secretArn`<sup>Required</sup> <a name="secretArn" id="cdk-managed-ad.MicrosoftAD.property.secretArn"></a>

```typescript
public readonly secretArn: string;
```

- *Type:* string

The secret containing the directory administrator password.

---


## Structs <a name="Structs" id="Structs"></a>

### MicrosoftADProps <a name="MicrosoftADProps" id="cdk-managed-ad.MicrosoftADProps"></a>

Properties for MicrosoftAD.

#### Initializer <a name="Initializer" id="cdk-managed-ad.MicrosoftADProps.Initializer"></a>

```typescript
import { MicrosoftADProps } from 'cdk-managed-ad'

const microsoftADProps: MicrosoftADProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.domainName">domainName</a></code> | <code>string</code> | The fully qualified domain name for the AD directory (e.g. corp.example.com). |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC where the Microsoft AD will be created. |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.edition">edition</a></code> | <code>string</code> | Edition of Microsoft AD (Standard or Enterprise). |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.enableDirectoryDataAccess">enableDirectoryDataAccess</a></code> | <code>boolean</code> | Enable Directory Data Service Access. |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.password">password</a></code> | <code>aws-cdk-lib.aws_secretsmanager.Secret</code> | The password for the directory administrator. |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.shortName">shortName</a></code> | <code>string</code> | Short name for the directory (e.g. CORP). |
| <code><a href="#cdk-managed-ad.MicrosoftADProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | *No description.* |

---

##### `domainName`<sup>Required</sup> <a name="domainName" id="cdk-managed-ad.MicrosoftADProps.property.domainName"></a>

```typescript
public readonly domainName: string;
```

- *Type:* string

The fully qualified domain name for the AD directory (e.g. corp.example.com).

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="cdk-managed-ad.MicrosoftADProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

VPC where the Microsoft AD will be created.

---

##### `edition`<sup>Optional</sup> <a name="edition" id="cdk-managed-ad.MicrosoftADProps.property.edition"></a>

```typescript
public readonly edition: string;
```

- *Type:* string
- *Default:* Standard

Edition of Microsoft AD (Standard or Enterprise).

---

##### `enableDirectoryDataAccess`<sup>Optional</sup> <a name="enableDirectoryDataAccess" id="cdk-managed-ad.MicrosoftADProps.property.enableDirectoryDataAccess"></a>

```typescript
public readonly enableDirectoryDataAccess: boolean;
```

- *Type:* boolean
- *Default:* false

Enable Directory Data Service Access.

---

##### `password`<sup>Optional</sup> <a name="password" id="cdk-managed-ad.MicrosoftADProps.property.password"></a>

```typescript
public readonly password: Secret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.Secret
- *Default:* A secure random password is generated

The password for the directory administrator.

If not provided, a secure random password will be generated.

---

##### `shortName`<sup>Optional</sup> <a name="shortName" id="cdk-managed-ad.MicrosoftADProps.property.shortName"></a>

```typescript
public readonly shortName: string;
```

- *Type:* string
- *Default:* derived from domain name

Short name for the directory (e.g. CORP).

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="cdk-managed-ad.MicrosoftADProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* Two subnets will be selected from different AZs

---



