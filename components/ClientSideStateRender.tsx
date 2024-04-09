"use client"

import { useUserStore } from '@/stores/userStore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react'

function ClientSideStateRender() {

    const session = useSession();

    const { user, fetchInitialData } = useUserStore();

    useEffect(() => {
      if (session?.data?.user?.id) {
        fetchInitialData(session.data.user.id);
      }

    }, [session, fetchInitialData]);

  return (
    <></>
  )
}

export default ClientSideStateRender