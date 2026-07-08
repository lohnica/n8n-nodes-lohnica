import type { INodeProperties } from 'n8n-workflow';
import {
	childAllowanceOptions,
	germanStateOptions,
	handleLohnicaResponse,
	incomeTaxClassOptions,
	insuranceTypeOptions,
} from '../shared';

const showForCalculation = {
	resource: ['calculation'],
};

/**
 * The month is a path parameter. An empty field falls back to the current
 * month (YYYY-MM), so the node works out of the box without configuration.
 */
const monthExpression = '{{ $parameter["yearMonth"] || new Date().toISOString().slice(0, 7) }}';

const calculationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForCalculation },
		options: [
			{
				name: 'Cost to Net',
				value: 'costToNet',
				action: 'Calculate net and gross salary from a target labour cost',
				description: 'Calculate net and gross salary from a target total employer cost',
				routing: {
					request: {
						method: 'POST',
						url: `=/cost-net-calc/${monthExpression}`,
						ignoreHttpStatusErrors: true,
					},
					output: { postReceive: [handleLohnicaResponse] },
				},
			},
			{
				name: 'Gross to Net',
				value: 'grossToNet',
				action: 'Calculate net salary from gross salary',
				description: 'Calculate net salary and deductions from a gross salary',
				routing: {
					request: {
						method: 'POST',
						url: `=/gross-net-calc/${monthExpression}`,
						ignoreHttpStatusErrors: true,
					},
					output: { postReceive: [handleLohnicaResponse] },
				},
			},
			{
				name: 'Net to Gross',
				value: 'netToGross',
				action: 'Calculate the gross salary for a desired net salary',
				description: 'Find the gross salary that yields a given net salary',
				routing: {
					request: {
						method: 'POST',
						url: `=/net-gross-calc/${monthExpression}`,
						ignoreHttpStatusErrors: true,
					},
					output: { postReceive: [handleLohnicaResponse] },
				},
			},
		],
		default: 'grossToNet',
	},
];

const amountFields: INodeProperties[] = [
	{
		displayName: 'Monthly Gross Income (EUR)',
		name: 'monthlyGrossIncome',
		type: 'number',
		required: true,
		default: 0,
		description: 'Monthly gross salary in EUR',
		displayOptions: { show: { ...showForCalculation, operation: ['grossToNet'] } },
		routing: { send: { type: 'body', property: 'monthly-gross-income' } },
	},
	{
		displayName: 'Monthly Net Pay (EUR)',
		name: 'monthlyNetPay',
		type: 'number',
		required: true,
		default: 0,
		description: 'Desired monthly net salary in EUR',
		displayOptions: { show: { ...showForCalculation, operation: ['netToGross'] } },
		routing: { send: { type: 'body', property: 'monthly-net-pay' } },
	},
	{
		displayName: 'Target Labour Cost (EUR)',
		name: 'targetLaborCost',
		type: 'number',
		required: true,
		default: 0,
		description: 'Target total monthly employer cost in EUR',
		displayOptions: { show: { ...showForCalculation, operation: ['costToNet'] } },
		routing: { send: { type: 'body', property: 'target-labor-cost' } },
	},
];

const commonFields: INodeProperties[] = [
	{
		displayName: 'Month',
		name: 'yearMonth',
		type: 'string',
		default: '',
		placeholder: 'YYYY-MM',
		description: 'Payroll month in YYYY-MM format. Leave empty to use the current month.',
		hint: 'Leave empty for the current month',
		displayOptions: { show: showForCalculation },
	},
	{
		displayName: 'Income Tax Class',
		name: 'incomeTaxClass',
		type: 'options',
		options: incomeTaxClassOptions,
		default: '1',
		description: 'Income tax class (Steuerklasse)',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'income-tax-class' } },
	},
	{
		displayName: 'Federal State',
		name: 'state',
		type: 'options',
		options: germanStateOptions,
		default: 'nw',
		description: 'Federal state (Bundesland); determines the church tax rate',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'state' } },
	},
	{
		displayName: 'Health Insurance Type',
		name: 'insuranceType',
		type: 'options',
		options: insuranceTypeOptions,
		required: true,
		default: 'compulsory',
		description: 'Type of health insurance coverage',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'insurance-type' } },
	},
	{
		displayName: 'Pension Insurance',
		name: 'pensionInsurance',
		type: 'boolean',
		default: true,
		description: 'Whether the employee is subject to statutory pension insurance',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'pension-insurance' } },
	},
	{
		displayName: 'Church Tax',
		name: 'churchTax',
		type: 'boolean',
		default: false,
		description: 'Whether the employee is liable for church tax',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'church-tax' } },
	},
	{
		displayName: 'Age',
		name: 'age',
		type: 'number',
		default: 30,
		description: 'Age of the employee in years',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'age' } },
	},
	{
		displayName: 'Child Allowances',
		name: 'childAllowance',
		type: 'options',
		options: childAllowanceOptions,
		default: '0',
		description: 'Number of child allowances (Kinderfreibetraege)',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'child-allowance' } },
	},
	{
		displayName: 'Has Children',
		name: 'hasChildren',
		type: 'boolean',
		default: false,
		description: 'Whether the employee has children (affects long-term care insurance)',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'has-children' } },
	},
	{
		displayName: 'Children Under 25',
		name: 'childrenBelow25',
		type: 'number',
		default: 0,
		description: 'Number of children under 25 (affects long-term care insurance)',
		displayOptions: { show: showForCalculation },
		routing: { send: { type: 'body', property: 'children-below-25' } },
	},
];

const additionalFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForCalculation },
		options: [
			{
				displayName: 'Employer Subsidy',
				name: 'employerSubsidy',
				type: 'boolean',
				default: false,
				description: 'Whether the employer pays a subsidy towards private health insurance',
				routing: { send: { type: 'body', property: 'employer-subsidy' } },
			},
			{
				displayName: 'Employment Days',
				name: 'employmentDays',
				type: 'number',
				default: 0,
				description:
					'Number of working days for short-term employment (max 70, or max 18 with flat-rate tax)',
				routing: { send: { type: 'body', property: 'employment-days' } },
			},
			{
				displayName: 'Flat-Rate Tax',
				name: 'flatRateTax',
				type: 'boolean',
				default: false,
				description: 'Whether to apply flat-rate taxation under Section 40a (1) EStG',
				routing: { send: { type: 'body', property: 'flat-rate-tax' } },
			},
			{
				displayName: 'Health Insurance Company Number',
				name: 'healthInsuranceCompanyNumber',
				type: 'string',
				default: '',
				description: 'Company number (Betriebsnummer) of the health insurance fund',
				routing: { send: { type: 'body', property: 'health-insurance-company-number' } },
			},
			{
				displayName: 'Income Tax Factor',
				name: 'incomeTaxFactor',
				type: 'number',
				default: 0,
				description: 'Factor for income tax class 4 (Faktorverfahren)',
				routing: { send: { type: 'body', property: 'income-tax-factor' } },
			},
			{
				displayName: 'Midi-Job',
				name: 'midiJob',
				type: 'boolean',
				default: false,
				description: 'Whether to calculate within the transition zone (midi-job)',
				routing: { send: { type: 'body', property: 'midi-job' } },
			},
			{
				displayName: 'Mini-Job',
				name: 'miniJob',
				type: 'boolean',
				default: false,
				description: 'Whether to calculate as a mini-job (marginal employment)',
				routing: { send: { type: 'body', property: 'mini-job' } },
			},
			{
				displayName: 'Private Health Insurance Base Amount (EUR)',
				name: 'privateHealthInsuranceBaseAmount',
				type: 'number',
				default: 0,
				description: 'Base-rate portion of the private health insurance premium in EUR',
				routing: { send: { type: 'body', property: 'private-health-insurance-base-amount' } },
			},
			{
				displayName: 'Private Health Insurance Premium (EUR)',
				name: 'privateHealthInsurancePremium',
				type: 'number',
				default: 0,
				description: 'Total monthly premium for private health insurance in EUR',
				routing: { send: { type: 'body', property: 'private-health-insurance-premium' } },
			},
			{
				displayName: 'Short-Term Employment',
				name: 'shortTerm',
				type: 'boolean',
				default: false,
				description: 'Whether to calculate as short-term employment (persons group 110)',
				routing: { send: { type: 'body', property: 'short-term' } },
			},
			{
				displayName: 'Tax-Exempt Amount (Monthly, EUR)',
				name: 'taxExemptAmountMonthly',
				type: 'number',
				default: 0,
				description: 'Monthly tax-exempt amount (Freibetrag) in EUR',
				routing: { send: { type: 'body', property: 'tax-exempt-amount-monthly' } },
			},
			{
				displayName: 'Unemployment Insurance',
				name: 'unemploymentInsurance',
				type: 'boolean',
				default: true,
				description: 'Whether the employee is subject to unemployment insurance',
				routing: { send: { type: 'body', property: 'unemployment-insurance' } },
			},
		],
	},
];

const calculationNotice: INodeProperties[] = [
	{
		displayName:
			'Calculations consume credits. Create an account or top up your balance at <a href="https://api-portal.lohnica.de" target="_blank">api-portal.lohnica.de</a> (new accounts include free trial credits).',
		name: 'creditsNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForCalculation },
	},
];

export const calculationDescription: INodeProperties[] = [
	...calculationOperations,
	...calculationNotice,
	...amountFields,
	...commonFields,
	...additionalFields,
];
