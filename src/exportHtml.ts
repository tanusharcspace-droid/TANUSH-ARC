/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CourseSpecification } from './types';

export function generateSpecHtml(spec: CourseSpecification): string {
  const safeStr = (v: any) => (v !== undefined && v !== null ? String(v) : '');

  const poKeys = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'];
  const psoKeys = ['PSO1', 'PSO2', 'PSO3'];

  const cloRows = (spec.clos || [])
    .map(
      (clo) => `
      <tr>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #1e1b4b;">${safeStr(clo.code)}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; line-height: 1.5;">${safeStr(clo.statement)}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: center; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; color: #4338ca;">${safeStr(clo.bloomsLevel)}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-size: 11px; color: #475569;">${(clo.assessmentMethods || []).join(', ')}</td>
      </tr>`
    )
    .join('');

  const matrixRows = (spec.clos || [])
    .map((clo) => {
      const poTds = poKeys
        .map(
          (po) =>
            `<td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; font-family: ui-monospace, monospace; font-weight: ${(clo.poMappings?.[po] || 0) > 0 ? '700' : 'normal'}; color: ${(clo.poMappings?.[po] || 0) > 0 ? '#1e1b4b' : '#94a3b8'}; background: ${(clo.poMappings?.[po] || 0) > 0 ? '#eef2ff' : 'transparent'};">${clo.poMappings?.[po] || '-'}</td>`
        )
        .join('');
      const psoTds = psoKeys
        .map(
          (pso) =>
            `<td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; font-family: ui-monospace, monospace; font-weight: ${(clo.psoMappings?.[pso] || 0) > 0 ? '700' : 'normal'}; color: ${(clo.psoMappings?.[pso] || 0) > 0 ? '#047857' : '#94a3b8'}; background: ${(clo.psoMappings?.[pso] || 0) > 0 ? '#ecfdf5' : 'transparent'};">${clo.psoMappings?.[pso] || '-'}</td>`
        )
        .join('');
      return `<tr>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 700; font-family: ui-monospace, monospace; color: #1e1b4b;">${safeStr(clo.code)}</td>
        ${poTds}
        ${psoTds}
      </tr>`;
    })
    .join('');

  const unitRows = (spec.units || [])
    .map(
      (u) => `
      <div style="margin-bottom: 16px; padding: 14px 18px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
          <strong style="font-size: 14px; color: #0f172a;">${safeStr(u.unitRoman)}: ${safeStr(u.title)}</strong>
          <span style="font-size: 11px; font-family: ui-monospace, monospace; background: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 9999px; font-weight: 600;">
            ${safeStr(u.lectureHours)} Hours • Tier: ${safeStr(u.bloomsTier)}
          </span>
        </div>
        <p style="margin: 0; font-size: 12px; color: #334155; line-height: 1.6;">${safeStr(u.content)}</p>
      </div>`
    )
    .join('');

  const labRows = (spec.labSchedule || [])
    .map(
      (lab) => `
      <tr style="font-size: 12px;">
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; width: 80px; text-align: center; font-family: monospace;">Exp ${safeStr(lab.id)}</td>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #1e293b;">${safeStr(lab.title)}</td>
      </tr>`
    )
    .join('');

  const auditRows = (spec.auditTrail || [])
    .map(
      (a) => `
      <tr style="font-size: 11px;">
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-family: ui-monospace, monospace; color: #475569;">${safeStr(a.timestamp)}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600; color: #1e293b;">${safeStr(a.actor)} (${safeStr(a.role)})</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 500; color: #2563eb;">${safeStr(a.action)}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; color: #475569;">${safeStr(a.rationale)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeStr(spec.code || 'Course')} - Accredited Course Specification Dossier</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px 16px;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .header-banner {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .inst-title {
      font-size: 20px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #0f172a;
    }
    .inst-sub {
      font-size: 13px;
      color: #475569;
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-type {
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      color: #4338ca;
      margin-top: 8px;
    }
    .grid-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px 20px;
      background: #f1f5f9;
      padding: 20px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-bottom: 28px;
      font-size: 12px;
    }
    .meta-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; }
    .meta-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    .meta-val { font-weight: 700; color: #0f172a; font-family: ui-monospace, monospace; }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-left: 4px solid #4f46e5;
      padding-left: 12px;
      margin: 32px 0 14px 0;
      color: #1e1b4b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      border: 1px solid #0f172a;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 2px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
      font-family: ui-monospace, monospace;
      flex-wrap: wrap;
      gap: 12px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      font-family: ui-monospace, monospace;
    }
    .badge-approved { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .badge-draft { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <div class="inst-title">Autonomous Institute of Technology & Engineering</div>
      <div class="inst-sub">${safeStr(spec.department)} • ${safeStr(spec.program)}</div>
      <div class="doc-type">OFFICIAL ACCREDITED COURSE SPECIFICATION (spec.html)</div>
    </div>

    <div class="grid-meta">
      <div class="meta-item"><span class="meta-label">Course Code:</span><span class="meta-val">${safeStr(spec.code)}</span></div>
      <div class="meta-item"><span class="meta-label">Regulation / Batch:</span><span class="meta-val">${safeStr(spec.regulation)} (${safeStr(spec.academicYear)})</span></div>
      <div class="meta-item"><span class="meta-label">Course Title:</span><span class="meta-val">${safeStr(spec.title)}</span></div>
      <div class="meta-item">
        <span class="meta-label">Status:</span>
        <span class="badge ${spec.status === 'approved' ? 'badge-approved' : 'badge-draft'}">${safeStr(spec.status).toUpperCase()}</span>
      </div>
      <div class="meta-item"><span class="meta-label">Credits (L:T:P):</span><span class="meta-val">${safeStr(spec.credits?.lecture)}:${safeStr(spec.credits?.tutorial)}:${safeStr(spec.credits?.practical)} (Total: ${safeStr(spec.credits?.total)})</span></div>
      <div class="meta-item"><span class="meta-label">Contact Hours:</span><span class="meta-val">${safeStr(spec.credits?.contactHours || 0)} Hours</span></div>
      <div class="meta-item"><span class="meta-label">Ingested Course Spec:</span><span class="meta-val">${safeStr(spec.synthesisFiles?.specDoc?.name || 'Uploaded')}</span></div>
      <div class="meta-item"><span class="meta-label">Question Blueprint:</span><span class="meta-val">${safeStr(spec.synthesisFiles?.blueprintDoc?.name || 'Uploaded')}</span></div>
    </div>

    <div class="section-title">1. Course Objectives</div>
    <ol style="font-size: 13px; color: #334155; line-height: 1.7; margin-left: 20px;">
      ${(spec.courseObjectives || []).length > 0 ? spec.courseObjectives.map((obj) => `<li>${safeStr(obj)}</li>`).join('') : '<li>No course objectives specified.</li>'}
    </ol>

    <div class="section-title">2. Course Learning Outcomes (CLOs) & Bloom Taxonomy</div>
    <table>
      <thead>
        <tr>
          <th style="width: 12%;">CLO Code</th>
          <th style="width: 54%;">Outcome Statement</th>
          <th style="width: 14%;">Bloom Level</th>
          <th style="width: 20%;">Assessment Methods</th>
        </tr>
      </thead>
      <tbody>
        ${cloRows || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8;">No CLOs defined</td></tr>'}
      </tbody>
    </table>

    <div class="section-title">3. Program Outcome (PO) & PSO Correlation Matrix</div>
    <div style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th style="width: 10%;">CLO</th>
            ${poKeys.map((p) => `<th style="width: 5%;">${p}</th>`).join('')}
            ${psoKeys.map((p) => `<th style="width: 6%; background: #334155;">${p}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${matrixRows || '<tr><td colspan="16" style="padding: 12px; text-align: center; color: #94a3b8;">No mapping matrix defined</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="section-title">4. Syllabus Units & Lecture Breakdown</div>
    <div>
      ${unitRows || '<p style="color: #94a3b8; font-size: 12px;">No syllabus units recorded.</p>'}
    </div>

    ${
      (spec.labSchedule || []).length > 0
        ? `
    <div class="section-title">5. Laboratory Experiments Schedule</div>
    <table>
      <thead>
        <tr>
          <th>Exp #</th>
          <th>Experiment Title</th>
        </tr>
      </thead>
      <tbody>
        ${labRows}
      </tbody>
    </table>`
        : ''
    }

    <div class="section-title">6. Institutional Governance & Audit Trail</div>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Timestamp</th>
          <th style="width: 22%;">Actor & Role</th>
          <th style="width: 25%;">Action</th>
          <th style="width: 35%;">Compliance Rationale</th>
        </tr>
      </thead>
      <tbody>
        ${auditRows || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8;">No audit records recorded.</td></tr>'}
      </tbody>
    </table>

    <div class="footer">
      <div>AUTHENTICATION SEAL: ${safeStr(spec.governanceQuorum?.digitalSignature || 'ED25519-SIG-RATIFIED')}</div>
      <div>CREATED BY TANUSH M D</div>
    </div>
  </div>
</body>
</html>`;
}
