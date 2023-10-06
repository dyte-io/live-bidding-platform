/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import LoadingScreen from './loadingScreen';
import SetupScreen from './setupScreen';
import Meeting from './meeting'

function App() {
  const meetingEl = useRef<HTMLDivElement>(null);
  const [meeting, initMeeting] = useDyteClient();
  const [authToken, setAuthToken] = useState('');
  const [roomJoined, setRoomJoined] = useState<boolean>(false);

  const handleSubmit = async (preset: string) => {
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preset }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(
          'There was an error when starting the survey, check console for error'
        );
        console.log(res.status, data);
        return;
      }
      const { token } = data.data;
      setAuthToken(token);
  }

  useEffect(() => {
    if (!authToken || !meetingEl.current) return;
    provideDyteDesignSystem(meetingEl.current, {
      googleFont: 'Poppins',
      theme: 'light',
      colors: {
        danger: '#ffb31c',
        brand: {
          300: '#c6a6ff',
          400: '#9e77e0',
          500: '#754cba',
          600: '#4e288f',
          700: '#2e0773',
        },
        text: '#071428',
        'text-on-brand': '#ffffff',
        'video-bg': '#E5E7EB',
      },
      borderRadius: 'rounded',
    });
  
    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, [authToken])

  useEffect(() => {
    if (!meeting) return;

    const roomJoinedListener = () => {
      setRoomJoined(true);
    };
    const roomLeftListener = () => {
      setRoomJoined(false);
    };
    meeting.self.on('roomJoined', roomJoinedListener);
    meeting.self.on('roomLeft', roomLeftListener);

    return () => {
      meeting.self.removeListener('roomJoined', roomJoinedListener);
      meeting.self.removeListener('roomLeft', roomLeftListener);
    }

  }, [meeting])

  if (!authToken) return (
    <div className='h-[100vh] w-full flex flex-col items-center justify-center'>
      <h3 className='mb-6 text-xl text-black'>Live Auction App</h3>
      <button className='mb-3 text-white rounded-md  border-solid border-[1px] w-[300px] p-2 border-[#b58aff] bg-[#754cba]' onClick={() => handleSubmit('group_call_host')}>Join as Host</button>
      <button className='mb-3 text-color rounded-md border-solid border-[1px] w-[300px] border-gray-400  bg-gray-300 p-2' onClick={() => handleSubmit('group_call_participant')}>Join as Participant</button>
    </div>
  )

  return (
    <div ref={meetingEl} >
    <DyteProvider value={meeting} fallback={<LoadingScreen />}>
      {
        !roomJoined ? <SetupScreen />: <Meeting />
      }
    </DyteProvider>
    </div>
  )
}

export default App
