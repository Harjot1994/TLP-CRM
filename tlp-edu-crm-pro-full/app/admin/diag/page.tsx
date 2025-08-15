import Link from 'next/link'
export default function Page(){
  const links=[
    ['/admin/leads','Leads','Capture & track inquiries'],
    ['/admin/parents','Parents','Contacts & channels'],
    ['/admin/students','Students','Current • Past • Future'],
    ['/admin/teachers','Teachers','Staff directory'],
    ['/admin/classes','Classes','Cohorts by teacher'],
    ['/admin/attendance','Attendance','Mark sessions'],
    ['/admin/invoices','Invoices','Fees & payments'],
  ]
  return(<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
    {links.map(([href,title,desc])=>(
      <Link key={href} href={href} className='card p-4 hover:shadow-md transition'>
        <div className='text-lg font-semibold'>{title}</div>
        <div className='text-sm text-slate-600'>{desc}</div>
      </Link>
    ))}
  </div>)
}
