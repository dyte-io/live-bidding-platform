import { useDyteMeeting } from '@dytesdk/react-web-core';
import { useState } from 'react';
import Icon from './icon';

interface Bid {
    bid: number;
    user: string;
}

  
interface Props {
    isHost: boolean,
    item: number,
    highestBid: Bid,
    handlePrev: () => void;
    handleNext: () => void;
}

const AuctionControlBar = (props: Props) => {
    const { meeting } = useDyteMeeting();
    const [bid, setBid] = useState<string>('');
    const { isHost, item, highestBid, handleNext, handlePrev } = props;
    const placeBid = () => {
        const parsedBid = parseFloat(bid).toFixed(2);
        meeting.participants.broadcastMessage('new-bid', {
            bid: parsedBid,
            user: meeting.self.name,
        });
    }

    return (
        <div className='flex box-border flex-row p-3 bg-[#E5E7EB] w-[100%] items-center justify-between'>
            <div className="mr-2 text-black">
                <span>{highestBid.user === 'default' ? 'Starting' : 'Highest'} Bid: </span>$ {highestBid.bid}
            </div>
            
            {
                isHost && (
                    <div className="flex flex-row bg-[#c0c3c8] rounded-xl border-solid border-[1px] border-[#97999d] text-gray-600 items-center">
                        <button className='border-none outline-none padding-2 rounded-md overflow-hidden bg-none text-white cursor-pointer' onClick={handlePrev}><Icon size='sm' icon='prev' /></button>
                        <span className='mx-3'>{item + 1}</span>
                        <button className='border-none outline-none padding-2 rounded-md overflow-hidden bg-none text-white cursor-pointer' onClick={handleNext}><Icon size='sm' icon='next' /></button>
                    </div>
                )
            }
            {
                !isHost && <div className='ml-2'>
                <input className='border border-solid border-[#97999d] bg-[#c0c3c8] rounded-md outline-none p-2 text-black placeholder:text-gray-500' onChange={(e) => {
                    setBid(e.target.value);
                }} placeholder='$ 345' value={bid} />
                <button className='p-2 border-solid border-[1px] border-[#9e77e0] outline-none ml-3 rounded-md bg-[#754cba] text-white cursor-pointer' onClick={placeBid}>Your Bid</button>
            </div>
            }
        </div>
    )
}

export default AuctionControlBar