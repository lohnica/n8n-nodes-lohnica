import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LohnicaApi implements ICredentialType {
	name = 'lohnicaApi';

	displayName = 'Lohnica API';

	icon: Icon = {
		light: 'file:../nodes/Lohnica/lohnica.svg',
		dark: 'file:../nodes/Lohnica/lohnica.dark.svg',
	};

	documentationUrl = 'https://api-portal.lohnica.de';

	properties: INodeProperties[] = [
		{
			displayName:
				'New to Lohnica? Create a free account and API key at <a href="https://api-portal.lohnica.de" target="_blank">api-portal.lohnica.de</a>. New accounts include free trial credits.',
			name: 'signupNotice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Lohnica API key. Create one at https://api-portal.lohnica.de.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.lohnica.de/api/v1',
			url: '/auth/ping',
		},
	};
}
