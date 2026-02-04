import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as targets from 'aws-cdk-lib/aws-scheduler-targets';
import * as path from 'path';

export class SchedulerStepfunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const definitionBody = sfn.DefinitionBody.fromFile(
      path.join(__dirname, 'state-machine.asl.json')
    );

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody
    });

    const schedulerRole = new iam.Role(this, 'SchedulerRole', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
    });

    stateMachine.grantStartExecution(schedulerRole);

    new scheduler.Schedule(this, 'Schedule', {
      schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
      target: new targets.StepFunctionsStartExecution(stateMachine, {
        role: schedulerRole,
      }),
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}
