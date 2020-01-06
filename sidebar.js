import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactImageFallback from "react-image-fallback";
import {constant} from '../../constants.js';
import {Redirect} from 'react-router-dom';


class Sidebar extends React.Component {
    constructor(props){
        super(props);
        this.state = {redirect:false, id:"" ,redirectList:false,active:'',id:'',category:''}
        
    }
    componentDidMount(){
		
    }
    feedsbyCategory(id){
      this.setState({redirectList:true, category:id,active:id});
        //console.log(id);
      // var userData = JSON.parse(localStorage.getItem('aesthetician_login'));
      // this.setState({redirectList:true, category:id});
     }
    render(){
      const queryString = require('query-string');
      const parsed = queryString.parse(location.search);
      if(this.state.redirect){
        this.setState({redirect:false})
      return  <Redirect to={`feeds-detail/:${this.state.slug}`} />
      
    }
    if(this.state.redirectList){
      this.setState({redirectList:false})
    return  <Redirect to={`feeds?category=${this.state.category}`} />
    
  }
    const { Feedlist, InstaFeeds, MostPopular, FeedCategories } = this.props;
    if(MostPopular !== undefined){
    MostPopular.forEach(element => {
    element.post_image = element.feed_image.split(',');
  });
  }
  if (Feedlist !== undefined) {
    Feedlist.forEach(element => {
      element.post_image = element.feed_image.split(',');
    });
  }
        return (
          <div className="col-12 col-md-12 col-lg-2">
          <div className="pl-lg-3">
          <div className="most_block">
          <h2>SOLUTIONS FOR </h2>
          <ul>
            {FeedCategories !== undefined ?
            FeedCategories.result.map(item => (
            <li key={item.id} ><span className={ parsed.category == item.name ? 'active link' : 'link'} onClick={this.feedsbyCategory.bind(this, item.name)}>{item.name} </span></li>
            ))
            : 
            <div className="w-set">
            <div className="comment br animate w-60"></div>
            <div className="comment br animate w-60"></div>
            </div>
            }
            
          </ul>
        </div>
            <div className="most_block">
            {MostPopular !== undefined ? MostPopular.lenght !== 0 ?<h2>MOST POPULAR</h2>:'' :''}
              {MostPopular !== undefined ? MostPopular.map((item) => (
                <div key={item.id} className="block_box" onClick={() =>
                    this.setState({redirect:true, slug:item.slug})}>
                  <div className="po-post">
                    <ReactImageFallback
                      src={`${constant.FEEDS_IMAGEPATH}${item.post_image[0]}`} title={item.title}
                      fallbackImage="/images/logo_default.png"
                      className="my-image" title={item.title} />
                  </div>
                  <div className="pl-3">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
                : ""
                 }
            </div>
            <div className="most_block">
              <h2>Latest </h2>
              {Feedlist !== undefined ? Feedlist.slice(0, 3).map((item) => (
                <div key={item.id} className="block_box" onClick={() =>
                    this.setState({redirect:true, slug:item.slug})
                }>
                  <div className="po-post">
                    <ReactImageFallback
                      src={`${constant.FEEDS_IMAGEPATH}${item.post_image[0]}`} title={item.title}
                      fallbackImage="/images/logo_default.png"
                      className="my-image" title={item.title} />
                  </div>
                  <div className="pl-3">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
                : 
                <div className="w-set">
                <div className="comment br animate w-60"></div>
                <div className="comment br animate w-60"></div>
                </div>
                }
            </div>
            <div className="insta_block">
              <h2>INSTAGRAM FEEDS</h2>
              {InstaFeeds !== undefined ?
                    <div className="row align-items-center">
                        {InstaFeeds.slice(6,12).map((feed) => (
                            <div key={feed.id} className="col-12 col-sm-6 col-md-4">
                              <a target="_blank" href={feed.link} >
                                <img  src={feed.images.standard_resolution.url} />
                              </a>
                        </div>
                        ))}
                    </div>
                :
                <div className="row align-items-center">
            <div className="col-6 col-sm-4 col-md-4">
              <img src="/images/right_block-1.png" />
            </div>
            <div className="col-6 col-sm-4 col-md-4">
              <img src="/images/right_block-2.png" />
            </div>
            <div className="col-6 col-sm-4 col-md-4">
              <img src="/images/right_block-3.png" />
            </div>
            <div className="col-6 col-sm-4 col-md-4">
              <img src="/images/right_block-4.png" />
            </div>
            <div className="col-6 col-sm-4 col-md-4">
              <img src="/images/right_block-5.png" />
            </div>
            <div className="col-6 col-sm-4 col-md-4">
              <img src="/images/right_block-6.png" />
            </div>
  </div>}
            </div>
          </div>
        </div>
        )
    }
}

export default Sidebar;