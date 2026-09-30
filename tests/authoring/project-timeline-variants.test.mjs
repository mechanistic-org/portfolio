import test from 'node:test';
import assert from 'node:assert/strict';
import { selectAuthoredTimeline } from '../../src/utils/projectTimeline.mjs';

const event = {id:'SAT-01',date:'2017-02-14',date_label:'2017-02-14',title:'Hinge and display-clearance changes',summary:'The report proposes fuller engagement. Credit: Shared engineering report.',phase:'main',prominence:'prominent',source_ids:['EV-c2a8f9e1ac32']};
const chronology = {events:[event],phases:[{id:'main',label:'Development sequence'}],clusters:[]};
const row = `<strong>${event.date_label} - ${event.title}.</strong> ${event.summary}`;
const heading = '<h2 id="proposed-development-timeline">Proposed development timeline</h2>';

for (const paragraph of [false,true]) test(`Noon proposed timeline binds exact ${paragraph?'paragraph':'compact'} row into visual reference`,()=>{
  const html=`<p>Approved narrative.</p>${heading}<ul><li>${paragraph?`<p>${row}</p>`:row}</li></ul>`;
  const selected=selectAuthoredTimeline([{html}],chronology);
  assert.equal(selected.referenceId,'proposed-development-timeline');
  assert.match(selected.referenceHtml,/data-timeline-reference-event="SAT-01"/);
  assert.equal(selected.pieces.filter(p=>p.timeline).length,1);
  assert.equal(selected.pieces.filter(p=>p.html).map(p=>p.html).join(''),'<p>Approved narrative.</p>');
});
test('Noon mapping fails closed when a reviewed summary changes',()=>{
  assert.throws(()=>selectAuthoredTimeline([{html:heading+`<ul><li>${row.replace('proposes','proves')}</li></ul>`}],chronology),/exact narrative identity/);
});
test('renderer apostrophe substitution binds while preserving the visible HTML',()=>{
  const record={...event,summary:"The base station's requirements."};
  const html=heading+`<ul><li><strong>${record.date_label} - ${record.title}.</strong> The base station’s requirements.</li></ul>`;
  const selected=selectAuthoredTimeline([{html}],{...chronology,events:[record]});
  assert.match(selected.referenceHtml,/base station’s requirements/);
  assert.match(selected.referenceHtml,/data-timeline-reference-event="SAT-01"/);
});

test('accepted colon-separated date/title binds without changing reader prose',()=>{
  const record={...event,date:'2008-05',date_label:'May-June 2008',title:'Samples and interfaces'};
  const html=heading+`<ul><li><strong>${record.date_label}: ${record.title}.</strong> ${record.summary}</li></ul>`;
  const selected=selectAuthoredTimeline([{html}],{...chronology,events:[record]});
  assert.match(selected.referenceHtml,/May-June 2008: Samples and interfaces\./);
  assert.match(selected.referenceHtml,/data-timeline-reference-event="SAT-01"/);
  assert.throws(()=>selectAuthoredTimeline([{html:html.replace('Samples and interfaces','Finished production')}],{...chronology,events:[record]}),/exact narrative identity/);
});
