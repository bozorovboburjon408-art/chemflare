import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApiSetting {
  key_name: string;
  key_value: string;
  url?: string;
  description?: string;
}

interface ParsedApiSetting {
  name: string;
  key: string;
  url?: string;
  description?: string;
}

export const useApiSettings = () => {
  const [apis, setApis] = useState<ParsedApiSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApis = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-settings', {
        body: { action: 'get', adminCode: 'admin77' }
      });

      if (error) throw error;

      if (data?.settings) {
        const parsed = data.settings.map((setting: ApiSetting) => {
          let parsed: { key: string; url?: string; description?: string };
          try {
            parsed = JSON.parse(setting.key_value);
          } catch {
            parsed = { key: setting.key_value };
          }
          return {
            name: setting.key_name,
            key: parsed.key,
            url: parsed.url,
            description: parsed.description
          };
        });
        setApis(parsed);
      }
    } catch (err) {
      console.error('Error loading API settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApis();
  }, []);

  const getApi = (name: string): ParsedApiSetting | undefined => {
    return apis.find(api => api.name === name || api.name === name.toUpperCase());
  };

  const callApi = async (
    apiName: string, 
    endpoint: string = '', 
    options: RequestInit = {}
  ) => {
    const api = getApi(apiName);
    if (!api) {
      throw new Error(`API "${apiName}" topilmadi`);
    }

    const baseUrl = api.url || '';
    const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api.key}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API xatosi: ${response.status}`);
    }

    return response.json();
  };

  return {
    apis,
    isLoading,
    error,
    getApi,
    callApi,
    reload: loadApis
  };
};
