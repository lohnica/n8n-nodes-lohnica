import type { INodeProperties } from 'n8n-workflow';
import { handleLohnicaResponse } from '../shared';

const showForHealthInsurance = {
	resource: ['healthInsurance'],
};

/**
 * The date is a path parameter. An empty field falls back to today (YYYY-MM-DD).
 */
const dateExpression = '{{ $parameter["date"] || new Date().toISOString().slice(0, 10) }}';

const healthInsuranceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForHealthInsurance },
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List statutory health insurance funds',
				description:
					'List statutory health insurance funds with company numbers and supplementary rates',
				routing: {
					request: {
						method: 'GET',
						url: `=/health-insurances/${dateExpression}`,
						ignoreHttpStatusErrors: true,
					},
					output: { postReceive: [handleLohnicaResponse] },
				},
			},
		],
		default: 'list',
	},
];

const healthInsuranceFields: INodeProperties[] = [
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: '',
		placeholder: 'YYYY-MM-DD',
		description: 'Date for which to retrieve the funds, in YYYY-MM-DD format. Leave empty for today.',
		displayOptions: { show: { ...showForHealthInsurance, operation: ['list'] } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { ...showForHealthInsurance, operation: ['list'] } },
		options: [
			{
				displayName: 'Name Filter',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Only return funds whose name contains this text',
				routing: { send: { type: 'query', property: 'name' } },
			},
		],
	},
];

export const healthInsuranceDescription: INodeProperties[] = [
	...healthInsuranceOperations,
	...healthInsuranceFields,
];
