import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './index.css'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ContactsUs from '../ContactsUs'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const settings = {
  nextArrow: <Arrow />,
  prevArrow: <Arrow />,
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

function Arrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', background: '#989898'}}
      onClick={onClick}
    />
  )
}

const Home = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  let renderResult

  const getTopBooks = async () => {
    setApiResponse({
      status: apiStatusConstants.inProgress,
      data: null,
      errorMsg: null,
    })
    const jwt_token = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const responseData = await response.json()
    if (response.ok) {
      setApiResponse(prevApiDetails => ({
        ...prevApiDetails,
        status: apiStatusConstants.success,
        data: responseData,
      }))
    } else {
      setApiResponse(prevApiDetails => ({
        ...prevApiDetails,
        status: apiStatusConstants.failure,
        errorMsg: responseData.error_msg,
      }))
    }
  }

  const onClickRetry = () => {
    getTopBooks()
  }

  const renderFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        className="top-rated-books-failure-image"
        src="https://res.cloudinary.com/dkxxgpzd8/image/upload/v1647250727/Screenshot_30_uavmge.png"
        alt="failure view"
      />

      <p className="top-rated-books-failure-heading">
        Something Went wrong. Please try again.
      </p>
      <button
        className="top-rated-books-failure-btn"
        onClick={onClickRetry}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => {
    const {data} = apiResponse
    const bookDetails = data.books
    console.log(data)
    return (
      <Slider {...settings}>
        {bookDetails.map(eachLogo => {
          const {id, cover_pic} = eachLogo
          return (
            <Link to={`/books/${id}`}>
              <li className="slick-item" key={id}>
                <img
                  className="book-image"
                  src={cover_pic}
                  alt="company logo"
                />
                <h1>{eachLogo.title}</h1>
                <p>{eachLogo.author_name}</p>
              </li>
            </Link>
          )
        })}
      </Slider>
    )
  }

  const renderLoadingView = () => (
    <div className="loadingContainer" testid="loader">
      <Loader type="TailSpin" color="grey" height="40" width="40" />
    </div>
  )
  if (apiResponse.status === apiStatusConstants.inProgress) {
    renderResult = renderLoadingView()
  } else if (apiResponse.status === apiStatusConstants.success) {
    renderResult = renderSuccessView()
  } else if (apiResponse.status === apiStatusConstants.failure) {
    renderResult = renderFailureView()
  } else {
    renderResult = null
  }

  useEffect(() => {
    getTopBooks()
  }, [])

  return (
    <div className="bg2">
      <Header activeTab="home" />
      <div className="HomePageContent">
        <h1>Find Your Next Favorite Books?</h1>
        <p>
          You are in the right place.Tell us what titles or genres you have
          enjoyed in the past, and we will give you surprisingly insightful
          recommendations.
        </p>

        <div className="top-books-header">
          <h1>Top Rated Books</h1>
          <Link to="/shelf">
            <button className="find-books-button" type="button">
              Find Books
            </button>
          </Link>
        </div>
        {renderResult}
      </div>
      <ContactsUs />
    </div>
  )
}

export default Home
