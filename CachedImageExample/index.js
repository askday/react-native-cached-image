'use strict';

const React = require('react');
const ReactNative = require('react-native');

const _ = require('lodash');

const {
  View,
  ScrollView,
  Button,
  Dimensions,
  StyleSheet,
  AppRegistry,
  FlatList,
  Alert
} = ReactNative;

const {
  CachedImage,
  ImageCacheProvider,
  ImageCacheManager,
} = require('react-native-cached-image');

const {
  width
} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  buttons: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width,
    height: 300,
    marginBottom: 10,
  }
});

const loading = require('./loading.jpg');

const image1 = 'https://b-ssl.duitang.com/uploads/blog/201502/14/20150214130013_eGV2m.thumb.1000_0.jpeg';
const image2 = 'https://b-ssl.duitang.com/uploads/item/201402/14/20140214120558_2f4NN.thumb.1300_0.jpeg';

const images = [
  'https://b-ssl.duitang.com/uploads/blog/201502/14/20150214130010_wYAAK.thumb.1000_0.jpeg',
  'https://b-ssl.duitang.com/uploads/item/201306/18/20130618092329_4APwX.thumb.1300_0.jpeg',
  'https://b-ssl.duitang.com/uploads/item/201307/30/20130730144824_GTnmP.thumb.1000_0.jpeg',
  'https://b-ssl.duitang.com/uploads/item/201307/30/20130730144823_twFMU.thumb.1000_0.jpeg',
  'https://b-ssl.duitang.com/uploads/item/201307/30/20130730144726_tfHJV.thumb.1000_0.jpeg',
  'https://b-ssl.duitang.com/uploads/item/201307/30/20130730144759_E4GuJ.thumb.1000_0.jpeg',
];

function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const defaultImageCacheManager = ImageCacheManager();

class CachedImageExample extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showNextImage: false,
      dataSource: images
    };

    this.cacheImages = this.cacheImages.bind(this);

  }

  componentWillMount() {
    defaultImageCacheManager.downloadAndCacheUrl(image1);
  }

  clearCache() {
    defaultImageCacheManager.clearCache()
      .then(() => {
        Alert.alert('Cache cleared');
      });
  }

  getCacheInfo() {
    defaultImageCacheManager.getCacheInfo()
      .then(({ size, files }) => {
        // console.log(size, files);
        Alert.alert('Cache Info', `files: ${files.length}\nsize: ${formatBytes(size)}`);
      });
  }

  cacheImages() {
    this.setState({
      dataSource: []
    }, () => {
      this.setState({
        dataSource: images
      });
    });
  }

  renderRow({ item }) {
    return (
      <CachedImage
        source={{ uri: item }}
        defaultSource={loading}
        style={styles.image}
      />
    );
  }

  render() {
    const { dataSource } = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.buttons}>
          <Button
            onPress={this.clearCache}
            title="Clear Cache"
            color="#6f97e5"
          />
          <Button
            onPress={this.getCacheInfo}
            title="Cache Info"
            color="#2ce7cc"
          />
          <Button
            onPress={this.cacheImages}
            title="Cache Images"
            color="#826fe5"
          />
        </View>
        <View>
          <CachedImage
            source={{ uri: image1 }}
            style={styles.image}
          />
          <CachedImage
            source={{ uri: image2 }}
            style={styles.image}
          />
        </View>
        <ImageCacheProvider
          urlsToPreload={images}
          onPreloadComplete={() => Alert.alert('onPreloadComplete')}
          ttl={60}
          numberOfConcurrentPreloads={0}>
          <FlatList
            keyExtractor={(item, index) => `${index} - ${item}`}
            data={dataSource}
            renderItem={this.renderRow}
          />
        </ImageCacheProvider>
      </ScrollView>
    );
  }

}

AppRegistry.registerComponent('CachedImageExample', () => CachedImageExample);
