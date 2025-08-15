import { serverClient } from '@/lib/supabaseServer'
export const dynamic = 'force-dynamic'

export default async function Diag() {
  let messages: string[] = []
  let canSelect = 'unknown', canInsert = 'unknown'
  try {
    const s = serverClient()
    messages.push('serverClient OK (envs loaded)')
    const { error: selErr } = await s.from('teachers').select('id').limit(1)
    canSelect = selErr ? 'NO' : 'YES'
    if (selErr) messages.push('SELECT failed: ' + selErr.message)

    const testId = 'TC-DIAG-' + Math.floor(Math.random() * 100000)
    const { error: insErr } = await s.from('teachers').insert({ id: testId, name: 'Diag', email: '', phone: '' } as any)
    if (insErr) { canInsert = 'NO'; messages.push('INSERT failed: ' + insErr.message) }
    else { canInsert = 'YES'; messages.push('INSERT ok'); await s.from('teachers').delete().eq('id', testId) }
  } catch (e: any) {
    messages.push('serverClient ERROR: ' + (e?.message || String(e)))
  }

  return (
    <div style={{padding:20,fontFamily:'ui-sans-serif,system-ui'}}>
      <h1 style={{fontSize:20,fontWeight:700}}>Diagnostics</h1>
      <ul style={{marginTop:12,lineHeight:'1.6'}}>
        <li><b>Can SELECT teachers?</b> {canSelect}</li>
        <li><b>Can INSERT teacher?</b> {canInsert}</li>
      </ul>
      <pre style={{marginTop:16,background:'#111827',color:'#e5e7eb',padding:12,borderRadius:8,whiteSpace:'pre-wrap'}}>
{messages.join('\n')}
      </pre>
    </div>
  )
}

