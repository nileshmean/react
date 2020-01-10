/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import firebase from 'react-native-firebase';
import { Share } from 'react-native';
import { createAppContainer } from 'react-navigation';  
import { createStackNavigator } from 'react-navigation-stack'
import {View, Text, TextInput,KeyboardAvoidingView, ToastAndroid, TouchableHighlight,ScrollView,Button} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './src/styles/SliderEntry.style';
import SliderEntry from './src/components/SliderEntry';
import styles, { colors } from './src/styles/index.style';
import { ENTRIES1, ENTRIES2 } from './src/static/entries';
import { scrollInterpolators, animatedStyles } from './src/utils/animations';
import SplashScreen from 'react-native-splash-screen';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;



        class HomeScreen extends React.Component {  

          static navigationOptions = {
            title: 'test',
            headerRight: (
              <Button
                onPress= {() => _ShareMe()}
                title="Info"
                color="#000"
                title="Share Me..."
              />),
               headerStyle: {  
                   
                    backgroundColor: '#0871d3',  
                },  
                headerTintColor: '#FFF',  
                headerTitleStyle: {  
                    //fontWeight: 'bold',  
                },  
            };
           
          //Initialization
          constructor(props){
              super(props);
              this.state = {
             
        
              }
        
          }
          _renderItem ({item, index}) {
            return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
        }
          
    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }
          componentDidMount() {
           SplashScreen.hide()
          }
        
        
          mainExample (number, title) {
            const { slider1ActiveSlide } = this.state;
    
            return (
                <View style={styles.exampleContainer}>
                    <Text style={styles.title}>{`Example ${number}`}</Text>
                    <Text style={styles.subtitle}>{title}</Text>
                    <Carousel
                      ref={c => this._slider1Ref = c}
                      data={ENTRIES1}
                      renderItem={this._renderItemWithParallax}
                      sliderWidth={sliderWidth}
                      itemWidth={itemWidth}
                      hasParallaxImages={true}
                      firstItem={SLIDER_1_FIRST_ITEM}
                      inactiveSlideScale={0.94}
                      inactiveSlideOpacity={0.7}
                      // inactiveSlideShift={20}
                      containerCustomStyle={styles.slider}
                      contentContainerCustomStyle={styles.sliderContentContainer}
                      loop={true}
                      loopClonesPerSide={2}
                      autoplay={true}
                      autoplayDelay={500}
                      autoplayInterval={3000}
                      onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                    />
                    <Pagination
                      dotsLength={ENTRIES1.length}
                      activeDotIndex={slider1ActiveSlide}
                      containerStyle={styles.paginationContainer}
                      dotColor={'rgba(255, 255, 255, 0.92)'}
                      dotStyle={styles.paginationDot}
                      inactiveDotColor={colors.black}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.6}
                      carouselRef={this._slider1Ref}
                      tappableDots={!!this._slider1Ref}
                    />
                </View>
            );
        }
        
       
        
          render() {
            const example1 = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');

            return (
           
<View>
  <Text>First part and </Text>
  <Text>second part</Text>
  { example1 }

</View>        
            );
          }
        }
        
        const AppNavigator = createStackNavigator(  
          {  
              Home: HomeScreen,   
          },  
          {  
              initialRouteName: "Home"  
          }  
        );  
        
        const AppContainer = createAppContainer(AppNavigator);  
        export default class App extends React.Component {  
          render() {  
              return <AppContainer />;  
          }  
        }          