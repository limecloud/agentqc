import fs from 'node:fs'
import path from 'node:path'

const root = new URL('..', import.meta.url).pathname
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
const fail = (message) => {
  console.error(message)
  process.exitCode = 1
}

const profiles = new Set([
  'agent-runtime-cli',
  'agent-sdk-api',
  'agent-tool-mcp-gateway',
  'multi-channel-agent-gateway',
  'agent-ui-tui-desktop',
  'agent-skills-plugins',
  'background-agent-scheduler',
  'agent-distribution-release',
  'agent-evals-quality',
])

const surfaces = new Set([
  'cli-stream',
  'tui',
  'webui',
  'desktop-gui',
  'browser-automation',
  'channel-ui',
  'eval-ui',
])

const gateFamilies = new Set([
  'static',
  'unit',
  'property-fuzz',
  'contract-protocol',
  'fake-integration',
  'runtime-e2e',
  'ui-interaction',
  'live-provider',
  'stress-concurrency',
  'distribution-release',
  'semantic-eval',
  'benchmark-eval',
  'review',
])

const planFiles = [
  'docs/public/examples/agent-qc-plan.json',
  'docs/public/examples/codex-qc-plan.json',
  'docs/public/examples/claudecode-qc-plan.json',
  'docs/public/examples/openclaw-qc-plan.json',
  'docs/public/examples/hermes-qc-plan.json',
]

const checkGateList = (file, label, gates) => {
  if (!Array.isArray(gates) || gates.length === 0) fail(`${file} ${label} requires gates`)
  for (const gate of gates ?? []) {
    if (!gateFamilies.has(gate)) fail(`${file} ${label} has unknown gate family ${gate}`)
  }
}

for (const file of planFiles) {
  const plan = readJson(file)
  if (plan.schema_version !== '0.5.0') fail(`${file} must use schema_version 0.5.0`)
  if (!Array.isArray(plan.project_profiles) || plan.project_profiles.length === 0) fail(`${file} requires project_profiles`)
  const planProfiles = new Set(plan.project_profiles)
  for (const profile of planProfiles) if (!profiles.has(profile)) fail(`${file} has unknown profile ${profile}`)
  checkGateList(file, 'plan', plan.required_gates)
  if (!Array.isArray(plan.cases) || plan.cases.length === 0) fail(`${file} requires cases`)
  for (const qcCase of plan.cases) {
    for (const key of ['id', 'project_profile', 'target']) if (!qcCase[key]) fail(`${file} case is missing ${key}`)
    if (!profiles.has(qcCase.project_profile)) fail(`${file} case has unknown profile ${qcCase.project_profile}`)
    if (!planProfiles.has(qcCase.project_profile)) fail(`${file} ${qcCase.id} profile ${qcCase.project_profile} is not declared in project_profiles`)
    if (!Array.isArray(qcCase.steps) || qcCase.steps.length === 0) fail(`${file} ${qcCase.id} requires steps`)
    if (!Array.isArray(qcCase.expected) || qcCase.expected.length === 0) fail(`${file} ${qcCase.id} requires expected`)
    if (!Array.isArray(qcCase.required_evidence) || qcCase.required_evidence.length === 0) fail(`${file} ${qcCase.id} requires required_evidence`)
    if (qcCase.surface && !surfaces.has(qcCase.surface)) fail(`${file} ${qcCase.id} has unknown surface ${qcCase.surface}`)
    if (qcCase.required_gates) checkGateList(file, qcCase.id, qcCase.required_gates)
  }
}

const job = readJson('docs/public/examples/qcloop-job-request.json')
if (!job.prompt_template.includes('{{item}}')) fail('qcloop job prompt_template must include {{item}}')
if (!job.verifier_prompt_template.includes('{{item}}') || !job.verifier_prompt_template.includes('{{output}}')) fail('qcloop verifier_prompt_template must include {{item}} and {{output}}')
for (const item of job.items) {
  const parsed = JSON.parse(item)
  if (!profiles.has(parsed.project_profile)) fail(`qcloop item has unknown profile ${parsed.project_profile}`)
}

const verdict = readJson('docs/public/examples/qcloop-verdict.json')
if (typeof verdict.pass !== 'boolean') fail('qcloop-verdict.json pass must be boolean')
if (!verdict.status) fail('qcloop-verdict.json status is required')
if (!verdict.feedback) fail('qcloop-verdict.json feedback is required')
if (!Array.isArray(verdict.evidence_refs)) fail('qcloop-verdict.json evidence_refs must be an array')

const benchmark = readJson('docs/public/examples/lime-benchmark-experiment.json')
if (benchmark.schema_version !== '0.5.0') fail('lime-benchmark-experiment.json must use schema_version 0.5.0')
if (!benchmark.dataset?.id || !benchmark.dataset?.version) fail('lime benchmark requires dataset id and version')
if (!benchmark.dataset.harbor?.local_path && !benchmark.dataset.harbor?.registry_ref) fail('lime benchmark requires a Harbor local path or registry ref')
if (!Array.isArray(benchmark.configurations) || benchmark.configurations.length < 2) fail('lime benchmark requires baseline and candidate configurations')
if (!Array.isArray(benchmark.tasks) || benchmark.tasks.length === 0) fail('lime benchmark requires tasks')
if (!Array.isArray(benchmark.trials) || benchmark.trials.length === 0) fail('lime benchmark requires trials')
for (const task of benchmark.tasks) {
  if (!task.id) fail('lime benchmark task requires id')
  if (task.project_profile && !profiles.has(task.project_profile)) fail(`lime benchmark task has unknown profile ${task.project_profile}`)
  if (task.surface && !surfaces.has(task.surface)) fail(`lime benchmark task has unknown surface ${task.surface}`)
  if (!task.harbor_task?.task_dir || !task.harbor_task?.task_toml_ref) fail(`${task.id} requires Harbor task refs`)
  if (!task.verifier_contract?.kind || !task.verifier_contract?.reward_ref) fail(`${task.id} requires verifier contract and reward ref`)
  if (!task.trajectory_contract?.ref || !task.trajectory_contract?.schema) fail(`${task.id} requires trajectory contract`)
  checkGateList('lime-benchmark-experiment.json', task.id, task.required_gates)
}
for (const trial of benchmark.trials) {
  for (const key of ['trial_id', 'task_id', 'configuration_id', 'status']) {
    if (!trial[key]) fail(`lime benchmark trial is missing ${key}`)
  }
  if (!Array.isArray(trial.evidence_refs) || trial.evidence_refs.length === 0) fail(`${trial.trial_id} requires evidence refs`)
  if (!trial.harbor_trial_ref || !trial.artifact_manifest_ref) fail(`${trial.trial_id} requires Harbor trial and artifact refs`)
  if (!trial.runtime_correlation?.sessionId || !trial.runtime_correlation?.runId) fail(`${trial.trial_id} requires runtime correlation`)
}
if (!benchmark.decision?.outcome) fail('lime benchmark requires a decision outcome')

if (process.exitCode) process.exit(process.exitCode)
console.log('Agent QC examples validated')
