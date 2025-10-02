import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
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
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={28} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="football"
        options={{
          title: 'Football',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'football' : 'football-outline'} 
              size={28} 
              color={focused ? SPORT_CONFIGS[SportType.FOOTBALL].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.FOOTBALL].color,
          tabBarAccessibilityLabel: 'Football matches tab',
        }}
      />
      <Tabs.Screen
        name="basketball"
        options={{
          title: 'Basketball',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'basketball' : 'basketball-outline'} 
              size={28} 
              color={focused ? SPORT_CONFIGS[SportType.BASKETBALL].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.BASKETBALL].color,
          tabBarAccessibilityLabel: 'Basketball matches tab',
        }}
      />
      <Tabs.Screen
        name="tennis"
        options={{
          title: 'Tennis',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'tennisball' : 'tennisball-outline'} 
              size={28} 
              color={focused ? SPORT_CONFIGS[SportType.TENNIS].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.TENNIS].color,
          tabBarAccessibilityLabel: 'Tennis matches tab',
        }}
      />
      <Tabs.Screen
        name="ice-hockey"
        options={{
          title: 'Ice Hockey',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'snow' : 'snow-outline'} 
              size={28} 
              color={focused ? SPORT_CONFIGS[SportType.ICE_HOCKEY].color : color} 
            />
          ),
          tabBarActiveTintColor: SPORT_CONFIGS[SportType.ICE_HOCKEY].color,
          tabBarAccessibilityLabel: 'Ice Hockey matches tab',
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
