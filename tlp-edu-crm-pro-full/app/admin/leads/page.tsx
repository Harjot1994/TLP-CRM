import { listLeads, createLead, updateLeadStatus } from '@/app/actions.leads'

function Status({ id, value }: { id: string, value: string }){
  async function onChange(formData: FormData){ 'use server'; await updateLeadStatus(id, String(formData.get('status'))) }
  return (<form action={onChange}><select name='status' defaultValue={value} className='select'>
    {['New','Contacted','Qualified','Booked Counselling','No Answer','Not Interested','Converted'].map(s=><option key={s} value={s}>{s}</option>)}
  </select></form>)
}

export default async function Page(){
  const leads = await listLeads()
  async function add(fd: FormData){ 'use server'; await createLead(fd) }
  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Add Lead</div>
      <form action={add} className='grid md:grid-cols-3 gap-3'>
        <input type='hidden' name='id' defaultValue={`L-${Math.floor(Math.random()*9000)+1000}` as any} />
        <input name='parent_name' className='input' placeholder='Parent *' required/>
        <input name='phone' className='input' placeholder='Phone *' required/>
        <input name='email' className='input' placeholder='Email'/>
        <input name='child_name' className='input' placeholder='Child *' required/>
        <input name='child_grade' className='input' placeholder='Grade'/>
        <input name='program_interest' className='input' placeholder='Program'/>
        <input name='city' className='input' placeholder='City'/>
        <input name='owner' className='input' placeholder='Owner' defaultValue='Owner'/>
        <input name='source' className='input' placeholder='Source'/>
        <input name='campaign' className='input' placeholder='Campaign'/>
        <select name='status' className='select'>{['New','Contacted','Qualified','Booked Counselling','No Answer','Not Interested','Converted'].map(s=><option key={s} value={s}>{s}</option>)}</select>
        <textarea name='notes' className='input md:col-span-3' placeholder='Notes'/>
        <div className='md:col-span-3'><button className='btn btn-primary'>Save Lead</button></div>
      </form>
    </div>

    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Leads</div>
      <div className='overflow-auto'>
        <table className='min-w-[1000px] w-full text-sm'>
          <thead className='bg-slate-50'><tr className='text-left'>
            {['ID','Parent','Child','Grade','Program','Owner','Source','Status','Created','City','Email','Phone','Notes'].map(h=><th key={h} className='px-3 py-2 border-b text-left'>{h}</th>)}
          </tr></thead>
          <tbody>{leads.map((l:any)=>(<tr key={l.id}>
            <td className='px-3 py-2 border-b'>{l.id}</td>
            <td className='px-3 py-2 border-b'>{l.parent_name}</td>
            <td className='px-3 py-2 border-b'>{l.child_name}</td>
            <td className='px-3 py-2 border-b'>{l.child_grade}</td>
            <td className='px-3 py-2 border-b'>{l.program_interest}</td>
            <td className='px-3 py-2 border-b'>{l.owner}</td>
            <td className='px-3 py-2 border-b'>{l.source}</td>
            <td className='px-3 py-2 border-b'><Status id={l.id} value={l.status}/></td>
            <td className='px-3 py-2 border-b'>{new Date(l.created_at).toLocaleDateString()}</td>
            <td className='px-3 py-2 border-b'>{l.city}</td>
            <td className='px-3 py-2 border-b'>{l.email}</td>
            <td className='px-3 py-2 border-b'>{l.phone}</td>
            <td className='px-3 py-2 border-b truncate max-w-[240px]' title={l.notes}>{l.notes}</td>
          </tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>)
}
