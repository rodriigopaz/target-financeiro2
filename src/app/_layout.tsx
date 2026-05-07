import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { migrate } from '../database/migrate';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Layout() {
  return (
    <Suspense 
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      }
    >
      <SQLiteProvider databaseName="finances.db" onInit={migrate}>
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
    </Suspense>
  );
}