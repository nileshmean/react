// Image Upload
import React from 'react';
import { FlatList, ScrollView, Text, View, TouchableHighlight, Image, 
  ActivityIndicator, 
  SafeAreaView,
  Animated,
  ListView,
  TextInput,
  Picker,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Modal,

} from 'react-native';
import constant from '../../data/constant';
import RNFetchBlob from 'rn-fetch-blob'


import styles from './styles';
import { recipes } from '../../data/dataArrays';
import MenuImage from '../../components/MenuImage/MenuImage';
import DrawerActions from 'react-navigation';
import { getCategoryName } from '../../data/MockDataAPI';
import SplashScreen from 'react-native-splash-screen';
import { Button, Avatar,Card, FormLabel,Input, FormInput, FormValidationMessage } from 'react-native-elements'; 
import Icon from 'react-native-vector-icons/FontAwesome';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ceil } from 'react-native-reanimated';
import BackButton from '../../components/BackButton/BackButton';
import { Directions } from 'react-native-gesture-handler';
//const [currency, setCurrency] = useState('US Dollar');
import ImagePicker from 'react-native-image-crop-picker';
export default class PostFormScreen4 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      search: '',
      loading: false,
      isListEnd: false,
      showImageloading: true,
      serverData: [],
      dataSource:[],
      fetching_from_server: false,
      isHidden: true,
      animation: new Animated.Value(0),
      AdTitle:'',
      AdDescription:'',
      errMsgAdTitle:false,
      errMsgAdDescription:false,
      modalVisible: false,
      avatarSource: null,

    };
    this.offset = 1;
    this.page = 1;
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  componentDidMount()
  {
    SplashScreen.hide();
  }


  static navigationOptions = ({ navigation }) => ({
    title: 'Post',
    headerLeft: (
      <BackButton
        onPress={() => {
          navigation.goBack();
        }}
      />
   
    ),
   
  }
  
  );


  onClickListener = (viewId) => {
    // Alert.alert(this.state.Usrname+" "+this.state.email+" "+this.state.password , "View_id "+viewId);

    let lsAd_object = {
      lsAdTitle:this.state.AdTitle,
      lsAdDescription:this.state.AdDescription,
    };

    // You only need to define what will be added or updated
    AsyncStorage.setItem('ADid1', JSON.stringify(lsAd_object), () => {
     
      });

      AsyncStorage.getItem('ADid1', (err, result) => {
        console.log(result);
      });




    if(this.state.AdTitle || this.state.AdDescription != " "){
     if(this.state.AdTitle){
      if(this.state.AdDescription){
          this.registerCall();
       }else{
      this.setState({
        errMsgAdDescription: true,
      });
     }
     }else{
      
      this.setState({
        errMsgAdTitle: true,
      });

    }
  }else{
Alert.alert("Please fill all fields");
}
}

setModalVisible(visible) {
  this.setState({modalVisible: visible});
}

selectPhotoTapped() {


  var options = {
    title: 'Select Image',
    storageOptions: {
     skipBackup: true,
     path: 'images'
    }
 };


//  {
//   console.log('User selected a file form camera or gallery', response); 
//   const data = new FormData();
//   data.append('name', 'avatar');
//   data.append('fileData', {
//    uri : response.uri,
//    type: response.type,
//    name: response.fileName
//   });
//   const config = {
//    method: 'POST',
//    headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'multipart/form-data',
//    },
//    body: data,
//   };
//  fetch("http://localhost:3000/" + "upload", config)
//   .then((checkStatusAndGetJSONResponse)=>{       
//     console.log(checkStatusAndGetJSONResponse);
//   }).catch((err)=>{console.log(err)});
//  }

  ImagePicker.openPicker({
    width: 200,
    height: 200, compressImageMaxHeight: 400,
    compressImageMaxWidth: 400, cropping: true, multiple: true
  })
    .then(response => {
      let tempArray = []
      console.log("responseimage-------" + response)
      this.setState({ ImageSource: response })
      console.log("responseimagearray" + this.state.ImageSource)
      response.forEach((item) => {
        let image = {
          uri: item.path,
          // width: item.width,
          // height: item.height,
        }
        console.log("imagpath==========qqqq" , image.uri)
        this.setState({ imagepath: image.uri })

        image =   { name : 'avatar', filename : 'avatar.png', data: RNFetchBlob.wrap(image.uri)},


        tempArray.push(image)
        this.setState({ ImageSourceviewarray: tempArray })
         console.log('savedimageuri=====',item.path);

        console.log("imagpath==========" , image)

      })
      this.uploadImageToServer();
    }
    
  )};

  uploadImageToServer = () => {
    console.log("responseimagearray ssssssssssssss" , this.state.ImageSource)
    var dataimg = this.state.ImageSource;
    const data = new FormData();

    var url = constant.APIURL+'n-multiple-image';
    console.log(this.state.ImageSourceviewarray);

    RNFetchBlob.fetch('POST', 'http://192.168.1.56:4225/n-multiple-image', {
      Authorization : "Bearer access-token",
      otherHeader : "foo",
      'Content-Type' : 'multipart/form-data',
    }, this.state.ImageSourceviewarray
    // [
    //   // element with property `filename` will be transformed into `file` in form data
    //   //{ name : 'avatar', filename : 'avatar.png', data: RNFetchBlob.wrap(this.state.imagepath)},
    //   // custom content type
    //  // { name : 'avatar-png', filename : 'avatar-png.png', type:'image/png', data: binaryDataInBase64},
    // ]

      ).uploadProgress((written, total) => {
        console.log('uploaded', written / total)
    })
      .then((resp) => {
        console.log("happy");
      // ...
    }).catch((err) => {
      console.log("said");

      // ...
    })

    // this.state.ImageSource.map((data, key) => {

    //   console.log("responsdata          sss" ,this.state.ImageSourceviewarray)

    //   data.append('file', this.state.ImageSourceviewarray);

  

      // fetch(url,{

      //   method: 'POST',
      //   body: JSON.stringify(data),
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'multipart/form-data',
      //   //  'boundary=${formData._boundary}'

      //    },
         
      //   // headers: new Headers({
      //   //   //'Content-Type':'multipart/form-data',
      //   //  // 'Accept': 'application/json',
         

      //   //   //'Content-Type':'application/json'

      //   // })
      //   }).then(function (response) {

      //     return response.json();
      //   });



    // fetch('POST', 'http://192.168.1.56:4225/n-multiple-image', {
    //    // Authorization: "Bearer access-token",
    //   //  otherHeader: "foo",
    //     headers: new Headers({
    //       'Content-Type':'application/json'
    //     })
        

    //     },
    //     data).then((resp) => {
    //       console.log("respresprespresprespresprespresprespresprespresp",resp);
    //         var tempMSG = resp.data;
    //         tempMSG = tempMSG.replace(/^"|"$/g, '');

    //         Alert.alert(tempMSG);
    //     }).catch((err) => {
    //       console.log("errerr",err)
    //     // ...
    //     })
  //  })
  }


  render() {
    return (
<SafeAreaView style={{flex: 1}}>

      <View style={styles.mainContaitner}>
      <Text>Next</Text>

      <TouchableOpacity style={styles.footer} onPress={() => this.selectPhotoTapped()}>
      <Text style={styles.buttonNextText}>Next</Text>
  
    </TouchableOpacity>
 


      </View>
      </SafeAreaView>
      

    );
  }
}
