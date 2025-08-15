import { listClasses } from '@/app/actions.core'
import { serverClient } from '@/lib/supabaseServer'
import { recordAttendance } from '@/app/actions.core'
import Link from 'next/link'

export default async function Page({ searchParams }: { searchParams: { class?: string } }){
  const classes = await listClasses()
  const classId = searchParams.class || (classes[0]?.id || '')
  const supa = serverClient()
  let students:any[] = []
  if (classId) {
    const { data } = await supa.from('enrollments').select('students(*), class_id').eq('class_id', classId)
    students = (data||[]).map((e:any)=>e.students)
  }

  async function save(formData: FormData){ 'use server'; await recordAttendance(formData) }

  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Select Class</div>
      <div className='flex flex-wrap gap-2'>
        {classes.map((c:any)=>(<Link key={c.id} href={`/admin/attendance?class=${c.id}`} className={`btn ${c.id===classId?'btn-primary':'btn-outline'}`}>{c.name}</Link>))}
      </div>
    </div>

    {classId ? (
      <div className='card p-4'>
        <div className='text-lg font-semibold mb-3'>Mark Attendance</div>
        <form action={save} className='grid gap-3'>
          <input type='hidden' name='class_id' defaultValue={classId} />
          <input name='date' type='date' className='input w-48' required />
          <div className='overflow-auto rounded-xl'>
            <table className='min-w-[700px] w-full text-sm'>
              <thead className='bg-slate-50'><tr className='text-left'>
                {['Student ID','Student','Status'].map(h=>(<th key={h} className='px-3 py-2 font-medium text-slate-700 border-b'>{h}</th>))}
              </tr></thead>
              <tbody>
                {students.map((s:any)=>(<tr key={s.id}>
                  <td className='px-3 py-2 border-b'>{s.id}</td>
                  <td className='px-3 py-2 border-b'>{s.first_name} {s.last_name}</td>
                  <td className='px-3 py-2 border-b'>
                    <select name={`status_${s.id}`} className='select'>
                      <option value=''>—</option>
                      {['Present','Absent','Late','Makeup'].map(v=>(<option key={v} value={v}>{v}</option>))}
                    </select>
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
          <div><button className='btn btn-primary'>Save Attendance</button></div>
        </form>
        <p className='text-xs text-slate-500 mt-2'>On every 8th Present, if balance exists, a fee reminder email is sent (when RESEND_API_KEY is set).</p>
      </div>
    ) : null}
  </div>)
}
