/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  DyteCameraToggle,
  DyteChatToggle,
  DyteDialogManager,
  DyteGrid,
  DyteHeader,
  DyteLeaveButton,
  DyteMicToggle,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteSidebar,
  sendNotification,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core';
import AuctionControlBar from '@/components/auctionControlBar';
import Icon from '@/components/icon';
import { bidItems } from '@/constants';

interface Bid {
  bid: number;
  user: string;
}

const Meeting = () => {
  const { meeting } = useDyteMeeting();

  const [item, setItem] = useState(0);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [auctionStarted, setAuctionStarted] = useState<boolean>(false);
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false);
  const [size, setSize] = useState<any>('lg');
  const [highestBid, setHighestBid] = useState<Bid>({ bid: 100, user: 'default' });

  const handlePrev = () => {
    if (item - 1 < 0) return;
    setItem(item - 1)
    meeting.participants.broadcastMessage('item-changed', { item: item - 1 })
  }
  const handleNext = () => {
    if ( item + 1 >= bidItems.length) return;
    setItem(item + 1)
    meeting.participants.broadcastMessage('item-changed', { item: item + 1 })
  }

  useEffect(() => {
    setHighestBid({
      bid: bidItems[item].startingBid,
      user: 'default'
    })
  }, [item])

  useEffect(() => {
    if (!meeting) return;

    const preset = meeting.self.presetName;
    if (preset.includes('host')) {
      setIsHost(true);
    }

    const handleBroadcastedMessage = ({ type, payload }: { type: string, payload: any }) => {
      switch(type) {
        case 'auction-toggle': {
          setAuctionStarted(payload.started);
          break;
        }
        case 'item-changed': {
          setItem(payload.item);
          break;
        }
        case 'new-bid': {
          sendNotification({
            id: 'new-bid',
            message: `${payload.user} just made a bid of $ ${payload.bid}!`,
            duration: 2000,
          })
          if (parseFloat(payload.bid) > highestBid.bid) setHighestBid(payload)
          break;
        }
        default:
          break;
      }
    }
    meeting.participants.on('broadcastedMessage', handleBroadcastedMessage);

    const handleDyteStateUpdate = ({detail}: any) => {
        if (detail.activeSidebar) {
         setActiveSidebar(true);
        } else {
          setActiveSidebar(false);
        }
    }

    document.body.addEventListener('dyteStateUpdate', handleDyteStateUpdate);

    return () => {
      document.body.removeEventListener('dyteStateUpdate', handleDyteStateUpdate);
      meeting.participants.removeListener('broadcastedMessage', handleBroadcastedMessage);
    }
  }, [meeting])

  useEffect(() => {
    const participantJoinedListener = () => {
      if (!auctionStarted) return;
      setTimeout(() => {
        meeting.participants.broadcastMessage('auction-toggle', {
          started: auctionStarted
        })
      }, 500)
    
    }
    meeting.participants.joined.on('participantJoined', participantJoinedListener);
    return () => {
      meeting.participants.joined.removeListener('participantJoined', participantJoinedListener);
    }
  }, [meeting, auctionStarted])

  const toggleAuction = () => {
    if (!isHost) return;
    meeting.participants.broadcastMessage('auction-toggle', {
      started: !auctionStarted
    })
    if (!auctionStarted) {
      meeting.self.pin();
    } else {
      meeting.self.unpin();
    }
    setAuctionStarted(!auctionStarted);
  }

  useEffect(() => {
    window.onresize = () => {
      if (window.innerWidth < 1000 || window.innerHeight < 530) setSize('md');
      else setSize('lg');
    };
  }, [])

  return (
    <div className='h-[100vh] max-h-[100vh] overflow-y-auto w-full box-border flex flex-col'>
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager meeting={meeting} />

      <DyteHeader meeting={meeting} size='lg'>
        <div className="flex flex-row flex-1 mr-[40px] justify-end">
          {
            auctionStarted && (
              <div className="show-auction-popup" onClick={() => setShowPopup(() => !showPopup)}>
                <Icon size='sm' icon={showPopup ? 'close' : 'next'} />
              </div>
            )
          }
        </div>
      </DyteHeader>

      <div className='meeting-grid flex flex-row flex-1'>
        {
          auctionStarted && (
            <div className={`auction-container  ${!showPopup ? 'hide-auction-popup' : ''}`}>
              <div className='auction-img-cont relative flex flex-grow h-[10px]'>
              <img className='h-[100%]' src={bidItems[item].link} />
              <div className='auction-desc'>
                {bidItems[item].description}
              </div>
              </div>
              <AuctionControlBar
                item={item}
                highestBid={highestBid}
                handleNext={handleNext}
                handlePrev={handlePrev}
                isHost={isHost}
              />
          </div>
          )
        }
        <DyteGrid layout='column' size={size} meeting={meeting} style={{ height: '100%' }}/>
        {activeSidebar && <DyteSidebar meeting={meeting} />}
      </div>

      <div className='flex flex-row bg-white items-center justify-center'>
        <DyteMicToggle size='md' meeting={meeting} />
        <DyteCameraToggle size='md'  meeting={meeting} />
        <DyteLeaveButton size='md' />
        <DyteChatToggle size='md' meeting={meeting} />
        {
          isHost && (
            <button className='border-none outline-none flex flex-col p-2 h-max bg-white text-black cursor-pointer m-2 rounded-md hover:bg-[rgb(228, 224, 224)]' onClick={toggleAuction}>
              <Icon size='lg' icon='auction' />
              <span className='text-xs mt-1'>{auctionStarted ? 'Stop' : 'Start'} Auction</span>
            </button>
          )
        }
      </div>
    </div>
  )
}

export default Meeting