import { listTeachers, createTeacher } from '@/app/actions.core'
export default async function Page(){
  const teachers = await listTeachers()
  async function add(fd: FormData){ 'use server'; await createTeacher(fd) }
  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Add Teacher</div>
      <form action={add} className='grid md:grid-cols-2 gap-3'>
        <input name='id' className='input' placeholder='Teacher ID (TC-1001)' required/>
        <input name='name' className='input' placeholder='Name' required/>
        <input name='email' className='input' placeholder='Email'/>
        <input name='phone' className='input' placeholder='Phone'/>
        <div className='md:col-span-2'><button className='btn btn-primary'>Save Teacher</button></div>
      </form>
    </div>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Teachers</div>
      <div className='overflow-auto'><table className='min-w-[700px] w-full text-sm'>
        <thead className='bg-slate-50'><tr className='text-left'>{['ID','Name','Email','Phone'].map(h=>(<th key={h} className='px-3 py-2 border-b text-left'>{h}</th>))}</tr></thead>
        <tbody>{teachers.map((t:any)=>(<tr key={t.id}><td className='px-3 py-2 border-b'>{t.id}</td><td className='px-3 py-2 border-b'>{t.name}</td><td className='px-3 py-2 border-b'>{t.email}</td><td className='px-3 py-2 border-b'>{t.phone}</td></tr>))}</tbody>
      </table></div>
    </div>
  </div>)
}
