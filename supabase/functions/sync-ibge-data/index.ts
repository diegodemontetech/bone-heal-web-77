
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface IBGEState {
  id: number;
  nome: string;
  sigla: string;
}

interface IBGECity {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        id: number;
      }
    }
  }
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔄 Starting IBGE data sync...');

    // Fetch states from IBGE API
    console.log('📥 Fetching states from IBGE API...');
    const statesResponse = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const states: IBGEState[] = await statesResponse.json();

    // Process and insert states
    console.log(`Found ${states.length} states`);
    const formattedStates = states.map(state => ({
      id: state.id,
      name: state.nome,
      uf: state.sigla,
      ibge_code: state.id.toString()
    }));

    // Clear existing states
    const { error: clearStatesError } = await supabaseClient
      .from('ibge_states')
      .delete()
      .neq('id', 0);

    if (clearStatesError) {
      throw new Error(`Error clearing states: ${clearStatesError.message}`);
    }

    // Insert states
    const { error: statesError } = await supabaseClient
      .from('ibge_states')
      .insert(formattedStates);

    if (statesError) {
      throw new Error(`Error inserting states: ${statesError.message}`);
    }

    // Fetch cities from IBGE API
    console.log('📥 Fetching cities from IBGE API...');
    const citiesResponse = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
    const cities: IBGECity[] = await citiesResponse.json();

    // Process and insert cities
    console.log(`Found ${cities.length} cities`);
    const formattedCities = cities.map(city => ({
      id: city.id,
      name: city.nome,
      ibge_code: city.id.toString(),
      state_id: city.microrregiao.mesorregiao.UF.id
    }));

    // Clear existing cities
    const { error: clearCitiesError } = await supabaseClient
      .from('ibge_cities')
      .delete()
      .neq('id', 0);

    if (clearCitiesError) {
      throw new Error(`Error clearing cities: ${clearCitiesError.message}`);
    }

    // Insert cities in batches to avoid payload size limits
    const batchSize = 1000;
    for (let i = 0; i < formattedCities.length; i += batchSize) {
      const batch = formattedCities.slice(i, i + batchSize);
      const { error: citiesError } = await supabaseClient
        .from('ibge_cities')
        .insert(batch);

      if (citiesError) {
        throw new Error(`Error inserting cities batch ${i/batchSize + 1}: ${citiesError.message}`);
      }
      console.log(`Inserted batch ${i/batchSize + 1} of ${Math.ceil(formattedCities.length/batchSize)}`);
    }

    console.log('✅ IBGE data sync completed successfully!');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'IBGE data synced successfully',
        stats: {
          states: states.length,
          cities: cities.length
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
