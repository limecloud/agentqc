import fs from 'node:fs'
import path from 'node:path'

const root = new URL('..', import.meta.url).pathname
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
const fail = (message) => {
  console.error(message)
  process.exitCode = 1
}

const plan = readJson('docs/public/examples/lime-qc-plan.json')
const job = readJson('docs/public/examples/qcloop-job-request.json')
const verdict = readJson('docs/public/examples/qcloop-verdict.json')

if (plan.schema_version !== '0.1.0') fail('lime-qc-plan.json must use schema_version 0.1.0')
if (plan.target_project !== 'lime') fail('lime-qc-plan.json target_project must be lime')
if (!Array.isArray(plan.required_gates) || plan.required_gates.length === 0) fail('lime-qc-plan.json requires gates')
if (!Array.isArray(plan.cases) || plan.cases.length === 0) fail('lime-qc-plan.json requires cases')
for (const qcCase of plan.cases) {
  for (const key of ['id', 'name', 'target']) {
    if (!qcCase[key]) fail(`case is missing ${key}`)
  }
  if (!Array.isArray(qcCase.steps) || qcCase.steps.length === 0) fail(`${qcCase.id} requires steps`)
  if (!Array.isArray(qcCase.expected) || qcCase.expected.length === 0) fail(`${qcCase.id} requires expected`)
  if (!Array.isArray(qcCase.required_evidence) || qcCase.required_evidence.length === 0) fail(`${qcCase.id} requires required_evidence`)
}
if (!job.prompt_template.includes('{{item}}')) fail('qcloop job prompt_template must include {{item}}')
if (!job.verifier_prompt_template.includes('{{item}}') || !job.verifier_prompt_template.includes('{{output}}')) fail('qcloop verifier_prompt_template must include {{item}} and {{output}}')
if (!Array.isArray(job.items) || job.items.length === 0) fail('qcloop job requires items')
for (const item of job.items) JSON.parse(item)
if (typeof verdict.pass !== 'boolean') fail('qcloop-verdict.json pass must be boolean')
if (!verdict.feedback) fail('qcloop-verdict.json feedback is required')
if (!Array.isArray(verdict.evidence_refs)) fail('qcloop-verdict.json evidence_refs must be an array')

if (process.exitCode) process.exit(process.exitCode)
console.log('Agent QC examples validated')
