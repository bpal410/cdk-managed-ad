MYPATTERNS

Here's a summary of the key points from the AWS Construct Library Design Guidelines document:
1. Introduction:
  - The document provides guidelines for designing APIs in the AWS Construct Library to ensure consistency across the entire AWS surface area.
  - The AWS Construct Library includes low-level CFN Resources (L1), higher-level L2 constructs, L2.5 constructs, and even higher-level patterns.
2. API Design:
  - Modules are organized based on the AWS service namespace.
  - Construct classes must extend the cdk.Resource or cdk.Construct class directly.
  - Construct interfaces are used to reference owned and unowned constructs.
  - Construct props should be a struct (FooProps) and expose the full set of service capabilities.
  - Props should use strong types, provide sensible defaults, be flat, and have concise naming.
  - Constructs should expose all resource attributes as readonly properties.
  - Configuration APIs should be marked with the @config tag.
  - "From" static methods allow importing unowned resources.
  - Grants, metrics, events, and connections should be exposed on the construct interface.
  - Integrations should be modeled using interfaces implemented by classes.
3. Implementation Guidelines:
  - Construct IDs should be treated as part of the external contract.
  - Errors should be reported through exceptions, validators, or annotations.
  - Tokens should be used for late-bound values, and Lazys should not mutate the construct tree.
4. Documentation, Testing, and Versioning:
  - Inline documentation, READMEs, unit tests, and integration tests are required.
  - Semantic versioning should be followed, with changes to construct IDs or scope hierarchy considered breaking.
  - Naming and coding style guidelines are provided.


## Patterns

The basic L2 pattern looks like:

```ts
/**
* Let's assume if we are creating a L2 construct for the resource `Foo` from the service `DummyService`,
* this is the skeleton of an L2.
**/

// import the L1 resource
import { aws_dummyservice as service } from 'aws-cdk-lib';

/**
* Represents the Foo.
**/
export interface IFoo extends cdk.IResource {
   readonly fooId: string;
   readonly fooName: string;
   readonly fooArn: string;
}

/**
 * Represents the supported options for a property
 */
export enum SomeType {
  /**
   * The first option.
   */
  OPTION_ONE = 'OPTION_ONE',

  /**
   * The second option.
   */
  OPTOIN_TWO = 'OPTOIN_TWO',

  /**
   * The third option.
   */
  OPTION_THREE = 'OPTION_THREE',
}

/**
* Properties for the Foo construct.
**/
export interface FooProps {
  ...
  readonly someType: SomeType,
}

/**
* The construct to create Foo.
**/
export class Foo extends cdk.Resource implements IFoo {
   public static fromFooAttributes(scope: Construct, id: string, attrs: FooAttributes): IFoo {
      const arn = Stack.of(scope).formatArn({
        service: 'dummyservice',
        resource: 'foo'
        resourceName: attrs.fooName,
      });

      class Import implement IFoo {
        public readonly fooId = attrs.fooId;
        public readonly fooArn = arn
      }
      return new Import(scope, id)
   
   }
   constructor(scope: Construct, id: string, props: FooProps) {
      super(scope, id);

      const resource = new service.CfnFoo(this, 'Resource', {
         ...
         someType: props.someType,
      });
      this.fooId = resource.attrFooId;
      this.fooArn = this.getResourceArnAttribute(resource.attrFooArn, {
        service: 'dummyservice',
        resource: 'foo',
        resourceName: this.physicalName,
      }),
   }
}
```

## enum for a construct property
If a resource property with string type has some options, define a enum for that just as `SomeType` in the sample.

## Integration and unit tests
As part of developing your L2 construct, you should include at least one integration test and one unit test. The integration test should deploy the construct and generate snapshots using the IntegTest class from the @aws-cdk/integ-tests-alpha module.

## IAM Roles Generation
If L1 resources require a roleArn prop, regardless of whether it is mandatory or not, the L2 construct should offer a role: iam.IRole prop instead. This allows the construct to generate a scoped IAM role for the L1 resource using the following pattern:

```ts
constructor(scope: Construct, id: string, props: FooProps) {
  super(scope, id);

  const role = props.role ?? this.createServiceRole();

  const resource = new CfnFoo(this, 'Resource', {
    roleArn: props.role?.roleArn ?? this.createServiceRole().roleArn;
    ...
  });
}
private createServiceRole(): iam.Role {
  // create and return a scoped role here
}
```
This ensures that construct users always have a scoped IAM role without having to create one themselves, which can increase the potential risks.