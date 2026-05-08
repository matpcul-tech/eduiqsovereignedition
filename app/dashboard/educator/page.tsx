import { createClient } from '@supabase/supabase-js'
import EducatorDashboard from '@/components/dashboards/EducatorDashboard'

export default async function EducatorPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const fallbackUser = {
    id: 'demo',
    full_name: 'Demo Educator',
    school_name: 'Demo School',
    tribal_affiliation: '',
    role: 'educator',
  }

  if (!supabaseUrl || !serviceKey) {
    return <EducatorDashboard user={fallbackUser} students={[]} alerts={[]} />
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Open-access demo mode: pick the first educator in the DB.
  const { data: eduUser } = await supabase
    .from('eduiq_users')
    .select('*')
    .eq('role', 'educator')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!eduUser) {
    return <EducatorDashboard user={fallbackUser} students={[]} alerts={[]} />
  }

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
