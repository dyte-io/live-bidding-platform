import { useEffect, useState } from 'react'
import { useDyteMeeting } from '@dytesdk/react-web-core';
import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteCameraToggle,
  DyteMicToggle,
  DyteNameTag,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit';

const SetupScreen = () => {
  const { meeting } = useDyteMeeting();
  const [isHost, setIsHost] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (!meeting) return;
    const preset = meeting.self.presetName;
    const name = meeting.self.name;
    setName(name);

    if (preset.includes('host')) {
      setIsHost(true);
    }
  }, [meeting])

  const joinMeeting = () => {
    meeting?.self.setName(name);
    meeting?.joinRoom();
  }

  return (
    <div className='setup-screen h-[100vh] w-full flex flex-row items-center justify-between'>
      <div className='setup-media box-border w-[50%] inline-block'>
        <div className='float-right relative'>
          <DyteParticipantTile meeting={meeting} participant={meeting.self}>
            <DyteAvatar size="md" participant={meeting.self}/>
            <DyteNameTag meeting={meeting} participant={meeting.self}>
              <DyteAudioVisualizer size='sm' slot="start" participant={meeting.self} />
            </DyteNameTag>
            <div className='absolute bottom-2 right-2 flex'>
              <DyteMicToggle size="sm" meeting={meeting}/>
              &ensp;
              <DyteCameraToggle size="sm" meeting={meeting}/>
            </div>
          </DyteParticipantTile>
        </div>
      </div>
      <div className="setup-information flex flex-col w-[50%] m-8 box-border">
        <div className="setup-content w-[50%] text-center flex flex-col min-w-[300px]">
          <h2 className='mx-2 my-0 font-semibold text-lg'>Welcome! {name}</h2>
          <p className='mx-2 my-0 text-gray-700'>{isHost ? 'You are joining as a Host' : 'You are joining as a bidder'}</p>
          <input disabled={!meeting.self.permissions.canEditDisplayName ?? false} className='my-3 mx-0 outline-none p-2 font-medium border-solid border-[1px] border-slate-300' value={name} onChange={(e) => {
            setName(e.target.value)
          }} />
          <button className='my-2 mx-0 p-2 rounded-md border-solid border-[1px] border-[#754cba] text-white cursor-pointer bg-[#754cba]' onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen