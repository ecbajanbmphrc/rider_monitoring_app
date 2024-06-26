import {StyleSheet, Text, View, Button} from 'react-native';

function HomeScreen(props) {
  console.log(props);
  return (
    <View style={styles.viewStyle}>
  
     <Text style={styles.textStyle}>This is Home Screen</Text>
     <Button
      title="Profile"
      onPress={() => props.navigation.navigate('Profile', {
        name:"Eman"
      })}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    fontSize: 28,
    color: 'black',
  },
  headingStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
});
export default HomeScreen;