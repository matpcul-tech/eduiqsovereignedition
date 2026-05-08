import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EducatorDashboard from '@/components/dashboards/EducatorDashboard'

export default async function EducatorPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: eduUser } = await supabase
    .from('eduiq_users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!eduUser || eduUser.role !== 'educator') redirect('/dashboard')

  const { data: students } = await supabase
    .from('eduiq_students')
    .select(`
      *,
      eduiq_observations(ews_score, observed_date, behavioral_score, academic_score, attendance_score)
    `)
    .eq('primary_educator_id', eduUser.id)
    .order('full_name')

  const { data: recentAlerts } = await supabase
    .from('eduiq_alerts')
    .select('*, eduiq_students(full_name)')
    .eq('triggered_by', eduUser.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return <EducatorDashboard user={eduUser} students={students || []} alerts={recentAlerts || []} />
}
