/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },

  
};

export const CalendarColors = {
  backgroundGray: '#262626',
  onBackground: '#7D7D7D',
  border: '#2D2D2D',
  textGray: '#7D7D7D',
  surface: '#1A1A1A',   // TODO: Выяснить что делают эти параметры
  onSurface: '#FFFFFF', // TODO: Выяснить что делают эти параметры
  primary: '#ED5751',
  onPrimary: '#FFFFFF',

};

export const TAG_COLORS = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33F6',
  '#33FFF6',
  '#FFB533'
];