import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../theme/colors';

const SplashScreen = () => {
return (
<View style={styles.container}>
   <Text style={styles.logo}>Firebase Chat</Text>
</View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
justifyContent: 'center',
alignItems: 'center',
  },
logo: {
color: colors.white,
fontSize: 32,
fontWeight: 'bold',
},
});