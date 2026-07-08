import { NodeApiError } from 'n8n-workflow';
import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodePropertyOptions,
	JsonObject,
} from 'n8n-workflow';

/**
 * Post-receive handler shared by every operation.
 *
 * The Lohnica API wraps successful payloads in a `data` envelope and reports
 * errors as `{ message }` (business errors), `{ humanized }` (schema coercion)
 * or a plain string (402 out of credits). This unwraps the envelope on success
 * and surfaces the API's own message on failure, so the workflow author sees
 * the real reason instead of a bare status code.
 */
export async function handleLohnicaResponse(
	this: IExecuteSingleFunctions,
	_items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const { statusCode } = response;
	const body = response.body as IDataObject | string;
	const errorPayload: JsonObject =
		body && typeof body === 'object' ? (body as JsonObject) : { message: String(body) };

	if (statusCode >= 400) {
		let message: string;
		if (statusCode === 402) {
			message =
				'Insufficient credits. Top up your balance at https://api-portal.lohnica.de to continue.';
		} else if (typeof body === 'object' && typeof body.message === 'string') {
			message = body.message;
		} else if (typeof body === 'object' && body.humanized) {
			message = `Validation failed: ${JSON.stringify(body.humanized)}`;
		} else if (typeof body === 'string' && body.length > 0) {
			message = body;
		} else {
			message = `Request failed with status ${statusCode}`;
		}
		throw new NodeApiError(this.getNode(), errorPayload, {
			message,
			httpCode: String(statusCode),
		});
	}

	const payload =
		typeof body === 'object' && body !== null && 'data' in body ? body.data : body;

	if (Array.isArray(payload)) {
		return payload.map((entry) => ({ json: entry as IDataObject }));
	}
	return [{ json: (payload ?? {}) as IDataObject }];
}

export const incomeTaxClassOptions: INodePropertyOptions[] = [
	{ name: 'Class 1', value: '1' },
	{ name: 'Class 2', value: '2' },
	{ name: 'Class 3', value: '3' },
	{ name: 'Class 4', value: '4' },
	{ name: 'Class 5', value: '5' },
	{ name: 'Class 6', value: '6' },
];

export const germanStateOptions: INodePropertyOptions[] = [
	{ name: 'Baden-Wuerttemberg', value: 'bw' },
	{ name: 'Bayern', value: 'by' },
	{ name: 'Berlin', value: 'be' },
	{ name: 'Brandenburg', value: 'bb' },
	{ name: 'Bremen', value: 'hb' },
	{ name: 'Hamburg', value: 'hh' },
	{ name: 'Hessen', value: 'he' },
	{ name: 'Mecklenburg-Vorpommern', value: 'mv' },
	{ name: 'Niedersachsen', value: 'ni' },
	{ name: 'Nordrhein-Westfalen', value: 'nw' },
	{ name: 'Rheinland-Pfalz', value: 'rp' },
	{ name: 'Saarland', value: 'sl' },
	{ name: 'Sachsen', value: 'sn' },
	{ name: 'Sachsen-Anhalt', value: 'st' },
	{ name: 'Schleswig-Holstein', value: 'sh' },
	{ name: 'Thueringen', value: 'th' },
];

export const insuranceTypeOptions: INodePropertyOptions[] = [
	{ name: 'Compulsory', value: 'compulsory' },
	{ name: 'Main Job Self-Employed', value: 'main-job-self-employed' },
	{ name: 'Private', value: 'private' },
	{ name: 'Voluntary', value: 'voluntary' },
	{ name: 'Voluntary Self-Payer', value: 'voluntary-self-payer' },
];

export const childAllowanceOptions: INodePropertyOptions[] = [
	{ name: '0', value: '0' },
	{ name: '0.5', value: '0.5' },
	{ name: '1', value: '1' },
	{ name: '1.5', value: '1.5' },
	{ name: '2', value: '2' },
	{ name: '2.5', value: '2.5' },
	{ name: '3', value: '3' },
	{ name: '3.5', value: '3.5' },
	{ name: '4', value: '4' },
	{ name: '4.5', value: '4.5' },
	{ name: '5', value: '5' },
	{ name: '5.5', value: '5.5' },
	{ name: '6', value: '6' },
	{ name: '6.5', value: '6.5' },
	{ name: '7', value: '7' },
	{ name: '7.5', value: '7.5' },
	{ name: '8', value: '8' },
	{ name: '8.5', value: '8.5' },
	{ name: '9', value: '9' },
];
