import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { calculationDescription } from './resources/calculation';
import { healthInsuranceDescription } from './resources/healthInsurance';

export class Lohnica implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lohnica',
		name: 'lohnica',
		icon: { light: 'file:lohnica.svg', dark: 'file:lohnica.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'German gross-to-net, net-to-gross and cost-to-net payroll calculations',
		defaults: {
			name: 'Lohnica',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'lohnicaApi', required: true }],
		requestDefaults: {
			baseURL: 'https://app.lohnica.de/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Calculation',
						value: 'calculation',
					},
					{
						name: 'Health Insurance',
						value: 'healthInsurance',
					},
				],
				default: 'calculation',
			},
			...calculationDescription,
			...healthInsuranceDescription,
		],
	};
}
