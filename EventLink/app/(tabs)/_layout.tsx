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
        style={{ width: 20, height: 20, marginLeft: 3, marginTop: 20}}
        resizeMode="contain"
        tintColor={color}
      />
      <Text style={[styles.text, { color: color, fontFamily: focused ? 'Inter-Black' : 'Inter-Medium' }]}>
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
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFF',
        tabBarInactiveTintColor: '#90949A',
        tabBarStyle: {
          backgroundColor: '#393E44',
          borderTopWidth: 1,
          height: 90,
        }

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

    <Tabs.Screen
      name = "create"
      options= {{
        title: 'Create',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
          <TabIcon
          icon = {icons.create}
          color = {color}
          name="Create"
          focused={focused}
          />
        )
      }}
      />

    <Tabs.Screen
      name = "profile"
      options= {{
        title: 'Profile',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
          <TabIcon
          icon = {icons.user}
          color = {color}
          name="Profile"
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
    marginTop: 20,
  },
  icon: {
    marginLeft: 10,
    width: 20,
    height: 20,
    marginBottom: 20,
  },
  text: {
    marginTop: 5,
    fontSize: 9,
    textAlign: 'center',
  },
});

export default TabsLayout