import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Add_Feeds } from '../../actions/action';
import Header from './header';
import Footer from './footer';
import Moment from 'react-moment';
import {Redirect} from 'react-router-dom';
import 'moment-timezone';
import {constant} from '../../constants.js';
import Validation from '../../library/Validation';
import Swal from "sweetalert2";  
import PropTypes from "prop-types";

const mapStateToProps = function(state) {
    return {
        state:state,
    }
  }
  class Checkbox extends React.Component {
    static defaultProps = {
        checked: false
    }
    render() {
        return (
            <input
                type={this.props.type}
                name={this.props.name}
                checked={this.props.checked}
                onChange={this.props.onChange}
            />
        );
    }
}

class AddPost  extends Component{
    constructor(props,context) {
        super(props,context);

        this.state = {
            checkedItems: new Map(),
            title:'' , description :'', image:'' ,isLoggedIn: 'login',errors:{}, imagePreview:[], files:[],services:[]
        };

        this.handleChange = this.handleChange.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.onImageInput = this.onImageInput.bind(this);
    }

    handleChange = e => {
        const item = e.target.name;
        const isChecked = e.target.checked;

        console.log(item,isChecked)
        this.setState(prevState => ({
            checkedItems: prevState.checkedItems.set(item, isChecked),

        }));

        this.selected = this.selected || {};
        if (isChecked) {
            console.log("here",isChecked)
          this.selected[item] = true;
        } else {
            console.log("nohere",isChecked)

          delete this.selected[item];
        }
   
    
        this.setState({
            services: Object.keys(this.selected)
        }) 
  

    };

    deleteCheckboxState = (name, checked) => {
        const updateChecked = checked == null ? true : false;
        this.setState(prevState => prevState.checkedItems.set(name, updateChecked));
    };

    clearAllCheckboxes = () => {
        const clearCheckedItems = new Map();
        this.setState({ checkedItems: clearCheckedItems });
    };


    componentDidMount(){ 
        this.setState({ isLoggedIn: localStorage.getItem('aesthetician_login') })  
        var userData = JSON.parse(localStorage.getItem('aesthetician_login'))
      }
      
     onChangeInput(e){
        var value = e.target.value;
        this.setState({[e.target.name]: value})
       }
      
