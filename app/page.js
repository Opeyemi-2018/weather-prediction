import React from 'react'
// import Home from './climate-form/page'
// import CurrentWeather from './currentweather/page'
import SignIn from './components/authenticate/signIn'

const page = () => {
  return (
    <div className='bg-[#192735] min-h-screen pt-24'>
      <SignIn/>
    </div>
  )
}

export default page