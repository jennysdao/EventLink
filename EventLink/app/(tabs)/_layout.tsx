import { View, Text, StyleSheet } from 'react-native';
import {Tabs, Redirect} from 'expo-router'
import React from 'react'
import {Image} from "react-native";
import icons from '../../constants/icons';

interface TabIconProps {
  icon: any; 
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View>
      <Image
        source={icon}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
        tintColor={color}
      />
      <Text style={[styles.text, { color: color, fontFamily: focused ? 'Inter-Bold' : 'Inter-Medium' }]}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false
      }}
      >
      <Tabs.Screen
      name = "home"
      options= {{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
          <TabIcon
          icon = {icons.home}
          color = {color}
          name="Home"
          focused={focused}
          />
        )
      }}
      />
    </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
  text: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default TabsLayout