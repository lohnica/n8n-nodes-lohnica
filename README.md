# n8n-nodes-lohnica

This is an n8n community node. It lets you run German payroll calculations with the [Lohnica](https://lohnica.de) API in your n8n workflows.

Lohnica is a German payroll platform. This node exposes its public gross-to-net, net-to-gross and cost-to-net calculations, plus a lookup of statutory health insurance funds, using current tax tables and social security contribution rates.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Calculation

- **Gross to Net** – calculate net salary and deductions from a gross salary.
- **Net to Gross** – find the gross salary that yields a desired net salary.
- **Cost to Net** – derive net and gross salary from a target total employer cost.

All three take the payroll month plus the employee's tax and social security
parameters (tax class, federal state, health insurance type, pension insurance,
church tax, age, child allowances). Less common inputs (mini-job, midi-job,
short-term employment, private health insurance amounts, tax factor, allowances)
are available under **Additional Fields**.

### Health Insurance

- **List** – list statutory health insurance funds valid on a given date,
  including company numbers (Betriebsnummer) and supplementary contribution
  rates. Use the optional name filter to narrow the result. The company number
  returned here is the value you pass as *Health Insurance Company Number* in a
  calculation.

The **Month** and **Date** fields default to the current month / today when left
empty.

## Credentials

You need a Lohnica API key.

1. Create an account and an API key at [api-portal.lohnica.de](https://api-portal.lohnica.de). New accounts include free trial credits.
2. In n8n, create new **Lohnica API** credentials and paste the key.

The key is sent as the `X-API-Key` header. The credential test uses a
credit-free verification endpoint, so testing the connection does not consume
any credits.

## Compatibility

Requires n8n 1.0 or later. The node is declarative and has no runtime
dependencies.

## Usage

The node is also available as an AI agent tool (`usableAsTool`), so an agent can
be asked for a payroll calculation directly.

Each calculation returns one item with the full result (net pay, employer cost,
individual tax and social security contributions). The health insurance list
returns one item per fund.

Errors from the API are surfaced with their original message. If your balance is
depleted, the node reports that you need to top up at
[api-portal.lohnica.de](https://api-portal.lohnica.de).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Lohnica](https://lohnica.de) and the [Brutto-Netto API](https://brutto-netto-api.de)
