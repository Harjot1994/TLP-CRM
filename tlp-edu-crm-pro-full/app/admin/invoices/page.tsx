import { listInvoices, createInvoice, addPayment } from '@/app/actions.core'
import { serverClient } from '@/lib/supabaseServer'

export default async function Page(){
  const supa = serverClient()
  const { data: enrollments } = await supa.from('enrollments').select('id, students(first_name,last_name)')
  const invoices = await listInvoices()
  async function addInv(fd: FormData){ 'use server'; await createInvoice(fd) }
  async function addPay(fd: FormData){ 'use server'; await addPayment(fd) }

  return (<div className='grid gap-6'>
    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Create Invoice</div>
      <form action={addInv} className='grid md:grid-cols-3 gap-3'>
        <input name='id' className='input' placeholder='Invoice ID (INV-5001)' required/>
        <select name='enrollment_id' className='select' required>
          <option value=''>— Select Enrollment —</option>
          {(enrollments||[]).map((e:any)=>(<option key={e.id} value={e.id}>{e.id} — {e.students?.first_name} {e.students?.last_name}</option>))}
        </select>
        <input name='issue_date' type='date' className='input' required/>
        <input name='due_date' type='date' className='input' required/>
        <input name='amount_due' className='input' placeholder='Amount Due' required/>
        <textarea name='notes' className='input md:col-span-3' placeholder='Notes'/>
        <div className='md:col-span-3'><button className='btn btn-primary'>Save Invoice</button></div>
      </form>
    </div>

    <div className='card p-4'>
      <div className='text-lg font-semibold mb-3'>Invoices</div>
      <div className='overflow-auto rounded-xl'>
        <table className='min-w-[1000px] w-full text-sm'>
          <thead className='bg-slate-50'><tr className='text-left'>
            {['Invoice','Enrollment','Student','Issue','Due','Amount','Paid','Status','Add Payment'].map(h=>(<th key={h} className='px-3 py-2 font-medium text-slate-700 border-b'>{h}</th>))}
          </tr></thead>
          <tbody>
            {invoices.map((i:any)=>(<tr key={i.id} className='hover:bg-slate-50'>
              <td className='px-3 py-2 border-b'>{i.id}</td>
              <td className='px-3 py-2 border-b'>{i.enrollment_id}</td>
              <td className='px-3 py-2 border-b'>{i.enrollments?.students?.first_name} {i.enrollments?.students?.last_name}</td>
              <td className='px-3 py-2 border-b'>{i.issue_date}</td>
              <td className='px-3 py-2 border-b'>{i.due_date}</td>
              <td className='px-3 py-2 border-b'>${i.amount_due}</td>
              <td className='px-3 py-2 border-b'>${i.amount_paid || 0}</td>
              <td className='px-3 py-2 border-b'><span className='badge'>{i.status}</span></td>
              <td className='px-3 py-2 border-b'>
                <form action={addPay} className='flex gap-2 items-center'>
                  <input type='hidden' name='id' defaultValue={`PM-${Math.floor(Math.random()*9000)+1000}` as any} />
                  <input type='hidden' name='invoice_id' defaultValue={i.id} />
                  <input name='paid_date' type='date' className='input w-40' required />
                  <input name='amount' className='input w-28' placeholder='$' required />
                  <input name='method' className='input w-28' placeholder='Method' />
                  <input name='txn_ref' className='input w-40' placeholder='Txn Ref' />
                  <button className='btn btn-outline'>Add</button>
                </form>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  </div>)
}
