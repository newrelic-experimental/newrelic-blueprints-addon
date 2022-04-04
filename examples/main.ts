import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
// import { NewRelicAddOn } from '@newrelic/newrelic-eks-blueprints-addon';
import { NewRelicAddOn } from '../../dist';
import { Construct } from "constructs";


export default class NewRelicConstruct extends Construct {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id);
        // AddOns for the cluster
        const stackId = `${id}-blueprint`;

        const addOns: Array<blueprints.ClusterAddOn> = [
            new blueprints.addons.SecretsStoreAddOn(),
            new NewRelicAddOn({
                version: "4.2.0-beta",
                newRelicClusterName: id,
                // Uncomment "awsSecretName" after you create your secret in AWS Secrets Manager.
                // Required: nrLicenseKey
                // Optional: pixieDeployKey, pixieApiKey
                //
                // Format:
                // {
                //     "pixieDeployKey": "px-dep-XXXX",
                //     "pixieApiKey": "px-api-XXXX",
                //     "nrLicenseKey": "XXXXNRAL"
                // }
                awsSecretName: "newrelic-pixie-combined",
                //
                // Uncomment "installPixie" and "installPixieIntegration" if installing Pixie.
                installPixie: true,
                installPixieIntegration: true,
                //
                // For additional install options, visit the New Relic addon docs:
                // https://github.com/newrelic-experimental/newrelic-eks-blueprints-addon
            })
        ];

        blueprints.EksBlueprint.builder()
            .addOns(...addOns)
            .build(scope, stackId, props);
    }
}