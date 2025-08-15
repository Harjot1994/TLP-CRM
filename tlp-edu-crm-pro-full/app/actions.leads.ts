'use server'
import { z } from 'zod'
import { serverClient } from '@/lib/supabaseServer'

const Lead=z.object({id:z.string().min(2),parent_name:z.string().min(1),phone:z.string().min(5),email:z.string().optional().or(z.literal('')),child_name:z.string().min(1),child_grade:z.string().optional().or(z.literal('')),program_interest:z.string().optional().or(z.literal('')),city:z.string().optional().or(z.literal('')),owner:z.string().optional().or(z.literal('')),source:z.string().optional().or(z.literal('')),campaign:z.string().optional().or(z.literal('')),status:z.string().default('New'),notes:z.string().optional().or(z.literal('')),})

export async function listLeads(){const s=serverClient();const {data,error}=await s.from('leads').select('*').order('created_at',{ascending:false});if(error)throw error;return data}
export async function createLead(fd:FormData){const p=Lead.parse({id:fd.get('id'),parent_name:fd.get('parent_name'),phone:fd.get('phone'),email:fd.get('email')||'',child_name:fd.get('child_name'),child_grade:fd.get('child_grade')||'',program_interest:fd.get('program_interest')||'',city:fd.get('city')||'',owner:fd.get('owner')||'Owner',source:fd.get('source')||'',campaign:fd.get('campaign')||'',status:fd.get('status')||'New',notes:fd.get('notes')||''});const s=serverClient();const {error}=await s.from('leads').insert(p as any);if(error)throw error}
export async function updateLeadStatus(id:string,status:string){const s=serverClient();const {error}=await s.from('leads').update({status}).eq('id',id);if(error)throw error}
