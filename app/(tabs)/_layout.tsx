import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SPORT_CONFIGS } from '@/constants/sports';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SportType } from '@/types/sport';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="football"
        options={{
          title: 'Football',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={SPORT_CONFIGS[SportType.FOOTBALL].icon} 
              color={focused ? SPORT_CONFIGS[SportType.FOOTBALL].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.FOOTBALL].color,
        }}
      />
      <Tabs.Screen
        name="basketball"
        options={{
          title: 'Basketball',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={SPORT_CONFIGS[SportType.BASKETBALL].icon} 
              color={focused ? SPORT_CONFIGS[SportType.BASKETBALL].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.BASKETBALL].color,
        }}
      />
      <Tabs.Screen
        name="tennis"
        options={{
          title: 'Tennis',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={SPORT_CONFIGS[SportType.TENNIS].icon} 
              color={focused ? SPORT_CONFIGS[SportType.TENNIS].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.TENNIS].color,
        }}
      />
      <Tabs.Screen
        name="ice-hockey"
        options={{
          title: 'Ice Hockey',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={SPORT_CONFIGS[SportType.ICE_HOCKEY].icon} 
              color={focused ? SPORT_CONFIGS[SportType.ICE_HOCKEY].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.ICE_HOCKEY].color,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
