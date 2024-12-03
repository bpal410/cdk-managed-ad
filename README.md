# Next-Generation CDK Development with Amazon Q Developer

This is a sample repo for *DOP215 - Next-generation CDK development with Amazon Q Developer* from AWS reInvent 2024.

## Prerequisities

Prepare your markdown documents under `doc/`. Make sure to add the alias names on the top of each document.

install the latest npm packages

```
$ yarn install
$ yarn upgrade --latest
```

check your cdk version

```
$ npx cdk --version
```

## Prompts for Amazon Q Developer

Generaet the constructs:

```
@workspace follow DESIGNGUIDELINES and MYPATTERNS, build a opensearchserverless.Collection for me as a L2 construct for opensearchserverless.CfnCollection.
```

Generate the README and tests:

```
/dev update the README.md and generate unit tests for the Collection construct class.
```

Make sure to adjust the prompts for your own generation purposes.


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
