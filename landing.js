import React, { Component } from "react";
import { connect } from "react-redux";
//var Carousel = require('react-responsive-carousel').Carousel;
import Header from './header';
import Footer from './footer';

import ReactPlayer from 'react-player'
import { Redirect } from "react-router-dom";
import ItemsCarousel from "react-items-carousel";
import AliceCarousel from 'react-alice-carousel';
import { constant } from '../../constants';
import { Carousel } from 'react-responsive-carousel';
import Slider from "react-slick";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { fetchHomePostList, fetchFeedsList, fetchSlidePostList,InstagramFeeds, feedCategory } from '../../actions/action';
import ReactImageFallback from "react-image-fallback";
import Moment from 'react-moment';

const mapStateToProps = function (state) {
  return {
    state: state
  };
};

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responsive: {
        0: { items: 1 },
        460: { items: 4 },
        575: { items: 4 },
        767: { items: 2 },
        991: { items: 4 },
        1024: { items: 5 },
      },
      loadingState: false, hasMore: true, isLoggedIn: "loginstate", photoIndex: 0, isOpen: false, activeIndex: 0
    };
    // props.dispatch(showTestimonial());
    // props.dispatch(showPartners());
    // props.dispatch(showSlider());
    // props.dispatch(showContent());

		//this.toggleClass = this.toggleClass.bind(this);
		this.fetchMoreData = this.fetchMoreData.bind(this);
  }
	fetchMoreData() {
		if (this.props.state.totalHomePost > this.props.state.HomePostList.length) {
			this.setState({ loadingState: true });
			var datatoken = JSON.parse(localStorage.getItem('aesthetician_login'));
			var limit = this.props.state.HomePostList.length + 10
			setTimeout(() => {
				this.setState({ loadingState: false })
				this.props.dispatch(fetchHomePostList({ limit: limit, offset: 0}))
			}, 1000)
		}
	}


  

  componentDidMount() {
    this.props.dispatch(fetchHomePostList({  limit:10, offset: 0 }))
    this.props.dispatch(fetchSlidePostList({  limit:10, offset: 0 }))
    
    var userData = JSON.parse(localStorage.getItem('aesthetician_login'))
		// setTimeout(() => {
		// 	this.getData();
		// }, 4000)
		setTimeout(() => {
			this.refs.iScroll.addEventListener("scroll", () => {
				if (
					this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
					this.refs.iScroll.scrollHeight
				) {
					this.fetchMoreData();
					this.refs.iScroll.removeEventListener('scroll', () => { })
				}
			});
    }, 1000)
    
    this.refs.iScroll.addEventListener("scroll", () => {
			if (
				this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
				this.refs.iScroll.scrollHeight - 500
			) {
				this.fetchMoreData();
			}
		});
  }
  
  


  render() {

    const { photoIndex, isOpen, } = this.state;
		// if (this.state.isLoggedIn == null || this.state.isLoggedIn == undefined) {
		// 	return <Redirect to="login" />
		// }

 		const { SlidePostList,HomePostList,images, totalPost} = this.props.state;
		
 


    const imgpathpost = constant.FEEDS_IMAGEPATH;
		if(HomePostList!=undefined){
			if (HomePostList !== undefined) {
				HomePostList.forEach(element => {
					element.post_image = element.image.split(',');
				});
			}

		}
  //
  if(SlidePostList!=undefined){
    if (SlidePostList !== undefined) {
      SlidePostList.forEach(element => {
        element.post_image = element.image.split(',');
      });
    }

  }  

    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
	  slidesToScroll: 5,
	  autoplay: false,
	  autoplaySpeed: 2000,
	  arrows:false,
	  
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 3
          }
        }

      ]
    };

    //const imgpathApp = constant.DOWNLOADAPP_IMAGEPATH
    //const url = "http://192.168.1.56:3002/uploads/slider/";
    //let AliceCarouselItem = []
   // const { ResponseSlider, ResponseContent } = this.props.state
    // console.log('res=', this.props.state)
    // if (ResponsePartners !== undefined) {
    //   AliceCarouselItem = ResponsePartners.result.map((i) => <div className="logos slide-logo" key={i}><img src={`${constant.PARTNERS_LOGO}${i.logo}`} /></div>)
    // }

    //const imgpath = "http://192.168.1.56/hydra/public/uploads/testimonial/";
    return (

			<div ref="iScroll" style={{ height: "100vh", overflow: "auto" }}>
						<div className="home_wrapper" >

			<Header />

        <section className="partner">
          <div className="container-fluid">
          <Slider {...settings}>
          {SlidePostList !== undefined ? SlidePostList.map((item, i) => (
        <div className="slide-container1">
        <div className="slide-container">

		<ReactImageFallback src={`${imgpathpost}${item.post_image[0]}`} title={item.title}
															fallbackImage="/images/logo_default.png"
															className="my-post-image" />
															</div><span>{item.title}</span></div>)): ""}
       
      </Slider>
       
            </div>
        </section>
       	<section>
		{totalPost !== undefined && totalPost == 0 ?
			<div className="notrecord">
				<img src="/images/norecordfound.svg" />
				<h5>Record not Found</h5>
			</div>
			:
			<div className="row pr-3">
				{HomePostList !== undefined ? HomePostList.map((item, i) => (
					<div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
						<div className="new_logos">
							{item.category == 3 ?
								<a onClick={() => this.setState({ isOpen: true, photoIndex: item.imageIndex })}  >
									<div>
										<div className="cos_logo">

											<ReactImageFallback
												src={`${imgpathpost}${item.post_image[0]}`} title={item.title}
												fallbackImage="/images/logo_default.png"
												className="my-image" />
										</div>
										<h4>{item.title}</h4>
									</div>
								</a>
								:
								<a href={'/post-detail/'+item.id}  >
									<div>
										<div className="cos_logo">
											<ReactImageFallback
												src={`${imgpathpost}${item.post_image[0]}`} title={item.title}
												fallbackImage="/images/logo_default.png"
												className="my-image" />
										</div>
										<h4>{item.title}</h4>
									</div>
								</a>}
						</div>
					</div>
				)) : <div className="row m-0 logo-sim w-100">
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3">																
					<div className="fd_post_img animate din"></div>																
				</div>
				<div className="col-12 col-sm-6 col-md-4 col-lg-3">																
					<div className="fd_post_img animate din"></div>																
				</div>
			</div>
				}
			</div>}

		{this.state.loadingState
			? <div className="text-center new-loader">loading <img src="/images/loader.svg" />
			</div>
			: ""}
	</section></div>
					<Footer />
      
      </div>
    );
  }
}
export default connect(mapStateToProps)(Landing);
