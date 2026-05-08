import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRouter() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: eduUser } = await supabase
    .from('eduiq_users')
    .select('role')
    .eq('auth_id', user.id)
    .single()

  if (!eduUser) redirect('/?error=no_profile')

  const roleRoutes: Record<string, string> = {
    educator: '/dashboard/educator',
    parent: '/dashboard/parent',
    admin: '/dashboard/admin',
  }

  redirect(roleRoutes[eduUser.role] || '/')
}
