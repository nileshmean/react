import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPostDetail,fetchPostlistRecommended, } from '../../actions/action';
import Header from './header';
import Footer from './footer';
import Sidebar from './sidebar';
import queryString from 'query-string';
import Moment from 'react-moment';
import { Redirect } from 'react-router-dom';
import 'moment-timezone';
import { constant } from '../../constants.js';
import ReactImageFallback from "react-image-fallback";
import { ShareButtonIconOnly, ShareBlockStandard } from 'react-custom-share';
import { FaFacebook, FaTwitter, FaPinterest, FaLinkedin, FaGooglePlus } from 'react-icons/fa';
import Gallery from 'react-grid-gallery';

var Carousel = require('react-responsive-carousel').Carousel;
import SimpleCrypto from "simple-crypto-js";
var _secretKey = constant.SECRET_KEY;

var IMAGES = [];

const mapStateToProps = function (state) {
	return {
		state: state,
	}
}
class PostDetail extends Component {
	constructor(props) {
		super(props);
		var slug = props.match.params.any;
		this.state = { isLoggedIn: "loginstate", show_comment_error: "", comment_show: null, replyshow_id: 0, show_comment_error: "", show_reply_error: "", post_id: slug.slice(1), aesthetician_id:"" };

		
	}
	
	componentDidMount() {
		this.setState({ isLoggedIn: JSON.parse(localStorage.getItem('aesthetician_login')) })
		var userData = JSON.parse(localStorage.getItem('aesthetician_login'))
		console.log("this.state.post_id0=",this.state.post_id)
		this.props.dispatch(fetchPostDetail({ id: this.state.post_id }))
		this.props.dispatch(fetchPostlistRecommended({ id: this.state.post_id }))
	

	}

	Share() {
		fb_share("this is my title", "http://192.168.1.56:3002/aesthetician/feeds-detail?id=77", "http://192.168.1.56:3002/fb_img.jpg", "image", "Lorem ipsum")

	}

	
	render() {

		let shareBlockProps = {
			url: 'http://192.168.1.56:3002/feeds-detail?id=77',
			button: ShareButtonIconOnly,
			buttons: [
				{ network: 'Twitter', icon: FaTwitter },
				{ network: 'Facebook', icon: FaFacebook },
				{ network: 'Pinterest', icon: FaPinterest, media: this.state.sharedimage },
				{ network: 'GooglePlus', icon: FaGooglePlus },
			],
			text: this.state.sharetitle,
			longtext: this.state.sharedescription,
			media: this.state.sharedimage,
		};
		const userData = this.state.isLoggedIn
		if (this.state.isLoggedIn == null || this.state.isLoggedIn == undefined) {
			return <Redirect to="login"></Redirect>
		}
		if (this.state.redirectList) {
			this.setState({ redirectList: false })
			return <Redirect to={`/aesthetician/feed-category?category=${this.state.category}`} />

		}
		const imgpath = constant.FEEDS_IMAGEPATH
		const { PostDetail, Feedlist, PostlistRecommendedList, MostPopular } = this.props.state;
		if (PostDetail !== undefined) {

			PostDetail.post_image= PostDetail.feed_image.split(',');
			console.log(PostDetail.post_image[0]);

			 IMAGES =[ ];
			
				for(var i=0; i<PostDetail.post_image.length; i++)
			{
				IMAGES.push(
				
					{
					src: imgpath+PostDetail.post_image[i],
					thumbnail: imgpath+PostDetail.post_image[i],
					thumbnailWidth: 320,
					thumbnailHeight: 212,
				}
				)

			}


		}
		if (PostlistRecommendedList !== undefined) {
			PostlistRecommendedList.forEach(element => {
				element.Recommend_post_image = element.image.split(',');
			});
		}
		
	
		return (
			
			<div>
				<Header />
				<div className="event_wrapper">
					<section className="event_banner">
						<div className="container">
							<div className="row align-items-center justify-content-center">
								<div className="col-lg-8">
									<h2>Feeds Detail</h2>

								</div>
							</div>
						</div>
					</section>
					<section className="new_section">
						<div className="container">

							<div className="row">
							<Sidebar />

								<div className="col-12 col-md-12 col-lg-8 left_border right_border pr-0">
									<div className="post_details">
										<div className="post_head">
											<h2>{PostDetail !== undefined ? PostDetail.title : ''}</h2>
										
										</div>
										

										{PostDetail !== undefined && PostDetail.post_image.length == 1 ?
											<div className="full_detail_img">
												<ReactImageFallback
													src={`${imgpath}${PostDetail.post_image[0]}`}
													fallbackImage="/images/logo_default.png"
													className="my-image" />
											</div>
											:
											<Carousel showThumbs={false} showArrows={true} autoPlay={true} infiniteLoop={true} showIndicators={true}>
												{PostDetail !== undefined ? PostDetail.post_image.map((img_name, i) => (
													<div className="full_detail_img" key={i}>
														<ReactImageFallback src={`${imgpath}${img_name}`} fallbackImage="/images/logo_default.png" className="my-image" />
													</div>
												))
													: ""}
											</Carousel>
										}
										<p> {PostDetail !== undefined ? PostDetail.description : ''}
										</p>

							
									</div>
									<div className="">

									{
							IMAGES !== undefined ?
								<Gallery images= {IMAGES} ></Gallery>
								:" "
							}
							</div>
							<div className="clearfix"></div>

							<div className="row">
									<div className=" col-md-12 border-head mt-4 pt-4 pb-5 d-flex align-items-center justify-content-center">
										<h3>You May also like</h3>
									</div>
									{PostlistRecommendedList !== undefined ?
										<div className="row col-lg-12  mb-3 pr-md-4">
											{PostlistRecommendedList.map(item => (
												<div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
													<div className="post_slide" >
														<div className="mb-3 like_post">
															<img src={`${imgpath}${item.image[0]}`} title={item.title} />
														</div>
														<h4>{item.title}</h4>
													</div>
												</div>
											))}
										</div>
										
										: ""}
										</div>
								</div>
								<Sidebar />

							</div>
						</div>
					</section>
				</div>

				<Footer />
			</div>
		)

	}
}

export default { component: connect(mapStateToProps)(PostDetail) };