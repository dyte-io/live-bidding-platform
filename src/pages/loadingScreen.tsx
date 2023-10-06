const LoadingScreen = () => {
  return (
    <div className='h-[100vh] w-full bg-pink flex flex-col items-center justify-center'>
      <h3 className='m-2 p-0 w-fit h-fit font-medium text-xl'>Live Auction</h3>
      <p className='m-0 p-0 w-fit h-fit text-base text-gray-800'>Loading your meeting, please wait...</p>
    </div>
  )
}

export default LoadingScreen
