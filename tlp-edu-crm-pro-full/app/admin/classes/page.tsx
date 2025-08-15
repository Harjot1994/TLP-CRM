import { listClasses, createClass, listTeachers, createEnrollment, listStudents } from '@/app/actions.core'
export default async function Page(){
  const [classes, teachers, students] = await Promise.all([listClasses(), listTeachers(), listStudents()])
  async function addClass(fd: FormData){ 'use server'; await createClass(fd) }
  async function addEnroll(fd: FormData){ 'use server'; await createEnrollment(fd) }
  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Create Class</div>
      <form action={addClass} className='grid md:grid-cols-3 gap-3'>
        <input name='id' className='input' placeholder='Class ID (CL-2001)' required/>
        <input name='name' className='input' placeholder='Display Name' required/>
        <input name='program_name' className='input' placeholder='Program' required/>
        <input name='section' className='input' placeholder='Section'/>
        <input name='mode' className='input' placeholder='Mode'/>
        <input name='days' className='input' placeholder='Days'/>
        <input name='time' className='input' placeholder='Time'/>
        <input name='start_date' className='input' placeholder='Start Date (YYYY-MM-DD)'/>
        <input name='end_date' className='input' placeholder='End Date (YYYY-MM-DD)'/>
        <input name='location' className='input' placeholder='Location'/>
        <select name='teacher_id' className='select' required>
          <option value=''>— Select Teacher —</option>
          {teachers.map((t:any)=>(<option key={t.id} value={t.id}>{t.name}</option>))}
        </select>
        <input name='capacity' className='input' placeholder='Capacity'/>
        <div className='md:col-span-3'><button className='btn btn-primary'>Save Class</button></div>
      </form>
    </div>

    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Enroll a Student</div>
      <form action={addEnroll} className='grid md:grid-cols-3 gap-3'>
        <input name='id' className='input' placeholder='Enrollment ID (EN-3001)' required/>
        <select name='student_id' className='select' required>
          <option value=''>— Select Student —</option>
          {students.map((s:any)=>(<option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.id})</option>))}
        </select>
        <select name='class_id' className='select' required>
          <option value=''>— Select Class —</option>
          {classes.map((c:any)=>(<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <input name='start_date' className='input' placeholder='Start Date (YYYY-MM-DD)'/>
        <input name='end_date' className='input' placeholder='End Date (YYYY-MM-DD)'/>
        <input name='price' className='input' placeholder='Price'/>
        <input name='discount' className='input' placeholder='Discount'/>
        <input name='payment_plan' className='input' placeholder='Payment Plan'/>
        <select name='status' className='select' defaultValue='Active'>{['Active','Completed','Cancelled'].map(s=>(<option key={s} value={s}>{s}</option>))}</select>
        <div className='md:col-span-3'><button className='btn btn-outline'>Save Enrollment</button></div>
      </form>
    </div>

    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Classes</div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
        {classes.map((c:any)=>(<div key={c.id} className='rounded-2xl border bg-white p-4'>
          <div className='flex items-center justify-between'><div className='font-semibold'>{c.name}</div><span className='badge'>{c.mode}</span></div>
          <div className='text-sm text-slate-700 mt-1'>{c.program_name} • {c.section}</div>
          <div className='text-sm text-slate-700'>{c.days} • {c.time}</div>
          <div className='text-xs text-slate-500'>{c.start_date} → {c.end_date}</div>
          <div className='text-sm mt-2'>Teacher: <span className='font-medium'>{c.teachers?.name}</span></div>
        </div>))}
      </div>
    </div>
  </div>)
}
