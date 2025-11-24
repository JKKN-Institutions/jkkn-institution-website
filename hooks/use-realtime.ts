'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions<T> {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
}

export function useRealtime<T = any>({
  table,
  filter,
  event = '*',
  onInsert,
  onUpdate,
  onDelete
}: UseRealtimeOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Create channel
    const channelName = `realtime:${table}${filter ? `:${filter}` : ''}`;
    const newChannel = supabase.channel(channelName);

    // Subscribe to changes
    const subscription = newChannel.on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table,
        filter
      } as any,
      (payload: any) => {
        if (payload.eventType === 'INSERT' && onInsert) {
          onInsert(payload.new as T);
        } else if (payload.eventType === 'UPDATE' && onUpdate) {
          onUpdate(payload.new as T);
        } else if (payload.eventType === 'DELETE' && onDelete) {
          onDelete({ old: payload.old as T });
        }
      }
    );

    // Subscribe and track connection
    subscription.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
      } else if (status === 'CLOSED') {
        setIsConnected(false);
      }
    });

    setTimeout(() => {
      setChannel(newChannel);
    }, 0);

    // Cleanup
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
        setIsConnected(false);
      }
    };
  }, [table, filter, event]);

  return {
    channel,
    isConnected
  };
}
