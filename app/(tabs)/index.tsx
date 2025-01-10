import { Image, StyleSheet, Platform, View } from 'react-native';
import { CalendarBody, CalendarContainer, CalendarHeader, DeepPartial, ThemeConfigs } from '@howljs/calendar-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarColors as Colors }  from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <CalendarContainer
        allowDragToCreate={true}
        theme={customTheme}
        showWeekNumber={true}
      >
        <CalendarHeader />
        <CalendarBody />
      </CalendarContainer>
    </SafeAreaView>
  );

}

const customTheme: DeepPartial<ThemeConfigs> = {
  colors: {
    primary: Colors.primary,
    onPrimary: Colors.onPrimary,
    background: Colors.backgroundGray,
    onBackground: Colors.onBackground,
    text: Colors.textGray,
    border: Colors.border,
    surface: Colors.surface,
    onSurface: Colors.onSurface,


  },
};