      handleSubmit(e){
        console.log(this.state.services);

         e.preventDefault()
         let errors = {};
         errors = Validation('title','title | required',this.state.title, errors,'');
         errors = Validation('description','description | required',this.state.description, errors,'');
         //errors = Validation('image','image | required',this.state.image, errors,'');
        //  if(this.state.image == ''){
        //      var imgmsg = 'image is required';
        //      this.setState({ msg :imgmsg })
        //      //console.log(this.state.msg);
        //       }
         var formdata = new FormData();
         this.state.files.forEach(element => {
             formdata.append('file', element, element.name)
         })
         this.setState({errors:errors})
         var postData ={
            title: this.state.title,
            description: this.state.description,
            services:this.state.services,

             file: formdata,
      }
      console.log(postData);
      var userData = JSON.parse(localStorage.getItem('aesthetician_login'))
     if(Object.keys(errors).length == 0){
         this.props.dispatch(Add_Feeds({data:postData ,token:userData.token }))
         this.handleClick();
      }
     }
     handleClick() {  
         window.setTimeout(()=>{ 
             if(this.props.state.Post !== undefined ? this.props.state.Post.status == 200 :''){
                 Swal.fire({  
                 title: 'Success',  
                 type: 'success',  
                 text: this.props.state.Post !== undefined ? this.props.state.Post.data.message: '' ,  
             });   }
           else  if(this.props.state.Post !== undefined ? this.props.state.Post:''){
               Swal.fire({  
               //title: 'Success',  
               type: 'error',  
               text: this.props.state.Post !== undefined ? this.props.state.Post.error : '' ,  
         });  } },800)
     } 
      onImageInput(e){
         const config = {
             headers: {
                 'content-type': 'multipart/form-data'
             }
         } 
 
         const file = e.target.files[0]; 
   
         var reader = new FileReader();
         reader.onloadend = () => {
             this.setState({
             files: [...this.state.files, file],
             imagePreview: [...this.state.imagePreview, reader.result],
           });
         }
       reader.readAsDataURL(file)
    
     }
    render() {
        const checkboxes = [
            {
                name: "check-box-1",
                key: "checkBox1",
                label: "Check Box 1"
            },
            {
                name: "check-box-2",
                key: "checkBox2",
                label: "Check Box 2"
            },
            {
                name: "check-box-3",
                key: "checkBox3",
                label: "Check Box 3"
            },
            {
                name: "check-box-4",
                key: "checkBox4",
                label: "Check Box 4"
            }
        ];

        const checkboxesToRender = checkboxes.map(item => {
            return (
                <label key={item.key}>
                    {item.name}
                    <Checkbox
                        name={item.name}
                        checked={this.state.checkedItems.get(item.name) || false}
                        onChange={this.handleChange}
                        type="checkbox"
                    />
                </label>
            );
        });

        const checkboxesDeleteHandlers = checkboxes.map(item => {
            return (
                <span
                    key={item.name}
                    onClick={() =>
                        this.deleteCheckboxState(
                            item.name,
                            this.state.checkedItems.get(item.name)
                        )
                    }
                >
                    {item.name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </span>
            );
        });
        // 
        const imgpath =	constant.FEEDS_IMAGEPATH
        let { imagePreview } = this.state;

        if( this.props.state.Post !== undefined && this.props.state.Post.status == 200)
        {
         return  (
            <Redirect to="feeds"></Redirect>
         )
         }
////////
        return (
            <div>
            <Header />
                <div className="invite_wrapper">
                    <section className="invite_banner mb-0">
                        <div className="container">
                            <div className="row align-items-center justify-content-center">
                                <div className="join_box text-center">
                                    <h5>Post</h5>                                  
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="add_post bg-white">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 col-md-8 col-lg-8">
                                    <form className="form-box" onSubmit={this.handleSubmit} encType="multipart/form-data">
                                        <div className="w-100">
                                            <div className="form-group">
                                                <label>Post Title</label>
                                                <input type="text" name="title" placeholder="Title"  onChange={this.onChangeInput} />
                                                <div className="error qcont">{this.state.errors['title_er']}</div>
                                            </div>

                                            <div className="form-group">
                                                <label>Post Description</label>
                                                <textarea placeholder="Description" name="description"  onChange={this.onChangeInput}></textarea>
                                                <div className="error qcont">{this.state.errors['description_er']}</div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row align-items-center">
                                                    {imagePreview !== undefined ? imagePreview.map((url,i) => (
                                                        <div className="col-lg-3" key={i}>
                                                            <div className="upload_images">
                                                            <img src={url} />
                                                            </div>
                                                        </div>
                                                    )) : ""}
                                                   
                                                     <div className="p-3 col-lg-3">
                                                        <div className="img_upload">
                                                        <div className="add_new">
                                                           <input type="file" name="image" onChange={this.onImageInput} ref="file" multiple/>
                                                            <span className="icon-plus"></span>
                                                        </div>
                                                        
                                                       </div>
                                                    </div>
                                                    
                                                     
                                                </div>
                                                <div className="error qcont">{ this.state.msg }</div>
                                            </div>
                                            <div className="App">
                                                {checkboxesToRender}
                                                {/* <p onClick={this.clearAllCheckboxes}>clear all</p> */}
                                            </div>

                                            <div className="pt-4">
                                                <button className="btn theme_btn" onClick={this.change}>Post</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>                              
                            </div>
                        </div>
                    </section>
                </div>
            <Footer />
            </div>
       
           
        );
    }
}

export default  { component: connect(mapStateToProps)(AddPost)};