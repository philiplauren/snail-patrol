import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvvoorcnfpvhpfzkzpvr.supabase.co'
const supabaseAnonKey = 'sb_publishable_Uxev0aP6sklA7lkW8YN1EQ_bYieTGMD'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

export async function getRescues() {
  const { data, error } = await supabase
    .from('rescues')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function createRescue(rescue) {
  const { data, error } = await supabase
    .from('rescues')
    .insert([rescue])
    .select();

  if (error) throw error;

  return data;
}