import { listParents, createParent } from '@/app/actions.core'
export default async function Page(){
  const parents = await listParents()
  async function add(fd: FormData){ 'use server'; await createParent(fd) }
  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Add Parent</div>
      <form action={add} className='grid md:grid-cols-2 gap-3'>
        <input name='id' className='input' placeholder='Parent ID (PR-1001)' required/>
        <input name='name' className='input' placeholder='Name' required/>
        <input name='phone' className='input' placeholder='Phone' required/>
        <input name='email' className='input' placeholder='Email'/>
        <input name='address' className='input' placeholder='Address'/>
        <input name='preferred_channel' className='input' placeholder='Preferred Channel'/>
        <div className='md:col-span-2'><button className='btn btn-primary'>Save Parent</button></div>
      </form>
    </div>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Parents</div>
      <div className='overflow-auto'>
        <table className='min-w-[800px] w-full text-sm'>
          <thead className='bg-slate-50'><tr className='text-left'>{['ID','Name','Phone','Email','Preferred'].map(h=>(<th key={h} className='px-3 py-2 border-b text-left'>{h}</th>))}</tr></thead>
          <tbody>{parents.map((p:any)=>(<tr key={p.id}>
            <td className='px-3 py-2 border-b'>{p.id}</td><td className='px-3 py-2 border-b'>{p.name}</td>
            <td className='px-3 py-2 border-b'>{p.phone}</td><td className='px-3 py-2 border-b'>{p.email}</td>
            <td className='px-3 py-2 border-b'>{p.preferred_channel}</td>
          </tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>)
}
