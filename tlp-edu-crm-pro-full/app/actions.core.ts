'use server'
import { z } from 'zod'
import { serverClient } from '@/lib/supabaseServer'
import { sendEmail } from '@/lib/email'

// Parents
const Parent=z.object({id:z.string().min(2),name:z.string().min(1),phone:z.string().min(5),email:z.string().optional().or(z.literal('')),address:z.string().optional().or(z.literal('')),preferred_channel:z.string().optional().or(z.literal('')),})
export async function listParents(){const s=serverClient();const {data,error}=await s.from('parents').select('*').order('created_at',{ascending:false});if(error)throw error;return data}
export async function createParent(fd:FormData){const p=Parent.parse({id:fd.get('id'),name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email')||'',address:fd.get('address')||'',preferred_channel:fd.get('preferred_channel')||'',});const s=serverClient();const {error}=await s.from('parents').insert(p as any);if(error)throw error}

// Students
const Student=z.object({id:z.string().min(2),first_name:z.string().min(1),last_name:z.string().min(1),grade:z.string().optional().or(z.literal('')),school:z.string().optional().or(z.literal('')),dob:z.string().optional().or(z.literal('')),parent_id:z.string().min(2),status:z.enum(['current','past','future']).default('current'),})
export async function listStudents(){const s=serverClient();const {data,error}=await s.from('students').select('*, parents(*)').order('created_at',{ascending:false});if(error)throw error;return data}
export async function createStudent(fd:FormData){const x=Student.parse({id:fd.get('id'),first_name:fd.get('first_name'),last_name:fd.get('last_name'),grade:fd.get('grade')||'',school:fd.get('school')||'',dob:fd.get('dob')||'',parent_id:fd.get('parent_id'),status:fd.get('status')||'current',});const s=serverClient();const {error}=await s.from('students').insert(x as any);if(error)throw error}

// Teachers
const Teacher=z.object({id:z.string().min(2),name:z.string().min(1),email:z.string().optional().or(z.literal('')),phone:z.string().optional().or(z.literal('')),})
export async function listTeachers(){const s=serverClient();const {data,error}=await s.from('teachers').select('*').order('created_at',{ascending:false});if(error)throw error;return data}
export async function createTeacher(fd:FormData){const t=Teacher.parse({id:fd.get('id'),name:fd.get('name'),email:fd.get('email')||'',phone:fd.get('phone')||'',});const s=serverClient();const {error}=await s.from('teachers').insert(t as any);if(error)throw error}

// Classes
const Class=z.object({id:z.string().min(2),name:z.string().min(1),program_name:z.string().min(1),section:z.string().optional().or(z.literal('')),mode:z.string().optional().or(z.literal('')),days:z.string().optional().or(z.literal('')),time:z.string().optional().or(z.literal('')),start_date:z.string().optional().or(z.literal('')),end_date:z.string().optional().or(z.literal('')),location:z.string().optional().or(z.literal('')),teacher_id:z.string().min(2),capacity:z.number().or(z.string()).optional(),})
export async function listClasses(){const s=serverClient();const {data,error}=await s.from('classes').select('*, teachers(*)').order('start_date',{ascending:true});if(error)throw error;return data}
export async function createClass(fd:FormData){const c=Class.parse({id:fd.get('id'),name:fd.get('name'),program_name:fd.get('program_name'),section:fd.get('section')||'',mode:fd.get('mode')||'',days:fd.get('days')||'',time:fd.get('time')||'',start_date:fd.get('start_date')||'',end_date:fd.get('end_date')||'',location:fd.get('location')||'',teacher_id:fd.get('teacher_id'),capacity:Number(fd.get('capacity')||0),});const s=serverClient();const {error}=await s.from('classes').insert(c as any);if(error)throw error}

// Enrollments
const Enroll=z.object({id:z.string().min(2),student_id:z.string().min(2),class_id:z.string().min(2),start_date:z.string().optional().or(z.literal('')),end_date:z.string().optional().or(z.literal('')),price:z.number().or(z.string()).optional(),discount:z.number().or(z.string()).optional(),payment_plan:z.string().optional().or(z.literal('')),status:z.string().optional().or(z.literal('Active')),})
export async function createEnrollment(fd:FormData){const e=Enroll.parse({id:fd.get('id'),student_id:fd.get('student_id'),class_id:fd.get('class_id'),start_date:fd.get('start_date')||'',end_date:fd.get('end_date')||'',price:Number(fd.get('price')||0),discount:Number(fd.get('discount')||0),payment_plan:fd.get('payment_plan')||'',status:fd.get('status')||'Active',});const s=serverClient();const {error}=await s.from('enrollments').insert(e as any);if(error)throw error}

// Invoices / Payments
const Invoice=z.object({id:z.string().min(2),enrollment_id:z.string().min(2),issue_date:z.string(),due_date:z.string(),amount_due:z.number().or(z.string()),notes:z.string().optional().or(z.literal(''))})
export async function listInvoices(){const s=serverClient();const {data,error}=await s.from('invoices').select('*, enrollments(*, students(*, parents(*)))').order('due_date',{ascending:true});if(error)throw error;return data}
export async function createInvoice(fd:FormData){
  const i=Invoice.parse({id:fd.get('id'),enrollment_id:fd.get('enrollment_id'),issue_date:fd.get('issue_date'),due_date:fd.get('due_date'),amount_due:Number(fd.get('amount_due')),notes:fd.get('notes')||''})
  const s=serverClient()
  const { error } = await s.from('invoices').insert({ ...i, amount_paid: 0, status: 'Due' } as any)
  if (error) throw error
}
const Payment=z.object({id:z.string().min(2),invoice_id:z.string().min(2),paid_date:z.string(),amount:z.number().or(z.string()),method:z.string().optional().or(z.literal('')),txn_ref:z.string().optional().or(z.literal('')),notes:z.string().optional().or(z.literal('')),})
export async function addPayment(fd:FormData){
  const p=Payment.parse({id:fd.get('id'),invoice_id:fd.get('invoice_id'),paid_date:fd.get('paid_date'),amount:Number(fd.get('amount')),method:fd.get('method')||'',txn_ref:fd.get('txn_ref')||'',notes:fd.get('notes')||'',})
  const s=serverClient()
  const ins = await s.from('payments').insert(p as any)
  if (ins.error) throw ins.error

  // Sum all payments for this invoice
  const { data: pays, error: e1 } = await s.from('payments').select('amount').eq('invoice_id', p.invoice_id)
  if (e1) throw e1
  const paid = (pays || []).reduce((sum, row:any) => sum + Number(row.amount || 0), 0)

  // Get invoice amount_due
  const { data: inv, error: e2 } = await s.from('invoices').select('amount_due').eq('id', p.invoice_id).single()
  if (e2) throw e2
  const amount_due = Number(inv?.amount_due || 0)
  const status = paid >= amount_due ? 'Paid' : (paid > 0 ? 'Partial' : 'Due')

  const upd = await s.from('invoices').update({ amount_paid: paid, status }).eq('id', p.invoice_id)
  if (upd.error) throw upd.error
}

// Attendance with 8-session reminder
export async function recordAttendance(fd:FormData){
  const class_id=String(fd.get('class_id'))
  const date=String(fd.get('date'))
  const s=serverClient()

  const entries: { student_id: string, status: string }[] = []
  for (const [k,v] of fd.entries()) {
    if (String(k).startsWith('status_')) entries.push({ student_id: String(k).replace('status_',''), status: String(v) })
  }
  for (const e of entries) {
    const ins = await s.from('attendance').insert({ date, class_id, student_id: e.student_id, status: e.status })
    if (ins.error) throw ins.error

    if (e.status === 'Present') {
      const { data: en } = await s.from('enrollments').select('id').eq('student_id', e.student_id).eq('class_id', class_id).maybeSingle()
      if (en?.id) {
        const { count } = await s.from('attendance').select('*', { count: 'exact', head: true }).eq('class_id', class_id).eq('student_id', e.student_id).eq('status','Present')
        const presentCount = count || 0
        if (presentCount > 0 && presentCount % 8 === 0) {
          const { data: invs } = await s.from('invoices').select('id, amount_due, amount_paid, enrollments(*, students(*, parents(*)))').eq('enrollment_id', en.id)
          const outstanding = (invs || []).reduce((sum, i:any) => sum + Math.max(0, Number(i.amount_due||0) - Number(i.amount_paid||0)), 0)
          if (outstanding > 0) {
            const student = invs?.[0]?.enrollments?.students
            const parent = student?.parents
            if (parent?.email) {
              const html = `<p>Hi ${parent.name || 'Parent'},</p><p>This is a friendly reminder that fees are due for ${student.first_name} after ${presentCount} sessions.</p><p>Outstanding balance: <strong>$${outstanding.toFixed(2)}</strong>.</p><p>Thank you,<br/>The Learners Pathway</p>`
              await sendEmail(parent.email, `Fee Reminder for ${student.first_name}`, html)
            }
          }
        }
      }
    }
  }
}
