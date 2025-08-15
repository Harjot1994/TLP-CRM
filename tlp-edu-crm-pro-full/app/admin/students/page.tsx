import { listStudents, createStudent, listParents } from '@/app/actions.core'
export default async function Page(){
  const [students, parents] = await Promise.all([listStudents(), listParents()])
  async function add(fd: FormData){ 'use server'; await createStudent(fd) }
  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Add Student</div>
      <form action={add} className='grid md:grid-cols-3 gap-3'>
        <input name='id' className='input' placeholder='Student ID (ST-1001)' required/>
        <input name='first_name' className='input' placeholder='First Name' required/>
        <input name='last_name' className='input' placeholder='Last Name' required/>
        <input name='grade' className='input' placeholder='Grade'/>
        <input name='school' className='input' placeholder='School'/>
        <input name='dob' className='input' placeholder='DOB (YYYY-MM-DD)'/>
        <select name='parent_id' className='select' required>
          <option value=''>— Select Parent —</option>
          {parents.map((p:any)=>(<option key={p.id} value={p.id}>{p.id} — {p.name}</option>))}
        </select>
        <select name='status' className='select' defaultValue='current'>{['current','past','future'].map(s=>(<option key={s} value={s}>{s}</option>))}</select>
        <div className='md:col-span-3'><button className='btn btn-primary'>Save Student</button></div>
      </form>
    </div>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Students</div>
      <div className='overflow-auto'><table className='min-w-[900px] w-full text-sm'>
        <thead className='bg-slate-50'><tr className='text-left'>{['ID','Name','Grade','Status','Parent','Email','Phone'].map(h=>(<th key={h} className='px-3 py-2 border-b text-left'>{h}</th>))}</tr></thead>
        <tbody>{students.map((s:any)=>(<tr key={s.id}>
          <td className='px-3 py-2 border-b'>{s.id}</td>
          <td className='px-3 py-2 border-b'>{s.first_name} {s.last_name}</td>
          <td className='px-3 py-2 border-b'>{s.grade}</td>
          <td className='px-3 py-2 border-b'>{s.status}</td>
          <td className='px-3 py-2 border-b'>{s.parents?.name}</td>
          <td className='px-3 py-2 border-b'>{s.parents?.email}</td>
          <td className='px-3 py-2 border-b'>{s.parents?.phone}</td>
        </tr>))}</tbody>
      </table></div>
    </div>
  </div>)
}
