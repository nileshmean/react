import React from 'react';
import { FlatList, ActivityIndicator, Text, View,StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isListEnd: false,
      //Loading state used while loading the data for the first time
      serverData: [],
      dataSource:[],
      //Data Source for the FlatList
      fetching_from_server: false,
      //Loading state used while loading more data
    };
    this.offset = 1;
    this.page =1;

    //Index of the offset to load from web API

  }


  componentDidMount(){
    SplashScreen.hide()
    //this.loadata()
    this.loadMoreData();

   
  }


  loadMoreData = () => {
    if (!this.state.fetching_from_server && !this.state.isListEnd) {
      //On click of Load More button We will call the web API again
      this.setState({ fetching_from_server: true }, () => {
        fetch('https://jsonplaceholder.typicode.com/photos?_limit=10&_page=' + this.offset)
          //Sending the currect offset with get request
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson !='') {
              //Successful response from the API Call
              this.offset = this.offset + 1;
              //After the response increasing the offset for the next API call.
              this.setState({
                serverData: [...this.state.serverData, ...responseJson],
                //adding the new data with old one available
                fetching_from_server: false,
                //updating the loading state to false
              });
            } else {
              this.setState({
                fetching_from_server: false,
                isListEnd: true,
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
  };
  renderFooter() {
    return (
      <View style={styles.footer}>
        {this.state.fetching_from_server ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            style={{ width: '100%' }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.serverData}
            onEndReached={() => this.loadMoreData()}
            onEndReachedThreshold={5}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <Text style={styles.text}>
                  {item.id}
                  {'.'}
                  {item.title.toUpperCase()}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={this.renderFooter.bind(this)}
            //Adding Load More button as footer component
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor:'#ffffff'
  },
  item: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    //backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});